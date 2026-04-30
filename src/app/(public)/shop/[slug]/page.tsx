import connectDB from '@/lib/db/mongoose';
import Product from '@/lib/db/models/Product';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductInfo from '@/components/shop/ProductInfo';
import RelatedProducts from '@/components/shop/RelatedProducts';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  
  await connectDB();
  const product = await Product.findOne({ slug: resolvedParams.slug, isActive: true }).lean();

  if (!product) {
    notFound();
  }

  // Convert ObjectIds to strings to pass to client components
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Suspense fallback={<div className="aspect-square bg-muted animate-pulse rounded-xl" />}>
          <ProductGallery images={serializedProduct.images} name={serializedProduct.name} />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-xl" />}>
          <ProductInfo product={serializedProduct} />
        </Suspense>
      </div>
      
      <div className="mt-16 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{serializedProduct.description}</p>
        </div>
      </div>

      <Suspense fallback={<div className="mt-20 h-64 bg-muted animate-pulse rounded-xl" />}>
        <RelatedProducts 
          category={serializedProduct.category} 
          currentProductId={serializedProduct._id} 
        />
      </Suspense>
    </div>
  );
}
