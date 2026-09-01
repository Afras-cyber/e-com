import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheckLinear,
  BusLinear,
  HistoryLinear,
  BoltLinear,
} from "solar-icon-set";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateSEOMetadata, truncateDescription, generateBreadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhatsAppOrderTracker from "@/components/home/whatsappOrderTrack";
import HeroSection from "@/components/home/HeroSectionLS";

export const metadata: Metadata = generateSEOMetadata({
  title: `Premium Authentic Shoes | ${siteConfig.name}`,
  description: truncateDescription(
    "Discover authentic premium shoes and sneakers from top brands. Fast 2-4 days delivery across Sri Lanka. 100% genuine, easy returns, and WhatsApp ordering."
  ),
  ogImage: `${siteConfig.url}/homepage_shoe.png`,
  ogTitle: `${siteConfig.name} - Your Destination for Premium Shoes`,
  ogDescription: "Shop authentic premium shoes with fast delivery across Sri Lanka. Quality guaranteed, easy returns.",
  canonicalUrl: siteConfig.url,
  keywords: "shoes, authentic sneakers, premium footwear, buy shoes online, Sri Lanka shoes, casual shoes, sports shoes, designer shoes",
  author: siteConfig.name,
  type: "website",
});

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
  "Nike",
  "Adidas",
  "Puma",
  "Jordan",
  "New Balance",
  "Converse",
  "Gucci",
  "Prada",
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
        ])}
      />
      
      <HeroSection />
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
      {/* ── Hero ── */}
      {/* <HeroBanner /> */}

      {/* ── Feature Cards ── */}
      {/* <section className="relative -mt-14 sm:-mt-20 z-10 px-4">
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
      </section> */}

      <FeaturedProducts />
      <TestimonialsSection />
      <WhatsAppOrderTracker />
    </div>
  );
}
