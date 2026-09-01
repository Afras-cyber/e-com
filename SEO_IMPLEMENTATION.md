# SEO Implementation Guide

This document outlines the comprehensive SEO implementation for Legacy Shoes website.

## Overview

The website includes enterprise-grade SEO optimization across all key pages:

### 1. **Root Layout (`src/app/layout.tsx`)**
   - Comprehensive metadata with keywords and robots directives
   - Open Graph and Twitter Card tags
   - Google Site Verification support
   - Organization structured data (JSON-LD)
   - Local Business structured data (JSON-LD)

### 2. **Home Page (`src/app/(public)/page.tsx`)**
   - Optimized title and description
   - Product-focused keywords
   - Breadcrumb navigation with structured data
   - Open Graph for social media sharing
   - Homepage shoe image for rich previews

### 3. **Shop Page (`src/app/(public)/shop/page.tsx`)**
   - Dynamic SEO for product collections
   - Breadcrumb navigation
   - Schema markup for better search visibility
   - Filter-friendly URLs (category, brand, price, etc.)

### 4. **Product Detail Page (`src/app/(public)/shop/[slug]/page.tsx`)**
   - Comprehensive product schema markup (JSON-LD)
   - Product pricing, availability, and rating
   - Dynamic breadcrumb navigation
   - Open Graph with product images
   - Unique metadata per product

### 5. **Order Tracking Page (`src/app/(public)/track/page.tsx`)**
   - Breadcrumb structured data
   - Tracking-specific meta tags
   - Layout file (`src/app/(public)/track/layout.tsx`) for metadata

## Files Created

### SEO Utilities
- `src/lib/seo.ts` - Centralized SEO metadata generation functions
  - `generateSEOMetadata()` - Main metadata generator
  - `generateOrganizationSchema()` - Organization schema
  - `generateProductSchema()` - Product schema
  - `generateBreadcrumbSchema()` - Breadcrumb schema
  - `generateLocalBusinessSchema()` - Local business schema
  - `generateFAQSchema()` - FAQ schema
  - `getSEOTitle()` - Consistent title formatting
  - `truncateDescription()` - Optimal description length

### Components
- `src/components/seo/StructuredData.tsx` - JSON-LD renderer component

### Website Files
- `public/site.webmanifest` - PWA manifest with app metadata
- `src/app/robots.ts` - Robots.txt configuration
- `src/app/sitemap.ts` - XML sitemap generation

## Key SEO Features

### 1. **Structured Data (JSON-LD)**
   - Product schema for rich snippets
   - Organization schema for knowledge panel
   - Local business schema for local search
   - Breadcrumb schema for navigation breadcrumbs
   - FAQ schema (ready to use)

### 2. **Meta Tags**
   - Comprehensive title and description on all pages
   - Open Graph tags for social media sharing
   - Twitter Card tags for Twitter optimization
   - Canonical URLs to avoid duplicate content
   - Viewport configuration for mobile responsiveness

### 3. **Robots & Sitemap**
   - Robots.txt for search engine crawling rules
   - Dynamic sitemap.xml with all products
   - Last modified dates for cache invalidation
   - Change frequency and priority hints

### 4. **Images**
   - Logo images in public folder:
     - `website_logo_dark_mode.png` - For dark mode
     - `website_logo_light_mode.png` - For light mode
     - `homepage_shoe.png` - Homepage/fallback image
   - All images referenced in Open Graph tags
   - Mobile touch icon support

## Best Practices Implemented

### 1. **Meta Tags**
   - Titles: Descriptive, include keywords, 50-60 characters
   - Descriptions: 150-160 characters, include call-to-action
   - Keywords: Relevant, comma-separated
   - Robots: index, follow (allow crawling)

### 2. **Structured Data**
   - Product schema with pricing and availability
   - Breadcrumbs for better navigation UX
   - Organization schema for brand authority
   - Rating schema for social proof

### 3. **URLs**
   - Canonical URLs to prevent duplicate content
   - Readable slugs for products
   - Proper URL parameters for filters
   - HTTPS enforced

### 4. **Performance**
   - Preconnect to external resources (Google Fonts)
   - Manifest for PWA capabilities
   - Image optimization through Next.js Image component

## Environment Variables

To fully utilize all SEO features, add these to your `.env.local`:

```
NEXT_PUBLIC_SITE_NAME=Legacy Shoes
NEXT_PUBLIC_SITE_DESCRIPTION=Your destination for premium shoes and accessories
NEXT_PUBLIC_SITE_URL=https://legacyshoes.lk
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_google_verification_code_here
```

## Verification Steps

### 1. Google Search Console
1. Go to Google Search Console
2. Add your domain
3. Verify using the method provided (HTML tag, DNS record, etc.)
4. Upload sitemap.xml manually or it will be auto-discovered
5. Monitor crawl errors and search performance

### 2. Bing Webmaster Tools
1. Add your domain
2. Verify ownership
3. Monitor crawl stats and keyword data

### 3. Rich Results Test
1. Go to Google Rich Results Test
2. Enter your product page URLs
3. Verify product schema shows correctly

### 4. Mobile Friendly Test
1. Go to Google Mobile-Friendly Test
2. Test your pages for mobile optimization

## Monitoring

### Key Metrics to Track
- Click-Through Rate (CTR) in Google Search Console
- Impressions and Rankings
- Crawl Stats (pages crawled, errors)
- Core Web Vitals
- Organic traffic from Google Analytics

### Tools
- Google Search Console - Free
- Google Analytics 4 - Free
- Bing Webmaster Tools - Free
- SEMrush, Ahrefs, Moz - Paid alternatives

## Maintenance

### Regular Tasks
1. Update product schema when prices or availability change
2. Monitor 404 errors and fix broken links
3. Review keyword rankings monthly
4. Update sitemaps when adding new products
5. Check for crawl errors weekly

### Content Updates
- Add fresh content regularly
- Update product descriptions with relevant keywords
- Create blog posts for link building
- Update metadata for trending keywords

## Future Enhancements

1. **Schema Markup**
   - Add NewsArticle schema for blog posts
   - Implement Review schema when customer reviews are added
   - Add VideoObject schema for product videos

2. **Content**
   - Create FAQ pages with FAQ schema
   - Add blog section for content marketing
   - Implement internal linking strategy

3. **Performance**
   - Implement Core Web Vitals optimization
   - Add image lazy loading
   - Optimize JavaScript bundle size

4. **Analytics**
   - Set up Google Analytics 4 events
   - Track user behavior and conversions
   - Monitor keyword performance

## Support

For questions about SEO implementation or to add new features:
1. Review the SEO utilities in `src/lib/seo.ts`
2. Check component usage in page files
3. Update `.env.local` with new configuration values
