export function formatPrice(amount: number, currency = 'LKR'): string {
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
