import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Product from '@/lib/db/models/Product';
import { ProductSchema } from '@/lib/validations/product.schema';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const query: any = {};

    // Filters — category: case-insensitive match against stored category string OR slug
    if (searchParams.get('category')) {
      const catParam = searchParams.get('category') as string;
      // Also try converting slug format (e.g. "football-boot") to title-like form ("Football Boot")
      const slugToName = catParam.replace(/-/g, ' ');
      query.category = { $regex: new RegExp(`^(${catParam}|${slugToName})$`, 'i') };
    }
    if (searchParams.get('subcategory')) {
      const subParam = searchParams.get('subcategory') as string;
      const slugToName = subParam.replace(/-/g, ' ');
      query.subcategory = { $regex: new RegExp(`^(${subParam}|${slugToName})$`, 'i') };
    }
    if (searchParams.get('brand')) query.brand = { $in: searchParams.get('brand')?.split(',') };
    if (searchParams.get('sizes')) query.sizes = { $in: searchParams.get('sizes')?.split(',') };
    if (searchParams.get('colors')) query['colors.name'] = { $in: searchParams.get('colors')?.split(',') };
    if (searchParams.has('isFeatured')) query.isFeatured = searchParams.get('isFeatured') === 'true';
    if (searchParams.has('isOnSale')) query.isOnSale = searchParams.get('isOnSale') === 'true';
    if (searchParams.get('search')) {
      query.$text = { $search: searchParams.get('search') as string };
    }

    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sort: any = { createdAt: -1 };
    const sortParam = searchParams.get('sort');
    if (sortParam === 'price-asc') sort = { price: 1 };
    if (sortParam === 'price-desc') sort = { price: -1 };
    if (sortParam === 'best-rated') sort = { rating: -1 };

    const products = await Product.find(query).sort(sort).skip(skip).limit(limit).lean();
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin' && (session.user as any).role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const validatedData = ProductSchema.parse(body);

    // Calculate discount percent if applicable
    if (validatedData.discountPrice && validatedData.discountPrice < validatedData.price) {
      validatedData.discountPercent = Math.round(((validatedData.price - validatedData.discountPrice) / validatedData.price) * 100);
      validatedData.isOnSale = true;
    }

    const product = await Product.create(validatedData);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
