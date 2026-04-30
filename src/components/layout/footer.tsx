import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Instagram, Facebook, Twitter } from '@/components/shared/BrandIcons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter">
              STEP<span className="text-primary italic">KICKS</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Sri Lanka's premium destination for authentic sneakers and luxury bags. 
              Elevate your style with our curated collections.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-primary hover:text-zinc-950 transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-primary hover:text-zinc-950 transition-all">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-primary hover:text-zinc-950 transition-all">
                <Twitter size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Collections</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/shop?category=shoes" className="hover:text-primary transition-colors">Sneakers</Link></li>
              <li><Link href="/shop?category=shoes&subcategory=heels" className="hover:text-primary transition-colors">Heels & Loafers</Link></li>
              <li><Link href="/shop?category=bags" className="hover:text-primary transition-colors">Designer Bags</Link></li>
              <li><Link href="/shop?isOnSale=true" className="hover:text-primary transition-colors text-primary font-medium">Flash Sale</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Customer Service</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>123 Shoe Street, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94 77 675 6287"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>support@stepkicks.lk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest">
          <p>© {currentYear} StepKicks LK. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
