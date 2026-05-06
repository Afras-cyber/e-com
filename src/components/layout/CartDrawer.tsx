'use client';

import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format-price';
import { buildWhatsAppCartURL } from '@/lib/whatsapp';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import QuickOrderModal from '@/components/shop/QuickOrderModal';
import { siteConfig } from '@/config/site';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsModalOpen(true);
  };

  const handleOrderSuccess = (order: any) => {
    const siteUrl = `${window.location.origin}`;
    let message = `Hi! I just placed a cart order on StepKicks. 
    
Order ID: *${order.orderNumber}*

*Items:*
`;
    
    items.forEach((item, index) => {
      const itemLink = `${siteUrl}/shop/${item.product.slug}`;
      message += `${index + 1}. *${item.product.name}* (${item.selectedSize} | ${item.selectedColor}) x ${item.quantity}\n`;
      message += `   💰 Price: LKR ${(item.product.discountPrice ?? item.product.price).toLocaleString()}\n`;
      message += `   🔗 Link: ${itemLink}\n\n`;
    });
    
    message += `\n*Total: LKR ${total().toLocaleString()}*\n\n`;
    message += `Please confirm my order. Thank you!`;

    const finalUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(finalUrl, "_blank");
    clearCart();
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col border-l"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-bold">Your Cart</h2>
                <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                  {items.length} items
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p>Your cart is empty</p>
                  <Button variant="link" onClick={closeCart} className="mt-2">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="flex gap-4 border p-3 rounded-xl bg-card">
                    <div className="w-20 h-20 bg-muted/20 rounded-md overflow-hidden shrink-0">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs opacity-50">No img</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-sm line-clamp-1">{item.product.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.selectedSize} | {item.selectedColor}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product._id, item.selectedSize, item.selectedColor)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-sm">
                          {formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}
                        </span>
                        <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-md"
                            onClick={() => updateQuantity(item.product._id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-md"
                            onClick={() => updateQuantity(item.product._id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4 bg-card/50 mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold">{formatPrice(total())}</span>
                </div>
                <div className="grid gap-2">
                  <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 font-bold py-6 text-lg" onClick={handleCheckout}>
                    Checkout via WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* QuickOrderModal for Cart */}
          {items.length > 0 && (
            <QuickOrderModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              product={{
                id: items[0].product._id, // Just placeholder ID for the modal component logic
                name: "Cart Order",
                slug: "cart",
                image: items[0].product.images[0],
                price: total(),
              }}
              selectedSize="N/A"
              selectedColor="N/A"
              onSuccess={handleOrderSuccess}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
