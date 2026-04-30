import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Banner from '@/lib/db/models/Banner';

export async function GET() {
  try {
    await connectDB();
    const currentDate = new Date();
    
    // Only return active banners, and those that are either without dates or within the date range
    const banners = await Banner.find({
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: currentDate } }
      ],
    }).and([
      {
        $or: [
          { endDate: { $exists: false } },
          { endDate: { $gte: currentDate } }
        ]
      }
    ]).sort({ position: 1 }).lean();

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching public banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}
