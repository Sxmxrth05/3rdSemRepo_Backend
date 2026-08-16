import { Schema, model, Document, Types } from 'mongoose';

export interface IBusinessProfile extends Document {
  userId: Types.ObjectId;
  businessName: string;
  logoUrl?: string;
  address?: string;
  email: string;
  phone?: string;
  defaultSignature: {
    type: 'font' | 'drawn';
    value: string;
  };
  invoiceNumberPrefix: string;
  createdAt: Date;
  updatedAt: Date;
}

const businessProfileSchema = new Schema<IBusinessProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, default: 'My Business' },
    logoUrl: { type: String },
    address: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    defaultSignature: {
      type: { type: String, enum: ['font', 'drawn'], default: 'font' },
      value: { type: String, default: '' },
    },
    invoiceNumberPrefix: { type: String, default: 'INV-' },
  },
  { timestamps: true }
);

export const BusinessProfileModel = model<IBusinessProfile>('BusinessProfile', businessProfileSchema);
