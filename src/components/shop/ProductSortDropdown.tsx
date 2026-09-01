'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AltArrowDownLinear } from 'solar-icon-set';
import { cn } from '@/lib/utils';
import { ProductFilters } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';

export interface SortOption {
  label: string;
  value: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest Drops', value: 'newest' },
  { label: 'Popular', value: 'popular' },
];

interface ProductSortDropdownProps {
  filters: ProductFilters;
}

export default function ProductSortDropdown({ filters }: ProductSortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch count using same query key as ProductGrid (deduplicated by React Query)
  const { data, isLoading } = useProducts(filters);

  // Get current sort value from URL, defaulting to 'featured'
  const currentSortParam = searchParams.get('sort');
  let selectedValue = currentSortParam || 'featured';
  if (selectedValue === 'best-rated') selectedValue = 'popular';

  const selectedOption =
    SORT_OPTIONS.find((opt) => opt.value === selectedValue) || SORT_OPTIONS[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectOption = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'featured') {
      params.delete('sort'); // 'featured' is default, or can be explicit
    } else {
      params.set('sort', value);
    }

    params.set('page', '1');
    router.push(`/shop?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const totalCount = data?.total ?? 0;

  return (
    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
      {/* Product count display */}
      <span className="text-xs sm:text-sm text-muted-foreground font-medium whitespace-nowrap">
        {isLoading ? (
          <span className="inline-block w-28 h-4 bg-muted animate-pulse rounded" />
        ) : (
          `Showing ${totalCount} authentic ${totalCount === 1 ? 'pair' : 'pairs'}`
        )}
      </span>

      {/* Sort By Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 dark:bg-[#1A1A1A] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium transition-all shadow-xs hover:border-foreground/30 hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-[#B8975A]/20 cursor-pointer select-none",
            isOpen && "border-foreground/40 ring-2 ring-[#B8975A]/20 shadow-md"
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-muted-foreground font-normal">Sort:</span>
          <span className="font-bold text-foreground tracking-tight">
            {selectedOption.label}
          </span>
          <AltArrowDownLinear
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
              isOpen && "rotate-180 text-foreground"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-56 sm:w-64 z-50 rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#1A1A1A] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-black/5 dark:border-[#2D2D2D] ring-1 ring-black/5"
              role="listbox"
            >
              <div className="space-y-1">
                {SORT_OPTIONS.map((option) => {
                  const isSelected = selectedOption.value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectOption(option.value)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer",
                        isSelected
                          ? "bg-[#B8975A] text-white shadow-xs font-semibold"
                          : "text-foreground/80 hover:text-foreground hover:bg-muted/60 dark:hover:bg-[#252525]"
                      )}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white shrink-0 shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
