'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ 
  images, 
  name,
  externalIndex,
  onIndexChange
}: { 
  images: string[], 
  name: string,
  externalIndex?: number,
  onIndexChange?: (index: number) => void
}) {
  const [internalIndex, setInternalIndex] = useState(0);
  const mainIndex = externalIndex !== undefined ? externalIndex : internalIndex;

  const setMainIndex = (index: number | ((prev: number) => number)) => {
    const nextIndex = typeof index === 'function' ? index(mainIndex) : index;
    if (onIndexChange) {
      onIndexChange(nextIndex);
    } else {
      setInternalIndex(nextIndex);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted/20 flex items-center justify-center rounded-2xl border">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  const prevImage = () => setMainIndex(i => i === 0 ? images.length - 1 : i - 1);
  const nextImage = () => setMainIndex(i => (i + 1) % images.length);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image with swipe navigation */}
      <div className="aspect-square relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-muted/10 group">
        <Image 
          src={images[mainIndex]} 
          alt={name} 
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500"
          priority
        />

        {/* Mobile swipe arrows — always visible on mobile */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100 active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image counter badge */}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {mainIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainIndex(i)}
              className={cn(
                "aspect-square rounded-lg sm:rounded-xl border-2 overflow-hidden transition-all",
                mainIndex === i 
                  ? "ring-2 ring-primary ring-offset-2 border-primary scale-[1.02]" 
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-muted-foreground/20"
              )}
            >
              <Image 
                src={img} 
                alt={`${name} thumbnail ${i + 1}`} 
                width={120}
                height={120}
                className="object-cover w-full h-full" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
