import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Order from '@/lib/db/models/Order';
import { UpdateOrderStatusSchema } from '@/lib/validations/order.schema';
import { auth } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin' && (session.user as any).role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    await connectDB();
    const order = await Order.findById(resolvedParams.id).populate('statusHistory.updatedBy', 'name role').lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin' && (session.user as any).role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    await connectDB();
    const body = await request.json();
    const { status, note } = UpdateOrderStatusSchema.parse(body);

    const order = await Order.findById(resolvedParams.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      updatedBy: (session.user as any).id,
      note,
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error updating order:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
