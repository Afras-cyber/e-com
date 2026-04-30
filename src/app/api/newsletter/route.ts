import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Newsletter from '@/lib/db/models/Newsletter';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await connectDB();

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return NextResponse.json({ message: 'Subscribed successfully' });
      }
      return NextResponse.json({ message: 'Already subscribed' });
    }

    await Newsletter.create({ email: email.toLowerCase() });

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
