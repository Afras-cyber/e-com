"use client";

import { useState, useMemo } from "react";
import { formatPrice, calcDiscountPercent } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import {
  ChatLineLinear,
  CartLargeLinear,
  ShieldCheckLinear,
  DeliveryLinear,
  CheckReadLinear,
  ArrowRightUpLinear,
} from "solar-icon-set";
import { buildWhatsAppURL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import QuickOrderModal from "./QuickOrderModal";
import SizeGuideModal from "./SizeGuideModal";
import { siteConfig } from "@/config/site";

const DEFAULT_SHOE_SIZES = [
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
];

export default function ProductInfo({
  product,
  onColorChange,
}: {
  product: any;
  onColorChange?: (colorIndex: number, imageIndex?: number) => void;
}) {
  const sizesList =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : DEFAULT_SHOE_SIZES;

  const colorsList =
    product.colors && product.colors.length > 0 ? product.colors : [];

  const [selectedSize, setSelectedSize] = useState<string>(sizesList[0] || "8");
  const [selectedColor, setSelectedColor] = useState<string>(
    colorsList[0]?.name || "Standard",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);

  // Price calculations
  const price =
    product.isOnSale &&
    product.discountPrice &&
    product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const originalPrice = product.price;
  const hasDiscount =
    product.isOnSale &&
    product.discountPrice &&
    product.discountPrice < product.price;
  const discountAmount = hasDiscount
    ? originalPrice - (product.discountPrice || 0)
    : 0;
  const discountPercent = hasDiscount
    ? product.discountPercent ||
      calcDiscountPercent(originalPrice, product.discountPrice)
    : 0;

  const activeColorIndex = useMemo(() => {
    const idx = colorsList.findIndex((c: any) => c.name === selectedColor);
    return idx >= 0 ? idx : 0;
  }, [colorsList, selectedColor]);

  // Edition subtitle
  const editionSubtitle = useMemo(() => {
    if (selectedColor && selectedColor !== "Standard") {
      return `— ${selectedColor} Edition`;
    }
    if (product.subcategory) {
      return `— ${product.subcategory} Edition`;
    }
    return "— Special Edition";
  }, [selectedColor, product.subcategory]);

  const handleColorSelect = (color: any, idx: number) => {
    setSelectedColor(color.name);
    if (onColorChange) {
      onColorChange(idx, color.imageIndex);
    }
  };

  const handleWhatsAppEnquiry = () => {
    if (!selectedSize) {
      toast.error("Please select a size first.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleOrderSuccess = (order: any) => {
    const productLink = `${window.location.origin}/shop/${product.slug}`;
    const messageWithId =
      `Hi! I would like to enquire / order from ${siteConfig.name}.

Order Ref: *${order.orderNumber}*
👟 Product: *${product.name}*
📏 Size: US ${selectedSize}
🎨 Color: ${selectedColor}
💰 Price: LKR ${price.toLocaleString()}
🔗 Link: ${productLink}

Please confirm availability and dispatch details. Thank you!`.trim();

    const finalUrl = `https://wa.me/${siteConfig.contact.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(messageWithId)}`;
    window.open(finalUrl, "_blank");
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first.");
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    toast.success("Added to cart!");
  };

  // Pseudo out-of-stock sizes for realism if not strictly dynamic
  const isOutOfStock = (size: string) => {
    if (product.outOfStockSizes && Array.isArray(product.outOfStockSizes)) {
      return product.outOfStockSizes.includes(size);
    }
    return false;
  };

  return (
    <div className="flex flex-col w-full">
      {/* Category / Brand Pill Badge */}
      <div className="mb-3">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-bold tracking-[0.16em] uppercase text-muted-foreground bg-muted/40 border border-border/80 shadow-2xs">
          {product.brand
            ? `${product.brand} ORIGINALS`
            : product.category || "AUTHENTIC"}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground leading-[1.08] mb-1">
        {product.name}
      </h1>

      {/* Edition Subtitle */}
      <span className="font-serif italic text-lg sm:text-xl text-[#C39A4D] dark:text-[#D4AF37] font-normal mb-4 block">
        {editionSubtitle}
      </span>

      {/* Pricing Row */}
      <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3.5 mb-5 pb-5 border-b border-border/60">
        <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          {formatPrice(price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-base sm:text-lg text-muted-foreground line-through font-normal">
              {formatPrice(originalPrice)}
            </span>
            <span className="bg-[#C39A4D] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs ml-1">
              Save LKR {discountAmount.toLocaleString()}
            </span>
          </>
        )}
      </div>

      {/* Description Text */}
      <div className="mb-6">
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {product.shortDescription ||
            product.description ||
            "Engineered for speed, designed for legacy. Featherlight mesh with AirFlow tech, hand-finished details. Built for street lifestyle, tested for marathon miles."}
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Color Selection - ONLY Pure Color Swatches (No Product Images) */}
        {colorsList.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                Color:{" "}
                <span className="font-medium text-muted-foreground capitalize">
                  {selectedColor}
                </span>
              </h3>
              <span className="text-xs font-semibold text-muted-foreground">
                {activeColorIndex + 1} / {colorsList.length}
              </span>
            </div>

            {/* Pure Color Swatches */}
            <div className="flex gap-3 flex-wrap items-center">
              {colorsList.map((color: any, idx: number) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={`${color.name}-${idx}`}
                    type="button"
                    onClick={() => handleColorSelect(color, idx)}
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                    className={cn(
                      "relative w-9 h-9 sm:w-11 sm:h-11 rounded-full p-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer",
                      isSelected
                        ? "border-2 border-[#C39A4D] ring-2 ring-[#C39A4D]/30 ring-offset-2 scale-110 shadow-sm"
                        : "border border-border/80 hover:border-[#C39A4D]/60 hover:scale-105",
                    )}
                  >
                    {/* Inner color swatch */}
                    <span
                      className="w-full h-full rounded-full shadow-inner flex items-center justify-center transition-transform"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <CheckReadLinear className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Size Selection Grid */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
              SELECT SIZE (US)
            </h3>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold underline decoration-dotted underline-offset-4 transition-colors"
            >
              Size Guide
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-2.5">
            {sizesList.map((size: string) => {
              const isSelected = selectedSize === size;
              const outOfStock = isOutOfStock(size);

              return (
                <button
                  key={size}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "relative py-3 sm:py-3.5 px-2 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl transition-all duration-200 text-center flex items-center justify-center overflow-hidden cursor-pointer",
                    isSelected
                      ? "bg-[#C39A4D] text-white shadow-md shadow-[#C39A4D]/25 border-2 border-[#C39A4D] scale-[1.02]"
                      : outOfStock
                        ? "bg-muted/30 text-muted-foreground/40 border border-border/40 cursor-not-allowed"
                        : "bg-background hover:bg-muted/50 border border-border/80 hover:border-[#C39A4D]/60 text-foreground",
                  )}
                >
                  <span>{size}</span>
                  {outOfStock && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-full h-[1.5px] bg-muted-foreground/40 -rotate-25 origin-center" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Stock Availability Indicator */}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              Size {selectedSize} in stock •{" "}
              {product.stock > 0
                ? `${product.stock} pairs left`
                : "Ready for fast dispatch"}
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Service Badges (Horizontal 3-item row) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 py-4 border-y border-border/60 mb-6 bg-muted/15 rounded-2xl px-3 sm:px-4">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center">
          <ShieldCheckLinear size={18} className="text-[#C39A4D] shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-foreground">
            Authentic
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center border-x border-border/60 px-1 sm:px-2">
          <DeliveryLinear size={18} className="text-[#C39A4D] shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-foreground">
            Island Delivery
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center">
          <ChatLineLinear size={18} className="text-[#C39A4D] shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-foreground">
            WhatsApp Confirm
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3">
        {/* Enquire on WhatsApp — Primary CTA matching screenshot */}
        <Button
          size="lg"
          onClick={handleWhatsAppEnquiry}
          className="w-full h-14 sm:h-15 gap-2.5 bg-[#C39A4D] hover:bg-[#B38A3D] text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg shadow-[#C39A4D]/25 hover:shadow-xl hover:shadow-[#C39A4D]/35 transition-all active:scale-[0.99]"
        >
          <ChatLineLinear size={22} className="shrink-0" />
          <span>Enquire on WhatsApp</span>
          <ArrowRightUpLinear size={18} className="shrink-0 stroke-2" />
        </Button>

        {/* Add to Cart — Secondary */}
        <Button
          size="lg"
          onClick={handleAddToCart}
          variant="outline"
          className="w-full h-12 sm:h-13 gap-2.5 font-bold text-sm sm:text-base rounded-2xl border border-border/80 hover:bg-foreground hover:text-background transition-all"
        >
          <CartLargeLinear size={19} className="shrink-0" />
          Add to Cart
        </Button>
      </div>

      {/* Quick Order Modal */}
      <QuickOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          id: product._id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] || "",
          price,
        }}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSuccess={handleOrderSuccess}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        brand={product.brand || "Standard"}
      />
    </div>
  );
}
