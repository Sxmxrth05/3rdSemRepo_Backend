import PDFDocument from 'pdfkit';

export interface InvoicePdfData {
  invoiceNumber: string;
  documentStatus: string;
  paymentStatus: string;
  dueDate?: Date | string;
  createdAt: Date | string;
  sender: {
    businessName: string;
    email: string;
    phone?: string;
    address?: string;
  };
  client: {
    name: string;
    email: string;
    address?: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  currency: string;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  signature?: {
    type: 'font' | 'drawn';
    value: string;
  };
}

export const generateInvoicePdf = (data: InvoicePdfData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // Header
    doc.fillColor('#2196F3').fontSize(24).text(data.sender.businessName || 'BILLORA INVOICE', 50, 45);
    doc.fillColor('#666666').fontSize(10).text(`Invoice Number: ${data.invoiceNumber}`, 50, 75);
    doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`);
    if (data.dueDate) {
      doc.text(`Due Date: ${new Date(data.dueDate).toLocaleDateString()}`);
    }
    doc.text(`Payment Status: ${data.paymentStatus.toUpperCase()}`);

    doc.moveDown();
    doc.strokeColor('#e0e0e0').lineWidth(1).moveTo(50, 130).lineTo(545, 130).stroke();

    // From & To
    const yPos = 145;
    doc.fillColor('#333333').fontSize(12).text('From:', 50, yPos, { underline: true });
    doc.fontSize(10).text(data.sender.businessName, 50, yPos + 18);
    doc.text(data.sender.email, 50, yPos + 32);
    if (data.sender.address) doc.text(data.sender.address, 50, yPos + 46);

    doc.fillColor('#333333').fontSize(12).text('Billed To:', 300, yPos, { underline: true });
    doc.fontSize(10).text(data.client.name, 300, yPos + 18);
    doc.text(data.client.email, 300, yPos + 32);
    if (data.client.address) doc.text(data.client.address, 300, yPos + 46);

    // Table Header
    const tableTop = 230;
    doc.fillColor('#2196F3').fontSize(10);
    doc.text('Description', 50, tableTop);
    doc.text('Qty', 300, tableTop, { width: 50, align: 'right' });
    doc.text('Unit Price', 360, tableTop, { width: 80, align: 'right' });
    doc.text('Amount', 450, tableTop, { width: 95, align: 'right' });

    doc.strokeColor('#2196F3').lineWidth(1).moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).stroke();

    // Line Items
    let currentY = tableTop + 25;
    doc.fillColor('#333333');

    data.lineItems.forEach((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      doc.text(item.description, 50, currentY, { width: 240 });
      doc.text(item.quantity.toString(), 300, currentY, { width: 50, align: 'right' });
      doc.text(`${data.currency} ${item.unitPrice.toFixed(2)}`, 360, currentY, { width: 80, align: 'right' });
      doc.text(`${data.currency} ${itemTotal.toFixed(2)}`, 450, currentY, { width: 95, align: 'right' });
      currentY += 20;
    });

    doc.strokeColor('#e0e0e0').lineWidth(1).moveTo(50, currentY + 5).lineTo(545, currentY + 5).stroke();
    currentY += 15;

    // Totals
    doc.fontSize(10);
    doc.text('Subtotal:', 350, currentY, { width: 90, align: 'right' });
    doc.text(`${data.currency} ${data.subtotal.toFixed(2)}`, 450, currentY, { width: 95, align: 'right' });
    currentY += 18;

    doc.text(`Tax (${data.taxRate}%):`, 350, currentY, { width: 90, align: 'right' });
    doc.text(`${data.currency} ${data.taxAmount.toFixed(2)}`, 450, currentY, { width: 95, align: 'right' });
    currentY += 22;

    doc.fontSize(12).fillColor('#2196F3');
    doc.text('Total Due:', 350, currentY, { width: 90, align: 'right' });
    doc.text(`${data.currency} ${data.total.toFixed(2)}`, 450, currentY, { width: 95, align: 'right' });

    // Signature
    if (data.signature && data.signature.value) {
      currentY += 40;
      doc.fontSize(10).fillColor('#666666').text('Authorized Signature:', 50, currentY);
      doc.fontSize(14).fillColor('#0D47A1').text(data.signature.value, 50, currentY + 15);
    }

    doc.end();
  });
};
