"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AltArrowLeftLinear, AltArrowRightLinear } from "solar-icon-set";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  name: string;
  badgeText?: string;
  isLimited?: boolean;
  externalIndex?: number;
  onIndexChange?: (index: number) => void;
}

export default function ProductGallery({
  images,
  name,
  badgeText = "EST. 2026 • Authentic Branded",
  isLimited = true,
  externalIndex,
  onIndexChange,
}: ProductGalleryProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const mainIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);

  const setMainIndex = (index: number | ((prev: number) => number)) => {
    const nextIndex = typeof index === "function" ? index(mainIndex) : index;
    if (onIndexChange) {
      onIndexChange(nextIndex);
    } else {
      setInternalIndex(nextIndex);
    }
  };

  const prevImage = () => {
    setMainIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const nextImage = () => {
    setMainIndex((i) => (i + 1) % images.length);
  };

  // Keep active thumbnail in view on mobile scroll
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[
        mainIndex
      ] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [mainIndex]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextImage();
    } else if (distance < -minSwipeDistance) {
      prevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-[#F8F6F1] dark:bg-[#1E1D1A] flex items-center justify-center rounded-3xl border border-[#E7E2D3] dark:border-white/10">
        <span className="text-muted-foreground text-sm">
          No images available
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3.5 sm:gap-5 w-full">
      {/* Desktop Vertical Thumbnails Strip (Left column on lg+) */}
      {images.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="hidden lg:flex lg:flex-col gap-3 shrink-0 w-20 xl:w-24 max-h-[580px] overflow-y-auto overflow-x-hidden scrollbar-none py-1"
        >
          {images.map((img, idx) => {
            const isActive = mainIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setMainIndex(idx)}
                aria-label={`View ${name} image ${idx + 1}`}
                className={cn(
                  "relative aspect-square w-full rounded-2xl p-1.5 transition-all duration-300 flex items-center justify-center group overflow-hidden",
                  "bg-linear-to-b from-[#FAF8F3] to-[#EFECE3] dark:from-[#23221F] dark:to-[#181715]",
                  isActive
                    ? "border-2 border-[#C39A4D] shadow-md shadow-[#C39A4D]/15 scale-[1.03]"
                    : "border border-[#E7E2D3]/80 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-[#C39A4D]/60 hover:scale-[1.02]",
                )}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={img}
                    alt={`${name} thumbnail ${idx + 1}`}
                    fill
                    sizes="96px"
                    loading="lazy"
                    className="object-contain p-1 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C39A4D] shadow-xs" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Product Showcase Card */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square max-h-[580px] rounded-[1.75rem] sm:rounded-[2.25rem] overflow-hidden",
            "bg-gradient-to-b from-[#F8F6F0] via-[#F4F0E6] to-[#ECE6D8] dark:from-[#211F1C] dark:via-[#1A1917] dark:to-[#131210]",
            "border border-[#E6E0D0] dark:border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.25)]",
            "flex items-center justify-center group select-none",
          )}
        >
          {/* Top Pill Badges */}
          <div className="absolute top-3.5 sm:top-5 left-3.5 sm:left-5 right-3.5 sm:right-5 z-20 flex items-center justify-between pointer-events-none">
            {/* Left Pill: EST / Authentic */}
            <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-black/70 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-[#7E6D4E] dark:text-[#E2D5BE] shadow-xs border border-[#E8E1D0]/90 dark:border-white/10">
              <span className="font-semibold">{badgeText}</span>
            </div>

            {/* Right Pill: LIMITED or Status */}
            {isLimited && (
              <div className="pointer-events-auto inline-flex items-center rounded-full bg-white/95 dark:bg-black/70 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] dark:text-white shadow-xs border border-[#E8E1D0]/90 dark:border-white/10">
                <span>LIMITED</span>
              </div>
            )}
          </div>

          {/* Soft Ground Shadow */}
          <div className="absolute bottom-6 sm:bottom-10 w-3/5 h-6 sm:h-10 bg-black/15 dark:bg-black/45 blur-xl rounded-[50%] pointer-events-none transition-transform duration-500 group-hover:scale-105" />

          {/* Main Showcase Image with Animation */}
          <div className="relative w-full h-full p-6 sm:p-10 lg:p-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mainIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={images[mainIndex]}
                  alt={`${name} featured view`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-contain p-2 sm:p-4 drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  priority
                  loading="eager"
                  fetchPriority="high"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-black/65 backdrop-blur-md border border-[#E8E1D0]/80 dark:border-white/10 flex items-center justify-center shadow-md text-foreground transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 hover:bg-white dark:hover:bg-black"
              >
                <AltArrowLeftLinear className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-black/65 backdrop-blur-md border border-[#E8E1D0]/80 dark:border-white/10 flex items-center justify-center shadow-md text-foreground transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 hover:bg-white dark:hover:bg-black"
              >
                <AltArrowRightLinear className="w-5 h-5" />
              </button>

              {/* Counter Badge */}
              <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-20 bg-black/65 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md tracking-wider">
                {mainIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Mobile / Tablet Horizontal Thumbnails Carousel (visible below lg) */}
        {images.length > 1 && (
          <div
            ref={thumbnailsRef}
            className="flex lg:hidden gap-2.5 overflow-x-auto scrollbar-none py-1 px-0.5 snap-x snap-mandatory"
          >
            {images.map((img, idx) => {
              const isActive = mainIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMainIndex(idx)}
                  aria-label={`View ${name} image ${idx + 1}`}
                  className={cn(
                    "relative aspect-square w-16 sm:w-20 shrink-0 rounded-xl sm:rounded-2xl p-1 transition-all duration-200 flex items-center justify-center snap-center overflow-hidden",
                    "bg-linear-to-b from-[#FAF8F3] to-[#EFECE3] dark:from-[#23221F] dark:to-[#181715]",
                    isActive
                      ? "border-2 border-[#C39A4D] shadow-sm scale-105"
                      : "border border-[#E7E2D3] dark:border-white/10 opacity-70 hover:opacity-100",
                  )}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={img}
                      alt={`${name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      loading="eager"
                      className="object-contain p-0.5"
                    />
                  </div>
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C39A4D]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
