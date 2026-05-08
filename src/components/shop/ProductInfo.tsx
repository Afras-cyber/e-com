"use client";

import { useState } from "react";
import { IProduct } from "@/types/product";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle, ShoppingCart, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { buildWhatsAppURL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import QuickOrderModal from "./QuickOrderModal";
import { siteConfig } from "@/config/site";

export default function ProductInfo({ 
  product,
  onColorChange
}: { 
  product: any,
  onColorChange?: (colorIndex: number, imageIndex?: number) => void
}) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || "",
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name || "",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  const handleWhatsAppOrder = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color first.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleOrderSuccess = (order: any) => {
    const url = buildWhatsAppURL({
      productName: product.name,
      productSlug: product.slug,
      price: product.discountPrice || product.price,
      size: selectedSize,
      color: selectedColor,
      // Add order number to the message
      siteUrl: `${window.location.origin}`,
    });

    // Update message to include order ID, price and link
    const productLink = `${window.location.origin}/shop/${product.slug}`;
    const messageWithId = `Hi! I just placed a quick order on ${siteConfig.name}. 
    
Order ID: *${order.orderNumber}*
👟 Product: *${product.name}*
📏 Size: ${selectedSize}
🎨 Color: ${selectedColor}
💰 Price: LKR ${product.price.toLocaleString()}
🔗 Link: ${productLink}

Please confirm my order. Thank you!`.trim();

    const finalUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(messageWithId)}`;
    window.open(finalUrl, "_blank");
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color first.");
      return;
    }

    addToCart(product, selectedSize, selectedColor);

    toast.success("Added to cart!");
  };

  return (
    <div className="flex flex-col">
      {/* Brand */}
      <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-[0.2em] mb-2 font-semibold">
        {product.brand}
      </p>

      {/* Product Name */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-4 leading-tight">
        {product.name}
      </h1>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>
      )}

      {/* Price */}
      <div className="flex items-end gap-3 mb-8">
        {product.isOnSale && product.discountPrice ? (
          <>
            <span className="text-3xl sm:text-4xl font-black">
              {formatPrice(product.discountPrice)}
            </span>
            <span className="text-lg text-muted-foreground line-through pb-0.5">
              {formatPrice(product.price)}
            </span>
            <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full mb-1 uppercase tracking-wider">
              Save {product.discountPercent}%
            </span>
          </>
        ) : (
          <span className="text-3xl sm:text-4xl font-black">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      <div className="space-y-6 mb-8">
        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-muted-foreground">
              Color:{" "}
              <span className="text-foreground capitalize">
                {selectedColor}
              </span>
            </h3>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color: any, idx: number) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color.name);
                    if (onColorChange) onColorChange(idx, color.imageIndex);
                  }}
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 focus:outline-none transition-all relative",
                    selectedColor === color.name
                      ? "border-primary scale-110 ring-2 ring-primary/30 ring-offset-2"
                      : "border-transparent hover:scale-105 hover:border-muted-foreground/30",
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor === color.name && (
                    <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Size
              </h3>
              <button className="text-xs text-primary hover:underline font-semibold">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "py-3 px-1 text-sm border-2 rounded-xl font-bold transition-all text-center",
                    selectedSize === size
                      ? "bg-foreground text-background border-foreground shadow-md scale-[1.03]"
                      : "bg-background hover:bg-muted border-border hover:border-foreground/20",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Buttons — Mobile-first, stacked full-width */}
      <div className="flex flex-col gap-3">
        {/* WhatsApp — THE primary CTA, big and bold */}
        <Button
          size="lg"
          onClick={handleWhatsAppOrder}
          className="w-full gap-3 bg-[#25D366] hover:bg-[#1da851] text-white font-black text-base sm:text-lg py-7 sm:py-7 rounded-2xl shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all active:scale-[0.98]"
        >
          <MessageCircle size={22} className="shrink-0" />
          Order via WhatsApp
        </Button>

        {/* Add to Cart — secondary */}
        <Button
          size="lg"
          onClick={handleAddToCart}
          variant="outline"
          className="w-full gap-3 font-bold text-base py-6 sm:py-6 rounded-2xl border-2 hover:bg-foreground hover:text-background transition-all"
        >
          <ShoppingCart size={20} className="shrink-0" />
          Add to Cart
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 grid grid-cols-3 gap-3 text-center border-t pt-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck size={18} className="text-emerald-500" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground leading-tight">100% Authentic</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Truck size={18} className="text-blue-500" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground leading-tight">Fast Delivery</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
            <RotateCcw size={18} className="text-amber-500" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground leading-tight">Easy Returns</span>
        </div>
      </div>

      <QuickOrderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          id: product._id,
          name: product.name,
          slug: product.slug,
          image: product.images[0],
          price: product.discountPrice || product.price
        }}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}
