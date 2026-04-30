import mongoose from 'mongoose';
import Product from '../src/lib/db/models/Product';
import dotenv from 'dotenv';
import { slugify } from '../src/lib/slugify';

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
    inStock: true,
    stockCount: 50,
    isFeatured: true,
    isActive: true,
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
    inStock: true,
    stockCount: 30,
    isFeatured: true,
    isActive: true,
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
    inStock: true,
    stockCount: 20,
    isFeatured: false,
    isActive: true,
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

    // Optional: Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add slugs
    const productsToInsert = dummyProducts.map(p => ({
      ...p,
      slug: slugify(p.name)
    }));

    await Product.insertMany(productsToInsert);
    console.log(`Successfully inserted ${productsToInsert.length} products!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
