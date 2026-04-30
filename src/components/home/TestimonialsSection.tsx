'use client';

import { useQuery } from '@tanstack/react-query';
import { ITestimonial } from '@/types/testimonial';
import { Loader2, Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

function fetchTestimonials() {
  return fetch('/api/testimonials?isFeatured=true').then((res) => res.json());
}

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<ITestimonial[]>({
    queryKey: ['featured-testimonials'],
    queryFn: fetchTestimonials,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our satisfied sneakerheads and luxury lovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, idx) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-card border p-6 rounded-2xl shadow-sm relative"
            >
              <Quote className="absolute top-6 right-6 text-muted/40 w-12 h-12" />
              
              <div className="flex items-center gap-1 mb-4 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-500' : 'fill-muted stroke-muted'}`} 
                  />
                ))}
              </div>
              
              <p className="text-card-foreground/90 mb-6 italic min-h-[80px]">
                "{testimonial.review}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {testimonial.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{testimonial.customerName}</h4>
                  {testimonial.productName && (
                    <p className="text-xs text-muted-foreground">Bought: {testimonial.productName}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
