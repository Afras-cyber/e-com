import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import connectDB from "@/lib/db/mongoose";
import Order from "@/lib/db/models/Order";
import { InvoiceDocument, InvoiceData } from "@/lib/invoice/InvoiceTemplate";
import { siteConfig } from "@/config/site";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await connectDB();

    // Find order by ID or orderNumber
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { orderNumber: id };

    const order = await Order.findOne(query).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Map order fields to InvoiceData
    const invoiceData: InvoiceData = {
      orderNumber: order.orderNumber,
      createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
      status: order.status,
      customer: {
        name: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email,
        address: order.notes, // Use order notes or billing address if available, defaulting to notes for now
      },
      items: order.items.map((item: any) => ({
        productName: item.productName,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: order.totalAmount,
      negotiatedTotal: order.negotiatedTotal,
      notes: order.notes,
      shopName: siteConfig.name,
      shopPhone: siteConfig.contact.phone,
      shopEmail: siteConfig.contact.email,
      shopAddress: siteConfig.contact.address,
    };

    // Render the React PDF element to buffer
    const pdfElement = React.createElement(InvoiceDocument, { data: invoiceData });
    const buffer = await renderToBuffer(pdfElement as any);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${order.orderNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating invoice PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice", details: error.message },
      { status: 500 }
    );
  }
}
