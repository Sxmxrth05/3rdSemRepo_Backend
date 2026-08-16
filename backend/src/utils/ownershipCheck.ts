import { AppError } from './appError.js';

export const assertOwnership = (resourceUserId: string | object, requestUserId: string): void => {
  const resourceIdStr = typeof resourceUserId === 'object' ? resourceUserId.toString() : resourceUserId;
  if (resourceIdStr !== requestUserId) {
    throw new AppError('Forbidden: You do not have permission to access or modify this resource', 403, 'FORBIDDEN');
  }
};
