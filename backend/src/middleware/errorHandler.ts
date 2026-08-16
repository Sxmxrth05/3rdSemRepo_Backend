import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_SERVER_ERROR';
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code || 'OPERATIONAL_ERROR';
    details = err.details;
  } else if (err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    statusCode = 409;
    message = 'Resource duplicate conflict';
    code = 'DUPLICATE_KEY_ERROR';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier format';
    code = 'INVALID_ID';
  }

  if (env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('💥 Unhandled Error Stack:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      ...(details ? { details } : {}),
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  });
};
