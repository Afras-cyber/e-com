'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to update URL params
  const setFilter = useCallback(
    (name: string, value: string, isMulti: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (isMulti) {
        const existing = params.get(name)?.split(',').filter(Boolean) || [];
        if (existing.includes(value)) {
          const updated = existing.filter(v => v !== value);
          if (updated.length > 0) params.set(name, updated.join(','));
          else params.delete(name);
        } else {
          params.set(name, [...existing, value].join(','));
        }
      } else {
        if (params.get(name) === value) {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      }
      
      params.set('page', '1');
      router.push(`/shop?${params.toString()}`);
    },
    [searchParams, router]
  );

  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort') || 'newest';
  const currentBrands = searchParams.get('brand')?.split(',') || [];
  const currentSizes = searchParams.get('sizes')?.split(',') || [];
  const isOnSale = searchParams.get('isOnSale') === 'true';

  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Vans', 'New Balance'];
  const sizes = ['38', '39', '40', '41', '42', '43', '44', '45'];

  return (
    <div className="space-y-8 pr-6">
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Categories</h3>
        <div className="flex flex-col space-y-2">
          {['shoes', 'bags', 'accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter('category', cat)}
              className={cn(
                "text-left text-sm transition-colors py-1 hover:text-primary flex items-center justify-between",
                currentCategory === cat ? "font-bold text-primary" : "text-muted-foreground"
              )}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {currentCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Brands</h3>
        <div className="grid grid-cols-1 gap-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <div 
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition-all",
                  currentBrands.includes(brand) ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary"
                )}
                onClick={() => setFilter('brand', brand, true)}
              >
                {currentBrands.includes(brand) && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={cn(
                "text-sm transition-colors",
                currentBrands.includes(brand) ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-primary"
              )}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Sizes</h3>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setFilter('sizes', size, true)}
              className={cn(
                "h-10 text-xs font-bold border rounded-md transition-all flex items-center justify-center",
                currentSizes.includes(size) 
                  ? "bg-primary border-primary text-white shadow-md scale-105" 
                  : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Sort By</h3>
        <select 
          value={currentSort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="w-full text-sm border-2 rounded-lg p-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 border-border font-medium"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="best-rated">Best Rated</option>
        </select>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase tracking-widest">On Sale</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isOnSale}
              onChange={() => setFilter('isOnSale', isOnSale ? '' : 'true')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
      
      {(currentCategory || currentBrands.length > 0 || currentSizes.length > 0 || isOnSale) && (
        <button 
          onClick={() => router.push('/shop')}
          className="w-full py-2 text-xs font-bold text-destructive hover:underline uppercase tracking-tighter"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
