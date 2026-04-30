import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Order from '@/lib/db/models/Order';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    await connectDB();
    
    // Find the order by orderNumber
    const order = await Order.findOne({ 
      orderNumber: orderNumber.toUpperCase() 
    })
    .select('orderNumber status customer.name product createdAt statusHistory')
    .lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Don't send sensitive info like phone/email to public tracker
    return NextResponse.json(order);
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
