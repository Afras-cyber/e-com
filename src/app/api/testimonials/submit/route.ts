import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Testimonial from '@/lib/db/models/Testimonial';

export async function POST(req: Request) {
  try {
    const { customerName, review, rating, productName } = await req.json();

    if (!customerName || !review || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    await Testimonial.create({
      customerName,
      review,
      rating: parseInt(rating),
      productName,
      isFeatured: false, // Default to false, admin needs to approve/feature it
    });

    return NextResponse.json({ message: 'Testimonial submitted for review' });
  } catch (error) {
    console.error('Testimonial submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
