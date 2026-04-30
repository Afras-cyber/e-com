import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Newsletter from '@/lib/db/models/Newsletter';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const subscribers = await Newsletter.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Newsletter fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
