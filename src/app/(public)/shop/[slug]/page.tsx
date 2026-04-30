import { Metadata } from 'next';
import connectDB from '@/lib/db/mongoose';
import Product from '@/lib/db/models/Product';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductInfo from '@/components/shop/ProductInfo';
import RelatedProducts from '@/components/shop/RelatedProducts';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  await connectDB();
  const product = await Product.findOne({ slug: resolvedParams.slug, isAvailable: true }).lean();

  if (!product) {
    return {
      title: 'Product Not Found | StepKicks',
    };
  }

  return {
    title: `${product.name} | StepKicks`,
    description: product.seoDescription || product.description.substring(0, 160),
    openGraph: {
      images: [product.images[0]],
      title: product.name,
      description: product.seoDescription || product.description.substring(0, 160),
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  
  await connectDB();
  const product = await Product.findOneAndUpdate(
    { slug: resolvedParams.slug, isAvailable: true },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).lean();

  if (!product) {
    notFound();
  }

  // Convert ObjectIds to strings to pass to client components
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="min-h-screen">
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
          {/* Gallery — sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={<div className="aspect-square bg-muted animate-pulse rounded-2xl" />}>
              <ProductGallery images={serializedProduct.images} name={serializedProduct.name} />
            </Suspense>
          </div>

          {/* Product Info */}
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
            <ProductInfo product={serializedProduct} />
          </Suspense>
        </div>
      </div>
      
      {/* Description Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-3xl py-12 sm:py-16 border-t">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6 uppercase">About This Product</h2>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p className="whitespace-pre-wrap">{serializedProduct.description}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-xl mx-4 mb-10" />}>
        <RelatedProducts 
          category={serializedProduct.category} 
          currentProductId={serializedProduct._id} 
        />
      </Suspense>
    </div>
  );
}
