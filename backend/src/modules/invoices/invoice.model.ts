import { Schema, model, Document, Types } from 'mongoose';

export interface ILineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface IInvoice extends Document {
  userId: Types.ObjectId;
  clientId?: Types.ObjectId;
  invoiceNumber: string;
  documentStatus: 'draft' | 'sent' | 'archived';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
  client: {
    name: string;
    email: string;
    address?: string;
  };
  lineItems: ILineItem[];
  currency: string;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  template: string;
  colorScheme: string;
  font: string;
  signature?: {
    type: 'font' | 'drawn';
    value: string;
  };
  dueDate?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const lineItemSchema = new Schema<ILineItem>({
  description: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
});

const invoiceSchema = new Schema<IInvoice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    invoiceNumber: { type: String, required: true },
    documentStatus: { type: String, enum: ['draft', 'sent', 'archived'], default: 'draft' },
    paymentStatus: { type: String, enum: ['unpaid', 'partially_paid', 'paid', 'overdue'], default: 'unpaid' },
    client: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, default: '' },
    },
    lineItems: [lineItemSchema],
    currency: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 0 },
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    template: { type: String, default: 'modern' },
    colorScheme: { type: String, default: '#2196F3' },
    font: { type: String, default: 'Inter' },
    signature: {
      type: { type: String, enum: ['font', 'drawn'], default: 'font' },
      value: { type: String, default: '' },
    },
    dueDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

invoiceSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });
invoiceSchema.index({ userId: 1, invoiceNumber: 1 });

export const InvoiceModel = model<IInvoice>('Invoice', invoiceSchema);
