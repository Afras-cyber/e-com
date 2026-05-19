'use client';

import Link from "next/link";
import { ArrowRightLinear, MapPointLinear, BagLinear, StarsLinear, SaleLinear } from "solar-icon-set";;
import { motion } from "framer-motion";

const categories = [
  {
    name: "Sneakers",
    slug: "shoes",
    icon: MapPointLinear,
    gradient: "from-blue-500 to-indigo-600",
    shadowColor: "shadow-blue-500/20",
    emoji: "👟",
    description: "Premium kicks for every style",
    count: "200+ styles",
  },
  {
    name: "Luxury Bags",
    slug: "bags",
    icon: BagLinear,
    gradient: "from-violet-500 to-purple-700",
    shadowColor: "shadow-violet-500/20",
    emoji: "👜",
    description: "Elegant bags for all occasions",
    count: "80+ designs",
  },
  {
    name: "New Arrivals",
    slug: "new",
    icon: StarsLinear,
    gradient: "from-amber-400 to-orange-600",
    shadowColor: "shadow-amber-500/20",
    emoji: "✨",
    description: "Latest trends just landed",
    count: "Weekly drops",
  },
  {
    name: "Special Offers",
    slug: "sale",
    icon: SaleLinear,
    gradient: "from-rose-500 to-red-600",
    shadowColor: "shadow-rose-500/20",
    emoji: "🔥",
    description: "Unbeatable deals & discounts",
    count: "Up to 60% off",
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 sm:py-28 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-16 gap-4">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-primary mb-2">
              Browse
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Shop by{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Category
              </span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group text-sm text-muted-foreground font-bold hover:text-primary transition-colors flex items-center gap-1.5 w-fit shrink-0"
          >
            View All Products
            <ArrowRightLinear className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link href={`/shop?category=${cat.slug}`}>
                <div
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br ${cat.gradient} p-5 sm:p-8 text-white min-h-[150px] sm:min-h-[240px] flex flex-col justify-between shadow-xl ${cat.shadowColor} hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 cursor-pointer`}
                >
                  {/* Decorative blobs */}
                  <div className="absolute -top-6 -right-6 w-28 h-28 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-black/10 rounded-full blur-xl pointer-events-none" />

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

                  {/* Top: Emoji */}
                  <div className="relative z-10">
                    <span className="text-3xl sm:text-5xl block mb-1">{cat.emoji}</span>
                  </div>

                  {/* Bottom: Text */}
                  <div className="relative z-10">
                    <p className="text-[10px] sm:text-xs font-bold text-white/60 uppercase tracking-widest mb-0.5 sm:mb-1">
                      {cat.count}
                    </p>
                    <h3 className="text-sm sm:text-xl font-black tracking-tight leading-tight mb-0 sm:mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-white/65 hidden sm:block">
                      {cat.description}
                    </p>
                  </div>

                  {/* Hover arrow pill */}
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 border border-white/20">
                    <ArrowRightLinear className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
