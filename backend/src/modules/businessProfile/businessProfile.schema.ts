import { z } from 'zod';

export const updateBusinessProfileSchema = z.object({
  body: z.object({
    businessName: z.string().min(1, 'Business name cannot be empty').optional(),
    logoUrl: z.string().url('Invalid logo URL').optional().or(z.literal('')),
    address: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    defaultSignature: z
      .object({
        type: z.enum(['font', 'drawn']),
        value: z.string().min(1, 'Signature value cannot be empty'),
      })
      .optional(),
    invoiceNumberPrefix: z.string().min(1, 'Prefix cannot be empty').optional(),
  }),
});
