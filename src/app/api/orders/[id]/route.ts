import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Order from '@/lib/db/models/Order';
import Product from '@/lib/db/models/Product';
import { UpdateOrderStatusSchema } from '@/lib/validations/order.schema';
import { auth } from '@/lib/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // ... (keeping existing GET logic)
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

    const oldStatus = order.status;
    order.status = status;
    order.statusHistory.push({
      status,
      updatedBy: (session.user as any).id,
      note,
      timestamp: new Date(),
    });

    await order.save();

    // Side Effect 1: Inventory Sync
    // If order is confirmed and wasn't confirmed before, decrement stock
    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      await Product.findByIdAndUpdate(order.product.productId, {
        $inc: { stock: -1 }
      });
    }
    // If order was confirmed and is now cancelled, increment stock back
    if (status === 'cancelled' && oldStatus === 'confirmed') {
      await Product.findByIdAndUpdate(order.product.productId, {
        $inc: { stock: 1 }
      });
    }

    // Side Effect 2: Email Notification
    if (order.customer.email) {
      try {
        await resend.emails.send({
          from: 'StepKicks Store <onboarding@resend.dev>',
          to: order.customer.email,
          subject: `Order Update: ${order.orderNumber}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #000; text-transform: uppercase; font-weight: 900; letter-spacing: -1px;">STEPKICKS</h2>
              <p>Hi ${order.customer.name},</p>
              <p>Your order status has been updated to: <strong>${status.toUpperCase()}</strong></p>
              ${note ? `<p style="background: #f9f9f9; padding: 10px; border-radius: 5px; font-style: italic;">" ${note} "</p>` : ''}
              <div style="margin: 20px 0; padding: 15px; background: #fafafa; border-radius: 8px;">
                <p style="margin: 0; font-weight: bold;">Order: ${order.orderNumber}</p>
                <p style="margin: 5px 0 0 0;">Product: ${order.product.productName} (${order.product.selectedSize})</p>
              </div>
              <p>You can track your order live at: <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://stepkicks.lk'}/track?order=${order.orderNumber}">${process.env.NEXT_PUBLIC_APP_URL || 'https://stepkicks.lk'}/track</a></p>
              <p style="margin-top: 30px; font-size: 12px; color: #888;">If you have any questions, feel free to reply to this email or message us on WhatsApp.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error updating order:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
