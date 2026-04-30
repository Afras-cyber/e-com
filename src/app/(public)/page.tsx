import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Zap } from "lucide-react";
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
    description: "Verified by our experts",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "2-4 days island-wide",
    gradient: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free policy",
    gradient: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-500",
  },
  {
    icon: Zap,
    title: "WhatsApp Orders",
    description: "Instant checkout support",
    gradient: "from-purple-500/10 to-purple-500/5",
    iconColor: "text-purple-500",
  },
];

const brands = [
  "Nike", "Adidas", "Puma", "Jordan", "New Balance", "Converse", "Gucci", "Prada"
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      
      {/* Features Bar */}
      <section className="relative -mt-12 sm:-mt-16 z-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg shadow-black/5 backdrop-blur-xl bg-gradient-to-br ${feature.gradient} transition-transform hover:-translate-y-1`}
              >
                <div className={`mb-3 ${feature.iconColor}`}>
                  <feature.icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-0.5">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategorySection />

      <FeaturedProducts />

      {/* Brand Showcase */}
      <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-950/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground text-center mb-2">Trusted By</p>
          <h2 className="text-2xl sm:text-3xl font-black text-center tracking-tight">Leading Brands</h2>
        </div>
        <div className="flex gap-12 sm:gap-20 animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-200 dark:text-zinc-800 uppercase tracking-tighter hover:text-primary transition-colors cursor-default select-none">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">
            Ready to Step Up <br className="hidden sm:block" />
            Your <span className="italic text-primary">Game?</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Explore our full collection of premium sneakers, bags, and accessories at unbeatable prices.
          </p>
          <Link href="/shop">
            <Button size="lg" className="rounded-full px-10 py-7 text-base sm:text-lg font-black gap-2 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <TestimonialsSection />

      <NewsletterSignup />
    </div>
  );
}
