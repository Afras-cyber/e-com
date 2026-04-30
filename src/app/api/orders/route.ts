import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Order from '@/lib/db/models/Order';
import { CreateOrderSchema } from '@/lib/validations/order.schema';
import { sendOrderConfirmation, sendNewOrderNotification } from '@/lib/resend';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin' && (session.user as any).role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (searchParams.get('status')) query.status = searchParams.get('status');
    if (searchParams.get('search')) {
      const search = searchParams.get('search') as string;
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const validatedData = CreateOrderSchema.parse(body);

    const order = await Order.create({
      ...validatedData,
      status: 'inquiry',
      statusHistory: [],
    });

    // Send emails asynchronously (don't block the response)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      sendNewOrderNotification({
        adminEmail,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        productName: order.product.productName,
        selectedSize: order.product.selectedSize,
        selectedColor: order.product.selectedColor,
      }).catch(err => console.error('Failed to send admin order email:', err));
    }

    if (order.customer.email) {
      sendOrderConfirmation({
        toEmail: order.customer.email,
        customerName: order.customer.name,
        orderNumber: order.orderNumber,
        productName: order.product.productName,
        selectedSize: order.product.selectedSize,
        selectedColor: order.product.selectedColor,
        price: order.product.price,
        productSlug: order.product.productSlug,
      }).catch(err => console.error('Failed to send customer order email:', err));
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
