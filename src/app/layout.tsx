import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "shoes",
    "footwear",
    "sneakers",
    "authentic shoes",
    "Sri Lanka",
    "Legacy Sports",
    "premium shoes",
    "online shoe store",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon & Branding */}
        <link rel="icon" href="/favicon.png" />
        <link
          rel="apple-touch-icon"
          href="/website_logo_light_mode.png"
          sizes="180x180"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google Fonts preload */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Momo+Trust+Sans:wght@200..800&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Momo+Trust+Sans:wght@200..800&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data - Organization & Local Business */}
        <StructuredData data={generateOrganizationSchema()} />
        <StructuredData data={generateLocalBusinessSchema()} />

        {/* Additional Meta Tags */}
        <meta name="application-name" content={siteConfig.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
        <meta name="theme-color" content="#000000" />

        {/* Canonical URL */}
        <link rel="canonical" href={siteConfig.url} />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
