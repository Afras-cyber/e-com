import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "AdsBot-Google",
        allow: ["/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
