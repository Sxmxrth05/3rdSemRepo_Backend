import { z } from 'zod';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
});

const documentStatusSchema = z.preprocess(
  (val) => (val === 'issued' ? 'sent' : val),
  z.enum(['draft', 'sent', 'archived'])
);

export const createInvoiceSchema = z.object({
  body: z.object({
    clientId: z.string().optional(),
    client: z.object({
      name: z.string().min(1, 'Client name is required'),
      email: z.string().email('Invalid client email'),
      address: z.string().optional(),
    }),
    lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
    currency: z.string().default('USD'),
    taxRate: z.number().min(0).default(0),
    template: z.string().default('modern'),
    colorScheme: z.string().default('#2196F3'),
    font: z.string().default('Inter'),
    signature: z
      .object({
        type: z.enum(['font', 'drawn']),
        value: z.string(),
      })
      .optional(),
    dueDate: z.string().optional(),
    documentStatus: documentStatusSchema.default('draft'),
    paymentStatus: z.enum(['unpaid', 'partially_paid', 'paid', 'overdue']).default('unpaid'),
  }),
});

export const updateInvoiceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invoice ID is required'),
  }),
  body: z.object({
    client: z
      .object({
        name: z.string().min(1),
        email: z.string().email(),
        address: z.string().optional(),
      })
      .optional(),
    lineItems: z.array(lineItemSchema).min(1).optional(),
    currency: z.string().optional(),
    taxRate: z.number().min(0).optional(),
    template: z.string().optional(),
    colorScheme: z.string().optional(),
    font: z.string().optional(),
    signature: z
      .object({
        type: z.enum(['font', 'drawn']),
        value: z.string(),
      })
      .optional(),
    dueDate: z.string().optional(),
    documentStatus: documentStatusSchema.optional(),
    paymentStatus: z.enum(['unpaid', 'partially_paid', 'paid', 'overdue']).optional(),
  }),
});

export const updateInvoiceStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invoice ID is required'),
  }),
  body: z
    .object({
      documentStatus: documentStatusSchema.optional(),
      paymentStatus: z.enum(['unpaid', 'partially_paid', 'paid', 'overdue']).optional(),
    })
    .refine((data) => data.documentStatus !== undefined || data.paymentStatus !== undefined, {
      message: 'At least one of documentStatus or paymentStatus must be provided',
    }),
});

