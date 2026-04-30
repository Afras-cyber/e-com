import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/db/models/User';
import { auth } from '@/lib/auth';
import { CreateStaffSchema } from '@/lib/validations/user.schema';
import { sendStaffWelcome } from '@/lib/resend';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const staff = await User.find({ role: { $in: ['admin', 'staff'] } })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const validatedData = CreateStaffSchema.parse(body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Generate random 8-character password
    const tempPassword = Math.random().toString(36).slice(-8);

    const newStaff = await User.create({
      ...validatedData,
      password: tempPassword,
      addedBy: (session.user as any).id,
    });

    // Send welcome email
    if (newStaff.email) {
      sendStaffWelcome({
        toEmail: newStaff.email,
        staffName: newStaff.name,
        tempPassword,
      }).catch(err => console.error('Failed to send staff welcome email:', err));
    }

    const { password, ...staffWithoutPassword } = newStaff.toObject();

    return NextResponse.json(staffWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('Error creating staff:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}
