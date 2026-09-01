import { Metadata } from "next";
import { generateSEOMetadata, truncateDescription, generateBreadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = generateSEOMetadata({
  title: "Track Your Order",
  description: truncateDescription(
    "Track your order status in real-time. Enter your order number to see shipping updates, delivery status, and estimated arrival time."
  ),
  ogImage: `${siteConfig.url}/website_logo_dark_mode.png`,
  ogTitle: "Order Tracking",
  ogDescription: "Track your order status and delivery updates.",
  canonicalUrl: `${siteConfig.url}/track`,
  keywords: "track order, order status, shipping tracking, delivery status, order updates",
  author: siteConfig.name,
  type: "website",
});

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Track Order", url: `${siteConfig.url}/track` },
        ])}
      />
      {children}
    </>
  );
}
