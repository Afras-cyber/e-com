'use client';

import { useState } from 'react';
import { TuningLinear, CloseCircleLinear } from "solar-icon-set";
import { cn } from '@/lib/utils';
import ProductFilters from './ProductFilters';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileFilterToggle({
  hasActiveFilters,
  categories = [],
  brands = [],
  availableSizes = [],
  availableColors = [],
}: {
  hasActiveFilters: boolean;
  categories?: any[];
  brands?: any[];
  availableSizes?: string[];
  availableColors?: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer select-none",
          hasActiveFilters
            ? "border-[#B8975A] bg-[#B8975A]/10 text-foreground ring-1 ring-[#B8975A]/40"
            : "border-border/80 bg-card/90 dark:bg-[#1A1A1A] text-foreground hover:border-foreground/30 hover:bg-muted/30"
        )}
      >
        <TuningLinear className="w-4 h-4 text-[#B8975A]" />
        <span className="font-semibold">Filters</span>
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-[#B8975A] shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background dark:bg-[#161616] rounded-t-[32px] shadow-2xl max-h-[88vh] flex flex-col overflow-hidden border-t border-[#ECEAE4] dark:border-[#2A2A2A]"
            >
              {/* Drawer Sticky Header */}
              <div className="sticky top-0 bg-background/95 dark:bg-[#161616]/95 backdrop-blur-xl px-6 py-4 border-b border-[#ECEAE4] dark:border-[#282828] flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm tracking-widest uppercase text-foreground">
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-[#B8975A]" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close filters"
                >
                  <CloseCircleLinear className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Filters Content */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <ProductFilters
                  categories={categories}
                  brands={brands}
                  availableSizes={availableSizes}
                  availableColors={availableColors}
                  onFilterChange={() => {}}
                />
              </div>

              {/* Sticky Bottom Apply Button */}
              <div className="sticky bottom-0 p-4 bg-background/95 dark:bg-[#161616]/95 backdrop-blur-xl border-t border-[#ECEAE4] dark:border-[#282828]">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-full py-3.5 bg-[#B8975A] hover:bg-[#a6864d] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
