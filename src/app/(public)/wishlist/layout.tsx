import { Metadata } from "next";
import { generateSEOMetadata, truncateDescription, generateBreadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = generateSEOMetadata({
  title: `My Wishlist | ${siteConfig.name}`,
  description: truncateDescription(
    "View and manage your saved shoes, sneakers, and favorites at Legacy Sports. Ready to order with island-wide delivery in Sri Lanka."
  ),
  ogImage: `${siteConfig.url}/homepage_shoe.png`,
  ogTitle: `My Wishlist - ${siteConfig.name}`,
  ogDescription: "Keep track of your favorite sneakers and footwear.",
  canonicalUrl: `${siteConfig.url}/wishlist`,
  keywords: "wishlist, saved shoes, favorite sneakers, footwear wishlist, Sri Lanka shoes",
  author: siteConfig.name,
  type: "website",
});

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Wishlist", url: `${siteConfig.url}/wishlist` },
        ])}
      />
      {children}
    </>
  );
}
