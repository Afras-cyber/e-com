'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagniferLinear, CloseCircleLinear } from 'solar-icon-set';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface OrderSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderSearchModal({ isOpen, onClose }: OrderSearchModalProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const { data, isLoading } = useQuery({
    queryKey: ['orderSearch', search],
    queryFn: async () => {
      if (!search.trim()) return { orders: [] };
      const res = await fetch(`/api/orders?search=${encodeURIComponent(search)}&limit=8`);
      return res.json();
    },
    enabled: search.trim().length > 0,
  });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-start pt-20 sm:pt-32 bg-black/60 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-background rounded-xl shadow-2xl overflow-hidden border border-border mx-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative flex items-center p-4">
          <MagniferLinear className="h-6 w-6 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            placeholder="Search order ID (e.g. STK-...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors"
          >
            <CloseCircleLinear className="h-6 w-6" />
          </button>
        </div>

        {/* Horizontal Line */}
        <div className="h-[1px] w-full bg-border" />

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!search.trim() ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Start typing to search across all orders...
            </div>
          ) : isLoading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Searching...
            </div>
          ) : data?.orders?.length > 0 ? (
            <div className="flex flex-col gap-1">
              {data.orders.map((order: any) => (
                <button
                  key={order._id}
                  className="flex items-center justify-between w-full p-4 hover:bg-muted rounded-lg text-left transition-colors group"
                  onClick={() => {
                    router.push(`/admin/orders/${order.orderNumber}`);
                    onClose();
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg group-hover:text-primary transition-colors">{order.orderNumber}</p>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {order.customer.name} • {order.customer.phone}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </p>
                    <div>
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md",
                        order.status === 'delivered' ? "bg-green-100 text-green-700" :
                        order.status === 'cancelled' ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No orders found matching "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
