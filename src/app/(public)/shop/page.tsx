import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import MobileFilterToggle from "@/components/shop/MobileFilterToggle";
import ProductSortDropdown from "@/components/shop/ProductSortDropdown";
import { ProductFilters as FilterType } from "@/types/product";
import { Suspense } from "react";
import { RefreshLinear } from "solar-icon-set";
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
    isAvailable: resolvedParams.isAvailable === "true",
    isFeatured: resolvedParams.isFeatured === "true",
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    brand: resolvedParams.brand?.split(","),
    sizes: resolvedParams.sizes?.split(","),
    colors: resolvedParams.colors?.split(","),
  };

  const hasActiveFilters =
    filters.category ||
    filters.brand?.length ||
    filters.sizes?.length ||
    filters.colors?.length ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.isAvailable ||
    filters.isFeatured ||
    filters.isOnSale;

  await connectDB();
  const [dbCategories, dbBrands] = await Promise.all([
    Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean(),
    Brand.find({ isActive: true }).sort({ name: 1 }).lean(),
  ]);

  const categoriesData = JSON.parse(JSON.stringify(dbCategories));
  const brandsData = JSON.parse(JSON.stringify(dbBrands));

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
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

        {/* Right Corner Controls: Showing count, On Sale toggle, Sort Dropdown & Mobile Filter */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 flex-wrap">
          <Suspense fallback={<div className="h-10 w-48 bg-muted animate-pulse rounded-full" />}>
            <ProductSortDropdown filters={filters} />
          </Suspense>

          {/* Mobile filter toggle */}
          <div className="md:hidden">
            <MobileFilterToggle
              hasActiveFilters={!!hasActiveFilters}
              categories={categoriesData}
              brands={brandsData}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Filters Sidebar — desktop only (inline) */}
        <aside className="w-full md:w-72 lg:w-80 shrink-0 hidden md:block">
          <div className="sticky top-24">
            <Suspense
              fallback={
                <div className="animate-pulse h-96 bg-muted rounded-[28px]" />
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
                <RefreshLinear className="w-8 h-8 animate-spin text-muted-foreground" />
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
