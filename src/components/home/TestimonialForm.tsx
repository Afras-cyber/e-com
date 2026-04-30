'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestimonialForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    customerName: '',
    review: '',
    rating: 5,
    productName: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/testimonials/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-background border rounded-3xl p-6 md:p-8 max-w-xl w-full mx-auto shadow-2xl relative">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-6">Your review has been submitted and is pending approval.</p>
            <Button onClick={onClose} variant="outline">Close</Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-2xl font-bold mb-6">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name</label>
                  <Input 
                    placeholder="Alex Johnson" 
                    required 
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Bought (Optional)</label>
                  <Input 
                    placeholder="Air Jordan 1" 
                    value={formData.productName}
                    onChange={e => setFormData({...formData, productName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${star <= formData.rating ? 'fill-amber-500 text-amber-500' : 'text-muted'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Review</label>
                <Textarea 
                  placeholder="Tell us what you think about StepKicks..." 
                  className="min-h-[120px] resize-none"
                  required
                  value={formData.review}
                  onChange={e => setFormData({...formData, review: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="flex-1 gap-2"
                >
                  {status === 'loading' ? 'Submitting...' : (
                    <>
                      Submit Review <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
              {status === 'error' && (
                <p className="text-destructive text-sm text-center">Failed to submit. Please try again.</p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
