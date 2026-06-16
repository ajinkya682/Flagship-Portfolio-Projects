import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  logo?: string;
  industry: string;
  size: string;
  timezone: string;
  currency: string;
  careerPageUrl: string;
  subdomain: string;
  slug: string;
}

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  logo: { type: String },
  industry: { type: String, default: 'Technology' },
  size: { type: String, default: '1-10' },
  timezone: { type: String, default: 'UTC' },
  currency: { type: String, default: 'USD' },
  careerPageUrl: { type: String },
  subdomain: { type: String },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
