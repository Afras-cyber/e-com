import mongoose from 'mongoose';
import User from '../src/lib/db/models/User';
import dotenv from 'dotenv';

// Load .env.local manually for the script
dotenv.config({ path: '.env.local' });

async function seedAdmin() {
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

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });

    console.log('Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
