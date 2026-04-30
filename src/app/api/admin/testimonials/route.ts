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

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { ids, update } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    await Testimonial.updateMany(
      { _id: { $in: ids } },
      { $set: update }
    );

    return NextResponse.json({ message: 'Bulk update successful' });
  } catch (error) {
    console.error('Error bulk updating testimonials:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    await Testimonial.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ message: 'Bulk deletion successful' });
  } catch (error) {
    console.error('Error bulk deleting testimonials:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
