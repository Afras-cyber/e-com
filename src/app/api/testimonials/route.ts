import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Testimonial from '@/lib/db/models/Testimonial';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const isFeatured = searchParams.get('isFeatured') === 'true';

    const query: any = { isApproved: true };
    if (isFeatured) {
      query.isFeatured = true;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validate required fields (using basic validation here, ideally use Zod)
    if (!body.customerName || !body.rating || !body.review) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const testimonial = await Testimonial.create({
      ...body,
      isApproved: false, // Must be approved by admin
      isFeatured: false,
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 });
  }
}
