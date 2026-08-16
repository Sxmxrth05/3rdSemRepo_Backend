import Stripe from 'stripe';
import { env } from '../../config/env.js';
import { UserModel } from '../users/user.model.js';
import { InvoiceModel } from '../invoices/invoice.model.js';
import { AppError } from '../../utils/appError.js';

export class BillingService {
  private static stripe: Stripe | null = env.STRIPE_SECRET_KEY && !env.STRIPE_SECRET_KEY.includes('dummy')
    ? new Stripe(env.STRIPE_SECRET_KEY)
    : null;

  public static async getSubscriptionStatus(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const invoicesThisMonth = await InvoiceModel.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth },
    });

    const isPro = user.plan === 'pro';
    const limit = isPro ? Infinity : 10; // Free plan limit 10 invoices per month

    return {
      plan: user.plan,
      isPro,
      invoicesThisMonth,
      monthlyLimit: isPro ? 'unlimited' : limit,
      remainingInvoices: isPro ? 'unlimited' : Math.max(0, limit - invoicesThisMonth),
      stripeCustomerId: user.stripeCustomerId || null,
    };
  }

  public static async createCheckoutSession(userId: string) {

    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    if (!this.stripe) {
      // Mock session for local development
      return {
        url: `${env.CLIENT_URL}/settings/billing?status=success_mock`,
        message: 'Mock Stripe checkout active in development environment.',
      };
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${env.CLIENT_URL}/dashboard?billing=success`,
      cancel_url: `${env.CLIENT_URL}/pricing?billing=cancel`,
      metadata: { userId: user._id.toString() },
    });

    return { url: session.url };
  }

  public static async createCustomerPortal(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    if (!this.stripe || !user.stripeCustomerId) {
      return {
        url: `${env.CLIENT_URL}/settings/billing`,
        message: 'Mock customer portal link active.',
      };
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.CLIENT_URL}/settings/billing`,
    });

    return { url: session.url };
  }

  public static async handleWebhook(rawBody: Buffer, signature: string) {
    if (!this.stripe || !env.STRIPE_WEBHOOK_SECRET) {
      return { received: true, mock: true };
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw new AppError(`Webhook Signature Verification Failed: ${err instanceof Error ? err.message : 'Unknown'}`, 400);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId) {
          await UserModel.findByIdAndUpdate(userId, { plan: 'pro' });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        await UserModel.findOneAndUpdate({ stripeCustomerId: customerId }, { plan: 'free' });
        break;
      }
    }

    return { received: true };
  }
}
