import Link from 'next/link';
import { IProduct } from '@/types/product';
import { formatPrice } from '@/lib/format-price';

export default function ProductCard({ product }: { product: IProduct }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group relative rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
      <div className="aspect-[4/5] relative overflow-hidden bg-muted/20">
        {product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
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
