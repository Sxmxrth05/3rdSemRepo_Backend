import { Schema, model, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  slug: string;
  description: string;
  previewImageUrl: string;
  layoutConfig: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    previewImageUrl: { type: String, default: '' },
    layoutConfig: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const TemplateModel = model<ITemplate>('Template', templateSchema);
