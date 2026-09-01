"use client";

import { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

export default function ProductDetailsClientWrapper({
  product,
}: {
  product: any;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleColorChange = (colorIndex: number, imageIndex?: number) => {
    if (
      imageIndex !== undefined &&
      imageIndex >= 0 &&
      imageIndex < (product.images?.length || 0)
    ) {
      setSelectedImageIndex(imageIndex);
    }
  };

  const isLimited =
    product.isFeatured ||
    product.isOnSale ||
    product.tags?.some((t: string) => t.toLowerCase().includes("limited"));

  const badgeText = product.brand
    ? `EST. 2026 • ${product.brand} Branded`
    : "EST. 2026 • Authentic Branded";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
      {/* Gallery Section — 7 columns on desktop for spacious luxury showcase */}
      <div className="lg:col-span-7 xl:col-span-7 lg:sticky lg:top-24">
        <ProductGallery
          images={product.images || []}
          name={product.name}
          badgeText={badgeText}
          isLimited={isLimited}
          externalIndex={selectedImageIndex}
          onIndexChange={setSelectedImageIndex}
        />
      </div>

      {/* Product Details & Actions — 5 columns on desktop */}
      <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-start">
        <ProductInfo
          product={product}
          onColorChange={handleColorChange}
        />
      </div>
    </div>
  );
}
