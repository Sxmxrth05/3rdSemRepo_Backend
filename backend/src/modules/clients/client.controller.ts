import { Request, Response, NextFunction } from 'express';
import { ClientService } from './client.service.js';

export class ClientController {
  public static async listClients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const includeArchived = req.query.includeArchived === 'true';
      const clients = await ClientService.listClients(userId, includeArchived);
      res.status(200).json({ success: true, data: clients });
    } catch (error) {
      next(error);
    }
  }

  public static async createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const client = await ClientService.createClient(userId, req.body);
      res.status(201).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  }

  public static async updateClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const client = await ClientService.updateClient(userId, id, req.body);
      res.status(200).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  }

  public static async archiveClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await ClientService.archiveClient(userId, id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async getClientById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const client = await ClientService.getClientById(userId, id);
      res.status(200).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  }

  public static async getClientInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const invoices = await ClientService.getClientInvoices(userId, id);
      res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      next(error);
    }
  }

  public static async unarchiveClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await ClientService.unarchiveClient(userId, id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

