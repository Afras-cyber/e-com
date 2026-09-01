# SEO Quick Reference Card

## 🚀 Quick Start

### Using SEO Utilities in a New Page

```typescript
import { Metadata } from "next";
import { generateSEOMetadata, truncateDescription } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Your Page Title",
  description: truncateDescription("Your page description here"),
  canonicalUrl: `${siteConfig.url}/your-page`,
  keywords: "keyword1, keyword2, keyword3",
  ogImage: `${siteConfig.url}/image.png`,
  type: "website", // or "article" or "product"
});
```

### Using Structured Data in a Component

```typescript
import { StructuredData } from "@/components/seo/StructuredData";
import { generateBreadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export default function MyComponent() {
  return (
    <>
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "My Page", url: `${siteConfig.url}/my-page` },
        ])}
      />
      {/* Rest of component */}
    </>
  );
}
```

## 📋 SEO Checklist for New Pages

- [ ] Add metadata export with `generateSEOMetadata()`
- [ ] Set title (50-60 characters)
- [ ] Add description (150-160 characters)
- [ ] Add 15-20 keywords
- [ ] Add canonical URL
- [ ] Add breadcrumb structured data
- [ ] Add Open Graph image (1200x630)
- [ ] Test with Google Rich Results Test

## 🏷️ Meta Tags Quick Reference

### Title Format
```
Primary Keyword | Secondary | Brand Name
(Max 60 chars)
```

### Description Format
```
Brief compelling description with main keyword. Include 
call-to-action or unique value proposition. (150-160 chars)
```

### Keywords Format
```
primary1, primary2, secondary1, secondary2, ..., long-tail-phrase-1, long-tail-phrase-2
(15-20 keywords, comma-separated)
```

## 🔗 Useful URLs

### Google Tools
- Google Search Console: https://search.google.com/search-console
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev/
- Schema Tester: https://validator.schema.org/

### Bing Tools
- Bing Webmaster Tools: https://www.bing.com/webmasters/

### Third-party Tools
- SEMrush: https://www.semrush.com/
- Ahrefs: https://ahrefs.com/
- Moz: https://moz.com/

## 📊 SEO Metrics to Track

| Metric | Tool | Frequency |
|--------|------|-----------|
| Organic Traffic | Google Analytics | Daily |
| Keyword Rankings | GSC / Rank Tracker | Weekly |
| Impressions & CTR | Google Search Console | Daily |
| Crawl Errors | Google Search Console | Weekly |
| Core Web Vitals | PageSpeed Insights | Monthly |
| Backlinks | Ahrefs / SEMrush | Monthly |

## 🎯 Keyword Research Guide

### Primary Keywords (Head Terms)
- High volume, high competition
- Shorter (1-2 words)
- Example: "shoes", "sneakers"

### Secondary Keywords (Mid-Tail)
- Medium volume, medium competition
- 2-3 words
- Example: "buy shoes online"

### Long-Tail Keywords
- Lower volume, lower competition
- 3+ words, conversational
- Example: "buy authentic premium shoes online Sri Lanka"

## 📸 Image Optimization

### Open Graph Image Requirements
- **Dimensions:** 1200x630 pixels
- **Format:** JPG or PNG
- **Size:** < 5MB
- **Location:** Use absolute URLs (https://)

### Files in Public Folder
```
website_logo_light_mode.png   → Light theme logo
website_logo_dark_mode.png    → Dark theme logo
homepage_shoe.png             → Homepage/Product fallback
favicon.png                   → Browser tab icon
site.webmanifest             → PWA manifest
```

## 🔄 Update Workflow

### When Adding a New Product
1. Set `name` and `slug` with keywords
2. Add `seoDescription` (max 160 chars)
3. Add high-quality images
4. Set `brand`, `category`, `subcategory`
5. Set `isAvailable: true`
6. Deploy - sitemap auto-updates

### When Changing Site Info
1. Update `src/config/site.ts`
2. Run `npm run build` to verify
3. Test metadata on all pages
4. Update Google Search Console settings
5. Deploy to production

### When Adding New Pages
1. Create page file
2. Export metadata with `generateSEOMetadata()`
3. Add breadcrumb schema
4. Add canonical URL
5. Test in Rich Results Test
6. Deploy and verify in GSC

## 🐛 Common Issues & Solutions

### Metadata Not Appearing
- Clear browser cache
- Check page exports metadata
- Verify Next.js rebuild
- Check console for TypeScript errors

### Schema Not Validating
- Use Google Structured Data Validator
- Check JSON syntax (quotes, commas)
- Verify all required fields
- Check console for render errors

### Sitemap Not Including Products
- Verify `isAvailable: true` on products
- Check database connection
- Rebuild project (`npm run build`)
- Check /sitemap.xml endpoint

### Images Not Showing in OG
- Use absolute URLs (https://...)
- Verify image file exists
- Check dimensions (1200x630)
- Test with Facebook Debugger

## 💡 Pro Tips

### Title Tips
- Put main keyword first
- Keep under 60 characters
- Make it descriptive, not misleading
- Avoid keyword stuffing

### Description Tips
- Answer user's search intent
- Include 1-2 keywords naturally
- Add compelling hook/CTA
- Keep 150-160 characters

### Keyword Tips
- Use long-tail keywords (less competition)
- Target user intent, not just volume
- Mix informational + commercial keywords
- Avoid stuffing (use naturally in content)

### Link Tips
- Use descriptive anchor text
- Link internally to related pages
- Keep external links relevant
- Open external links in new tab

## 📞 Support Resources

- Docs: `SEO_IMPLEMENTATION.md`
- Checklist: `SEO_CHECKLIST.md`
- Architecture: `SEO_ARCHITECTURE.md`
- Summary: `SEO_SUMMARY.md`

---

**Need Help?**
- Check documentation files
- Test with Google tools
- Review examples in pages
- Check console errors

**Quick Links:**
- Home: `src/app/(public)/page.tsx`
- Shop: `src/app/(public)/shop/page.tsx`  
- Product: `src/app/(public)/shop/[slug]/page.tsx`
- Track: `src/app/(public)/track/layout.tsx`
