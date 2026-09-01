import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import connectDB from "@/lib/db/mongoose";
import Product from "@/lib/db/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Connect to database to fetch products
  try {
    await connectDB();
    const products = await Product.find({ isAvailable: true })
      .select("slug updatedAt")
      .lean()
      .limit(50000);

    const productEntries: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: new Date(product.updatedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [
      // Static pages
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/shop`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/track`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
      // Product pages
      ...productEntries,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return just static pages if database connection fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/shop`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/track`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
    ];
  }
}
