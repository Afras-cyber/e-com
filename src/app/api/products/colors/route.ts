import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Product from '@/lib/db/models/Product';

function isLightColor(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.8;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.8;
  }
  return false;
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');

    const matchQuery: any = {
      isAvailable: true,
      'colors.0': { $exists: true },
    };

    if (categoryParam) {
      const slugToName = categoryParam.replace(/-/g, ' ');
      matchQuery.category = {
        $regex: new RegExp(`^(${categoryParam}|${slugToName})$`, 'i'),
      };
    }

    const aggregatedColors = await Product.aggregate([
      { $match: matchQuery },
      { $unwind: '$colors' },
      {
        $match: {
          'colors.name': { $exists: true, $ne: '' },
          'colors.hex': { $exists: true, $ne: '' },
        },
      },
      {
        $group: {
          _id: { $toLower: '$colors.name' },
          name: { $first: '$colors.name' },
          hex: { $first: '$colors.hex' },
        },
      },
      { $sort: { name: 1 } },
    ]);

    const colors = aggregatedColors.map((c) => ({
      name: c.name,
      hex: c.hex.startsWith('#') ? c.hex : `#${c.hex}`,
      isLight: isLightColor(c.hex),
    }));

    return NextResponse.json(
      { colors },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching colors:', error);
    return NextResponse.json({ error: 'Failed to fetch colors' }, { status: 500 });
  }
}
