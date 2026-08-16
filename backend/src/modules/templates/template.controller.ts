import { Request, Response, NextFunction } from 'express';
import { TemplateService } from './template.service.js';

export class TemplateController {
  public static async listTemplates(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const templates = await TemplateService.listTemplates();
      res.status(200).json({ success: true, data: templates });
    } catch (error) {
      next(error);
    }
  }

  public static async getTemplateBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const template = await TemplateService.getTemplateBySlug(slug);
      res.status(200).json({ success: true, data: template });
    } catch (error) {
      next(error);
    }
  }
}

