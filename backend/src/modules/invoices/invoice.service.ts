import { InvoiceModel, ILineItem } from './invoice.model.js';
import { BusinessProfileModel } from '../businessProfile/businessProfile.model.js';
import { assertOwnership } from '../../utils/ownershipCheck.js';
import { AppError } from '../../utils/appError.js';
import { generateInvoicePdf } from '../../services/pdf.service.js';
import { emailService } from '../../services/email.service.js';

export class InvoiceService {
  private static calculateTotals(lineItems: ILineItem[], taxRate: number) {
    const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  }

  private static async getNextInvoiceNumber(userId: string): Promise<string> {
    const profile = await BusinessProfileModel.findOne({ userId });
    const prefix = profile?.invoiceNumberPrefix || 'INV-';

    // Count ALL invoices ever created by user to ensure sequential numbers without reuse
    const count = await InvoiceModel.countDocuments({ userId });
    const nextSeq = count + 1;
    return `${prefix}${nextSeq.toString().padStart(4, '0')}`;
  }

  public static async listInvoices(
    userId: string,
    filters: {
      documentStatus?: string;
      paymentStatus?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { userId, isDeleted: false };

    if (filters.documentStatus) query.documentStatus = filters.documentStatus;
    if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
    if (filters.search) {
      query.$or = [
        { invoiceNumber: { $regex: filters.search, $options: 'i' } },
        { 'client.name': { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [invoices, totalCount] = await Promise.all([
      InvoiceModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      InvoiceModel.countDocuments(query),
    ]);

    return {
      invoices,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    };
  }

  public static async createInvoice(userId: string, data: Record<string, any>) {
    const lineItems: ILineItem[] = data.lineItems;
    const taxRate: number = data.taxRate || 0;

    const { subtotal, taxAmount, total } = this.calculateTotals(lineItems, taxRate);
    const invoiceNumber = await this.getNextInvoiceNumber(userId);

    // Default signature from profile if not provided
    let signature = data.signature;
    if (!signature || !signature.value) {
      const profile = await BusinessProfileModel.findOne({ userId });
      if (profile && profile.defaultSignature && profile.defaultSignature.value) {
        signature = profile.defaultSignature;
      }
    }

    return InvoiceModel.create({
      userId,
      clientId: data.clientId,
      invoiceNumber,
      client: data.client,
      lineItems,
      currency: data.currency || 'USD',
      taxRate,
      subtotal,
      taxAmount,
      total,
      template: data.template || 'modern',
      colorScheme: data.colorScheme || '#2196F3',
      font: data.font || 'Inter',
      signature,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      documentStatus: data.documentStatus || 'draft',
      paymentStatus: data.paymentStatus || 'unpaid',
    });
  }

  public static async getInvoiceById(userId: string, invoiceId: string) {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');

    assertOwnership(invoice.userId, userId);
    return invoice;
  }

  public static async updateInvoice(userId: string, invoiceId: string, data: Record<string, any>) {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');

    assertOwnership(invoice.userId, userId);

    if (data.lineItems || data.taxRate !== undefined) {
      const lineItems = data.lineItems || invoice.lineItems;
      const taxRate = data.taxRate !== undefined ? data.taxRate : invoice.taxRate;
      const totals = this.calculateTotals(lineItems, taxRate);

      data.subtotal = totals.subtotal;
      data.taxAmount = totals.taxAmount;
      data.total = totals.total;
    }

    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }

    Object.assign(invoice, data);
    await invoice.save();
    return invoice;
  }

  public static async softDeleteInvoice(userId: string, invoiceId: string) {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');

    assertOwnership(invoice.userId, userId);

    invoice.isDeleted = true;
    invoice.deletedAt = new Date();
    await invoice.save();

    return { message: 'Invoice moved to trash (recoverable for 30 days)' };
  }

  public static async restoreInvoice(userId: string, invoiceId: string) {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');

    assertOwnership(invoice.userId, userId);

    invoice.isDeleted = false;
    invoice.deletedAt = undefined;
    await invoice.save();

    return { message: 'Invoice restored from trash successfully' };
  }

  public static async listTrash(userId: string) {
    return InvoiceModel.find({ userId, isDeleted: true }).sort({ deletedAt: -1 });
  }

  public static async downloadPdf(userId: string, invoiceId: string): Promise<{ buffer: Buffer; filename: string }> {
    const invoice = await this.getInvoiceById(userId, invoiceId);
    const profile = await BusinessProfileModel.findOne({ userId });

    const pdfBuffer = await generateInvoicePdf({
      invoiceNumber: invoice.invoiceNumber,
      documentStatus: invoice.documentStatus,
      paymentStatus: invoice.paymentStatus,
      dueDate: invoice.dueDate,
      createdAt: invoice.createdAt,
      sender: {
        businessName: profile?.businessName || 'Business Name',
        email: profile?.email || '',
        phone: profile?.phone,
        address: profile?.address,
      },
      client: invoice.client,
      lineItems: invoice.lineItems,
      currency: invoice.currency,
      taxRate: invoice.taxRate,
      subtotal: invoice.subtotal,
      taxAmount: invoice.taxAmount,
      total: invoice.total,
      signature: invoice.signature,
    });

    return {
      buffer: pdfBuffer,
      filename: `${invoice.invoiceNumber}.pdf`,
    };
  }

  public static async sendEmail(userId: string, invoiceId: string) {
    const invoice = await this.getInvoiceById(userId, invoiceId);
    const { buffer, filename } = await this.downloadPdf(userId, invoiceId);

    const sent = await emailService.sendEmail({
      to: invoice.client.email,
      subject: `Invoice ${invoice.invoiceNumber} from Billora`,
      html: `<p>Hello ${invoice.client.name},</p><p>Please find attached invoice <strong>${invoice.invoiceNumber}</strong> for amount <strong>${invoice.currency} ${invoice.total.toFixed(2)}</strong>.</p><p>Thank you!</p>`,
      attachments: [{ filename, content: buffer }],
    });

    if (sent) {
      invoice.documentStatus = 'sent';
      await invoice.save();
    }

    return { message: `Invoice ${invoice.invoiceNumber} emailed to ${invoice.client.email}` };
  }

  public static async permanentDeleteInvoice(userId: string, invoiceId: string) {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');

    assertOwnership(invoice.userId, userId);

    if (!invoice.isDeleted) {
      throw new AppError('Invoice must be in trash before permanent deletion', 400, 'INVALID_OPERATION');
    }

    await InvoiceModel.findByIdAndDelete(invoiceId);
    return { message: 'Invoice permanently deleted' };
  }

  public static async emptyTrash(userId: string) {
    const result = await InvoiceModel.deleteMany({ userId, isDeleted: true });
    return { message: `Trash emptied successfully. ${result.deletedCount} invoices removed.` };
  }

  public static async duplicateInvoice(userId: string, invoiceId: string) {
    const original = await this.getInvoiceById(userId, invoiceId);
    const invoiceNumber = await this.getNextInvoiceNumber(userId);

    const duplicateData = {
      userId,
      clientId: original.clientId,
      invoiceNumber,
      client: original.client,
      lineItems: original.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      currency: original.currency,
      taxRate: original.taxRate,
      subtotal: original.subtotal,
      taxAmount: original.taxAmount,
      total: original.total,
      template: original.template,
      colorScheme: original.colorScheme,
      font: original.font,
      signature: original.signature,
      dueDate: original.dueDate,
      documentStatus: 'draft' as const,
      paymentStatus: 'unpaid' as const,
    };

    return InvoiceModel.create(duplicateData);

  }

  public static async updateInvoiceStatus(userId: string, invoiceId: string, statusData: { documentStatus?: string; paymentStatus?: string }) {
    const invoice = await this.getInvoiceById(userId, invoiceId);

    if (statusData.documentStatus) {
      invoice.documentStatus = statusData.documentStatus as any;
    }
    if (statusData.paymentStatus) {
      invoice.paymentStatus = statusData.paymentStatus as any;
    }

    await invoice.save();
    return invoice;
  }

  public static async getPublicInvoice(invoiceId: string) {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice || invoice.isDeleted) {
      throw new AppError('Invoice not found or link has expired', 404, 'INVOICE_NOT_FOUND');
    }
    const profile = await BusinessProfileModel.findOne({ userId: invoice.userId });

    return {
      invoice,
      businessProfile: {
        businessName: profile?.businessName || 'Business Name',
        email: profile?.email || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
      },
    };
  }
}

