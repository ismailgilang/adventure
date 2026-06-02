import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createDb, seoMeta, companyProfile } from "../lib/db";
import ToasterProvider from "@/components/ToasterProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const db = createDb();
    const seoData = await db.select().from(seoMeta).limit(1);
    const companyData = await db.select().from(companyProfile).limit(1);
    
    const company = companyData[0];
    const brandName = company?.name || "Villa Situ Cileunca";
    const defaultTitle = `${brandName} - Jelajahi Keindahan Alam`;

    if (seoData && seoData[0]) {
      const s = seoData[0];
      const version = s.updatedAt ? new Date(s.updatedAt).getTime() : Date.now();
      const favicon = s.faviconUrl || "/favicon.ico";
      
      return {
        title: s.title || defaultTitle,
        description: s.description,
        keywords: s.keywords,
        alternates: {
          canonical: s.canonicalUrl || undefined,
        },
        robots: s.robots || "index, follow",
        openGraph: {
          title: s.ogTitle || s.title || defaultTitle,
          description: s.ogDescription || s.description,
          images: s.ogImage ? [{ url: s.ogImage }] : [],
          type: "website",
        },
        twitter: {
          card: (s.twitterCard as any) || "summary_large_image",
          title: s.ogTitle || s.title || defaultTitle,
          description: s.ogDescription || s.description,
          images: s.ogImage ? [s.ogImage] : [],
        },
        icons: {
          icon: favicon.includes("?") ? `${favicon}&v=${version}` : `${favicon}?v=${version}`,
        }
      };
    }

    return {
      title: defaultTitle,
      description: "Temukan keajaiban alam tersembunyi, rasakan kehangatan budaya nusantara, dan ciptakan kenangan abadi dengan paket wisata eksklusif kami.",
      icons: {
        icon: "/favicon.ico",
      }
    };
  } catch (err) {
    console.error("Failed to fetch SEO metadata:", err);
  }

  return {
    title: "IO Travel - Jelajahi Surga Nusantara",
    description: "Temukan keajaiban alam tersembunyi, rasakan kehangatan budaya nusantara, dan ciptakan kenangan abadi dengan paket wisata eksklusif kami.",
    icons: {
      icon: "/favicon.ico",
    }
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
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  );
}
