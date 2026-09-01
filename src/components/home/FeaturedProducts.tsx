'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/shop/ProductCard';
import { ArrowRightLinear } from "solar-icon-set";;
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] lg:rounded-[2rem] bg-white dark:bg-[#1A1A1A] shadow-[0_12px_40px_rgba(0,0,0,0.06)] ring-1 ring-[#E8E8EA]/80 dark:ring-[#2A2A2A] animate-pulse">
      <div className="aspect-square bg-linear-to-b from-[#F8F6F2] to-[#EEEAE3] dark:from-[#242424] dark:to-[#161616]" />
      <div className="space-y-2 px-3.5 py-3.5 sm:px-5 sm:py-4">
        <div className="h-2.5 w-1/4 rounded bg-[#EEEAE3] dark:bg-[#2A2A2A]" />
        <div className="h-4 w-2/3 rounded bg-[#EEEAE3] dark:bg-[#2A2A2A]" />
        <div className="h-3 w-1/2 rounded bg-[#EEEAE3] dark:bg-[#2A2A2A]" />
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
              <span className="italic text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">
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
