export const siteConfig = {
  name: "StepKicks",
  shortName: "SK",
  description: "StepKicks — Your destination for premium shoes and accessories. Authentic quality, delivered fast to your doorstep.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://stepkicks.lk",
  ogImage: "https://stepkicks.lk/og.jpg",
  contact: {
    email: "info@stepkicks.lk",
    phone: "+94 77 675 6287",
    whatsapp: "94776756287", // Raw number for wa.me URLs
    address: "123, Galle Road, Colombo 03, Sri Lanka",
  },
  social: {
    instagram: "https://instagram.com/stepkicks",
    facebook: "https://facebook.com/stepkicks",
    tiktok: "https://tiktok.com/@stepkicks",
  },
  business: {
    currency: "LKR",
    currencySymbol: "Rs.",
    orderPrefix: "STK",
  }
};

export type SiteConfig = typeof siteConfig;
