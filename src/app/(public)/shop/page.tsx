import ProductGrid from '@/components/shop/ProductGrid';
import ProductFilters from '@/components/shop/ProductFilters';
import { ProductFilters as FilterType } from '@/types/product';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const filters: FilterType = {
    category: resolvedParams.category,
    subcategory: resolvedParams.subcategory,
    search: resolvedParams.search,
    sort: resolvedParams.sort as any,
    page: resolvedParams.page ? parseInt(resolvedParams.page) : 1,
    isOnSale: resolvedParams.isOnSale === 'true',
    // arrays logic:
    brand: resolvedParams.brand?.split(','),
    sizes: resolvedParams.sizes?.split(','),
    colors: resolvedParams.colors?.split(','),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shop Collection</h1>
        {filters.category && (
          <p className="text-muted-foreground capitalize hidden sm:block">
            {filters.category} &gt; {filters.subcategory || 'All'}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 hidden md:block">
          <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-xl" />}>
            <ProductFilters />
          </Suspense>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          }>
            <ProductGrid filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
