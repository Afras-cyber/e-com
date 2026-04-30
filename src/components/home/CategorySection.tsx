import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Footprints, Sparkles, Percent } from "lucide-react";

const categories = [
  {
    name: "Sneakers",
    slug: "shoes",
    icon: Footprints,
    color: "bg-blue-500",
    description: "Premium kicks for every style"
  },
  {
    name: "Luxury Bags",
    slug: "bags",
    icon: ShoppingBag,
    color: "bg-purple-500",
    description: "Elegant bags for all occasions"
  },
  {
    name: "New Arrivals",
    slug: "new",
    icon: Sparkles,
    color: "bg-amber-500",
    description: "Latest trends just landed"
  },
  {
    name: "Special Offers",
    slug: "sale",
    icon: Percent,
    color: "bg-rose-500",
    description: "Unbeatable deals & discounts"
  }
];

export default function CategorySection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Shop by <span className="text-primary">Category</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Explore our curated collections designed to match your unique personality and lifestyle.
            </p>
          </div>
          <Link 
            href="/shop" 
            className="text-primary font-bold hover:underline underline-offset-4 flex items-center gap-1"
          >
            View All Collections
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`}>
              <div className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className={`mb-6 inline-flex p-4 rounded-2xl ${cat.color} text-white shadow-lg`}>
                  <cat.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-muted-foreground">
                  {cat.description}
                </p>
                <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
