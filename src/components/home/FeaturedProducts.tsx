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
      <section className="py-16 sm:py-20 container mx-auto px-4">
        <h2 className="text-3xl font-black tracking-tight mb-8">Featured Hits</h2>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (isError || !data?.products || data.products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 container mx-auto px-4">
      <div className="flex items-end justify-between mb-8 sm:mb-12">
        <div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Curated For You
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Featured <span className="italic text-primary">Hits</span>
          </h2>
        </div>
        <Link href="/shop" className="hidden sm:block">
          <Button variant="ghost" className="gap-2 font-bold">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* 2-column grid on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {data.products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      <div className="mt-8 sm:hidden flex justify-center">
        <Link href="/shop" className="w-full">
          <Button variant="outline" className="w-full gap-2 rounded-xl py-6 font-bold">
            View All Products <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
