import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: 'shoes' | 'bags' | 'accessories';
  subcategory: string;
  brand: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string; imageIndex?: number }[];
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  rating: number;
  reviewCount: number;
  viewCount: number;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ColorSchema = new Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    imageIndex: { type: Number },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['shoes', 'bags', 'accessories'],
    },
    subcategory: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100 },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [ColorSchema],
    stock: { type: Number, required: true, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },
    clickCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Indexes for performance
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isOnSale: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ name: 'text', tags: 'text' });

const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

export default Product;
