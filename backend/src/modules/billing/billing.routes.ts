import { Router, raw } from 'express';
import { BillingController } from './billing.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

// Raw body parser for Stripe webhook signature verification
router.post('/webhook', raw({ type: 'application/json' }), BillingController.webhook);

router.use(requireAuth);
router.get('/subscription', BillingController.getSubscription);
router.post('/checkout', BillingController.createCheckout);
router.get('/portal', BillingController.createPortal);

export default router;

