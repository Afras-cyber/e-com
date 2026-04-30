import { ShieldCheck, Truck, Heart, Star, Sparkles, Zap } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/80" />
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6">
            REDESIGNING <span className="text-primary italic">LUXURY</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-2xl max-w-2xl mx-auto font-medium">
            Sri Lanka's premier destination for high-end sneakers and designer bags. 
            Curated by enthusiasts, for enthusiasts.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                Our Story
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                From a Passion Project to <span className="text-primary">Market Leader</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                StepKicks began in 2022 with a simple mission: to bridge the gap between global luxury fashion and the Sri Lankan market. What started as a small Instagram boutique has grown into a trusted ecosystem for collectors and fashion lovers alike.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that authentic luxury should be accessible, verified, and accompanied by exceptional service. That's why every product in our catalog undergoes a rigorous multi-point inspection process before it ever reaches our shop.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div>
                  <h4 className="text-4xl font-black text-primary">5k+</h4>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-1">Happy Clients</p>
                </div>
                <div>
                  <h4 className="text-4xl font-black text-primary">100%</h4>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-1">Authenticity Rate</p>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-accent opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
              <div className="relative aspect-square rounded-[3rem] bg-zinc-100 dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
                 <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700 font-bold text-xl p-12 text-center italic">
                    "Authenticity is the soul of luxury. We never compromise on that promise."
                 </div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 max-w-[240px]">
                <p className="text-sm font-medium italic text-zinc-500 dark:text-zinc-400">
                  "StepKicks isn't just a store; it's a culture. We're building a community of style-conscious individuals."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Aroos M.</p>
                    <p className="text-[10px] text-muted-foreground">Founder, StepKicks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Why Choose StepKicks?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've built our reputation on three core pillars that define everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Strict Authenticity",
                description: "Our multi-stage verification process ensures that every pair of sneakers and every luxury bag is 100% genuine. No exceptions.",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                icon: Zap,
                title: "Personalized Support",
                description: "Experience luxury service via WhatsApp. Our dedicated concierges help you find the right size and style for your needs.",
                color: "text-amber-500",
                bg: "bg-amber-500/10"
              },
              {
                icon: Truck,
                title: "Elite Fulfillment",
                description: "We treat your purchases with the utmost care. Premium packaging and secure, insured shipping are standard for every order.",
                color: "text-rose-500",
                bg: "bg-rose-500/10"
              }
            ].map((value, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className={`h-16 w-16 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mb-6`}>
                  <value.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-primary text-white">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-white rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Heart className="mx-auto h-16 w-16 mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
            Built by Collectors,<br />For Collectors.
          </h2>
          <p className="text-xl md:text-2xl text-primary-foreground/80 leading-relaxed mb-12">
            We understand the thrill of the hunt and the joy of unboxing something special. 
            That's why we're committed to delivering that experience to you, perfectly, every single time.
          </p>
          <div className="flex flex-wrap justify-center gap-12 grayscale brightness-200 opacity-50">
             {/* Brands could go here again or just some icons */}
             <Star size={40} />
             <Star size={40} />
             <Star size={40} />
             <Star size={40} />
             <Star size={40} />
          </div>
        </div>
      </section>
    </div>
  );
}
