import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import MobileFilterToggle from "@/components/shop/MobileFilterToggle";
import { ProductFilters as FilterType } from "@/types/product";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import connectDB from "@/lib/db/mongoose";
import Category from "@/lib/db/models/Category";
import Brand from "@/lib/db/models/Brand";

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
    isOnSale: resolvedParams.isOnSale === "true",
    brand: resolvedParams.brand?.split(","),
    sizes: resolvedParams.sizes?.split(","),
    colors: resolvedParams.colors?.split(","),
  };

  const hasActiveFilters =
    filters.category ||
    filters.brand?.length ||
    filters.sizes?.length ||
    filters.isOnSale;

  await connectDB();
  const dbCategories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean();
  const dbBrands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean();
  
  const categoriesData = JSON.parse(JSON.stringify(dbCategories));
  const brandsData = JSON.parse(JSON.stringify(dbBrands));

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Shop Collection
          </h1>
          {filters.category && (
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {filters.category} &gt; {filters.subcategory || "All"}
            </p>
          )}
        </div>

        {/* Mobile filter toggle */}
        <div className="md:hidden">
          <MobileFilterToggle hasActiveFilters={!!hasActiveFilters} categories={categoriesData} brands={brandsData} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar — desktop only (inline) */}
        <aside className="w-full lg:w-64 shrink-0 hidden md:block">
          <div className="sticky top-24">
            <Suspense
              fallback={
                <div className="animate-pulse h-64 bg-muted rounded-xl" />
              }
            >
              <ProductFilters categories={categoriesData} brands={brandsData} />
            </Suspense>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <ProductGrid filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
