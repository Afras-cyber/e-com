"use client";

import { useState } from "react";
import { SendSquareLinear, CheckCircleLinear, LetterLinear } from "solar-icon-set";;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section className="py-20 sm:py-28 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Dark card — always dark for contrast */}
        <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-zinc-950 dark:bg-zinc-900 border border-white/5 p-8 sm:p-14 lg:p-20">

          {/* Ambient glow blobs */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center">

            {/* Icon badge */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
              <LetterLinear className="w-6 h-6 text-primary" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight text-white leading-tight">
              Join the{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                StepKicks
              </span>{" "}
              Club
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Be the first to know about new arrivals, limited edition drops, and exclusive WhatsApp-only deals.
            </p>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircleLinear className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-xl font-bold text-white">You&apos;re on the list!</p>
                  <p className="text-zinc-400">Check your inbox for a special welcome gift.</p>
                  <Button
                    variant="ghost"
                    className="mt-2 text-zinc-400 hover:text-white hover:bg-white/10"
                    onClick={() => setStatus("idle")}
                  >
                    Subscribe another email
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                >
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        "h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 rounded-2xl focus-visible:ring-primary focus-visible:border-primary/50",
                        status === "error" && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {status === "error" && (
                      <p className="text-destructive text-xs mt-2 ml-1 text-left">
                        Something went wrong. Please try again.
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-zinc-950 font-bold gap-2 text-base shadow-lg shadow-primary/25 shrink-0 disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      <>Subscribe <SendSquareLinear size={16} /></>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-8 text-xs text-zinc-600">
              By subscribing, you agree to our Terms of Service and Privacy Policy.{" "}
              We respect your privacy and will never spam you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
