import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Instagram, Facebook } from "@/components/shared/BrandIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products or your order? We're here to help. 
            Reach out to us via the form or through our social channels.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone / WhatsApp</h3>
                      <p className="text-muted-foreground">+94 77 675 6287</p>
                      <p className="text-xs text-muted-foreground mt-1">Mon-Sat: 9am - 8pm</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-muted-foreground">support@stepkicks.lk</p>
                      <p className="text-muted-foreground">orders@stepkicks.lk</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Location</h3>
                      <p className="text-muted-foreground">
                        StepKicks Flagship Store<br />
                        123 Shoe Street, Colombo 03<br />
                        Sri Lanka
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Instagram size={20} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Order Inquiry" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="How can we help you?" 
                    className="min-h-[150px] resize-none"
                  />
                </div>

                <Button className="w-full h-12 gap-2 text-lg">
                  <Send size={18} />
                  Send Message
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-zinc-200 dark:bg-zinc-800 w-full relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500 font-medium">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 mb-2 opacity-20" />
            <p>Interactive Map Integration Coming Soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}
