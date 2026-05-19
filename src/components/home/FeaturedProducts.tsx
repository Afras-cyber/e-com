'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/shop/ProductCard';
import { ArrowRightLinear } from "solar-icon-set";;
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

function ProductSkeleton() {
  return (
    <div className="rounded-2xl bg-muted/60 dark:bg-zinc-800/60 overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted dark:bg-zinc-700/60" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-muted dark:bg-zinc-700/60 rounded w-1/3" />
        <div className="h-4 bg-muted dark:bg-zinc-700/60 rounded w-2/3" />
        <div className="h-4 bg-muted dark:bg-zinc-700/60 rounded w-1/4 mt-2" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const { data, isLoading, isError } = useProducts({ isFeatured: true, limit: 4 });

  if (isError || (!isLoading && (!data?.products || data.products.length === 0))) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-primary mb-2">
              Curated For You
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Featured{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Hits
              </span>
            </h2>
          </motion.div>

          <Link href="/shop" className="hidden sm:block">
            <Button
              variant="ghost"
              className="gap-2 font-bold text-muted-foreground hover:text-primary group"
            >
              View All{" "}
              <ArrowRightLinear className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {isLoading
            ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
            : data!.products.slice(0, 4).map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <ProductCard product={product} priority={i < 2} />
                </motion.div>
              ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden">
          <Link href="/shop" className="block">
            <Button
              variant="outline"
              className="w-full gap-2 rounded-2xl py-6 font-bold border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              View All Products <ArrowRightLinear className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
