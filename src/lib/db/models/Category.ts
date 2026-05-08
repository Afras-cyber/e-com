import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sizes: string[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    sizes: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ isActive: 1 });

// Middleware to deactivate products when category is deactivated
CategorySchema.post('save', async function (doc) {
  if (doc.isActive === false) {
    await mongoose.model('Product').updateMany(
      { categoryId: doc._id },
      { $set: { isAvailable: false } }
    );
  }
});

// For findOneAndUpdate
CategorySchema.post('findOneAndUpdate', async function (doc) {
  if (doc && doc.isActive === false) {
    await mongoose.model('Product').updateMany(
      { categoryId: doc._id },
      { $set: { isAvailable: false } }
    );
  }
});

const Category: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);

export default Category;
