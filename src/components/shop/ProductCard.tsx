"use client";

import { memo, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeartLinear, HeartBold, ChatLineBold } from "solar-icon-set";
import { IProduct } from "@/types/product";
import { formatPrice, calcDiscountPercent } from "@/lib/format-price";
import { buildWhatsAppURL } from "@/lib/whatsapp";
import { useWishlist } from "@/store/useWishlist";
import { toast } from "sonner";

function resolvePrice(product: IProduct) {
  if (
    product.isOnSale &&
    product.discountPrice != null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
  ) {
    return product.discountPrice;
  }
  return product.price;
}

function resolveDiscount(product: IProduct): number | null {
  if (!product.isOnSale) return null;
  if (product.discountPercent && product.discountPercent > 0) {
    return product.discountPercent;
  }
  if (
    product.discountPrice != null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
  ) {
    return calcDiscountPercent(product.price, product.discountPrice);
  }
  return null;
}

function ProductCard({
  product,
  priority = false,
}: {
  product: IProduct;
  priority?: boolean;
}) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const active = isInWishlist(product._id);
  const cover = product.images?.[0];
  const price = resolvePrice(product);
  const discount = resolveDiscount(product);
  const inStock = product.isAvailable && product.stock > 0;
  const isLimited =
    product.isFeatured ||
    product.tags?.some((tag) => tag.toLowerCase().includes("limited"));

  const categoryLabel = (product.subcategory || product.category || "")
    .replace(/[-_]/g, " ")
    .trim();

  const colorway = product.colors?.[0]?.name;
  const sizeCount = product.sizes?.length ?? 0;
  const href = `/shop/${product.slug}`;

  const whatsappHref = useMemo(() => {
    if (!inStock) return null;
    return buildWhatsAppURL({
      productName: product.name,
      productSlug: product.slug,
      size: product.sizes?.[0] || "Any",
      color: colorway || "Any",
      price,
    });
  }, [inStock, product.name, product.slug, product.sizes, colorway, price]);

  const toggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (active) {
        removeItem(product._id);
        toast.info("Removed from wishlist");
        return;
      }
      addItem({
        id: product._id,
        name: product.name,
        price,
        image: cover ?? "",
        slug: product.slug,
      });
      toast.success("Added to wishlist");
    },
    [
      active,
      addItem,
      removeItem,
      product._id,
      product.name,
      product.slug,
      price,
      cover,
    ],
  );

  return (
    <article className="@container group relative flex flex-col overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] lg:rounded-[2rem] bg-white dark:bg-[#1A1A1A] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-[#E8E8EA]/80 dark:ring-[#2A2A2A] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_56px_rgba(0,0,0,0.10)]">
      <div className="relative aspect-square overflow-hidden bg-linear-to-b from-[#F8F6F2] to-[#EEEAE3] dark:from-[#242424] dark:to-[#161616]">
        <Link
          href={href}
          className="absolute inset-0"
          aria-label={product.name}
        >
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain object-center p-5 sm:p-7 transition-transform duration-500 ease-out will-change-transform group-hover:-translate-y-1.5 group-hover:scale-[1.04] drop-shadow-[0_18px_28px_rgba(0,0,0,0.18)] ${
                inStock ? "" : "opacity-55 grayscale"
              }`}
              priority={priority}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs text-[#6B6B6B] dark:text-[#A8A9AD]">
              No image
            </span>
          )}
        </Link>

        {categoryLabel ? (
          <span className="pointer-events-none absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 max-w-[52%] truncate rounded-full bg-white/95 dark:bg-[#1A1A1A]/90 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide text-[#6B6B6B] dark:text-[#A8A9AD] shadow-sm ring-1 ring-black/5 dark:ring-white/10">
            {categoryLabel}
          </span>
        ) : null}

        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 flex items-center gap-1.5">
          {discount != null ? (
            <span className="rounded-full bg-[#B8975A] px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              -{discount}%
            </span>
          ) : isLimited ? (
            <span className="rounded-full bg-[#B8975A] px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Limited
            </span>
          ) : null}

          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={active}
            className="grid size-7 sm:size-8 place-items-center rounded-full bg-white/95 dark:bg-[#1A1A1A]/90 shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            {active ? (
              <HeartBold className="size-3.5 sm:size-4 text-red-500" />
            ) : (
              <HeartLinear className="size-3.5 sm:size-4 text-[#6B6B6B] dark:text-[#A8A9AD]" />
            )}
          </button>
        </div>

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
            className="absolute z-20 left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-4 inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-[#D4AF37] via-[#B9975B] to-[#C5A880] text-[10px] sm:text-xs font-semibold text-white shadow-[0_10px_24px_rgba(185,151,90,0.45)] transition-all duration-300 opacity-100 translate-y-0 md:opacity-0 md:translate-y-3 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto hover:brightness-105"
          >
            <ChatLineBold className="size-3.5 sm:size-4 shrink-0" />
            <span>Enquire</span>
            <span className="hidden @[16rem]:inline">on WhatsApp</span>
          </a>
        ) : null}
      </div>

      <Link
        href={href}
        className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-5 sm:pb-5 sm:pt-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.16em] text-[#9A9A9A] dark:text-[#7A7A7A]">
              {product.brand}
            </p>
            <h3 className="mt-0.5 font-serif text-[10x] sm:text-sm font-bold uppercase tracking-tight text-[#1A1A1A] dark:text-[#F5F5F5] line-clamp-1">
              {product.name}
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-serif text-[13px] sm:text-base font-semibold text-[#B8975A] leading-none">
              {formatPrice(price)}
            </p>
            {discount != null ? (
              <p className="mt-1 text-[10px] sm:text-xs text-[#9A9A9A] line-through">
                {formatPrice(product.price)}
              </p>
            ) : null}
          </div>
        </div>

        <p className="mt-1.5 text-[10px] sm:text-xs text-[#8A8A8A] dark:text-[#8D8D8D] line-clamp-1">
          {colorway ? `${colorway} • ` : ""}
          {inStock ? "In Stock" : "Out of Stock"}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-3">
          {product.colors?.length ? (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((c) => (
                <span
                  key={`${c.name}-${c.hex}`}
                  className="size-3.5 sm:size-4 rounded-full ring-1 ring-black/10 dark:ring-white/15 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 3 ? (
                <span className="text-[10px] text-[#9A9A9A]">
                  +{product.colors.length - 3}
                </span>
              ) : null}
            </div>
          ) : null}
          {sizeCount > 0 ? (
            <span className="text-[10px] sm:text-[11px] text-[#9A9A9A]">
              {sizeCount} {sizeCount === 1 ? "size" : "sizes"}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export default memo(ProductCard);
