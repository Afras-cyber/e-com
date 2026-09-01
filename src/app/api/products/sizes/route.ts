import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Product from '@/lib/db/models/Product';
import Category from '@/lib/db/models/Category';

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');

    const productQuery: any = { isAvailable: true };

    if (categoryParam) {
      const slugToName = categoryParam.replace(/-/g, ' ');
      productQuery.category = {
        $regex: new RegExp(`^(${categoryParam}|${slugToName})$`, 'i'),
      };
    }

    // Fetch distinct sizes from products and categories in parallel
    const [productSizes, categorySizes] = await Promise.all([
      Product.distinct('sizes', productQuery),
      categoryParam
        ? Category.findOne({
            $or: [
              { slug: categoryParam.toLowerCase() },
              { name: new RegExp(`^${categoryParam.replace(/-/g, ' ')}$`, 'i') },
            ],
            isActive: true,
          })
            .select('sizes')
            .lean()
            .then((cat: any) => cat?.sizes || [])
        : Category.distinct('sizes', { isActive: true }),
    ]);

    // Merge unique non-empty sizes
    const rawSizes = Array.from(
      new Set([...(productSizes || []), ...(categorySizes || [])])
    ).filter((s): s is string => typeof s === 'string' && s.trim().length > 0);

    const sortedSizes = sortSizes(rawSizes);

    return NextResponse.json(
      { sizes: sortedSizes },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return NextResponse.json({ error: 'Failed to fetch sizes' }, { status: 500 });
  }
}
