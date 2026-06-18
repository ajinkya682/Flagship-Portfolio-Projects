import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOffer extends Document {
  companyId: mongoose.Types.ObjectId;
  application: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  salary: number;
  currency: string;
  startDate: Date;
  expirationDate: Date;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  letterContent: string;
  sentAt?: Date;
  hireLetterSent?: boolean;
}

const OfferSchema: Schema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  candidate: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  salary: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  startDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'declined', 'expired'], default: 'draft' },
  letterContent: { type: String, required: true },
  sentAt: { type: Date },
  hireLetterSent: { type: Boolean, default: false }
}, { timestamps: true });

export const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);
