import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Brand from '@/lib/db/models/Brand';
import { auth } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const data = await req.json();

    const brand = await Brand.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    
    // Check if products exist for this brand
    const Product = (await import('@/lib/db/models/Product')).default;
    const productCount = await Product.countDocuments({ brandId: id });
    
    if (productCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete brand. It has ${productCount} associated products. Deactivate it instead.` 
      }, { status: 400 });
    }

    await Brand.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Brand deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
