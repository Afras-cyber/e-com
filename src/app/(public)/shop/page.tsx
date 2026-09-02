import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import MobileFilterToggle from "@/components/shop/MobileFilterToggle";
import ProductSortDropdown from "@/components/shop/ProductSortDropdown";
import { ProductFilters as FilterType } from "@/types/product";
import { Suspense } from "react";
import { RefreshLinear } from "solar-icon-set";
import { Metadata } from "next";
import connectDB from "@/lib/db/mongoose";
import Category from "@/lib/db/models/Category";
import Brand from "@/lib/db/models/Brand";
import Product from "@/lib/db/models/Product";
import { generateSEOMetadata, truncateDescription, generateBreadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { StructuredData } from "@/components/seo/StructuredData";

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  });
}

export const metadata: Metadata = generateSEOMetadata({
  title: "Shop Premium Shoes & Sneakers",
  description: truncateDescription(
    "Browse our extensive collection of authentic premium shoes from top brands. Filter by size, color, brand, and price. Fast delivery across Sri Lanka."
  ),
  ogImage: `${siteConfig.url}/homepage_shoe.png`,
  ogTitle: "Shop Premium Authentic Shoes",
  ogDescription: "Browse and buy authentic premium shoes. Multiple brands, sizes, and styles available.",
  canonicalUrl: `${siteConfig.url}/shop`,
  keywords: "buy shoes online, premium sneakers, authentic footwear, shoe brands, Sri Lanka, sale shoes, casual shoes, sports shoes",
  author: siteConfig.name,
  type: "website",
});

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
  const [dbCategories, dbBrands, dbSizes, dbColors] = await Promise.all([
    Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean(),
    Brand.find({ isActive: true }).sort({ name: 1 }).lean(),
    Product.distinct("sizes", { isAvailable: true }),
    Product.aggregate([
      { $match: { isAvailable: true, "colors.0": { $exists: true } } },
      { $unwind: "$colors" },
      {
        $match: {
          "colors.name": { $exists: true, $ne: "" },
          "colors.hex": { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: { $toLower: "$colors.name" },
          name: { $first: "$colors.name" },
          hex: { $first: "$colors.hex" },
        },
      },
      { $sort: { name: 1 } },
    ]),
  ]);

  const categoriesData = dbCategories.map((c: any) => ({ ...c, _id: c._id.toString() }));
  const brandsData = dbBrands.map((b: any) => ({ ...b, _id: b._id.toString() }));
  const rawSizes = (dbSizes || []).filter(
    (s): s is string => typeof s === "string" && s.trim().length > 0
  );
  const sizesData = sortSizes(rawSizes);
  const colorsData = (dbColors || []).map((col: any) => ({
    _id: col._id,
    name: col.name,
    hex: col.hex,
  }));

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Shop", url: `${siteConfig.url}/shop` },
        ])}
      />

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
              availableSizes={sizesData}
              availableColors={colorsData}
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
              <ProductFilters
                categories={categoriesData}
                brands={brandsData}
                availableSizes={sizesData}
                availableColors={colorsData}
              />
            </Suspense>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
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
