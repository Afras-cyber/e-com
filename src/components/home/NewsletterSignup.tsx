"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-zinc-950 text-white rounded-[2.5rem] p-8 md:p-16">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              Join the <span className="text-primary italic">StepKicks</span> Club
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Be the first to know about new arrivals, limited edition drops, and exclusive WhatsApp-only deals.
            </p>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 text-emerald-400"
                >
                  <CheckCircle2 size={48} />
                  <p className="text-xl font-bold text-white">You're on the list!</p>
                  <p className="text-zinc-400">Check your inbox for a special welcome gift.</p>
                  <Button 
                    variant="ghost" 
                    className="mt-4 text-zinc-400 hover:text-white"
                    onClick={() => setStatus("idle")}
                  >
                    Subscribe another email
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                >
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 rounded-2xl focus:ring-primary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-zinc-950 font-bold gap-2 text-lg shadow-lg shadow-primary/20"
                  >
                    {status === "loading" ? (
                      "Joining..."
                    ) : (
                      <>
                        Subscribe <Send size={18} />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-8 text-xs text-zinc-500">
              By subscribing, you agree to our Terms of Service and Privacy Policy. 
              We respect your privacy and will never spam you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
