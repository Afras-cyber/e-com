import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrandDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrandDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    logo: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BrandSchema.index({ isActive: 1 });

// Middleware to deactivate products when brand is deactivated
BrandSchema.post('save', async function (doc) {
  if (doc.isActive === false) {
    await mongoose.model('Product').updateMany(
      { brandId: doc._id },
      { $set: { isAvailable: false } }
    );
  }
});

// For findOneAndUpdate
BrandSchema.post('findOneAndUpdate', async function (doc) {
  if (doc && doc.isActive === false) {
    await mongoose.model('Product').updateMany(
      { brandId: doc._id },
      { $set: { isAvailable: false } }
    );
  }
});

const Brand: Model<IBrandDocument> =
  mongoose.models.Brand || mongoose.model<IBrandDocument>('Brand', BrandSchema);

export default Brand;
