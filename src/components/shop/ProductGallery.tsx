'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ProductGallery({ images, name }: { images: string[], name: string }) {
  const [mainImage, setMainImage] = useState(images?.[0] || '');

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted/20 flex items-center justify-center rounded-xl border">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square relative overflow-hidden rounded-xl border bg-muted/10">
        <img 
          src={mainImage} 
          alt={name} 
          className="object-cover w-full h-full"
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(img)}
              className={cn(
                "aspect-square rounded-lg border overflow-hidden",
                mainImage === img ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100 transition-opacity"
              )}
            >
              <img src={img} alt={`${name} thumbnail ${i + 1}`} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
