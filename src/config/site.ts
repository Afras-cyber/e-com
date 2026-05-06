export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "StepKicks",
  shortName: "SK",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "StepKicks — Your destination for premium shoes and accessories. Authentic quality, delivered fast to your doorstep.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://stepkicks.lk",
  ogImage: "https://stepkicks.lk/og.jpg",
  contact: {
    email: process.env.NEXT_PUBLIC_SITE_EMAIL || "info@stepkicks.lk",
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94 77 675 6287",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94776756287",
    address:
      process.env.NEXT_PUBLIC_SHOP_ADDRESS ||
      "123, Galle Road, Colombo 03, Sri Lanka",
  },
  social: {
    instagram: "https://instagram.com/stepkicks",
    facebook: "https://facebook.com/stepkicks",
    tiktok: "https://tiktok.com/@stepkicks",
  },
  business: {
    currency: process.env.NEXT_PUBLIC_CURRENCY || "LKR",
    currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rs.",
    orderPrefix: process.env.NEXT_PUBLIC_ORDER_PREFIX || "STK",
  },
};

export type SiteConfig = typeof siteConfig;
