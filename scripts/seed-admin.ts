import mongoose from 'mongoose';
import User from '../src/lib/db/models/User';
import Banner from '../src/lib/db/models/Banner';
import dotenv from 'dotenv';

// Load .env.local manually for the script
dotenv.config({ path: '.env.local' });

async function seedDatabase() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const mongoUri = process.env.MONGODB_URI;

  if (!adminEmail || !adminPassword || !mongoUri) {
    console.error('Missing required environment variables (ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI)');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 1. Seed Admin
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
      });
      console.log('Admin user created successfully!');
    } else {
      console.log('Admin user already exists!');
    }

    // 2. Seed Banners
    console.log('Seeding banners...');
    await Banner.deleteMany({}); // Optional: clear existing banners

    await Banner.insertMany([
      {
        title: 'Step into Style',
        subtitle: 'Professional E-Commerce Shoes Collection',
        image: 'https://graphicsfamily.com/wp-content/uploads/edd/2021/07/Professional-E-Commerce-Shoes-Banner-Design-1536x864.jpg',
        type: 'hero',
        position: 1,
        isActive: true,
        buttonText: 'Shop Now',
        link: '/shop',
      },
      {
        title: 'Massive Shoe Sale',
        subtitle: 'Up to 50% Off on Premium Brands',
        image: 'https://static.vecteezy.com/system/resources/previews/020/903/143/original/shoe-sale-banner-vector.jpg',
        type: 'hero',
        position: 2,
        isActive: true,
        buttonText: 'View Offers',
        link: '/shop?isOnSale=true',
      }
    ]);
    console.log('Banners seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
