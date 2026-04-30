'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/shop/ProductCard';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FeaturedProducts() {
  const { data, isLoading, isError } = useProducts({ isFeatured: true, limit: 4 });

  if (isLoading) {
    return (
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Products</h2>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (isError || !data?.products || data.products.length === 0) {
    return null; // Don't show the section if there are no featured products
  }

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Hits</h2>
          <p className="text-muted-foreground">Our most popular and exclusive picks just for you.</p>
        </div>
        <Link href="/shop" className="hidden sm:block">
          <Button variant="ghost" className="gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      <div className="mt-8 sm:hidden flex justify-center">
        <Link href="/shop" className="w-full">
          <Button variant="outline" className="w-full gap-2">
            View All Products <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
