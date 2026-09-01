"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseCircleLinear, RulerLinear } from "solar-icon-set";
import { Button } from "@/components/ui/button";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: string;
}

const SIZE_CHART = [
  { usMen: "6.0", usWomen: "7.5", uk: "5.5", eu: "38.5", cm: "24.0", inches: "9.4" },
  { usMen: "6.5", usWomen: "8.0", uk: "6.0", eu: "39.0", cm: "24.5", inches: "9.6" },
  { usMen: "7.0", usWomen: "8.5", uk: "6.0", eu: "40.0", cm: "25.0", inches: "9.8" },
  { usMen: "7.5", usWomen: "9.0", uk: "6.5", eu: "40.5", cm: "25.5", inches: "10.0" },
  { usMen: "8.0", usWomen: "9.5", uk: "7.0", eu: "41.0", cm: "26.0", inches: "10.2" },
  { usMen: "8.5", usWomen: "10.0", uk: "7.5", eu: "42.0", cm: "26.5", inches: "10.4" },
  { usMen: "9.0", usWomen: "10.5", uk: "8.0", eu: "42.5", cm: "27.0", inches: "10.6" },
  { usMen: "9.5", usWomen: "11.0", uk: "8.5", eu: "43.0", cm: "27.5", inches: "10.8" },
  { usMen: "10.0", usWomen: "11.5", uk: "9.0", eu: "44.0", cm: "28.0", inches: "11.0" },
  { usMen: "10.5", usWomen: "12.0", uk: "9.5", eu: "44.5", cm: "28.5", inches: "11.2" },
  { usMen: "11.0", usWomen: "12.5", uk: "10.0", eu: "45.0", cm: "29.0", inches: "11.4" },
  { usMen: "11.5", usWomen: "13.0", uk: "10.5", eu: "45.5", cm: "29.5", inches: "11.6" },
  { usMen: "12.0", usWomen: "13.5", uk: "11.0", eu: "46.0", cm: "30.0", inches: "11.8" },
];

export default function SizeGuideModal({
  isOpen,
  onClose,
  brand = "Standard",
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [gender, setGender] = useState<"men" | "women">("men");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-background rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/80 z-10 max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-border/60">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C39A4D]">
                    Fit & Sizing
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-tight text-foreground">
                  Footwear Size Guide
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Standard sizing conversions for {brand} and international brands.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
              >
                <CloseCircleLinear size={24} />
              </Button>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border/60 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setGender("men")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    gender === "men"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  US Men&apos;s
                </button>
                <button
                  type="button"
                  onClick={() => setGender("women")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    gender === "women"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  US Women&apos;s
                </button>
              </div>

              <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border/60 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    unit === "cm"
                      ? "bg-[#C39A4D] text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Centimeters (CM)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("in")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    unit === "in"
                      ? "bg-[#C39A4D] text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Inches
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1 my-2 rounded-2xl border border-border/60 bg-muted/10">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 sticky top-0 backdrop-blur-md border-b border-border/60">
                  <tr>
                    <th className="py-3 px-3 sm:px-4">US {gender === "men" ? "Men" : "Women"}</th>
                    <th className="py-3 px-3 sm:px-4">UK</th>
                    <th className="py-3 px-3 sm:px-4">EU</th>
                    <th className="py-3 px-3 sm:px-4 text-right">Length ({unit.toUpperCase()})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-medium">
                  {SIZE_CHART.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-foreground">
                        {gender === "men" ? row.usMen : row.usWomen}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-muted-foreground">{row.uk}</td>
                      <td className="py-2.5 px-3 sm:px-4 text-muted-foreground">{row.eu}</td>
                      <td className="py-2.5 px-3 sm:px-4 text-right font-mono font-semibold text-[#C39A4D]">
                        {unit === "cm" ? `${row.cm} cm` : `${row.inches}"`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Measuring Tip */}
            <div className="pt-3 border-t border-border/60 flex items-start gap-2.5 text-xs text-muted-foreground">
              <RulerLinear size={18} className="text-[#C39A4D] shrink-0 mt-0.5" />
              <p>
                <strong className="text-foreground">Pro-fit tip:</strong> For the most accurate fit, measure your foot from the tip of your longest toe to the back of your heel while wearing the socks you intend to use. If you are between sizes, we recommend sizing up half a size.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
