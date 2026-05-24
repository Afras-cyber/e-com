import Link from "next/link";
import connectDB from "@/lib/db/mongoose";
import Category from "@/lib/db/models/Category";
import { ArrowRightLinear } from "solar-icon-set";

/* ─── Palette pool: each category gets a colour slot (cycles if more than pool) ─── */
const PALETTE = [
  {
    bg: "from-[#6C63FF] via-[#8B5CF6] to-[#A78BFA]",
    glow: "#7C3AED",
    accent: "#C4B5FD",
    pill: "bg-violet-400/20 text-violet-100",
    dot: "bg-violet-300",
  },
  {
    bg: "from-[#F97316] via-[#FB923C] to-[#FDBA74]",
    glow: "#EA580C",
    accent: "#FED7AA",
    pill: "bg-orange-400/20 text-orange-100",
    dot: "bg-orange-300",
  },
  {
    bg: "from-[#10B981] via-[#34D399] to-[#6EE7B7]",
    glow: "#059669",
    accent: "#A7F3D0",
    pill: "bg-emerald-400/20 text-emerald-100",
    dot: "bg-emerald-300",
  },
  {
    bg: "from-[#EF4444] via-[#F87171] to-[#FCA5A5]",
    glow: "#DC2626",
    accent: "#FECACA",
    pill: "bg-red-400/20 text-red-100",
    dot: "bg-red-300",
  },
  {
    bg: "from-[#3B82F6] via-[#60A5FA] to-[#93C5FD]",
    glow: "#2563EB",
    accent: "#BFDBFE",
    pill: "bg-blue-400/20 text-blue-100",
    dot: "bg-blue-300",
  },
  {
    bg: "from-[#EC4899] via-[#F472B6] to-[#FBCFE8]",
    glow: "#DB2777",
    accent: "#FCE7F3",
    pill: "bg-pink-400/20 text-pink-100",
    dot: "bg-pink-300",
  },
  {
    bg: "from-[#F59E0B] via-[#FBBF24] to-[#FDE68A]",
    glow: "#D97706",
    accent: "#FEF3C7",
    pill: "bg-amber-400/20 text-amber-100",
    dot: "bg-amber-300",
  },
  {
    bg: "from-[#14B8A6] via-[#2DD4BF] to-[#99F6E4]",
    glow: "#0D9488",
    accent: "#CCFBF1",
    pill: "bg-teal-400/20 text-teal-100",
    dot: "bg-teal-300",
  },
];

/* ─── Emoji fallback map by slug keyword ─── */
function getEmoji(name: string, slug: string): string {
  const key = (name + slug).toLowerCase();
  if (key.includes("shoe") || key.includes("sneaker") || key.includes("kick")) return "👟";
  if (key.includes("bag") || key.includes("purse")) return "👜";
  if (key.includes("sale") || key.includes("offer") || key.includes("deal")) return "🔥";
  if (key.includes("new") || key.includes("arrival") || key.includes("latest")) return "✨";
  if (key.includes("cloth") || key.includes("shirt") || key.includes("dress")) return "👗";
  if (key.includes("hat") || key.includes("cap")) return "🧢";
  if (key.includes("watch") || key.includes("accessory")) return "⌚";
  if (key.includes("sport") || key.includes("gym")) return "🏃";
  if (key.includes("kids") || key.includes("child")) return "🧒";
  return "🛍️";
}

/* ─── Fetch live categories (server-side) ─── */
async function getCategories() {
  try {
    await connectDB();
    const cats = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return cats as unknown as {
      _id: string;
      name: string;
      slug: string;
      description?: string;
      image?: string;
    }[];
  } catch {
    return [];
  }
}

/* ─── Static fallback shown when DB is empty ─── */
const FALLBACK = [
  { name: "Sneakers", slug: "shoes", description: "Premium kicks for every style" },
  { name: "Luxury Bags", slug: "bags", description: "Elegant bags for all occasions" },
  { name: "New Arrivals", slug: "new", description: "Latest trends just landed" },
  { name: "Special Offers", slug: "sale", description: "Unbeatable deals & discounts" },
];

export default async function CategorySection() {
  const dbCats = await getCategories();
  const cats = dbCats.length > 0 ? dbCats : FALLBACK;

  /* Split into hero (first) + rest */
  const [hero, ...rest] = cats;

  return (
    <section className="relative py-24 sm:py-32 px-4 overflow-hidden">

      {/* ── Ambient background orbs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.09] blur-3xl"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, #F97316, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 dark:bg-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
                Browse
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
              Shop by{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-primary/70">
                  Category
                </span>
                {/* Underline squiggle */}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M0,4 Q25,0 50,4 Q75,8 100,4 Q125,0 150,4 Q175,8 200,4"
                    stroke="url(#cat-underline)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="cat-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-sm leading-relaxed">
              Explore our curated collections — from everyday essentials to luxury finds.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border dark:border-zinc-700 bg-background/60 dark:bg-zinc-900/60 backdrop-blur-sm text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300 w-fit shrink-0"
          >
            View all products
            <ArrowRightLinear className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[150px] sm:auto-rows-[170px] lg:auto-rows-[180px]">
          {cats.map((cat, i) => {
            const isHero = i === 0;
            const palette = PALETTE[i % PALETTE.length];
            
            // For a perfect rectangle when there are exactly 4 items (1 hero, 3 small)
            const isLastOfFour = i === 3 && cats.length === 4;

            return (
              <div 
                key={String(cat.slug)} 
                className={
                  isHero 
                    ? "col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2" 
                    : isLastOfFour
                      ? "col-span-1 sm:col-span-2 lg:col-span-2"
                      : "col-span-1 row-span-1"
                }
              >
                {isHero ? (
                  <HeroCard cat={cat} palette={palette} idx={i} />
                ) : (
                  <SmallCard cat={cat} palette={palette} idx={i} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Hero Card ─────────────────────── */
function HeroCard({
  cat,
  palette,
  idx,
}: {
  cat: { name: string; slug: string; description?: string; image?: string };
  palette: (typeof PALETTE)[0];
  idx: number;
}) {
  const emoji = getEmoji(cat.name, cat.slug);
  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl h-full w-full shadow-2xl cursor-pointer block"
      style={{ boxShadow: `0 20px 60px -12px ${palette.glow}55` }}
    >
      {/* Gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${palette.bg} transition-all duration-700 group-hover:scale-105`}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 blur-2xl"
        style={{ background: palette.accent }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10 blur-2xl"
        style={{ background: "#000" }}
      />

      {/* Shine on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top badge */}
      <div className="relative z-10 p-6 sm:p-8 flex items-start justify-between">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-sm border border-white/20 ${palette.pill}`}
        >
          <span className={`w-1 h-1 rounded-full ${palette.dot}`} />
          Featured
        </div>
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
          <ArrowRightLinear className="w-4 h-4 sm:w-5 sm:h-5 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>

      {/* Big emoji */}
      <div className="relative z-10 px-6 sm:px-8 flex-1 flex items-center">
        <span
          className="text-7xl sm:text-9xl select-none drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 inline-block"
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))" }}
        >
          {emoji}
        </span>
      </div>

      {/* Bottom text */}
      <div className="relative z-10 p-6 sm:p-8">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-1.5">
          {cat.name}
        </h3>
        {cat.description && (
          <p className="text-sm sm:text-base text-white/70 leading-snug">
            {cat.description}
          </p>
        )}
        <div className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/90">
          <span>Shop now</span>
          <ArrowRightLinear className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────── Small Card ─────────────────────── */
function SmallCard({
  cat,
  palette,
  idx,
}: {
  cat: { name: string; slug: string; description?: string; image?: string };
  palette: (typeof PALETTE)[0];
  idx: number;
}) {
  const emoji = getEmoji(cat.name, cat.slug);
  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl h-full w-full shadow-xl cursor-pointer block"
      style={{ boxShadow: `0 12px 40px -10px ${palette.glow}44` }}
    >
      {/* Gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${palette.bg} transition-all duration-700 group-hover:scale-105`}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative blob */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-25 blur-2xl"
        style={{ background: palette.accent }}
      />

      {/* Shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col justify-between">
        {/* Top: emoji + arrow */}
        <div className="flex items-start justify-between">
          <span
            className="text-4xl sm:text-5xl select-none group-hover:scale-110 transition-transform duration-400 inline-block"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))" }}
          >
            {emoji}
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            <ArrowRightLinear className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </div>
        </div>

        {/* Bottom: text */}
        <div>
          <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight leading-tight">
            {cat.name}
          </h3>
          {cat.description && (
            <p className="mt-0.5 text-[11px] sm:text-xs text-white/65 leading-snug line-clamp-1">
              {cat.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
