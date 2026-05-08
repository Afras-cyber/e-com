'use client';

import { useState } from 'react';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

export default function ProductDetailsClientWrapper({ product }: { product: any }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleColorChange = (colorIndex: number, imageIndex?: number) => {
    if (imageIndex !== undefined && imageIndex >= 0 && imageIndex < product.images.length) {
      setSelectedImageIndex(imageIndex);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
      {/* Gallery — sticky on desktop */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ProductGallery 
          images={product.images} 
          name={product.name} 
          externalIndex={selectedImageIndex}
          onIndexChange={setSelectedImageIndex}
        />
      </div>

      {/* Product Info */}
      <ProductInfo 
        product={product} 
        onColorChange={handleColorChange} 
      />
    </div>
  );
}
