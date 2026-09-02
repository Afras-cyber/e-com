"use client";

import Link from "next/link";
import {
  CartLargeLinear,
  HamburgerMenuLinear,
  MagniferLinear,
  HeartLinear,
  MoonBold,
  CardSearchBold,
  MenuDotsBold,
  CartBold,
} from "solar-icon-set";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useWishlist } from "@/store/useWishlist";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";
import CartDrawer from "./CartDrawer";
import MobileMenu from "./MobileMenu";
import SearchDialog from "./SearchDialog";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
// import { Moon, Search, ShoppingBag, Menu } from "";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { itemCount, openCart } = useCartStore();
  const { items } = useWishlist();
  const { toggleMobileMenu } = useUIStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 w-full max-w-full overflow-hidden",
          scrolled
            ? "dark:bg-[#1A1A1A]/85 dark:border-[#2A2A2A] bg-[#FAF9F6]/85 border-[#E8E8EA]"
            : "dark:bg-[#1A1A1A]/60 dark:border-[#2A2A2A]/50 bg-[#FAF9F6]/60 border-[#E8E8EA]/50",
        )}
      >
        <div className="mx-auto max-w-[1440px] w-full px-5 md:px-8 h-[72px] flex items-center justify-between">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center group">
              <button
                data-nav-tick="0"
                className="flex items-baseline gap-[6px] select-none shrink-0"
                aria-label="Legacy Sports Home"
              >
                <span className="font-serif font-[900] tracking-[-0.03em] text-[22px] md:text-[24px] dark:text-white text-[#1A1A1A]">
                  LEGACY
                </span>
                <span className="font-sans font-[300] tracking-[0.32em] text-[11px] md:text-[12px] opacity-70 dark:text-gray-400 text-[#1A1A1A]">
                  SPORTS
                </span>
                <span className="ml-1 w-[5px] h-[5px] rounded-full bg-gradient-to-br from-[#D4AF37] via-[#B9975B] to-[#C5A880] inline-block translate-y-[-6px]"></span>
              </button>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-9 text-[12px] font-sans font-medium tracking-[0.22em]">
              {[
                { label: "HOME", href: "/" },
                { label: "SHOP", href: "/shop" },
                { label: "TRACK ORDER", href: "/track" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}>
                  <button
                    data-nav-tick="0"
                    className="relative py-1 transition-all dark:text-gray-300 dark:hover:text-white text-[#1A1A1A] hover:text-[#1A1A1A] opacity-60 hover:opacity-100 group"
                  >
                    {label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gradient-to-br from-[#D4AF37] via-[#B9975B] to-[#C5A880] group-hover:w-full transition-all"></span>
                  </button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-full border grid place-items-center transition-colors dark:bg-[#2A2A2A] dark:border-[#3A3A3A] dark:text-white dark:hover:bg-white dark:hover:text-[#1A1A1A] bg-white border-[#E8E8EA] hover:bg-[#1A1A1A] hover:text-white"
              aria-label="Toggle dark mode"
              title="Toggle light/dark"
              type="button"
            >
              <MoonBold className="w-4 h-4" />
            </button>

            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full border transition-colors dark:bg-[#2A2A2A] dark:border-[#3A3A3A] dark:text-white dark:hover:bg-white dark:hover:text-[#1A1A1A] bg-white border-[#E8E8EA] hover:bg-[#1A1A1A] hover:text-white"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <CardSearchBold className="w-4 h-4" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full border relative transition-colors dark:bg-[#2A2A2A] dark:border-[#3A3A3A] dark:text-white dark:hover:bg-white dark:hover:text-[#1A1A1A] bg-white border-[#E8E8EA] hover:bg-[#1A1A1A] hover:text-white"
              onClick={openCart}
              aria-label="Cart"
            >
              <CartBold className="w-4 h-4" />
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#D4AF37] text-[10px] font-black `text-[#1A1A1A] flex items-center justify-center border-2 dark:border-[#1A1A1A] border-white">
                  {itemCount()}
                </span>
              )}
            </Button>

            {/* WhatsApp - Desktop Only */}
            <a
              href="https://wa.me/94771234567?text=Hi%20Legacy%20Sports!"
              target="_blank"
              rel="noopener"
              className="hidden md:grid w-10 h-10 rounded-full border place-items-center transition-colors dark:bg-[#D4AF37]/20 dark:border-[#D4AF37]/40 dark:text-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-[#1A1A1A] bg-white border-[#D4AF37]/30 text-[#8B6F1F] hover:bg-[#D4AF37] hover:text-white"
              aria-label="WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.55 2 2.08 6.47 2.08 11.95c0 1.75.46 3.46 1.33 4.97L2 22l5.22-1.37a9.84 9.84 0 0 0 4.7 1.2h.01c5.48 0 9.95-4.47 9.95-9.95a9.83 9.83 0 0 0-2.83-6.97Zm-7.02 15.1h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.2 8.2 0 0 1-1.27-4.42c0-4.55 3.7-8.25 8.26-8.25a8.2 8.2 0 0 1 5.82 2.41 8.2 8.2 0 0 1 2.41 5.82c0 4.56-3.7 8.26-8.25 8.26Z" />
              </svg>
            </a>

            {/* Mobile Menu - Mobile Only */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden w-10 h-10 rounded-full grid place-items-center ml-1 dark:bg-white dark:text-[#1A1A1A] bg-[#1A1A1A] text-white transition-colors"
              aria-label="Open menu"
            >
              <MenuDotsBold className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <CartDrawer />
      <MobileMenu />
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}