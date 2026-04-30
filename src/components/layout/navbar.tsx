'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { itemCount, openCart } = useCartStore();
  const { toggleMobileMenu } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight">StepKicks</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/shop" className="transition-colors hover:text-foreground/80 text-foreground/60">Shop</Link>
              <Link href="/shop?category=shoes" className="transition-colors hover:text-foreground/80 text-foreground/60">Shoes</Link>
              <Link href="/shop?category=bags" className="transition-colors hover:text-foreground/80 text-foreground/60">Bags</Link>
              <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
            </nav>
          </div>
          <button 
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Link href="/shop">
                <Button variant="outline" className="w-full md:w-64 justify-start text-muted-foreground gap-2">
                  <Search className="h-4 w-4" />
                  <span>Search products...</span>
                </Button>
              </Link>
            </div>
            <nav className="flex items-center">
              <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                {mounted && itemCount() > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    {itemCount()}
                  </span>
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <CartDrawer />
      <MobileMenu />
    </>
  );
}
