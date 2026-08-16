import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './utils/appError.js';

// Import domain routes
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import businessProfileRoutes from './modules/businessProfile/businessProfile.routes.js';
import clientRoutes from './modules/clients/client.routes.js';
import invoiceRoutes from './modules/invoices/invoice.routes.js';
import templateRoutes from './modules/templates/template.routes.js';
import billingRoutes from './modules/billing/billing.routes.js';

const app: Application = express();

// 1. Security HTTP headers
app.use(helmet());

// 2. CORS configuration with explicit allowlist
const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS error: Origin not allowed by allowlist'));
      }
    },
    credentials: true,
  })
);

// 3. Rate Limiter (Max 100 requests per 15 mins per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: { message: 'Too many requests from this IP. Please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 4. Cookie Parser
app.use(cookieParser());

// 5. Special raw body handling for Stripe webhooks before global JSON parser
app.use('/api/v1/billing/webhook', express.raw({ type: 'application/json' }));

// 6. Body Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 7. NoSQL injection sanitizer (In-place sanitization compatible with Express 5)
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// Root Info Route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'Billora Backend API',
      version: '1.0.0',
      status: 'active',
      health: '/health',
      apiDocs: '/api/v1',
    },
  });
});

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { status: 'healthy', timestamp: new Date() } });
});

// API Index Route
app.get(['/api', '/api/v1'], (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Billora API v1 Services',
      endpoints: {
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        businessProfile: '/api/v1/business-profile',
        clients: '/api/v1/clients',
        invoices: '/api/v1/invoices',
        templates: '/api/v1/templates',
        billing: '/api/v1/billing',
      },
    },
  });
});

// 7. Domain API Routes Mount (/api/v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/business-profile', businessProfileRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/billing', billingRoutes);

// 8. 404 Route Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('API endpoint route not found', 404, 'NOT_FOUND'));
});

// 9. Centralized Error Handler Middleware
app.use(errorHandler);

export default app;
