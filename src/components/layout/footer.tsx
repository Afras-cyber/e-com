import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 sm:pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand Column — full width on mobile */}
          <div className="col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter inline-block">
              STEP<span className="text-primary italic">KICKS</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Sri Lanka's premium destination for authentic sneakers and luxury bags. 
              Elevate your style with our curated collections.
            </p>
            {/* WhatsApp CTA */}
            <a 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+94776756287'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1da851] transition-colors"
            >
              <MessageCircle size={16} />
              Chat With Us
            </a>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 uppercase tracking-widest text-xs">Collections</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop?category=shoes" className="hover:text-white transition-colors">Sneakers</Link></li>
              <li><Link href="/shop?category=bags" className="hover:text-white transition-colors">Designer Bags</Link></li>
              <li><Link href="/shop?isOnSale=true" className="hover:text-white transition-colors text-primary font-medium">Flash Sale 🔥</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/admin/login" className="hover:text-white transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Contact Info — hidden on smallest mobile */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold mb-4 sm:mb-6 uppercase tracking-widest text-xs">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <span>123 Shoe Street, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <span>+94 77 675 6287</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <span>support@stepkicks.lk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] sm:text-xs uppercase tracking-widest">
          <p>© {currentYear} StepKicks LK. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
