export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Legacy Sports",
  shortName: "LS",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "LEGACY Shoes — Your destination for premium shoes and accessories. Authentic quality, delivered fast to your doorstep.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://legacyshoes.lk",
  ogImage:
    "https://crk-shoes.s3.ap-south-1.amazonaws.com/site/banner_legacy_sports.jpeg",
  ogImage2: "https://crk-shoes.s3.ap-south-1.amazonaws.com/site/ls.png",
  contact: {
    email: process.env.NEXT_PUBLIC_SITE_EMAIL || "[EMAIL_ADDRESS]",
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94 70 724 2232",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94707242232",
    address: process.env.NEXT_PUBLIC_SHOP_ADDRESS || "Mawanella, Sri Lanka",
  },
  social: {
    instagram: "https://www.instagram.com/legacy_sports.lk/?hl=en",
    facebook: "https://www.facebook.com/Legacysports.lk",
    // tiktok: "https://tiktok.com/@stepkicks",
  },
  business: {
    currency: process.env.NEXT_PUBLIC_CURRENCY || "LKR",
    currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rs.",
    orderPrefix: process.env.NEXT_PUBLIC_ORDER_PREFIX || "LS",
  },
};

export type SiteConfig = typeof siteConfig;
