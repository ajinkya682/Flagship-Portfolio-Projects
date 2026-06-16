import mongoose, { Document, Model } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  email: string;
  source: string;
  createdAt: Date;
}

const NewsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  source: { type: String, default: 'resources_page' },
  createdAt: { type: Date, default: Date.now },
});

export const NewsletterSubscriber: Model<INewsletterSubscriber> = 
  mongoose.models.NewsletterSubscriber || mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);
