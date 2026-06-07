'use client';

import Link from 'next/link';
import { CartLargeLinear, HamburgerMenuLinear, MagniferLinear, HeartLinear } from "solar-icon-set";;
import { Button } from '../ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useWishlist } from '@/store/useWishlist';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import SearchDialog from './SearchDialog';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';

export default function Navbar() {
  const { itemCount, openCart } = useCartStore();
  const { items } = useWishlist();
  const { toggleMobileMenu } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm py-2'
            : 'bg-transparent py-4'
        )}
      >
        <div className="max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6">

          {/* Desktop: Logo + Nav */}
          <div className="mr-auto hidden md:flex items-center gap-10">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-black tracking-tighter uppercase text-foreground group-hover:opacity-80 transition-opacity">
                {siteConfig.name.slice(0, 4)}
                <span className="text-primary italic">{siteConfig.name.slice(4)}</span>
              </span>
            </Link>

            <nav className="flex items-center gap-7 text-sm font-bold uppercase tracking-widest">
              {[
                { href: '/shop', label: 'Shop' },
                { href: '/track', label: 'Track' },
                { href: '/about', label: 'About' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="relative text-foreground/60 hover:text-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile: Hamburger */}
          <div className="flex md:hidden mr-3">
            <button
              onClick={toggleMobileMenu}
              className="p-2 -ml-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Open menu"
            >
              <HamburgerMenuLinear className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile: Centered Logo */}
          <Link href="/" className="flex md:hidden flex-1 items-center justify-center">
            <span className="text-xl font-black tracking-tighter uppercase text-foreground">
              {siteConfig.name.slice(0, 4)}
              <span className="text-primary italic">{siteConfig.name.slice(4)}</span>
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">

            {/* MagniferLinear */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/60 hover:text-primary hover:bg-primary/10 relative group transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="MagniferLinear"
            >
              <MagniferLinear className="h-5 w-5" />
              <kbd className="hidden lg:inline-flex absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground/60 hover:text-primary hover:bg-primary/10 relative transition-colors"
                aria-label="Wishlist"
              >
                <HeartLinear
                  className={cn(
                    'h-5 w-5 transition-all',
                    mounted && items.length > 0 ? 'fill-red-500 text-red-500' : ''
                  )}
                />
                {mounted && items.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center border-2 border-background">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
              onClick={openCart}
              aria-label="Cart"
            >
              <CartLargeLinear className="h-5 w-5" />
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-[10px] font-black text-primary-foreground flex items-center justify-center border-2 border-background">
                  {itemCount()}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <CartDrawer />
      <MobileMenu />
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
