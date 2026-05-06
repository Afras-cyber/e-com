"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/format-price";
import { format } from "date-fns";
import {
  MessageCircle,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

export default function OrderManager({ id }: { id: string }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");

  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      return res.json();
    },
  });

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });
      if (res.ok) {
        setNote("");
        refetch();
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const updateNegotiatedPrice = async (price: number) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ negotiatedTotal: price }),
      });
      if (res.ok) refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  const statuses = [
    "inquiry",
    "contacted",
    "negotiating",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            Manage Order {order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground">
            Received on {format(new Date(order.createdAt), "MMMM dd, yyyy p")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Customer & Product Info */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer
                </h3>
                <div className="space-y-1">
                  <p className="font-bold text-lg">{order.customer.name}</p>
                  <p className="text-primary font-medium">
                    {order.customer.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.email || "No email provided"}
                  </p>
                </div>
                <Button
                  className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E]"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${order.customer.phone.replace(/\+/g, "")}`,
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Items
                </h3>
                <div className="space-y-4">
                  {(
                    order.items || [
                      {
                        ...order.product,
                        quantity: 1,
                      },
                    ]
                  ).map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex gap-4 p-3 rounded-lg bg-muted/20 border border-muted/30"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div className="flex-1 space-y-0.5">
                        <p className="font-bold text-sm leading-tight">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          Size: {item.selectedSize} | {item.selectedColor}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs font-medium">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-black">
                            {formatPrice(item.price * (item.quantity || 1))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">
                      {formatPrice(order.totalAmount || order.product?.price)}
                    </span>
                  </div>
                  {order.negotiatedTotal && (
                    <div className="flex justify-between items-center text-sm text-primary">
                      <span className="font-bold">Negotiated Total</span>
                      <span className="text-lg font-black">
                        {formatPrice(order.negotiatedTotal)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Status Pipeline</h2>
            <div className="relative space-y-6 before:absolute before:left-2.5 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-muted">
              {order.statusHistory.map((item: any, i: number) => (
                <div key={i} className="relative pl-10">
                  <div
                    className={cn(
                      "absolute left-0 top-1 h-5 w-5 rounded-full border-2 bg-background flex items-center justify-center",
                      i === 0 ? "border-primary scale-110" : "border-muted",
                    )}
                  >
                    {i === 0 && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold capitalize">{item.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.timestamp), "MMM dd, p")}
                    </p>
                    {item.note && (
                      <p className="text-sm mt-1 bg-muted/50 p-2 rounded italic text-muted-foreground">
                        "{item.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Control Sidebar */}
        <div className="space-y-8">
          <div className="rounded-xl border bg-card p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-6">Update Status</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pipeline Action</label>
                <div className="grid gap-2">
                  {statuses.map((s) => (
                    <Button
                      key={s}
                      variant={order.status === s ? "default" : "outline"}
                      size="sm"
                      className="justify-start capitalize font-bold"
                      onClick={() => updateStatus(s)}
                      disabled={updating}
                    >
                      {order.status === s && (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium">
                  Add Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm min-h-[80px]"
                  placeholder="Internal note for this status update..."
                />
              </div>

              <div className="pt-4 border-t space-y-4">
                <Button
                  className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E]"
                  onClick={() => {
                    const message =
                      `Hi ${order.customer.name}! This is an update regarding your order *${order.orderNumber}*.
                    
Current Status: *${order.status.toUpperCase()}*
${note ? `Note: ${note}` : ""}

You can track your order here: ${window.location.origin}/track?order=${order.orderNumber}

Thank you for choosing ${siteConfig.name}!`.trim();
                    window.open(
                      `https://wa.me/${order.customer.phone.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`,
                      "_blank",
                    );
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Send Update via WhatsApp
                </Button>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">
                  Notify customer manually
                </p>
              </div>

              <div className="pt-4 border-t space-y-4">
                <label className="text-sm font-medium">
                  Final Negotiated Price
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={order.negotiatedTotal || order.totalAmount}
                    onBlur={(e) =>
                      updateNegotiatedPrice(parseInt(e.target.value))
                    }
                    className="flex-1 p-2 border rounded-md font-bold"
                  />
                  <Button size="icon" variant="secondary">
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Setting this helps track accurate revenue in dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
