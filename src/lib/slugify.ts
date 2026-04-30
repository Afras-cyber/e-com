export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spaces to hyphens
    .replace(/[^\w-]+/g, '')     // remove non-word chars
    .replace(/--+/g, '-')        // collapse double hyphens
    .replace(/^-+|-+$/g, '');    // trim leading/trailing hyphens
}
