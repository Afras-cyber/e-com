import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Product from '../src/lib/db/models/Product';
import Category from '../src/lib/db/models/Category';
import Brand from '../src/lib/db/models/Brand';

dotenv.config({ path: '.env.local' });

const slugify = (text: string) => 
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
  const Cat = Category as any;
  const Br = Brand as any;
  const Pr = Product as any;
  
  try {
    console.log('--- STARTING MIGRATION ---');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Database connected');

    const products = await Pr.find({});
    console.log(`Found ${products.length} products to migrate.`);

    for (const product of products) {
      // 1. Ensure Category exists
      let category = await Cat.findOne({ name: new RegExp(`^${product.category}$`, 'i') });
      if (!category) {
        category = await Cat.create({
          name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
          slug: slugify(product.category),
          isActive: true
        });
        console.log(`Created category: ${category.name}`);
      }

      // 2. Ensure Brand exists
      let brand = await Br.findOne({ name: new RegExp(`^${product.brand}$`, 'i') });
      if (!brand) {
        brand = await Br.create({
          name: product.brand,
          slug: slugify(product.brand),
          isActive: true
        });
        console.log(`Created brand: ${brand.name}`);
      }

      // 3. Update Product
      await Pr.findByIdAndUpdate(product._id, {
        $set: {
          categoryId: category._id,
          brandId: brand._id
        }
      });
    }

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
