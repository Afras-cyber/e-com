'use client';

import { useUIStore } from '@/store/useUIStore';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
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
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/shop' },
    { label: 'Track Order', href: '/track' },
    { label: 'Sneakers', href: '/shop?category=shoes' },
    { label: 'Bags', href: '/shop?category=bags' },
    { label: 'About Us', href: '/about' },
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
            className="fixed top-0 left-0 h-full w-full max-w-xs bg-background shadow-2xl z-50 flex flex-col border-r md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-xl font-black tracking-tight text-primary">StepKicks</span>
              <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 border-b">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-muted/50 border-none rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="p-3 text-lg font-medium hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t bg-muted/20 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} StepKicks.</p>
              <p>All rights reserved.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
