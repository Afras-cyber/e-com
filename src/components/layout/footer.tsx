import { PhoneLinear, LetterLinear, MapPointLinear, ChatLineLinear } from "solar-icon-set";;
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground/[0.03] dark:bg-zinc-950 border-t border-border text-foreground/60 dark:text-zinc-400 pt-16 sm:pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">

          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1 space-y-5">
            <Link
              href="/"
              className="text-2xl font-black text-foreground dark:text-white tracking-tighter inline-block"
            >
              {siteConfig.name.slice(0, 4)}
              <span className="text-primary italic">
                {siteConfig.name.slice(4)}
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-foreground/60 dark:text-zinc-400">
              {siteConfig.description}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border dark:border-zinc-800 flex items-center justify-center text-foreground/50 dark:text-zinc-500 hover:text-foreground dark:hover:text-white hover:border-foreground/30 dark:hover:border-zinc-600 transition-colors"
                aria-label="Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border dark:border-zinc-800 flex items-center justify-center text-foreground/50 dark:text-zinc-500 hover:text-foreground dark:hover:text-white hover:border-foreground/30 dark:hover:border-zinc-600 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border dark:border-zinc-800 flex items-center justify-center text-foreground/50 dark:text-zinc-500 hover:text-foreground dark:hover:text-white hover:border-foreground/30 dark:hover:border-zinc-600 transition-colors"
                aria-label="Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1da851] transition-colors shadow-lg shadow-[#25D366]/20"
            >
              <ChatLineLinear size={16} />
              Chat With Us
            </a>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-foreground dark:text-white font-bold mb-4 sm:mb-6 uppercase tracking-widest text-xs">
              Collections
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop?category=shoes" className="hover:text-foreground dark:hover:text-white transition-colors">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bags" className="hover:text-foreground dark:hover:text-white transition-colors">
                  Designer Bags
                </Link>
              </li>
              <li>
                <Link href="/shop?isOnSale=true" className="hover:text-foreground dark:hover:text-white transition-colors text-primary font-medium">
                  Flash Sale 🔥
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-foreground dark:hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-foreground dark:text-white font-bold mb-4 sm:mb-6 uppercase tracking-widest text-xs">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-foreground dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-foreground dark:hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-foreground dark:hover:text-white transition-colors">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-foreground dark:text-white font-bold mb-4 sm:mb-6 uppercase tracking-widest text-xs">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPointLinear size={16} className="text-primary shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneLinear size={16} className="text-primary shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <LetterLinear size={16} className="text-primary shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border dark:border-zinc-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] sm:text-xs uppercase tracking-widest">
          <p className="text-foreground/50 dark:text-zinc-500">
            © {currentYear} {siteConfig.name} LK. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground dark:hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground dark:hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
