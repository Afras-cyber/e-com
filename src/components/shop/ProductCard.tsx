'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/types/product';
import { formatPrice } from '@/lib/format-price';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/store/useWishlist';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductCard({ product }: { product: IProduct }) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const active = isInWishlist(product._id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (active) {
      removeItem(product._id);
      toast.info('Removed from wishlist');
    } else {
      addItem({
        id: product._id,
        name: product.name,
        price: product.isOnSale && product.discountPrice ? product.discountPrice : product.price,
        image: product.images[0],
        slug: product.slug
      });
      toast.success('Added to wishlist');
    }
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group relative rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
      <div className="aspect-[4/5] relative overflow-hidden bg-muted/20">
        {product.images?.[0] ? (
          <Image 
            src={product.images[0]} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/40 text-muted-foreground text-sm">
            No image
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOnSale && product.discountPercent && (
            <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-md">
              -{product.discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:scale-110 active:scale-95 z-10"
        >
          <Heart className={cn("w-4 h-4 transition-colors", active ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
          {product.brand}
        </span>
        <h3 className="font-semibold text-base line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2 flex items-center gap-2">
          {product.isOnSale && product.discountPrice ? (
            <>
              <span className="font-bold text-lg">{formatPrice(product.discountPrice)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-bold text-lg">{formatPrice(product.price)}</span>
          )}
        </div>
        
        {/* Colors quick preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            {product.colors.slice(0, 4).map((c, i) => (
              <span 
                key={i} 
                className="w-3 h-3 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
