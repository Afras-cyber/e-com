import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      
      {/* Fallback Hero Content if banners are empty */}
      <div className="empty:hidden">
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-primary mb-6">
              Step into <span className="text-accent">Style</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover our premium collection of authentic sneakers and luxury bags.
              Unbeatable prices, guaranteed authenticity, and direct WhatsApp
              ordering.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <ShoppingBag size={20} />
                  Shop Now
                </Button>
              </Link>
              <Link href="/shop?category=shoes">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2"
                >
                  View Sneakers <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <FeaturedProducts />
      <TestimonialsSection />
    </div>
  );
}
