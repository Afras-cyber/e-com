export interface WhatsAppMessageConfig {
  productName: string;
  size: string;
  color: string;
  price: number;
  productSlug: string;
  siteUrl?: string;
  sellerPhone?: string;
}

function getSiteUrl(overrideUrl?: string): string {
  // 1. Use explicit override if provided
  if (overrideUrl) return overrideUrl;

  // 2. In browser: use current origin (works in dev AND production)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 3. Server-side: use env variable, with a sensible fallback
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://stepkicks.lk';
}

export function buildWhatsAppURL(config: WhatsAppMessageConfig): string {
  const siteUrl = getSiteUrl(config.siteUrl);
  const sellerPhone =
    config.sellerPhone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

  const productLink = `${siteUrl}/shop/${config.productSlug}?size=${encodeURIComponent(
    config.size
  )}&color=${encodeURIComponent(config.color)}`;

  const message = `Hi! I'm interested in purchasing:

👟 *${config.productName}*
📏 Size: ${config.size}
🎨 Color: ${config.color}
💰 Price: LKR ${config.price.toLocaleString()}
🔗 Product Link: ${productLink}

Please let me know about availability and payment details. Thank you!`.trim();

  return `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
}

export interface WhatsAppCartConfig {
  items: Array<{
    productName: string;
    productSlug: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  siteUrl?: string;
  sellerPhone?: string;
}

export function buildWhatsAppCartURL(config: WhatsAppCartConfig): string {
  const siteUrl = getSiteUrl(config.siteUrl);
  const sellerPhone =
    config.sellerPhone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

  let message = `Hi! I'm interested in purchasing the following items:\n\n`;
  
  config.items.forEach((item, index) => {
    const itemLink = `${siteUrl}/shop/${item.productSlug}?size=${encodeURIComponent(
      item.size
    )}&color=${encodeURIComponent(item.color)}`;

    message += `${index + 1}. *${item.productName}*\n`;
    message += `   📏 Size: ${item.size}\n`;
    message += `   🎨 Color: ${item.color}\n`;
    message += `   📦 Qty: ${item.quantity}\n`;
    message += `   💰 Subtotal: LKR ${(item.price * item.quantity).toLocaleString()}\n`;
    message += `   🔗 Link: ${itemLink}\n\n`;
  });
  
  message += `*Total: LKR ${config.total.toLocaleString()}*\n\n`;
  message += `Please let me know about availability and payment details. Thank you!`;

  return `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
}
