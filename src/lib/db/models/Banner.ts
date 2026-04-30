import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBannerDocument extends Document {
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  type: 'hero' | 'promo' | 'sale' | 'seasonal';
  position: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  backgroundColor?: string;
  textColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBannerDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    mobileImage: { type: String },
    link: { type: String },
    buttonText: { type: String },
    type: {
      type: String,
      enum: ['hero', 'promo', 'sale', 'seasonal'],
      default: 'promo',
    },
    position: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
    backgroundColor: { type: String },
    textColor: { type: String },
  },
  { timestamps: true }
);

BannerSchema.index({ isActive: 1, position: 1 });

const Banner: Model<IBannerDocument> =
  mongoose.models.Banner || mongoose.model<IBannerDocument>('Banner', BannerSchema);

export default Banner;
