'use client';

import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@/lib/format-price';
import { format } from 'date-fns';
import { 
  Eye, 
  MessageCircle, 
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useState } from 'react';

const statusMap: any = {
  inquiry: { label: 'New Inquiry', color: 'bg-blue-100 text-blue-700', icon: MessageCircle },
  contacted: { label: 'Contacted', color: 'bg-purple-100 text-purple-700', icon: Clock },
  negotiating: { label: 'Negotiating', color: 'bg-orange-100 text-orange-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-cyan-100 text-cyan-700', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function OrderTable() {
  const [filter, setFilter] = useState('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-orders', filter],
    queryFn: async () => {
      const url = filter === 'all' ? '/api/orders' : `/api/orders?status=${filter}`;
      const res = await fetch(url);
      return res.json();
    }
  });

  if (isLoading) return <div className="p-8 text-center">Loading orders...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error loading orders</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('all')}
          className="rounded-full"
        >
          All
        </Button>
        {Object.entries(statusMap).map(([key, value]: [string, any]) => (
          <Button 
            key={key}
            variant={filter === key ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter(key)}
            className="rounded-full whitespace-nowrap"
          >
            {value.label}
          </Button>
        ))}
      </div>

      <div className="rounded-md border bg-card shadow-sm">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data?.orders.map((order: any) => {
              const status = statusMap[order.status] || statusMap.inquiry;
              return (
                <tr key={order._id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-bold text-primary">{order.orderNumber}</td>
                  <td className="p-4 align-middle">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customer.name}</span>
                      <span className="text-xs text-muted-foreground">{order.customer.phone}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <img src={order.items?.[0]?.image || order.product?.image} alt="" className="w-8 h-8 rounded object-cover border" />
                      <div className="flex flex-col">
                        <span className="font-medium line-clamp-1">
                          {order.items?.[0]?.productName || order.product?.productName}
                          {(order.items?.length || 0) > 1 && <span className="text-primary ml-1">+{order.items.length - 1} more</span>}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.items?.[0]?.selectedSize || order.product?.selectedSize} | {order.items?.[0]?.selectedColor || order.product?.selectedColor}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle font-bold">
                    {formatPrice(order.negotiatedTotal || order.totalAmount)}
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="p-4 align-middle">
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold", status.color)}>
                      <status.icon className="h-3 w-3" />
                      {status.label}
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Link href={`/admin/orders/${order._id}`}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        Manage
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
      {(!data?.orders || data.orders.length === 0) && (
        <div className="p-8 text-center text-muted-foreground">No orders found</div>
      )}
    </div>
  );
}
