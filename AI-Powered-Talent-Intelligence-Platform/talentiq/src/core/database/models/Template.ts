import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITemplate extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  type: 'email' | 'offer' | 'hire' | 'rejection';
  subject?: string;
  body: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['email', 'offer', 'hire', 'rejection'], required: true },
  subject: { type: String },
  body: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Template: Model<ITemplate> = mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);
