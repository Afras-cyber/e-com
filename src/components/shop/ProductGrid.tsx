'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductFilters } from '@/types/product';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { PackageX } from 'lucide-react';

export default function ProductGrid({ filters }: { filters: ProductFilters }) {
  const { data, isLoading, isError } = useProducts(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-destructive font-medium">Failed to load products.</p>
        <p className="text-muted-foreground text-sm mt-1">Please try again later.</p>
      </div>
    );
  }

  if (!data?.products || data.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center border rounded-xl bg-muted/10 p-8">
        <PackageX className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      {/* Pagination (Simplified for now) */}
      {data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <span className="text-sm text-muted-foreground">
            Page {data.page} of {data.totalPages}
          </span>
          {/* Pagination buttons can be implemented via URL updates */}
        </div>
      )}
    </div>
  );
}
