export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Legacy Sports",
  shortName: "LS",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "LEGACY Sports — Your destination for premium shoes and accessories. Authentic quality, delivered fast to your doorstep.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://legacysports.lk",
  ogImage: "https://legacysports.lk/og.jpg",
  contact: {
    email: process.env.NEXT_PUBLIC_SITE_EMAIL || "[EMAIL_ADDRESS]",
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94 77 675 6287",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94776756287",
    address:
      process.env.NEXT_PUBLIC_SHOP_ADDRESS ||
      "123, Galle Road, Colombo 03, Sri Lanka",
  },
  social: {
    instagram: "https://www.instagram.com/legacy_sports_lanka/?hl=en",
    // facebook: "https://facebook.com/stepkicks",
    // tiktok: "https://tiktok.com/@stepkicks",
  },
  business: {
    currency: process.env.NEXT_PUBLIC_CURRENCY || "LKR",
    currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rs.",
    orderPrefix: process.env.NEXT_PUBLIC_ORDER_PREFIX || "STK",
  },
};

export type SiteConfig = typeof siteConfig;
