import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Newsletter from "@/lib/db/models/Newsletter";
import { auth } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, content } = await request.json();

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Missing subject or content" },
        { status: 400 },
      );
    }

    await connectDB();
    const subscribers = await Newsletter.find({ isActive: true })
      .select("email")
      .lean();
    const emails = subscribers.map((s) => s.email);

    if (emails.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found" },
        { status: 400 },
      );
    }

    // In a real production app, you'd use a background job or batch sending.
    // Resend supports up to 50 emails per call in some configurations.
    // For now, we'll send a single broadcast if possible, or iterate.

    const { data, error } = await resend.emails.send({
      from: "CRK Shoes <newsletter@crkshoes.shop>", // Ensure this domain is verified in Resend
      to: emails,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: -1px;">CRK Shoes</h1>
          </div>
          <div style="padding: 30px; line-height: 1.6; color: #333;">
            ${content}
          </div>
          <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            <p>&copy; 2026 CRK Shoes. All rights reserved.</p>
            <p>You're receiving this because you subscribed to our newsletter.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send emails" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: `Successfully sent to ${emails.length} subscribers`,
      data,
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
