import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SEOMetadataParams {
  title: string;
  description: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  keywords?: string;
  author?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  productData?: {
    name: string;
    description: string;
    price: string;
    priceCurrency: string;
    image: string;
    rating?: number;
    reviewCount?: number;
    availability: string;
    brand: string;
    sku?: string;
    category?: string;
  };
}

/**
 * Generate comprehensive SEO metadata for pages
 */
export function generateSEOMetadata({
  title,
  description,
  ogImage,
  ogTitle,
  ogDescription,
  canonicalUrl,
  robots = "index, follow",
  keywords,
  author,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  productData,
}: SEOMetadataParams): Metadata {
  const baseUrl = siteConfig.url;
  const finalOgImage = ogImage || siteConfig.ogImage;
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalCanonical = canonicalUrl ? new URL(canonicalUrl, baseUrl).toString() : baseUrl;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    robots,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type: (type === "product" ? "website" : type) as any,
      title: finalOgTitle,
      description: finalOgDescription,
      url: finalCanonical,
      siteName: siteConfig.name,
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: finalOgTitle,
        },
      ],
      locale: "en_US",
      publishedTime,
      modifiedTime,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title: finalOgTitle,
      description: finalOgDescription,
      images: [finalOgImage],
    },
    alternates: {
      canonical: finalCanonical,
    },
  };

  return metadata;
}

/**
 * Generate JSON-LD structured data for organizations
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/website_logo_dark_mode.png`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.split(",")[0],
      addressCountry: "LK",
    },
    sameAs: Object.values(siteConfig.social || {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
    },
  };
}

/**
 * Generate JSON-LD structured data for a product
 */
export function generateProductSchema(data: SEOMetadataParams["productData"]) {
  if (!data) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    image: data.image,
    brand: {
      "@type": "Brand",
      name: data.brand,
    },
    offers: {
      "@type": "Offer",
      price: data.price,
      priceCurrency: data.priceCurrency,
      availability: `https://schema.org/${data.availability}`,
      url: siteConfig.url,
    },
    category: data.category,
    sku: data.sku,
    ...(data.rating && data.reviewCount && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: data.rating,
        reviewCount: data.reviewCount,
      },
    }),
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD structured data for local business
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    image: `${siteConfig.url}/website_logo_dark_mode.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressCountry: "LK",
    },
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    url: siteConfig.url,
    priceRange: "Rs. 1000 - Rs. 50000",
    areaServed: "LK",
    sameAs: Object.values(siteConfig.social || {}),
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Get SEO title with template
 */
export function getSEOTitle(title: string, suffix: boolean = true): string {
  if (suffix) {
    return `${title} | ${siteConfig.name}`;
  }
  return title;
}

/**
 * Truncate description to optimal length for SEO
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trimEnd() + "...";
}
