import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createDb, seoMeta } from "../lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const db = createDb();
    const seoData = await db.select().from(seoMeta).limit(1);
    
    if (seoData && seoData[0]) {
      const s = seoData[0];
      return {
        title: s.title,
        description: s.description,
        keywords: s.keywords,
        alternates: {
          canonical: s.canonicalUrl || undefined,
        },
        robots: s.robots || "index, follow",
        openGraph: {
          title: s.ogTitle || s.title,
          description: s.ogDescription || s.description,
          images: s.ogImage ? [{ url: s.ogImage }] : [],
          type: "website",
        },
        twitter: {
          card: (s.twitterCard as any) || "summary_large_image",
          title: s.ogTitle || s.title,
          description: s.ogDescription || s.description,
          images: s.ogImage ? [s.ogImage] : [],
        },
        icons: {
          icon: s.faviconUrl || "/favicon.ico",
        }
      };
    }
  } catch (err) {
    console.error("Failed to fetch SEO metadata:", err);
  }

  // Fallback metadata
  return {
    title: "IO Travel - Jelajahi Surga Nusantara",
    description: "Temukan keajaiban alam tersembunyi, rasakan kehangatan budaya nusantara, dan ciptakan kenangan abadi dengan paket wisata eksklusif kami.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
