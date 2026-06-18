import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidate extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  passportPhotoUrl?: string;
  signature?: string;
  availableStartDate?: Date;
  avatar?: string;
  extractedSkills: string[];
  extractedCompanies: string[];
  extractedEducation: string[];
  portalToken?: string;
  hasPortalAccess: boolean;
  isBlocked: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const CandidateSchema: Schema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  portfolioUrl: { type: String },
  resumeUrl: { type: String },
  passportPhotoUrl: { type: String },
  signature: { type: String },
  availableStartDate: { type: Date },
  avatar: { type: String },
  extractedSkills: { type: [String], default: [] },
  extractedCompanies: { type: [String], default: [] },
  extractedEducation: { type: [String], default: [] },
  portalToken: { type: String },
  hasPortalAccess: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

export const Candidate: Model<ICandidate> = mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);
