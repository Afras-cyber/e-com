import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonialDocument extends Document {
  customerName: string;
  customerAvatar?: string;
  rating: number;
  review: string;
  productId?: mongoose.Types.ObjectId;
  productName?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonialDocument>(
  {
    customerName: { type: String, required: true },
    customerAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TestimonialSchema.index({ isApproved: 1, isFeatured: 1 });

const Testimonial: Model<ITestimonialDocument> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonialDocument>('Testimonial', TestimonialSchema);

export default Testimonial;
