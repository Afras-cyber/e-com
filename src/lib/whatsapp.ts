export interface WhatsAppMessageConfig {
  productName: string;
  size: string;
  color: string;
  price: number;
  productSlug: string;
  siteUrl?: string;
  sellerPhone?: string;
}

export function buildWhatsAppURL(config: WhatsAppMessageConfig): string {
  const siteUrl = config.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stepkicks.lk';
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
  const siteUrl = config.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stepkicks.lk';
  const sellerPhone =
    config.sellerPhone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

  let message = `Hi! I'm interested in purchasing the following items:\n\n`;
  
  config.items.forEach((item, index) => {
    message += `${index + 1}. *${item.productName}*\n`;
    message += `   📏 Size: ${item.size}\n`;
    message += `   🎨 Color: ${item.color}\n`;
    message += `   📦 Qty: ${item.quantity}\n`;
    message += `   💰 Subtotal: LKR ${(item.price * item.quantity).toLocaleString()}\n\n`;
  });
  
  message += `*Total: LKR ${config.total.toLocaleString()}*\n\n`;
  message += `Please let me know about availability and payment details. Thank you!`;

  return `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
}
