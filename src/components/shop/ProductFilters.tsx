'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { CheckReadLinear, ChatLineBold } from 'solar-icon-set';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface ProductFiltersProps {
  categories?: any[];
  brands?: any[];
  className?: string;
  onFilterChange?: () => void;
}

const DEFAULT_BRANDS = [
  { name: 'Nike', count: 12 },
  { name: 'Adidas', count: 8 },
  { name: 'New Balance', count: 6 },
  { name: 'Puma', count: 5 },
  { name: 'Asics', count: 4 },
  { name: 'Jordan', count: 3 },
];

const DEFAULT_SIZES = [
  '6', '6.5', '7', '7.5',
  '8', '8.5', '9', '9.5',
  '10', '10.5', '11'
];

const COLOR_OPTIONS = [
  { name: 'White', hex: '#FFFFFF', isLight: true },
  { name: 'Black', hex: '#111111' },
  { name: 'Beige', hex: '#D6C29A' },
  { name: 'Brown', hex: '#8B5A2B' },
  { name: 'Lime', hex: '#CCFF00' },
  { name: 'Gold', hex: '#C59B58' },
];

const SLIDER_MIN = 0;
const SLIDER_MAX = 100000;
const SLIDER_STEP = 1000;

export default function ProductFilters({
  categories = [],
  brands = [],
  className,
  onFilterChange,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Collapsible section state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brand: true,
    category: true,
    size: true,
    price: true,
    color: true,
    availability: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper to update URL params
  const setFilter = useCallback(
    (name: string, value: string, isMulti: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());

      if (isMulti) {
        const existing = params.get(name)?.split(',').filter(Boolean) || [];
        if (existing.includes(value)) {
          const updated = existing.filter((v) => v !== value);
          if (updated.length > 0) params.set(name, updated.join(','));
          else params.delete(name);
        } else {
          params.set(name, [...existing, value].join(','));
        }
      } else {
        if (params.get(name) === value) {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      }

      params.set('page', '1');
      router.push(`/shop?${params.toString()}`, { scroll: false });
      onFilterChange?.();
    },
    [searchParams, router, onFilterChange]
  );

  const toggleBooleanFilter = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name) === 'true') {
        params.delete(name);
      } else {
        params.set(name, 'true');
      }
      params.set('page', '1');
      router.push(`/shop?${params.toString()}`, { scroll: false });
      onFilterChange?.();
    },
    [searchParams, router, onFilterChange]
  );

  // Current active filters
  const currentCategory = searchParams.get('category');
  const currentBrands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const currentSizes = searchParams.get('sizes')?.split(',').filter(Boolean) || [];
  const currentColors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
  const isInStock = searchParams.get('isAvailable') === 'true';
  const isLimitedEdition = searchParams.get('isFeatured') === 'true';
  const isPreOrder = searchParams.get('preOrder') === 'true';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const isOnSale = searchParams.get('isOnSale') === 'true';

  // Price range local state for smooth sliding
  const [minPrice, setMinPrice] = useState<number>(
    minPriceParam ? Number(minPriceParam) : SLIDER_MIN
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    maxPriceParam ? Number(maxPriceParam) : SLIDER_MAX
  );

  useEffect(() => {
    setMinPrice(minPriceParam ? Number(minPriceParam) : SLIDER_MIN);
    setMaxPrice(maxPriceParam ? Number(maxPriceParam) : SLIDER_MAX);
  }, [minPriceParam, maxPriceParam]);

  const applyPriceFilter = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min > SLIDER_MIN) {
      params.set('minPrice', min.toString());
    } else {
      params.delete('minPrice');
    }

    if (max < SLIDER_MAX) {
      params.set('maxPrice', max.toString());
    } else {
      params.delete('maxPrice');
    }

    params.set('page', '1');
    router.push(`/shop?${params.toString()}`, { scroll: false });
    onFilterChange?.();
  };

  const handleMinSliderChange = (val: number) => {
    const value = Math.min(val, maxPrice - SLIDER_STEP);
    setMinPrice(value);
    applyPriceFilter(value, maxPrice);
  };

  const handleMaxSliderChange = (val: number) => {
    const value = Math.max(val, minPrice + SLIDER_STEP);
    setMaxPrice(value);
    applyPriceFilter(minPrice, value);
  };

  const handleClearAll = () => {
    router.push('/shop', { scroll: false });
    onFilterChange?.();
  };

  const hasAnyFilterActive =
    !!currentCategory ||
    currentBrands.length > 0 ||
    currentSizes.length > 0 ||
    currentColors.length > 0 ||
    isInStock ||
    isLimitedEdition ||
    isPreOrder ||
    isOnSale ||
    minPriceParam != null ||
    maxPriceParam != null;

  // Brands list
  const brandList =
    brands.length > 0
      ? brands.map((b, i) => ({
          name: b.name,
          count: DEFAULT_BRANDS[i % DEFAULT_BRANDS.length]?.count || 5,
        }))
      : DEFAULT_BRANDS;

  // Categories list
  const categoryList =
    categories.length > 0
      ? categories
      : [
          { name: 'Running Lab', slug: 'running-lab' },
          { name: 'Street Culture', slug: 'street-culture' },
          { name: 'Luxe Leather', slug: 'luxe-leather' },
        ];

  // Sizes list
  let sizesToDisplay = DEFAULT_SIZES;
  const selectedCategoryData = currentCategory
    ? categories.find(
        (c) =>
          c.slug.toLowerCase() === currentCategory.toLowerCase() ||
          c.name.toLowerCase() === currentCategory.toLowerCase()
      )
    : null;

  if (
    selectedCategoryData &&
    selectedCategoryData.sizes &&
    selectedCategoryData.sizes.length > 0
  ) {
    sizesToDisplay = selectedCategoryData.sizes;
  }

  // Calculate percentages for slider track highlight
  const minPercent = Math.max(
    0,
    Math.min(100, ((minPrice - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100)
  );
  const maxPercent = Math.max(
    0,
    Math.min(100, ((maxPrice - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100)
  );

  return (
    <div className={cn("space-y-6 select-none", className)}>
      {/* Outer Card Container */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-[#ECEAE4] dark:border-[#2A2A2A] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-colors">
        {/* Header: FILTERS & Clear All */}
        <div className="flex items-center justify-between pb-6 border-b border-[#ECEAE4] dark:border-[#282828]">
          <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase text-foreground">
            Filters
          </h2>
          {hasAnyFilterActive && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs sm:text-sm font-bold text-[#B8975A] hover:underline cursor-pointer transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* 1. BRAND Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-foreground">
              Brand
            </h3>
            <button
              type="button"
              onClick={() => toggleSection('brand')}
              className="w-5 h-5 rounded-full border border-[#ECEAE4] dark:border-[#333] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
              aria-label="Toggle Brand section"
            >
              <span className="text-xs leading-none font-bold">
                {openSections.brand ? '−' : '+'}
              </span>
            </button>
          </div>

          {openSections.brand && (
            <div className="mt-4 space-y-2.5">
              {brandList.map((brand) => {
                const isSelected = currentBrands.includes(brand.name);
                return (
                  <label
                    key={brand.name}
                    className="flex items-center justify-between group cursor-pointer py-0.5"
                    onClick={() => setFilter('brand', brand.name, true)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-[#B8975A] border-[#B8975A] text-white shadow-xs"
                            : "border-[#D8D5CC] dark:border-[#383838] bg-transparent group-hover:border-[#B8975A]"
                        )}
                      >
                        {isSelected && <CheckReadLinear className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className={cn(
                          "text-xs sm:text-sm font-medium transition-colors",
                          isSelected
                            ? "text-foreground font-semibold"
                            : "text-foreground/80 group-hover:text-foreground"
                        )}
                      >
                        {brand.name}
                      </span>
                    </div>
                    {brand.count != null && (
                      <span className="text-xs text-muted-foreground/60 font-medium">
                        ({brand.count})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. CATEGORY Section */}
        <div className="pt-6 border-t border-[#ECEAE4] dark:border-[#282828] mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-foreground">
              Category
            </h3>
            <button
              type="button"
              onClick={() => toggleSection('category')}
              className="w-5 h-5 rounded-full border border-[#ECEAE4] dark:border-[#333] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
              aria-label="Toggle Category section"
            >
              <span className="text-xs leading-none font-bold">
                {openSections.category ? '−' : '+'}
              </span>
            </button>
          </div>

          {openSections.category && (
            <div className="mt-4 space-y-2.5">
              {categoryList.map((cat) => {
                const isSelected =
                  currentCategory === cat.slug ||
                  currentCategory?.toLowerCase() === cat.name.toLowerCase();
                return (
                  <label
                    key={cat.slug}
                    className="flex items-center gap-3 group cursor-pointer py-0.5"
                    onClick={() => setFilter('category', cat.slug)}
                  >
                    <div
                      className={cn(
                        "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-[#B8975A] border-[#B8975A] text-white shadow-xs"
                          : "border-[#D8D5CC] dark:border-[#383838] bg-transparent group-hover:border-[#B8975A]"
                      )}
                    >
                      {isSelected && <CheckReadLinear className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-medium transition-colors",
                        isSelected
                          ? "text-foreground font-semibold"
                          : "text-foreground/80 group-hover:text-foreground"
                      )}
                    >
                      {cat.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. SIZE (US) Section */}
        <div className="pt-6 border-t border-[#ECEAE4] dark:border-[#282828] mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-foreground">
              Size (US)
            </h3>
            <button
              type="button"
              onClick={() => toggleSection('size')}
              className="w-5 h-5 rounded-full border border-[#ECEAE4] dark:border-[#333] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
              aria-label="Toggle Size section"
            >
              <span className="text-xs leading-none font-bold">
                {openSections.size ? '−' : '+'}
              </span>
            </button>
          </div>

          {openSections.size && (
            <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-2.5">
              {sizesToDisplay.map((size) => {
                const isSelected = currentSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFilter('sizes', size, true)}
                    className={cn(
                      "h-9 sm:h-10 rounded-full border text-xs sm:text-sm font-medium transition-all flex items-center justify-center cursor-pointer",
                      isSelected
                        ? "bg-[#B8975A] border-[#B8975A] text-white shadow-xs font-bold"
                        : "border-[#ECEAE4] dark:border-[#333] bg-background dark:bg-[#1F1F1F] text-foreground/90 hover:border-[#B8975A] hover:text-[#B8975A]"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. PRICE RANGE Section */}
        <div className="pt-6 border-t border-[#ECEAE4] dark:border-[#282828] mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-foreground">
              Price Range
            </h3>
            <button
              type="button"
              onClick={() => toggleSection('price')}
              className="w-5 h-5 rounded-full border border-[#ECEAE4] dark:border-[#333] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
              aria-label="Toggle Price Range section"
            >
              <span className="text-xs leading-none font-bold">
                {openSections.price ? '−' : '+'}
              </span>
            </button>
          </div>

          {openSections.price && (
            <div className="mt-5 space-y-4">
              {/* Dual Range Slider */}
              <div className="relative pt-2 pb-1">
                {/* Background track */}
                <div className="h-1.5 w-full bg-[#EAE8E1] dark:bg-[#2C2C2C] rounded-full relative">
                  {/* Highlighted active track */}
                  <div
                    className="h-1.5 bg-[#B8975A] rounded-full absolute"
                    style={{
                      left: `${minPercent}%`,
                      width: `${maxPercent - minPercent}%`,
                    }}
                  />
                </div>

                {/* Range inputs */}
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={SLIDER_STEP}
                  value={minPrice}
                  onChange={(e) => handleMinSliderChange(Number(e.target.value))}
                  className="pointer-events-none appearance-none bg-transparent absolute inset-0 w-full h-full z-10 
                    [&::-webkit-slider-thumb]:pointer-events-auto 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-4.5 
                    [&::-webkit-slider-thumb]:h-4.5 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-white 
                    [&::-webkit-slider-thumb]:border-2 
                    [&::-webkit-slider-thumb]:border-[#B8975A] 
                    [&::-webkit-slider-thumb]:shadow-md 
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:pointer-events-auto 
                    [&::-moz-range-thumb]:w-4.5 
                    [&::-moz-range-thumb]:h-4.5 
                    [&::-moz-range-thumb]:rounded-full 
                    [&::-moz-range-thumb]:bg-white 
                    [&::-moz-range-thumb]:border-2 
                    [&::-moz-range-thumb]:border-[#B8975A] 
                    [&::-moz-range-thumb]:shadow-md 
                    [&::-moz-range-thumb]:cursor-pointer"
                />
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={SLIDER_STEP}
                  value={maxPrice}
                  onChange={(e) => handleMaxSliderChange(Number(e.target.value))}
                  className="pointer-events-none appearance-none bg-transparent absolute inset-0 w-full h-full z-20 
                    [&::-webkit-slider-thumb]:pointer-events-auto 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-4.5 
                    [&::-webkit-slider-thumb]:h-4.5 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-white 
                    [&::-webkit-slider-thumb]:border-2 
                    [&::-webkit-slider-thumb]:border-[#B8975A] 
                    [&::-webkit-slider-thumb]:shadow-md 
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:pointer-events-auto 
                    [&::-moz-range-thumb]:w-4.5 
                    [&::-moz-range-thumb]:h-4.5 
                    [&::-moz-range-thumb]:rounded-full 
                    [&::-moz-range-thumb]:bg-white 
                    [&::-moz-range-thumb]:border-2 
                    [&::-moz-range-thumb]:border-[#B8975A] 
                    [&::-moz-range-thumb]:shadow-md 
                    [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>

              {/* Input Value Pills */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center rounded-full border border-[#ECEAE4] dark:border-[#333] bg-background dark:bg-[#1F1F1F] px-3.5 py-1.5 w-full shadow-xs">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1.5 select-none">
                    LKR
                  </span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    onBlur={() => applyPriceFilter(minPrice, maxPrice)}
                    className="w-full bg-transparent text-xs font-bold text-foreground outline-none"
                  />
                </div>
                <span className="text-muted-foreground select-none font-medium text-xs">—</span>
                <div className="flex items-center rounded-full border border-[#ECEAE4] dark:border-[#333] bg-background dark:bg-[#1F1F1F] px-3.5 py-1.5 w-full shadow-xs">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1.5 select-none">
                    LKR
                  </span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    onBlur={() => applyPriceFilter(minPrice, maxPrice)}
                    className="w-full bg-transparent text-xs font-bold text-foreground outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. COLOR Section */}
        <div className="pt-6 border-t border-[#ECEAE4] dark:border-[#282828] mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-foreground">
              Color
            </h3>
            <button
              type="button"
              onClick={() => toggleSection('color')}
              className="w-5 h-5 rounded-full border border-[#ECEAE4] dark:border-[#333] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
              aria-label="Toggle Color section"
            >
              <span className="text-xs leading-none font-bold">
                {openSections.color ? '−' : '+'}
              </span>
            </button>
          </div>

          {openSections.color && (
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = currentColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    onClick={() => setFilter('colors', color.name, true)}
                    style={{ backgroundColor: color.hex }}
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-xs transition-all hover:scale-110 cursor-pointer relative",
                      color.isLight && "border border-[#DCDAD4] dark:border-[#444]",
                      isSelected
                        ? "ring-2 ring-offset-2 ring-[#B8975A] dark:ring-offset-[#1A1A1A] scale-105"
                        : "hover:ring-1 hover:ring-[#B8975A]/50"
                    )}
                    aria-label={`Filter by color ${color.name}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* 6. AVAILABILITY Section */}
        <div className="pt-6 border-t border-[#ECEAE4] dark:border-[#282828] mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-foreground">
              Availability
            </h3>
            <button
              type="button"
              onClick={() => toggleSection('availability')}
              className="w-5 h-5 rounded-full border border-[#ECEAE4] dark:border-[#333] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
              aria-label="Toggle Availability section"
            >
              <span className="text-xs leading-none font-bold">
                {openSections.availability ? '−' : '+'}
              </span>
            </button>
          </div>

          {openSections.availability && (
            <div className="mt-4 space-y-2.5">
              {/* In Stock */}
              <label
                className="flex items-center gap-3 group cursor-pointer py-0.5"
                onClick={() => toggleBooleanFilter('isAvailable')}
              >
                <div
                  className={cn(
                    "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all",
                    isInStock
                      ? "border-[#B8975A] bg-[#B8975A] text-white"
                      : "border-[#D8D5CC] dark:border-[#383838] bg-transparent group-hover:border-[#B8975A]"
                  )}
                >
                  {isInStock && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium transition-colors",
                    isInStock
                      ? "text-foreground font-semibold"
                      : "text-foreground/80 group-hover:text-foreground"
                  )}
                >
                  In Stock
                </span>
              </label>

              {/* Limited Edition */}
              <label
                className="flex items-center gap-3 group cursor-pointer py-0.5"
                onClick={() => toggleBooleanFilter('isFeatured')}
              >
                <div
                  className={cn(
                    "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all",
                    isLimitedEdition
                      ? "border-[#B8975A] bg-[#B8975A] text-white"
                      : "border-[#D8D5CC] dark:border-[#383838] bg-transparent group-hover:border-[#B8975A]"
                  )}
                >
                  {isLimitedEdition && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium transition-colors",
                    isLimitedEdition
                      ? "text-foreground font-semibold"
                      : "text-foreground/80 group-hover:text-foreground"
                  )}
                >
                  Limited Edition
                </span>
              </label>

              {/* Pre-Order */}
              <label
                className="flex items-center gap-3 group cursor-pointer py-0.5"
                onClick={() => toggleBooleanFilter('preOrder')}
              >
                <div
                  className={cn(
                    "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all",
                    isPreOrder
                      ? "border-[#B8975A] bg-[#B8975A] text-white"
                      : "border-[#D8D5CC] dark:border-[#383838] bg-transparent group-hover:border-[#B8975A]"
                  )}
                >
                  {isPreOrder && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium transition-colors",
                    isPreOrder
                      ? "text-foreground font-semibold"
                      : "text-foreground/80 group-hover:text-foreground"
                  )}
                >
                  Pre-Order
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Need Sizing Help? Card */}
      <div className="bg-[#FBF8F2] dark:bg-[#201D17] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border border-[#F0EAE0] dark:border-[#352E23] shadow-xs">
        <h4 className="font-serif text-base sm:text-lg font-bold text-[#1E1C1A] dark:text-[#E8E4DC]">
          Need sizing help?
        </h4>
        <p className="text-xs text-[#736E65] dark:text-[#A69F93] mt-1.5 leading-relaxed">
          Our team replies in minutes on WhatsApp with real measurements.
        </p>
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
            "Hi Legacy Shoes, I need sizing help with shoes."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full bg-[#B8975A] hover:bg-[#a6864d] active:scale-[0.98] text-white rounded-full py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <ChatLineBold className="w-4 h-4" />
          <span>WhatsApp our team</span>
        </a>
      </div>
    </div>
  );
}
