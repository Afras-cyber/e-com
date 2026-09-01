"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpBold,
  ArrowRightBold,
  ShieldCheckBold,
  UploadTrack2Bold,
  DollarBold,
  ChatLineBold,
} from "solar-icon-set";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="mx-auto w-full max-w-360 px-4 sm:px-5 md:px-8 py-6 sm:py-8 md:py-14">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-2.5 pl-1 pr-3 sm:pr-4 py-1 sm:py-1.5 rounded-full border w-fit bg-white dark:bg-[#1A1A1A] border-[#E8E8EA] dark:border-[#2A2A2A] shadow-sm hover:shadow-md transition-shadow duration-200">
              <span className="w-6 sm:w-7 h-6 sm:h-7 rounded-full grid place-items-center bg-linear-to-br from-[#D4AF37] via-[#B9975B] to-[#C5A880] shrink-0">
                <span className="w-2 h-2 rounded-full bg-white"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#1A1A1A] dark:text-[#E8E8E8]">
                EST. 2026 • AUTHENTIC BRANDED
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-4 sm:mt-6 md:mt-8 font-serif font-extrabold leading-[0.95] sm:leading-[0.92] md:leading-[0.86] tracking-tight text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-[#1A1A1A] dark:text-[#F5F5F5]">
              <span className="block">LEGACY</span>
              <span className="block font-serif italic font-medium tracking-tight text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-[#6B6B6B] dark:text-[#A8A9AD] -mt-0.5 sm:-mt-1 md:-mt-2">
                in every
              </span>
              <span className="block bg-linear-to-br from-[#D4AF37] via-[#B9975B] to-[#C5A880] bg-clip-text text-transparent pb-1 md:pb-2">
                STEP.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 sm:mt-6 md:mt-8 max-w-md text-xs sm:text-sm md:text-base leading-relaxed text-[#6B6B6B] dark:text-[#A8A9AD]">
              Curated authentic branded shoes. No checkout hassle — simply{" "}
              <span className="font-semibold text-[#1A1A1A] dark:text-[#E8E8E8]">
                WhatsApp us
              </span>{" "}
              and we handle your size, price &amp; island-wide delivery.
            </p>

            {/* Trust Badges */}
            <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#E8E8EA] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[10px] sm:text-xs text-[#6B6B6B] dark:text-[#A8A9AD] hover:border-[#D4AF37] dark:hover:border-[#D4AF37]/50 transition-colors duration-200">
                <ShieldCheckBold className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#B9975B] shrink-0" />
                Authentic Guarantee
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#E8E8EA] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[10px] sm:text-xs text-[#6B6B6B] dark:text-[#A8A9AD] hover:border-[#D4AF37] dark:hover:border-[#D4AF37]/50 transition-colors duration-200">
                <UploadTrack2Bold className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#B9975B] shrink-0" />
                Island-wide Delivery
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4">
            <Link href="/shop">
              <button className="h-10 sm:h-12 md:h-13 px-4 sm:px-6 md:px-8 rounded-full text-xs sm:text-sm md:text-sm font-semibold tracking-wide inline-flex items-center justify-center gap-2 md:gap-3 shadow-lg hover:shadow-xl bg-linear-to-br from-[#D4AF37] via-[#B9975B] to-[#C5A880] text-white hover:opacity-90 transition-all duration-200 whitespace-nowrap shrink-0">
                Shop Collection
                <span className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 rounded-full bg-white/90 text-[#8B6F1F] grid place-items-center shrink-0">
                  <ArrowUpBold className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
                </span>
              </button>
            </Link>
              <a
                href="https://wa.me/94771234567?text=Hi%20Legacy%20Shoes%2C%20I'd%20like%20to%20chat%20about%20your%20collection"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 sm:h-12 md:h-13 px-4 sm:px-6 md:px-7 rounded-full border text-xs sm:text-sm md:text-sm font-semibold tracking-wide inline-flex items-center justify-center gap-2 md:gap-2.5 border-[#D4AF37]/30 dark:border-[#D4AF37]/20 bg-white dark:bg-[#1A1A1A] hover:border-[#B9975B] dark:hover:border-[#B9975B] hover:bg-[#FAF9F6] dark:hover:bg-[#2A2A2A] transition-all duration-200 whitespace-nowrap text-[#1A1A1A] dark:text-[#E8E8E8]"
              >
                <ChatLineBold className="w-4 h-4 md:w-5 md:h-5 text-[#25D366] shrink-0" />
                Chat on WhatsApp
                <ArrowRightBold className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 opacity-60 shrink-0" />
              </a>
            </div>

            {/* Stats */}
            <div className="mt-8 sm:mt-10 md:mt-12 hidden md:flex items-center gap-6 md:gap-8 text-xs tracking-wider text-[#6B6B6B] dark:text-[#A8A9AD]">
              <span>• 200+ AUTHENTIC PAIRS</span>
              <span>• WHATSAPP ONLY • NO CARD NEEDED</span>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative h-125 md:h-145 lg:h-160 flex items-center justify-center overflow-hidden rounded-[32px] border bg-white dark:bg-[#1A1A1A] border-[#E8E8EA] dark:border-[#2A2A2A] shadow-[0_20px_80px_rgba(0,0,0,0.06)]">
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-[82%] md:w-120 aspect-square rounded-full bg-linear-to-br from-[#D4AF37]/20 via-[#E8E8EA] dark:via-[#2A2A2A] to-[#C5A880]/25" />
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-[78%] md:w-110 aspect-square rounded-full shadow-[inset_0_0_0_1px_rgba(212,175,55,0.12)] bg-linear-to-b from-[#FFFEFB] to-[#F5F0E6] dark:from-[#222222] dark:to-[#161616]" />
            </div>
            <div className="absolute top-1/2 left-1/2 w-[60%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/15 blur-[60px]" />

            <div className="relative z-10 w-[86%] md:w-[84%] max-w-130 h-[72%] md:h-[76%] animate-float drop-shadow-[0_30px_60px_rgba(0,0,0,0.22)]">
              <Image
                src="/homepage_shoe.png"
                alt="Aero Running Sneaker"
                fill
                priority
                sizes="(max-width: 768px) 86vw, 520px"
                className="object-contain object-center"
              />
            </div>

            <div className="absolute left-[5%] md:left-[8%] top-[14%] z-20 rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.10)] border px-4 py-3 flex items-center gap-3 bg-white dark:bg-[#1A1A1A] border-[#E8E8EA] dark:border-[#2A2A2A]">
              <div className="w-10 h-10 rounded-full grid place-items-center text-white bg-linear-to-br from-[#D4AF37] via-[#B9975B] to-[#C5A880]">
                <DollarBold className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[13px] font-sans font-bold leading-none text-[#1A1A1A] dark:text-[#F5F5F5]">
                  AERO MAX
                </div>
                <div className="text-[11px] mt-1 font-sans text-[#6B6B6B] dark:text-[#A8A9AD]">
                  Authentic • In stock
                </div>
              </div>
            </div>

            <div className="absolute right-[4%] md:right-[8%] bottom-[12%] z-20 bg-[#1A1A1A] text-white rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.25)] px-4 py-3 flex items-center gap-2.5 border border-white/10">
              <ChatLineBold className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div className="text-[10px] tracking-[0.14em] font-sans font-semibold uppercase">
                WhatsApp Ordering • No Card Needed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
