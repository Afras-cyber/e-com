'use client';

import Link from "next/link";
import { ShoppingBag, Footprints, Sparkles, Percent, ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Sneakers",
    slug: "shoes",
    icon: Footprints,
    gradient: "from-blue-600 to-blue-800",
    emoji: "👟",
    description: "Premium kicks for every style"
  },
  {
    name: "Luxury Bags",
    slug: "bags",
    icon: ShoppingBag,
    gradient: "from-purple-600 to-purple-800",
    emoji: "👜",
    description: "Elegant bags for all occasions"
  },
  {
    name: "New Arrivals",
    slug: "new",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-600",
    emoji: "✨",
    description: "Latest trends just landed"
  },
  {
    name: "Special Offers",
    slug: "sale",
    icon: Percent,
    gradient: "from-rose-500 to-red-600",
    emoji: "🔥",
    description: "Unbeatable deals & discounts"
  }
];

export default function CategorySection() {
  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-14 gap-3">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Browse
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Shop by <span className="italic text-primary">Category</span>
            </h2>
          </div>
          <Link 
            href="/shop" 
            className="text-sm text-primary font-bold hover:underline underline-offset-4 flex items-center gap-1 w-fit"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`}>
              <div className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br ${cat.gradient} p-5 sm:p-8 text-white min-h-[140px] sm:min-h-[220px] flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]`}>
                {/* Decorative circle */}
                <div className="absolute -top-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full blur-xl" />
                
                <div className="relative z-10">
                  <span className="text-2xl sm:text-4xl mb-2 sm:mb-4 block">{cat.emoji}</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-base sm:text-xl font-black mb-0 sm:mb-1 tracking-tight leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-white/70 hidden sm:block">
                    {cat.description}
                  </p>
                </div>
                
                {/* Hover arrow */}
                <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
