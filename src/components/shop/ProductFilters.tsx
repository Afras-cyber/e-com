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
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name) === value) {
        params.delete(name); // Toggle off if clicked again
      } else {
        params.set(name, value);
      }
      params.set('page', '1'); // Reset page on filter change
      router.push(`/shop?${params.toString()}`);
    },
    [searchParams, router]
  );

  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort') || 'newest';
  const isOnSale = searchParams.get('isOnSale') === 'true';

  return (
    <div className="space-y-8 pr-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        <div className="flex flex-col space-y-2">
          {['shoes', 'bags', 'accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter('category', cat)}
              className={cn(
                "text-left text-sm transition-colors py-1 hover:text-primary",
                currentCategory === cat ? "font-medium text-primary" : "text-muted-foreground"
              )}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-lg mb-4">Sort By</h3>
        <select 
          value={currentSort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="w-full text-sm border rounded-md p-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="best-rated">Best Rated</option>
        </select>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-lg mb-4">Offers</h3>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isOnSale}
            onChange={() => setFilter('isOnSale', 'true')}
            className="rounded border-border text-primary focus:ring-primary w-4 h-4 accent-primary"
          />
          <span className="text-sm font-medium">On Sale</span>
        </label>
      </div>
    </div>
  );
}
