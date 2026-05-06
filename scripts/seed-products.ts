import mongoose from 'mongoose';
import Product from '../src/lib/db/models/Product';
import Category from '../src/lib/db/models/Category';
import Brand from '../src/lib/db/models/Brand';
import dotenv from 'dotenv';

const slugify = (text: string) => 
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

// Load .env.local manually for the script
dotenv.config({ path: '.env.local' });

const dummyProducts = [
  {
    name: "Bugatti Men's Premium Sneakers",
    shortDescription: "Premium everyday sneakers by Bugatti.",
    description: "Experience ultimate comfort and style with these premium Bugatti sneakers. Crafted with high-quality materials, perfect for everyday wear or special occasions.",
    brand: "Bugatti",
    category: "shoes",
    subcategory: "sneakers",
    price: 18500,
    isOnSale: false,
    images: ["https://bugattishoes.in/cdn/shop/files/322-A9S01-6900-4100.jpg?v=1762412735"],
    sizes: ["40", "41", "42", "43", "44"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" }
    ],
    stock: 50,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: "Classic Action Lifestyle Trainers",
    shortDescription: "Versatile trainers for the modern lifestyle.",
    description: "Versatile and durable trainers designed for the modern lifestyle. Whether you're hitting the gym or the streets, these shoes provide exceptional support.",
    brand: "Action",
    category: "shoes",
    subcategory: "trainers",
    price: 12000,
    discountPrice: 9500,
    discountPercent: 21,
    isOnSale: true,
    images: ["https://www.actionlifestyle.com/cdn/shop/files/MG_7309_77c94f82-b50f-48f3-9cd5-37fa62578098.jpg?v=1715678626"],
    sizes: ["39", "40", "41", "42"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Grey", hex: "#808080" }
    ],
    stock: 30,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: "Urban Style Casual Loafers",
    shortDescription: "Elegant casual slip-on loafers.",
    description: "Step out in elegance with these casual loafers. Slip-on design with a comfortable insole makes them your go-to choice for smart-casual events.",
    brand: "StepKicks",
    category: "shoes",
    subcategory: "loafers",
    price: 8500,
    isOnSale: false,
    images: ["https://static-01.daraz.lk/p/2537dfc4f93a7f67d193aafc1b43d939.jpg"],
    sizes: ["41", "42", "43", "45"],
    colors: [
      { name: "Brown", hex: "#8B4513" }
    ],
    stock: 20,
    isFeatured: false,
    isAvailable: true,
  }
];

async function seedProducts() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('MONGODB_URI is not set in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Optional: Clear existing products, categories, and brands
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    console.log('Cleared existing data');

    const productsToInsert = [];

    for (const p of dummyProducts) {
      // 1. Get or Create Category
      let category = await Category.findOne({ name: new RegExp(`^${p.category}$`, 'i') });
      if (!category) {
        category = await Category.create({
          name: p.category.charAt(0).toUpperCase() + p.category.slice(1),
          slug: slugify(p.category),
          isActive: true
        });
      }

      // 2. Get or Create Brand
      let brand = await Brand.findOne({ name: new RegExp(`^${p.brand}$`, 'i') });
      if (!brand) {
        brand = await Brand.create({
          name: p.brand,
          slug: slugify(p.brand),
          isActive: true
        });
      }

      // 3. Prepare Product
      productsToInsert.push({
        ...p,
        categoryId: category._id,
        brandId: brand._id,
        slug: slugify(p.name)
      });
    }

    await Product.insertMany(productsToInsert);
    console.log(`Successfully inserted ${productsToInsert.length} products with category/brand links!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
