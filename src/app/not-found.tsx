import Link from "next/link";
import { Search, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-zinc-100 dark:text-zinc-900 tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl md:text-4xl font-bold bg-background px-4">
            Page Not Found
          </span>
        </div>
      </div>
      
      <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
        The sneaker or bag you're looking for might have been moved, sold out, or doesn't exist.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="default" className="w-full gap-2" size="lg">
            <Home size={18} />
            Back to Home
          </Button>
        </Link>
        <Link href="/shop" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full gap-2" size="lg">
            <Search size={18} />
            Browse Shop
          </Button>
        </Link>
      </div>

      <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 w-full max-w-md">
        <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">
          Popular Categories
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/shop?category=shoes" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
            Sneakers <ArrowRight size={14} />
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <Link href="/shop?category=bags" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
            Luxury Bags <ArrowRight size={14} />
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <Link href="/shop?isOnSale=true" className="text-sm hover:text-primary transition-colors flex items-center gap-1 text-primary">
            Flash Sale <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
