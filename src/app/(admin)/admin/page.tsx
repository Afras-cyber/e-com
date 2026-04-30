import { auth } from "@/lib/auth";
import {
  Package,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import connectDB from "@/lib/db/mongoose";
import Order from "@/lib/db/models/Order";
import Product from "@/lib/db/models/Product";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";

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

  // Fetch recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || "Admin"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Total Revenue
            </h3>
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
            <h3 className="tracking-tight text-sm font-medium">
              Pending Inquiries
            </h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Total Products
            </h3>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalProducts}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">
              Recent Orders
            </h3>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                      Order
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr
                      key={order._id.toString()}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-2 align-middle font-medium">
                        {order.orderNumber}
                      </td>
                      <td className="p-2 align-middle">
                        {order.customer.name}
                      </td>
                      <td className="p-2 align-middle">
                        {formatPrice(
                          order.product.negotiatedPrice || order.product.price,
                        )}
                      </td>
                      <td className="p-2 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "inquiry"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link
                href="/admin/orders"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                View all orders <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">
              Quick Actions
            </h3>
            <div className="grid gap-2">
              <Link href="/admin/products/new">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Package className="h-4 w-4" /> Add New Product
                </Button>
              </Link>
              <Link href="/admin/banners">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <ImageIcon className="h-4 w-4" /> Manage Banners
                </Button>
              </Link>
              <Link href="/admin/staff">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Users className="h-4 w-4" /> Manage Staff
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
