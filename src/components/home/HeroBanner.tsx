'use client';

import { useQuery } from '@tanstack/react-query';
import { IBanner } from '@/types/banner';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function fetchBanners() {
  return fetch('/api/banners').then((res) => res.json());
}

export default function HeroBanner() {
  const { data: banners, isLoading } = useQuery<IBanner[]>({
    queryKey: ['hero-banners'],
    queryFn: fetchBanners,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] sm:h-[80vh] min-h-[500px] flex items-center justify-center bg-muted/20 animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    // Fallback hero when no banners exist
    return (
      <div className="relative w-full h-[70vh] sm:h-[80vh] min-h-[500px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start text-white">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3"
          >
            Premium Footwear & Accessories
          </motion.p>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-8xl font-black mb-4 tracking-tighter max-w-4xl leading-[0.9]"
          >
            ELEVATE YOUR
            <br />
            <span className="italic text-zinc-400">EVERY STEP</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-zinc-400 mb-8 max-w-lg leading-relaxed"
          >
            Discover authentic sneakers, luxury bags, and premium accessories from the world's top brands.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/shop">
              <Button size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-full font-black bg-white text-zinc-950 hover:bg-zinc-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 gap-2">
                Shop Collection <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] min-h-[500px] max-h-[800px] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${currentBanner.image})`,
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end sm:justify-center pb-24 sm:pb-0 items-start text-white">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-black mb-3 sm:mb-4 tracking-tight max-w-3xl leading-[1.05]"
            >
              {currentBanner.title}
            </motion.h1>
            {currentBanner.subtitle && (
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-xl text-gray-200/90 leading-relaxed"
              >
                {currentBanner.subtitle}
              </motion.p>
            )}
            {currentBanner.link && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link href={currentBanner.link}>
                  <Button size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-full font-bold bg-white text-zinc-950 hover:bg-zinc-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 gap-2">
                    {currentBanner.buttonText || 'Shop Now'} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          {/* Indicators — pill style */}
          <div className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
