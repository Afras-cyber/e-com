"use client";

import { useState } from "react";
import { IProduct } from "@/types/product";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle, ShoppingCart } from "lucide-react";
import { buildWhatsAppURL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

export default function ProductInfo({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || "",
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name || "",
  );

  const addToCart = useCartStore((state) => state.addItem);

  const handleWhatsAppOrder = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color first.");
      return;
    }

    const url = buildWhatsAppURL({
      productName: product.name,
      productSlug: product.slug,
      price: product.discountPrice || product.price,
      size: selectedSize,
      color: selectedColor,
    });

    window.open(url, "_blank");
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color first.");
      return;
    }

    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.discountPrice || product.price,
      image: product.images?.[0] || "",
      selectedSize,
      selectedColor,
      quantity: 1,
    });

    alert("Added to cart!");
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2 font-medium">
        {product.brand}
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{product.name}</h1>

      <div className="flex items-end gap-4 mb-8">
        {product.isOnSale && product.discountPrice ? (
          <>
            <span className="text-3xl font-black text-primary">
              {formatPrice(product.discountPrice)}
            </span>
            <span className="text-xl text-muted-foreground line-through pb-1">
              {formatPrice(product.price)}
            </span>
            <span className="bg-accent text-accent-foreground text-sm font-bold px-2 py-1 rounded-md mb-1">
              Save {product.discountPercent}%
            </span>
          </>
        ) : (
          <span className="text-3xl font-black">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      <div className="space-y-6 mb-8">
        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">
              Color:{" "}
              <span className="font-normal text-muted-foreground">
                {selectedColor}
              </span>
            </h3>
            <div className="flex gap-3">
              {product.colors.map((color: any) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 focus:outline-none transition-all",
                    selectedColor === color.name
                      ? "border-primary scale-110"
                      : "border-transparent hover:scale-105",
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Size</h3>
              <button className="text-sm text-blue-600 hover:underline">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "py-2 px-1 text-sm border rounded-md font-medium transition-colors text-center",
                    selectedSize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
        <Button
          size="lg"
          onClick={handleAddToCart}
          variant="outline"
          className="flex-1 gap-2 border-2"
        >
          <ShoppingCart size={20} />
          Add to Cart
        </Button>
        <Button
          size="lg"
          onClick={handleWhatsAppOrder}
          className="flex-1 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
        >
          <MessageCircle size={20} />
          Order via WhatsApp
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-muted-foreground border-t pt-6">
        <div className="flex items-center gap-2">
          <Check size={16} className="text-green-500" />
          <span>Authenticity Guaranteed</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={16} className="text-green-500" />
          <span>Island-wide Delivery</span>
        </div>
      </div>
    </div>
  );
}
