import { siteConfig } from "@/config/site";

export function formatPrice(amount: number, currency = siteConfig.business.currency): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calcDiscountPercent(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}
