import { Request, Response, NextFunction } from 'express';
import { BillingService } from './billing.service.js';

export class BillingController {
  public static async getSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const subscription = await BillingService.getSubscriptionStatus(userId);
      res.status(200).json({ success: true, data: subscription });
    } catch (error) {
      next(error);
    }
  }


  public static async createCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      const userId = req.user!.userId;
      const session = await BillingService.createCheckoutSession(userId);
      res.status(200).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  public static async createPortal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const portal = await BillingService.createCustomerPortal(userId);
      res.status(200).json({ success: true, data: portal });
    } catch (error) {
      next(error);
    }
  }

  public static async webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const result = await BillingService.handleWebhook(req.body, signature);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
