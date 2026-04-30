'use client';

import { useWishlist } from '@/store/useWishlist';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/format-price';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowRight, HeartOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleMoveToCart = (item: any) => {
    // Assuming standard size/color for wishlist moves, or just open product page
    // For now, let's just toast and redirect to product page for selection
    toast.info('Redirecting to select size/color...');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <HeartOff className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Your wishlist is empty</h1>
          <p className="text-muted-foreground">
            Save items you love and they'll appear here.
          </p>
          <Link href="/shop">
            <Button className="rounded-full px-8 h-12 gap-2 mt-4 font-bold">
              <ShoppingBag className="w-4 h-4" />
              Go Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">My Favorites</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            You have {items.length} {items.length === 1 ? 'item' : 'items'} saved.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearWishlist}
          className="text-destructive hover:bg-destructive/10 w-fit font-bold uppercase tracking-tight"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.id} className="group relative bg-card border rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
            <Link href={`/shop/${item.slug}`} className="aspect-[4/5] relative overflow-hidden bg-muted/20">
              <Image 
                src={item.image} 
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </Link>
            
            <div className="p-5 flex flex-col flex-1">
              <Link href={`/shop/${item.slug}`} className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {item.name}
              </Link>
              <p className="font-black text-xl mb-6">{formatPrice(item.price)}</p>
              
              <div className="mt-auto flex gap-2">
                <Link href={`/shop/${item.slug}`} className="flex-1">
                  <Button className="w-full rounded-xl font-bold uppercase tracking-tighter h-11 gap-2">
                    View Product
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={() => removeItem(item.id)}
                  className="rounded-xl h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
