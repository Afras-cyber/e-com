"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MagniferLinear,
  CloseCircleLinear,
  RefreshLinear,
  BagLinear,
  ArrowRightLinear,
} from "solar-icon-set";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/product";
import { formatPrice } from "@/lib/format-price";
import Link from "next/link";

export default function SearchDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${searchQuery}&limit=5`);
      const data = await res.json();
      setResults(data.products || []);
    } catch (error) {
      console.error("MagniferLinear error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start pt-[10vh] px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
            <MagniferLinear className="w-6 h-6 text-muted-foreground mr-4" />
            <input
              autoFocus
              placeholder="MagniferLinear for sneakers, bags, or brands..."
              className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query) {
                  router.push(`/shop?search=${query}`);
                  onClose();
                }
              }}
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <CloseCircleLinear className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <RefreshLinear className="w-8 h-8 animate-spin mb-2" />
                <p>Searching CRK Shoes...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2 mb-4">
                  Products Found
                </p>
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-2xl transition-all group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {product.category} • {product.brand}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm">
                        {formatPrice(product.discountPrice || product.price)}
                      </p>
                      <ArrowRightLinear className="w-4 h-4 ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/shop?search=${query}`}
                  onClick={onClose}
                  className="flex items-center justify-center p-4 text-primary font-bold text-sm hover:underline"
                >
                  View all results for "{query}"
                </Link>
              </div>
            ) : query.length >= 2 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MagniferLinear className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p>No products found for "{query}"</p>
                <p className="text-xs mt-1">Try searching for something else</p>
              </div>
            ) : (
              <div className="py-6 px-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Quick Links
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "New Arrivals", href: "/shop?sort=newest" },
                    { label: "On Sale", href: "/shop?isOnSale=true" },
                    { label: "Luxury Bags", href: "/shop?category=bags" },
                    { label: "Sneakers", href: "/shop?category=shoes" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={onClose}
                      className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-bold"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
