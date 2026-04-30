import Link from "next/link";
import { ArrowRight, ShoppingBag, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CategorySection from "@/components/home/CategorySection";
import NewsletterSignup from "@/components/home/NewsletterSignup";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Every item is verified by our experts."
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Island-wide shipping within 2-4 days."
  },
  {
    icon: CheckCircle2,
    title: "Easy Returns",
    description: "7-day hassle-free return policy."
  }
];

const brands = [
  "Nike", "Adidas", "Puma", "Jordan", "New Balance", "Converse", "Gucci", "Prada"
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      
      {/* Features Bar */}
      <section className="border-y border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategorySection />

      <FeaturedProducts />

      {/* Brand Showcase */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <h2 className="text-2xl font-bold text-center">Trusted by Leading Brands</h2>
        </div>
        <div className="flex gap-20 animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} className="text-4xl md:text-6xl font-black text-zinc-300 dark:text-zinc-800 uppercase tracking-tighter hover:text-primary transition-colors cursor-default">
              {brand}
            </span>
          ))}
        </div>
      </section>

      <TestimonialsSection />

      <NewsletterSignup />
    </div>
  );
}
