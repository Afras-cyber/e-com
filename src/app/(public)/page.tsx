import Link from "next/link";
import { ArrowRightLinear, ShieldCheckLinear, BusLinear, HistoryLinear, BoltLinear } from "solar-icon-set";;
import { Button } from "@/components/ui/button";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CategorySection from "@/components/home/CategorySection";
import NewsletterSignup from "@/components/home/NewsletterSignup";

const features = [
  {
    icon: ShieldCheckLinear,
    title: "100% Authentic",
    description: "Verified by our experts",
    accent: "emerald",
    iconClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10 dark:bg-emerald-500/[0.07]",
    borderClass: "border-emerald-500/20 dark:border-emerald-500/10",
  },
  {
    icon: BusLinear,
    title: "Fast Delivery",
    description: "2–4 days island-wide",
    accent: "blue",
    iconClass: "text-blue-500",
    bgClass: "bg-blue-500/10 dark:bg-blue-500/[0.07]",
    borderClass: "border-blue-500/20 dark:border-blue-500/10",
  },
  {
    icon: HistoryLinear,
    title: "Easy Returns",
    description: "7-day hassle-free policy",
    accent: "amber",
    iconClass: "text-amber-500",
    bgClass: "bg-amber-500/10 dark:bg-amber-500/[0.07]",
    borderClass: "border-amber-500/20 dark:border-amber-500/10",
  },
  {
    icon: BoltLinear,
    title: "WhatsApp Orders",
    description: "Instant checkout support",
    accent: "violet",
    iconClass: "text-violet-500",
    bgClass: "bg-violet-500/10 dark:bg-violet-500/[0.07]",
    borderClass: "border-violet-500/20 dark:border-violet-500/10",
  },
];

const brands = [
  "Nike", "Adidas", "Puma", "Jordan", "New Balance", "Converse", "Gucci", "Prada",
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ── Hero ── */}
      <HeroBanner />

      {/* ── Feature Cards ── */}
      <section className="relative -mt-14 sm:-mt-20 z-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`${feature.bgClass} border ${feature.borderClass} bg-background/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg shadow-black/5 dark:shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className={`mb-3 ${feature.iconClass}`}>
                  <feature.icon size={22} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-0.5 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <CategorySection />

      {/* ── Featured Products ── */}
      <FeaturedProducts />

      {/* ── Brand Marquee ── */}
      <section className="py-16 sm:py-24 bg-muted/40 dark:bg-zinc-900/40 overflow-hidden border-y border-border dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-primary text-center mb-2">
            Trusted By
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-center tracking-tight text-foreground">
            Leading Brands
          </h2>
        </div>
        <div className="flex gap-12 sm:gap-20 animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground/10 dark:text-white/[0.06] uppercase tracking-tighter hover:text-primary/40 transition-colors cursor-default select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── CTA Banner ── */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-foreground to-foreground/80 dark:from-zinc-100 dark:to-zinc-300 px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl shadow-foreground/10 dark:shadow-zinc-200/10">

            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-background/50 dark:text-zinc-500 mb-4">
                Limited Collection
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 sm:mb-6 leading-tight text-background dark:text-zinc-950">
                Ready to Step Up{" "}
                <br className="hidden sm:block" />
                Your{" "}
                <span className="italic text-primary">Game?</span>
              </h2>
              <p className="text-base sm:text-lg text-background/60 dark:text-zinc-600 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                Explore our full collection of premium sneakers, bags, and accessories at unbeatable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="rounded-full px-10 py-7 text-base sm:text-lg font-black gap-2 bg-background dark:bg-zinc-950 text-foreground dark:text-white hover:bg-background/90 dark:hover:bg-zinc-900 shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Shop Now <ArrowRightLinear className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full px-10 py-7 text-base sm:text-lg font-black text-background dark:text-zinc-900 hover:bg-white/10 dark:hover:bg-zinc-900/10 border border-background/20 dark:border-zinc-900/20"
                  >
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterSignup />
    </div>
  );
}
