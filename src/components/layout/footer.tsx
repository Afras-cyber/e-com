import { siteConfig } from "@/config/site";
import Link from "next/link";
import { ShieldCheckLinear } from "solar-icon-set";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 pt-16 sm:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-baseline gap-2 group">
              <span className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                LEGACY
              </span>
              <span className="text-xs tracking-[0.25em] text-zinc-400 dark:text-zinc-500 font-sans uppercase">
                SPORTS
              </span>
            </Link>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm font-normal">
              The curated destination for authentic branded shoes in Sri Lanka. WhatsApp ordering, legacy quality.
            </p>

            <div>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-[#C29B53] via-[#B58D4B] to-[#9E7736] hover:brightness-105 active:scale-[0.98] shadow-lg shadow-[#B58D4B]/20 transition-all cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-current text-white shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.002 3.66 3.745-.985z" />
                </svg>
                <span>Order via WhatsApp</span>
              </a>

              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-3">
                {siteConfig.contact.phone} • 9am - 10pm daily
              </p>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-900 dark:text-zinc-100 mb-5">
              SHOP
            </h4>
            <ul className="space-y-3.5 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sort=newest"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* CONNECT Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-900 dark:text-zinc-100 mb-5">
              CONNECT
            </h4>
            <ul className="space-y-3.5 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              <li>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >

                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors block"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors block"
                >
                  TikTok
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors block"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* BOUTIQUE INFO Column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-900 dark:text-zinc-100 mb-5">
              SHOP INFO
            </h4>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              No card payment on site. All deals finalized on WhatsApp with size confirmation & delivery options.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-[#FAF9F5] dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-300 font-medium my-2 shadow-2xs">
              <ShieldCheckLinear className="w-4 h-4 text-[#C29B53] shrink-0" />
              <span>Authentic guarantee • Island-wide delivery</span>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200/70 dark:border-zinc-800/70 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          <p>
            © {currentYear} {siteConfig.name.toUpperCase()}. Crafted in Sri Lanka • Golden • Silver • Legacy.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Authentic Guarantee
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

