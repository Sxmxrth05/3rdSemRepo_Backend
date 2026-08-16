import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from './invoice.service.js';

export class InvoiceController {
  public static async listInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await InvoiceService.listInvoices(userId, {
        documentStatus: req.query.documentStatus as string,
        paymentStatus: req.query.paymentStatus as string,
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async createInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const invoice = await InvoiceService.createInvoice(userId, req.body);
      res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  }

  private static getId(req: Request): string {
    return Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  }

  public static async getInvoiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const invoice = await InvoiceService.getInvoiceById(userId, InvoiceController.getId(req));
      res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  }

  public static async updateInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const invoice = await InvoiceService.updateInvoice(userId, InvoiceController.getId(req), req.body);
      res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  }

  public static async softDeleteInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await InvoiceService.softDeleteInvoice(userId, InvoiceController.getId(req));
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async restoreInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await InvoiceService.restoreInvoice(userId, InvoiceController.getId(req));
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async listTrash(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const trash = await InvoiceService.listTrash(userId);
      res.status(200).json({ success: true, data: trash });
    } catch (error) {
      next(error);
    }
  }

  public static async downloadPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { buffer, filename } = await InvoiceService.downloadPdf(userId, InvoiceController.getId(req));

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  }

  public static async sendEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await InvoiceService.sendEmail(userId, InvoiceController.getId(req));
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async permanentDeleteInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await InvoiceService.permanentDeleteInvoice(userId, InvoiceController.getId(req));
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async emptyTrash(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await InvoiceService.emptyTrash(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async duplicateInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const invoice = await InvoiceService.duplicateInvoice(userId, InvoiceController.getId(req));
      res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  }

  public static async updateInvoiceStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const invoice = await InvoiceService.updateInvoiceStatus(userId, InvoiceController.getId(req), req.body);
      res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  }

  public static async getPublicInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shareToken = Array.isArray(req.params.shareToken) ? req.params.shareToken[0] : req.params.shareToken;
      const data = await InvoiceService.getPublicInvoice(shareToken);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

