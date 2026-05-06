import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Category from '@/lib/db/models/Category';
import { auth } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await connectDB();
    const data = await req.json();

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await connectDB();
    
    // Check if products exist in this category
    const Product = (await import('@/lib/db/models/Product')).default;
    const productCount = await Product.countDocuments({ categoryId: id });
    
    if (productCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category. It has ${productCount} associated products. Deactivate it instead.` 
      }, { status: 400 });
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
