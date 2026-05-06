'use client';

import { useUIStore } from '@/store/useUIStore';
import { useWishlist } from '@/store/useWishlist';
import { X, Search, Heart, ShoppingBag, Sparkles, Package, Footprints, Info, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { siteConfig } from '@/config/site';

export default function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { items: wishlistItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      closeMobileMenu();
    }
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Shop All', href: '/shop', icon: ShoppingBag },
    { label: 'Sneakers', href: '/shop?category=shoes', icon: Footprints },
    { label: 'Bags', href: '/shop?category=bags', icon: Package },
    { label: 'Track Order', href: '/track', icon: MapPin },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistItems.length },
    { label: 'About Us', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm md:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-[320px] bg-background shadow-2xl z-50 flex flex-col border-r md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <span className="text-xl font-black tracking-tighter uppercase">
                {siteConfig.name.slice(0, 4)}<span className="text-primary italic">{siteConfig.name.slice(4)}</span>
              </span>
              <Button variant="ghost" size="icon" onClick={closeMobileMenu} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="px-5 py-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-muted/50 border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-4 px-4 py-3.5 text-[15px] font-semibold hover:bg-muted/50 rounded-xl transition-colors active:bg-muted"
                  >
                    <link.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="flex-1">{link.label}</span>
                    {link.badge && link.badge > 0 ? (
                      <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </nav>
            </div>

            {/* WhatsApp CTA at bottom */}
            <div className="p-4 border-t bg-muted/10">
              <a 
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1da851] transition-colors active:scale-[0.98]"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
