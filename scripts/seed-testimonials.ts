import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Testimonial from '../src/lib/db/models/Testimonial';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const testimonials = [
  {
    customerName: "Afras Mohamed",
    rating: 5,
    review: "The Bugatti sneakers are absolutely stunning! The quality is top-notch and they were delivered within 2 days in Colombo. Highly recommend StepKicks!",
    productName: "Bugatti Men's Premium Sneakers",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Sarah J.",
    rating: 5,
    review: "Finally found an authentic designer bag store in Sri Lanka. The WhatsApp support was very helpful in helping me choose the right color.",
    productName: "Luxury Designer Bag",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Kasun Perera",
    rating: 4,
    review: "Great collection of kicks. The sizing was perfect. Will definitely buy again.",
    productName: "Nike Air Max 270",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Dilini W.",
    rating: 5,
    review: "Best shopping experience! The interface is so smooth and tracking my order was very easy.",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Hussain R.",
    rating: 5,
    review: "StepKicks never disappoints. Premium quality sneakers at reasonable prices.",
    isApproved: true,
    isFeatured: false,
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected.');

    console.log('Cleaning existing testimonials...');
    await Testimonial.deleteMany({});

    console.log('Seeding testimonials...');
    await Testimonial.insertMany(testimonials);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
