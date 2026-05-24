import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Banner from '@/lib/db/models/Banner';
import { auth } from '@/lib/auth';
import { deleteImagesFromS3 } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    await connectDB();
    const body = await request.json();
    
    const existingBanner = await Banner.findById(resolvedParams.id).lean();
    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    if (existingBanner.image && existingBanner.image !== body.image) {
      await deleteImagesFromS3([existingBanner.image]);
    }
    
    const banner = await Banner.findByIdAndUpdate(
      resolvedParams.id,
      body,
      { returnDocument: 'after', runValidators: true }
    ).lean();

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    await connectDB();
    
    const existingBanner = await Banner.findById(resolvedParams.id).lean();
    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    if (existingBanner.image) {
      await deleteImagesFromS3([existingBanner.image]);
    }

    await Banner.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
