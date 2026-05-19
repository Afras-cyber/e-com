'use client';

import { useQuery } from '@tanstack/react-query';
import { IBanner } from '@/types/banner';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AltArrowLeftLinear, AltArrowRightLinear, RefreshLinear, ArrowRightLinear, StarsLinear } from "solar-icon-set";;
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
      <div className="w-full h-[85vh] min-h-[560px] flex items-center justify-center bg-muted/30 animate-pulse">
        <RefreshLinear className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    // Fallback hero — theme-aware with accent colors
    return (
      <div className="relative w-full h-[85vh] min-h-[560px] overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Ambient glow blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center items-start">
          {/* Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-6"
          >
            <StarsLinear className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs sm:text-sm font-bold text-white/80 tracking-widest uppercase">
              Premium Footwear &amp; Accessories
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-[clamp(5rem,10vw,9rem)] font-black mb-5 tracking-tighter text-white leading-[0.88] max-w-4xl"
          >
            ELEVATE
            <br />
            <span className="italic text-primary/80">EVERY</span>
            <br />
            STEP
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-xl text-white/50 mb-10 max-w-md leading-relaxed"
          >
            Discover authentic sneakers, luxury bags, and premium accessories from the world&apos;s top brands.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/shop">
              <Button
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-full font-black bg-white text-zinc-950 hover:bg-zinc-100 transition-all shadow-2xl hover:scale-105 active:scale-95 gap-2"
              >
                Shop Collection <ArrowRightLinear className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="ghost"
                className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-full font-black text-white hover:bg-white/10 border border-white/20 gap-2"
              >
                Our Story
              </Button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative w-full h-[85vh] min-h-[560px] max-h-[850px] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentBanner.image})` }}
          />
          {/* Layered Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-end sm:justify-center pb-28 sm:pb-0 items-start text-white">
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
                className="text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-xl text-white/70 leading-relaxed"
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
                  <Button
                    size="lg"
                    className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-full font-bold bg-white text-zinc-950 hover:bg-zinc-100 transition-all shadow-xl hover:scale-105 active:scale-95 gap-2"
                  >
                    {currentBanner.buttonText || 'Shop Now'} <ArrowRightLinear className="w-4 h-4 sm:w-5 sm:h-5" />
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
            aria-label="Previous slide"
          >
            <AltArrowLeftLinear className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            aria-label="Next slide"
          >
            <AltArrowRightLinear className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Pill Indicators */}
          <div className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
