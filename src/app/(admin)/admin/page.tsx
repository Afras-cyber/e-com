import { auth } from "@/lib/auth";
import { Package, ShoppingCart, Users, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import connectDB from "@/lib/db/mongoose";
import Order from "@/lib/db/models/Order";
import Product from "@/lib/db/models/Product";
import { formatPrice } from "@/lib/format-price";

export default async function AdminDashboard() {
  const session = await auth();
  
  await connectDB();
  
  // Basic stats
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "inquiry" });
  const totalProducts = await Product.countDocuments();
  
  // Calculate total revenue for delivered orders
  const deliveredOrders = await Order.find({ status: "delivered" }).lean();
  const revenue = deliveredOrders.reduce((sum, order) => {
    return sum + (order.product.negotiatedPrice || order.product.price);
  }, 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || 'Admin'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
            <span className="text-muted-foreground">💰</span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{formatPrice(revenue)}</div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Orders</h3>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalOrders}</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Pending Inquiries</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Products</h3>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalProducts}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">Quick Links</h3>
            <div className="grid gap-2">
              <Link href="/admin/products/new" className="text-sm text-blue-600 hover:underline">
                + Add New Product
              </Link>
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
                View All Orders
              </Link>
              <Link href="/admin/banners" className="text-sm text-blue-600 hover:underline">
                Manage Homepage Banners
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
