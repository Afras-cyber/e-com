'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircleLinear, ChatLineLinear, RefreshLinear } from "solar-icon-set";;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
  };
  selectedSize: string;
  selectedColor: string;
  onSuccess: (order: any) => void;
}

export default function QuickOrderModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColor,
  onSuccess,
}: QuickOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in your name and phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
          },
          items: [{
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            selectedSize,
            selectedColor,
            price: product.price,
            quantity: 1,
            image: product.image,
          }],
          totalAmount: product.price,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(data);
        onClose();
      } else {
        toast.error(data.error || 'Failed to create order inquiry');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-3xl p-6 md:p-8 z-[101] shadow-2xl border"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black tracking-tight uppercase italic">
                Quick <span className="text-primary">Order</span>
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <CloseCircleLinear size={20} />
              </Button>
            </div>

            <div className="bg-muted/30 rounded-2xl p-4 flex gap-4 mb-8">
              <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover border" />
              <div>
                <h4 className="font-bold text-sm leading-tight mb-1">{product.name}</h4>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                  Size: {selectedSize} | {selectedColor}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <Input 
                  placeholder="e.g. John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 rounded-xl bg-muted/20 border-transparent focus:bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number (WhatsApp)</label>
                <Input 
                  placeholder="e.g. 077 123 4567" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-12 rounded-xl bg-muted/20 border-transparent focus:bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email (Optional)</label>
                <Input 
                  type="email"
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-xl bg-muted/20 border-transparent focus:bg-background transition-all"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl gap-3 text-lg font-black shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <RefreshLinear className="animate-spin" />
                ) : (
                  <>
                    <ChatLineLinear size={22} />
                    Complete via WhatsApp
                  </>
                )}
              </Button>
              
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">
                Securely handled via encrypted WhatsApp chat
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
