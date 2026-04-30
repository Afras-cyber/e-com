import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Testimonial from '@/lib/db/models/Testimonial';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const testimonials = await Testimonial.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
