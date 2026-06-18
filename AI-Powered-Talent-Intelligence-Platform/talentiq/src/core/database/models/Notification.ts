import mongoose, { Schema, Document, Model } from 'mongoose';

export type NotificationType =
  | 'offer_accepted'
  | 'offer_declined'
  | 'offer_sent'
  | 'candidate_message'
  | 'hire_accepted'
  | 'hire_declined'
  | 'assignment_submitted'
  | 'new_application'
  | 'stage_changed';

export interface INotification extends Document {
  recipientUserId: string; // recruiter/admin user ID
  companyId: mongoose.Types.ObjectId; // Strict multi-tenant isolation
  type: NotificationType;
  title: string;
  message: string;
  candidateId?: mongoose.Types.ObjectId;
  applicationId?: mongoose.Types.ObjectId;
  offerId?: mongoose.Types.ObjectId;
  hireLetterID?: mongoose.Types.ObjectId;
  assignmentId?: mongoose.Types.ObjectId;
  linkHref?: string; // e.g. /applications/abc123
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipientUserId: { type: String, required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    type: {
      type: String,
      enum: [
        'offer_accepted',
        'offer_declined',
        'offer_sent',
        'candidate_message',
        'hire_accepted',
        'hire_declined',
        'assignment_submitted',
        'new_application',
        'stage_changed',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate' },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
    offerId: { type: Schema.Types.ObjectId, ref: 'Offer' },
    hireLetterID: { type: Schema.Types.ObjectId, ref: 'HireLetter' },
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    linkHref: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);
