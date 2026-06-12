import { LetterLinear, PhoneLinear, MapPointLinear } from "solar-icon-set";
import { Instagram, Facebook } from "@/components/shared/BrandIcons";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/contact/ContactForm";

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
                      <PhoneLinear size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        PhoneLinear / WhatsApp
                      </h3>
                      <p className="text-muted-foreground">+94 77 675 6287</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mon-Sat: 9am - 8pm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <LetterLinear size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-muted-foreground">
                        crkshoes@gmail.com
                      </p>
                      {/* <p className="text-muted-foreground">orders@stepkicks.lk</p> */}
                    </div>
                  </div>

                  {/* <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <MapPointLinear size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Location</h3>
                      <p className="text-muted-foreground">
                        CRK Shoes Flagship Store
                        <br />
                       
                        <br />
                        Sri Lanka
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/c_r_k_shoes/?hl=en",
                        "_blank",
                      )
                    }
                  >
                    <Instagram size={20} />
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Facebook size={20} />
                  </Button> */}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Live Map */}
      <section className="h-[450px] w-full relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.81536311406!2d79.82118591953123!3d6.9218335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2594000000001%3A0x67530e16345d045d!2sColombo!5e0!3m2!1sen!2slk!4v1714500000000!5m2!1sen!2slk"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale dark:invert contrast-125"
        ></iframe>
      </section>
    </div>
  );
}
