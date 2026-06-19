import Link from "next/link";
import connectDB from "@/lib/db/mongoose";
import Category from "@/lib/db/models/Category";

/* ─── Accent glow colour per slot ─── */
const GLOWS = [
  { orb: "#7C3AED", border: "rgba(124,58,237,0.30)", glow: "rgba(124,58,237,0.18)" },
  { orb: "#F97316", border: "rgba(249,115,22,0.30)",  glow: "rgba(249,115,22,0.16)"  },
  { orb: "#10B981", border: "rgba(16,185,129,0.30)",  glow: "rgba(16,185,129,0.16)"  },
  { orb: "#EF4444", border: "rgba(239,68,68,0.30)",   glow: "rgba(239,68,68,0.16)"   },
  { orb: "#3B82F6", border: "rgba(59,130,246,0.30)",  glow: "rgba(59,130,246,0.16)"  },
  { orb: "#EC4899", border: "rgba(236,72,153,0.30)",  glow: "rgba(236,72,153,0.16)"  },
  { orb: "#F59E0B", border: "rgba(245,158,11,0.30)",  glow: "rgba(245,158,11,0.16)"  },
  { orb: "#14B8A6", border: "rgba(20,184,166,0.30)",  glow: "rgba(20,184,166,0.16)"  },
];

const FALLBACK = [
  { name: "Sneakers",      slug: "shoes",  description: "Premium kicks for every style" },
  { name: "Luxury Bags",   slug: "bags",   description: "Elegant bags for all occasions" },
  { name: "New Arrivals",  slug: "new",    description: "Latest trends just landed"     },
  { name: "Special Offers",slug: "sale",   description: "Unbeatable deals & discounts"  },
];

async function getCategories() {
  try {
    await connectDB();
    const cats = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return cats as unknown as {
      _id: string; name: string; slug: string; description?: string;
    }[];
  } catch {
    return [];
  }
}

export default async function CategorySection() {
  const dbCats = await getCategories();
  const cats   = dbCats.length > 0 ? dbCats : FALLBACK;

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 40%, rgba(124,58,237,0.07), transparent 60%), " +
            "radial-gradient(ellipse 55% 45% at 85% 65%, rgba(249,115,22,0.06), transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
                Collections
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
              Shop by{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-primary/70">
                  Category
                </span>
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none" aria-hidden>
                  <path d="M0,4 Q25,0 50,4 Q75,8 100,4 Q125,0 150,4 Q175,8 200,4"
                    stroke="url(#cu)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="cu" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.8" />
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
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 w-fit shrink-0"
          >
            View all
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* ── Cards: 2-col on mobile │ ≤4: fill row │ >4: 4-per-row wrap ── */}
        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-4">
          {cats.map((cat, i) => {
            const g = GLOWS[i % GLOWS.length];
            // Desktop sizing strategy:
            //  ≤ 4 cats → flex:1 so all cards equally share full row width
            //  > 4 cats → fixed 25% so exactly 4 per row, rest wrap naturally
            const desktopFlex = cats.length <= 4 ? "1 1 0" : "0 0 calc(25% - 12px)";
            const desktopMinW = cats.length <= 4 ? "120px"  : "calc(25% - 12px)";
            const desktopMaxW = cats.length <= 4 ? "none"   : "calc(25% - 12px)";
            return (
              <Link
                key={String(cat.slug)}
                href={`/shop?category=${cat.slug}`}
                className="group glass-card cat-card-fade cat-shimmer relative overflow-hidden rounded-2xl flex flex-col justify-between"
                style={{
                  minHeight: "130px",
                  flex: desktopFlex,
                  minWidth: desktopMinW,
                  maxWidth: desktopMaxW,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${g.border}`,
                  boxShadow: `0 4px 24px ${g.glow}, inset 0 1px 0 rgba(255,255,255,0.10)`,
                  ["--glow-hover" as string]: `0 16px 48px ${g.glow.replace("0.18","0.42").replace("0.16","0.38")}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                {/* Orb */}
                <div
                  className="absolute -top-8 -right-8 rounded-full blur-3xl pointer-events-none orb-float"
                  style={{
                    width: "120px", height: "120px",
                    background: g.orb,
                    opacity: 0.3,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />

                {/* Glass highlight edge */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 55%)" }}
                />

                {/* Content */}
                <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-between">

                  {/* Category name */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight leading-tight text-foreground">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  {cat.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-snug whitespace-normal">
                      {cat.description}
                    </p>
                  )}

                  {/* CTA */}
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                      style={{ color: g.orb }}
                    >
                      Shop now
                      <svg
                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 16 16" fill="none"
                      >
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
