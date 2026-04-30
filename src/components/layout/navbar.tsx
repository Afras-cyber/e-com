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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
          ? "border-b bg-background/80 backdrop-blur-xl py-2" 
          : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex h-14 items-center px-4">
          <div className="mr-8 hidden md:flex items-center">
            <Link href="/" className="mr-10 flex items-center">
              <span className="text-2xl font-black tracking-tighter">
                STEP<span className="text-primary italic">KICKS</span>
              </span>
            </Link>
            <nav className="flex items-center space-x-8 text-sm font-bold uppercase tracking-widest">
              <Link href="/shop" className="transition-colors hover:text-primary text-foreground/70">Shop</Link>
              <Link href="/shop?category=shoes" className="transition-colors hover:text-primary text-foreground/70">Shoes</Link>
              <Link href="/shop?category=bags" className="transition-colors hover:text-primary text-foreground/70">Bags</Link>
              <Link href="/about" className="transition-colors hover:text-primary text-foreground/70">About</Link>
            </nav>
          </div>

          <div className="flex md:hidden mr-4">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 -ml-2 text-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <Link href="/" className="flex md:hidden flex-1 items-center justify-center">
            <span className="text-xl font-black tracking-tighter">
              STEP<span className="text-primary italic">KICKS</span>
            </span>
          </Link>

          <div className="flex items-center justify-end space-x-2">
            <div className="hidden lg:block">
              <Link href="/shop">
                <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-primary/10 group" 
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
              <span className="sr-only">Cart</span>
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-black text-zinc-950 flex items-center justify-center border-2 border-background">
                  {itemCount()}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>
      <CartDrawer />
      <MobileMenu />
    </>
  );
}
