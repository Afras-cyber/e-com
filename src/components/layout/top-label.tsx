export default function TopLabel() {
  return (
    <div className="relative z-50 w-full max-w-full overflow-hidden text-[10px] md:text-[11px] tracking-[0.22em] font-semibold uppercase py-[11px] px-4 flex justify-center items-center gap-4 md:gap-7 bg-[#1A1A1A] ">
      <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5E6C8] to-[#D4AF37] bg-clip-text text-transparent text-center truncate max-w-full">
        Legacy Sports • Authentic Branded Collection • WhatsApp Ordering
        Available
      </span>
      <span className="hidden md:inline-flex w-px h-3 bg-[#2A2A2A] shrink-0"></span>
      <span className="hidden md:inline text-[#A8A9AD] tracking-[0.18em] shrink-0">
        Island-wide Delivery • No online payment hassle
      </span>
    </div>
  );
}
