"use client";

import { ChatLineLinear } from "solar-icon-set";;
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { siteConfig } from "@/config/site";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappNumber = siteConfig.contact.whatsapp;
  const message = encodeURIComponent(`Hi ${siteConfig.name}! I'm interested in your products.`);

  useEffect(() => {
    // Show tooltip after 5 seconds to catch attention
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // Hide it after another 5 seconds
      setTimeout(() => setShowTooltip(false), 5000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-3 mb-2 max-w-[200px]"
          >
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Need help? Chat with us on WhatsApp! 💬
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${whatsappNumber.replace(/\+/g, "")}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-[#25D366]/40 transition-shadow"
      >
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:hidden" />
        <ChatLineLinear className="h-7 w-7" />
        
        {/* Active status indicator */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border-2 border-[#25D366]"></span>
        </span>
      </motion.a>
    </div>
  );
}
