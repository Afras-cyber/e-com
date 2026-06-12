export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "CKR Shoes",
  shortName: "SK",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "CKR Shoes — Your destination for premium shoes and accessories. Authentic quality, delivered fast to your doorstep.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ckrshoes.lk",
  ogImage: "https://ckrshoes.lk/og.jpg",
  contact: {
    email: process.env.NEXT_PUBLIC_SITE_EMAIL || "info@ckrshoes.lk",
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94 77 675 6287",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94776756287",
    address:
      process.env.NEXT_PUBLIC_SHOP_ADDRESS ||
      "123, Galle Road, Colombo 03, Sri Lanka",
  },
  social: {
    instagram: "https://www.instagram.com/c_r_k_shoes/?hl=en",
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
