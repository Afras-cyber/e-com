'use client';

import { useQuery } from '@tanstack/react-query';
import { ITestimonial } from '@/types/testimonial';
import { RefreshLinear, StarLinear, DialogLinear, ChatSquareLinear } from "solar-icon-set";;
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TestimonialForm from './TestimonialForm';

function fetchTestimonials() {
  return fetch('/api/testimonials?isFeatured=true').then((res) => res.json());
}

export default function TestimonialsSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: testimonials, isLoading } = useQuery<ITestimonial[]>({
    queryKey: ['featured-testimonials'],
    queryFn: fetchTestimonials,
  });

  if (isLoading) {
    return (
      <section className="py-20 sm:py-28 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-48">
          <RefreshLinear className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28 bg-muted/40 dark:bg-zinc-900/40 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-primary mb-3">
            Social Proof
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-4 leading-tight">
            What Our{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Customers
            </span>{" "}
            Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-base sm:text-lg leading-relaxed">
            Don&apos;t just take our word for it. Hear from our satisfied sneakerheads and luxury lovers.
          </p>
          <Button
            onClick={() => setIsFormOpen(true)}
            variant="outline"
            className="rounded-full px-8 py-5 font-bold border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all gap-2 shadow-sm"
          >
            <ChatSquareLinear className="w-4 h-4" />
            Share Your Experience
          </Button>
        </div>

        {/* Testimonial Cards */}
        {testimonials && testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {testimonials.slice(0, 3).map((testimonial, idx) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative bg-background dark:bg-zinc-800/60 border border-border dark:border-zinc-700/60 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* DialogLinear Icon */}
                <DialogLinear className="absolute top-5 right-5 sm:top-7 sm:right-7 text-border dark:text-zinc-700 w-8 h-8 sm:w-10 sm:h-10 group-hover:text-primary/20 transition-colors" />

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarLinear
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-muted text-muted stroke-muted-foreground/30'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs font-bold text-muted-foreground">
                    {testimonial.rating}.0
                  </span>
                </div>

                {/* Review */}
                <p className="text-foreground/80 dark:text-zinc-300 mb-6 leading-relaxed text-sm sm:text-base min-h-[80px] italic">
                  &ldquo;{testimonial.review}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border dark:border-zinc-700/60">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-sm shrink-0">
                    {testimonial.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {testimonial.customerName}
                    </h4>
                    {testimonial.productName && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Bought: {testimonial.productName}
                      </p>
                    )}
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Verified
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Testimonial Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              className="relative z-10 w-full"
            >
              <TestimonialForm onClose={() => setIsFormOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
