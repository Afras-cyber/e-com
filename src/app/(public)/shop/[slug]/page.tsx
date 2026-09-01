import { Metadata } from "next";
import connectDB from "@/lib/db/mongoose";
import Product from "@/lib/db/models/Product";
import { notFound } from "next/navigation";
import ProductDetailsClientWrapper from "@/components/shop/ProductDetailsClientWrapper";
import RelatedProducts from "@/components/shop/RelatedProducts";
import { Suspense } from "react";
import Link from "next/link";
import {  ShieldCheckLinear, DeliveryLinear } from "solar-icon-set";
import { cache } from "react";
import { siteConfig } from "@/config/site";
import { generateSEOMetadata, truncateDescription, generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { formatPrice } from "@/lib/format-price";

const getProductBySlug = cache(async (slug: string) => {
  await connectDB();
  return Product.findOne({
    slug,
    isAvailable: true,
  }).lean();
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist or is no longer available.",
      robots: "noindex, nofollow",
    };
  }

  const productImage = product.images?.[0] || `${siteConfig.url}/homepage_shoe.png`;
  const seoDescription = truncateDescription(
    product.seoDescription || product.description?.substring(0, 160) || product.shortDescription || ""
  );

  return generateSEOMetadata({
    title: `${product.name} - ${product.brand || "Premium Shoes"}`,
    description: seoDescription,
    ogImage: productImage,
    ogTitle: product.name,
    ogDescription: seoDescription,
    canonicalUrl: `${siteConfig.url}/shop/${product.slug}`,
    keywords: `${product.name}, ${product.brand}, ${product.category}, shoes, sneakers, ${product.subcategory}, buy online Sri Lanka`,
    author: siteConfig.name,
    type: "product",
    productData: {
      name: product.name,
      description: product.description || product.shortDescription || "",
      price: formatPrice(product.price || 0),
      priceCurrency: siteConfig.business.currency,
      image: productImage,
      rating: (product as any).rating || 4.5,
      reviewCount: (product as any).reviewCount || 0,
      availability: product.isAvailable ? "InStock" : "OutOfStock",
      brand: product.brand || siteConfig.name,
      sku: (product as any)._id?.toString(),
      category: product.category || "Footwear",
    },
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Increment view count in background without blocking render
  Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } }).exec().catch(() => {});

  // Convert ObjectIds to strings to pass to client components
  const serializedProduct = JSON.parse(JSON.stringify(product));

  const categoryName = serializedProduct.subcategory || serializedProduct.category || "Footwear";

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth pb-16 sm:pb-24">
      {/* Structured Data */}
      <StructuredData
        data={generateProductSchema({
          name: serializedProduct.name,
          description: serializedProduct.description || serializedProduct.shortDescription || "",
          price: formatPrice(serializedProduct.price || 0),
          priceCurrency: siteConfig.business.currency,
          image: serializedProduct.images?.[0] || `${siteConfig.url}/homepage_shoe.png`,
          rating: serializedProduct.rating || 4.5,
          reviewCount: serializedProduct.reviewCount || 0,
          availability: serializedProduct.isAvailable ? "InStock" : "OutOfStock",
          brand: serializedProduct.brand || siteConfig.name,
          sku: serializedProduct._id?.toString(),
          category: serializedProduct.category || "Footwear",
        })}
      />
      
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Shop", url: `${siteConfig.url}/shop` },
          { name: categoryName, url: `${siteConfig.url}/shop?category=${encodeURIComponent(categoryName)}` },
          { name: serializedProduct.name, url: `${siteConfig.url}/shop/${serializedProduct.slug}` },
        ])}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 sm:pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground overflow-x-auto scrollbar-none py-1">
          <Link
            href="/"
            className="hover:text-foreground transition-colors shrink-0 font-medium"
          >
            Home
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <Link
            href="/shop"
            className="hover:text-foreground transition-colors shrink-0 font-medium"
          >
            Shop
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <Link
            href={`/shop?category=${encodeURIComponent(serializedProduct.category || "")}`}
            className="hover:text-foreground transition-colors shrink-0 font-medium capitalize"
          >
            {categoryName}
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-[320px]">
            {serializedProduct.name}
          </span>
        </nav>
      </div>

      {/* Main Product Showcase & Info Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-6">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
              <div className="lg:col-span-7 aspect-square bg-muted/40 rounded-3xl" />
              <div className="lg:col-span-5 space-y-4">
                <div className="h-6 w-24 bg-muted/60 rounded-full" />
                <div className="h-10 w-3/4 bg-muted/60 rounded-xl" />
                <div className="h-8 w-1/2 bg-muted/60 rounded-xl" />
                <div className="h-24 bg-muted/40 rounded-2xl" />
                <div className="h-12 w-full bg-muted/60 rounded-2xl" />
              </div>
            </div>
          }
        >
          <ProductDetailsClientWrapper product={serializedProduct} />
        </Suspense>
      </main>

      {/* Product Details, Specs & About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-border/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Story / Description */}
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground mb-4">
              About This Edition
            </h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-wrap">
                {serializedProduct.description || serializedProduct.shortDescription}
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 flex items-start gap-3">
                <ShieldCheckLinear className="w-5 h-5 text-[#C39A4D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Verified Authenticity</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    100% genuine brand originals sourced directly with manufacturer certification.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 flex items-start gap-3">
                <DeliveryLinear className="w-5 h-5 text-[#C39A4D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Express Islandwide Dispatch</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Carefully packaged and delivered straight to your door with tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications Table */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF8F4] dark:bg-[#1C1B19] rounded-3xl p-6 sm:p-7 border border-[#ECE7DA] dark:border-white/10 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#C39A4D] mb-1">
                Product Details
              </h3>
              <h4 className="font-serif text-xl font-bold uppercase tracking-tight text-foreground mb-4">
                Specifications
              </h4>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Brand</span>
                  <span className="font-bold text-foreground capitalize">{serializedProduct.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Category</span>
                  <span className="font-bold text-foreground capitalize">{categoryName}</span>
                </div>
                {serializedProduct.colors && serializedProduct.colors.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Available Colors</span>
                    <span className="font-bold text-foreground">
                      {serializedProduct.colors.map((c: any) => c.name).join(", ")}
                    </span>
                  </div>
                )}
                {serializedProduct.sizes && serializedProduct.sizes.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Available Sizes (US)</span>
                    <span className="font-bold text-foreground">
                      {serializedProduct.sizes.join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground font-medium">Authenticity</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Original</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Suspense
          fallback={
            <div className="h-64 bg-muted animate-pulse rounded-2xl mx-auto mb-10" />
          }
        >
          <RelatedProducts
            category={serializedProduct.category}
            currentProductId={serializedProduct._id}
          />
        </Suspense>
      </div>
    </div>
  );
}
