import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INewsletterDocument extends Document {
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<INewsletterDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Newsletter: Model<INewsletterDocument> =
  mongoose.models.Newsletter || mongoose.model<INewsletterDocument>('Newsletter', NewsletterSchema);

export default Newsletter;
