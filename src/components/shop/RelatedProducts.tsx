'use client';

import { useQuery } from '@tanstack/react-query';
import { IProduct } from '@/types/product';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

async function fetchRelatedProducts(category: string) {
  const res = await fetch(`/api/products?category=${category}&limit=4`);
  if (!res.ok) throw new Error('Failed to fetch related products');
  return res.json();
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['related-products', category],
    queryFn: () => fetchRelatedProducts(category),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const relatedProducts = data?.products?.filter((p: IProduct) => p._id !== currentProductId).slice(0, 4) || [];

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((product: IProduct) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
