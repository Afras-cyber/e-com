'use client';

import { useState } from 'react';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/format-price';
import { motion, AnimatePresence } from 'framer-motion';

const statusMap: any = {
  inquiry: { label: 'Inquiry Received', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
  contacted: { label: 'Store Contacted', icon: Search, color: 'text-purple-500', bg: 'bg-purple-50' },
  negotiating: { label: 'Negotiating', icon: Search, color: 'text-orange-500', bg: 'bg-orange-50' },
  confirmed: { label: 'Order Confirmed', icon: CheckCircle2, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  processing: { label: 'Processing', icon: Package, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  shipped: { label: 'Dispatched', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
  cancelled: { label: 'Cancelled', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber) return;
    
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const res = await fetch(`/api/track/${orderNumber}`);
      const data = await res.json();
      
      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Track Your <span className="text-primary italic">Step</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your order number to see the current status of your inquiry.
          </p>
        </div>

        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="e.g. ORD-123456" 
              className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-lg uppercase"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="h-14 px-10 rounded-2xl text-lg font-bold gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track Order"}
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-medium border border-red-100"
            >
              {error}
            </motion.div>
          )}

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Status Header */}
              <div className="bg-zinc-900 text-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">Current Status</p>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black capitalize">{order.status}</h2>
                      <div className={`p-2 rounded-xl ${statusMap[order.status]?.bg || 'bg-zinc-800'} ${statusMap[order.status]?.color || 'text-white'}`}>
                        {(() => {
                          const Icon = statusMap[order.status]?.icon || Package;
                          return <Icon size={24} />;
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">Order ID</p>
                    <p className="text-2xl font-bold">{order.orderNumber}</p>
                    <p className="text-sm text-zinc-400">Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>

              {/* Status Pipeline */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 md:p-10">
                <h3 className="text-xl font-bold mb-8">Status History</h3>
                <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-20px)] before:w-0.5 before:bg-zinc-100 dark:before:bg-zinc-800">
                  {order.statusHistory.map((item: any, i: number) => {
                    const status = statusMap[item.status] || { label: item.status, icon: Package };
                    const Icon = status.icon;
                    const isLatest = i === 0;
                    
                    return (
                      <div key={i} className="relative pl-10">
                        <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-2 bg-white dark:bg-zinc-950 flex items-center justify-center transition-transform ${isLatest ? 'border-primary scale-110 z-10' : 'border-zinc-200 dark:border-zinc-800'}`}>
                          {isLatest ? <div className="h-2.5 w-2.5 rounded-full bg-primary" /> : <div className="h-1.5 w-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                          <div>
                            <p className={`font-bold capitalize ${isLatest ? 'text-primary' : 'text-zinc-500'}`}>{status.label}</p>
                            {item.note && <p className="text-sm text-muted-foreground italic mt-1">"{item.note}"</p>}
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(item.timestamp), 'MMM dd, p')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold px-1">Order Items</h3>
                {(order.items || [
                  {
                    ...order.product,
                    quantity: 1,
                  }
                ]).map((item: any, i: number) => (
                  <div key={i} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] p-6 flex items-center gap-6">
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700 shadow-sm" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg leading-tight">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black">{formatPrice(item.price * (item.quantity || 1))}</p>
                    </div>
                  </div>
                ))}
                
                <div className="bg-zinc-900 text-white rounded-[2rem] p-6 flex justify-between items-center">
                  <span className="font-bold text-zinc-400">Total Bill</span>
                  <span className="text-2xl font-black">
                    {formatPrice(order.negotiatedTotal || order.totalAmount)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
