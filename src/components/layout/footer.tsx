import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">StepKicks</h3>
            <p className="text-sm text-muted-foreground">
              Premium sneakers and luxury bags for every style. 
              Authentic products with unbeatable prices.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shop?category=shoes" className="hover:text-primary">Sneakers</Link></li>
              <li><Link href="/shop?category=shoes&subcategory=heels" className="hover:text-primary">Heels</Link></li>
              <li><Link href="/shop?category=bags" className="hover:text-primary">Bags</Link></li>
              <li><Link href="/shop?isOnSale=true" className="hover:text-primary text-accent">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@stepkicks.lk</li>
              <li>WhatsApp: {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</li>
              <li>Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StepKicks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
