# SEO Architecture Diagram

## Page Structure & SEO Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Root Layout (layout.tsx)                 │
│                                                               │
│  ├─ Metadata Export                                          │
│  │  ├─ Title Template                                        │
│  │  ├─ Keywords (20+)                                        │
│  │  ├─ Open Graph Tags                                       │
│  │  └─ Twitter Cards                                         │
│  │                                                            │
│  ├─ Head Elements                                            │
│  │  ├─ Favicon & Apple Touch Icon                            │
│  │  ├─ Preconnect (Google Fonts)                             │
│  │  ├─ Manifest Link                                         │
│  │  └─ StructuredData Components                             │
│  │     ├─ Organization Schema                                │
│  │     └─ Local Business Schema                              │
│  │                                                            │
│  └─ Body (Providers + Children)                              │
└─────────────────────────────────────────────────────────────┘
         │
         ├─────────────────┬─────────────────┬──────────────┐
         │                 │                 │              │
         ▼                 ▼                 ▼              ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐
    │ Home Page   │  │ Shop Page   │  │ Product     │  │ Track    │
    │             │  │             │  │ Detail Page │  │ Page     │
    ├─────────────┤  ├─────────────┤  ├─────────────┤  ├──────────┤
    │ Metadata    │  │ Metadata    │  │ Metadata    │  │ Layout   │
    │ • Title     │  │ • Title     │  │ • Title     │  │ • Meta   │
    │ • Desc      │  │ • Desc      │  │ • Desc      │  │ • Struct │
    │ • Keywords  │  │ • Keywords  │  │ • Keywords  │  │          │
    │ • OG Tags   │  │ • OG Tags   │  │ • OG Tags   │  │ Children │
    │             │  │             │  │             │  │ (Client) │
    │ Components  │  │ Components  │  │ Components  │  │          │
    │ • Breadcrumb│  │ • Breadcrumb│  │ • Breadcrumb│  │ Metadata │
    │ • Structure │  │ • Structure │  │ • Product   │  │ • Breadcrumb
    │ • Data      │  │ • Data      │  │   Schema    │  │ • Structure
    └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘
```

## SEO Utilities & Components

```
┌──────────────────────────────────────────────────────────────┐
│                    src/lib/seo.ts                            │
├──────────────────────────────────────────────────────────────┤
│ • generateSEOMetadata()          - Main metadata generator   │
│ • generateOrganizationSchema()   - Company info schema       │
│ • generateProductSchema()        - Product schema with price │
│ • generateBreadcrumbSchema()     - Navigation breadcrumbs    │
│ • generateLocalBusinessSchema()  - Local business info       │
│ • generateFAQSchema()            - FAQ schema template       │
│ • getSEOTitle()                  - Consistent titles         │
│ • truncateDescription()          - Optimal length (160 chars)│
└──────────────────────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│            src/components/seo/StructuredData.tsx             │
├──────────────────────────────────────────────────────────────┤
│ Renders JSON-LD structured data as <script> tags            │
│ ├─ Accepts data prop (Record<string, any> | null)          │
│ └─ Returns null if data is undefined/null                   │
└──────────────────────────────────────────────────────────────┘
```

## Website Configuration Files

```
┌───────────────────────────────────────────────────────────────────┐
│                  Search Engine Configuration                      │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐        ┌──────────────────────┐       │
│  │   /robots.txt        │        │   /sitemap.xml       │       │
│  ├──────────────────────┤        ├──────────────────────┤       │
│  │ User-agent: *        │        │ Generated dynamically │       │
│  │ Allow: /             │        │ ├─ All products      │       │
│  │ Disallow: /api/      │        │ ├─ Static pages      │       │
│  │ Disallow: /admin/    │        │ ├─ Last modified     │       │
│  │ Sitemap: sitemap.xml │        │ ├─ Change frequency  │       │
│  │                      │        │ └─ Priority          │       │
│  └──────────────────────┘        └──────────────────────┘       │
│                                                                   │
│  ┌──────────────────────┐        ┌──────────────────────┐       │
│  │  site.webmanifest    │        │  config/site.ts      │       │
│  ├──────────────────────┤        ├──────────────────────┤       │
│  │ App metadata         │        │ Site configuration   │       │
│  │ ├─ Name & description│        │ ├─ Site name         │       │
│  │ ├─ Theme colors      │        │ ├─ URL               │       │
│  │ ├─ Icons             │        │ ├─ Social media      │       │
│  │ └─ Shortcuts         │        │ └─ Contact info      │       │
│  └──────────────────────┘        └──────────────────────┘       │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Meta Tags Structure (Every Page)

```
<head>
  <!-- Basic Meta Tags -->
  <title>{Page Title} | Legacy Shoes</title>
  <meta name="description" content="{160 char description}">
  <meta name="keywords" content="{comma-separated keywords}">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph (Social Media) -->
  <meta property="og:type" content="website|article|product">
  <meta property="og:title" content="{Page Title}">
  <meta property="og:description" content="{Description}">
  <meta property="og:image" content="{1200x630 image}">
  <meta property="og:url" content="{Canonical URL}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{Page Title}">
  <meta name="twitter:description" content="{Description}">
  <meta name="twitter:image" content="{1200x630 image}">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="{Canonical URL}">
  
  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization|Product|BreadcrumbList|FAQPage",
      ...
    }
  </script>
</head>
```

## Product Schema Example

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nike Air Max 90",
  "description": "Classic air max sneaker...",
  "image": "https://example.com/shoe.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Nike"
  },
  "offers": {
    "@type": "Offer",
    "price": "8,500",
    "priceCurrency": "LKR",
    "availability": "https://schema.org/InStock",
    "url": "https://legacyshoes.lk/shop/nike-air-max-90"
  },
  "category": "Footwear",
  "sku": "PRODUCT_ID_123",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.5,
    "reviewCount": 10
  }
}
```

## Breadcrumb Schema Example

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://legacyshoes.lk"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Shop",
      "item": "https://legacyshoes.lk/shop"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Sneakers",
      "item": "https://legacyshoes.lk/shop?category=Sneakers"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Nike Air Max 90",
      "item": "https://legacyshoes.lk/shop/nike-air-max-90"
    }
  ]
}
```

## Images in Public Folder

```
public/
├── website_logo_light_mode.png    ← Light mode logo (PWA & manifest)
├── website_logo_dark_mode.png     ← Dark mode logo (OG tags)
├── homepage_shoe.png              ← Homepage hero image
├── favicon.png                    ← Browser tab icon
└── site.webmanifest              ← PWA manifest file
```

## SEO Data Flow

```
User visits page
    │
    ▼
Next.js renders page with metadata
    │
    ├──► generateSEOMetadata() builds meta tags
    │         │
    │         ├─ Title (50-60 chars)
    │         ├─ Description (150-160 chars)
    │         ├─ Keywords (15-20 terms)
    │         ├─ Open Graph tags
    │         └─ Twitter Card tags
    │
    ├──► StructuredData component renders JSON-LD
    │         │
    │         ├─ Organization schema
    │         ├─ Product schema (for products)
    │         └─ Breadcrumb schema
    │
    └──► Browser displays page with SEO enhancements
              │
              ├─ Search engines crawl & index
              ├─ Social media shows rich preview
              └─ Rich snippets in search results
```

## Keyword Targeting by Page

```
Home Page (/)
├─ Primary: premium shoes, authentic footwear
├─ Secondary: sneakers, shoes online Sri Lanka
└─ Long-tail: buy authentic premium shoes online

Shop Page (/shop)
├─ Primary: buy shoes online, shoe brands
├─ Secondary: premium sneakers, footwear store
└─ Long-tail: authentic shoes Sri Lanka fast delivery

Product Page (/shop/[slug])
├─ Primary: [Product Name] [Brand]
├─ Secondary: [Category], shoes, sneakers
└─ Long-tail: buy [Brand] [Product] shoes online Sri Lanka

Track Page (/track)
├─ Primary: track order, order status
├─ Secondary: shipping tracking, delivery
└─ Long-tail: real-time order tracking system
```

---

**Architecture Version:** 1.0  
**Last Updated:** 2026-09-01
