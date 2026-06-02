import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { db, seoMeta } from "@adventure/database";
import ToasterProvider from "@/components/ToasterProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seoData = await db.select().from(seoMeta).limit(1);
    
    if (seoData && seoData[0]) {
      const s = seoData[0];
      const version = s.updatedAt ? new Date(s.updatedAt).getTime() : Date.now();
      const favicon = s.faviconUrl || "/favicon.ico";
      
      return {
        title: "IO Travel - Admin Dashboard",
        description: "Panel Kontrol Konten & Manajemen Reservasi Wisata IO Travel.",
        icons: {
          icon: favicon.includes("?") ? `${favicon}&v=${version}` : `${favicon}?v=${version}`,
        }
      };
    }
  } catch (err) {
    console.error("Failed to fetch SEO metadata for admin:", err);
  }

  return {
    title: "IO Travel - Admin Dashboard",
    description: "Panel Kontrol Konten & Manajemen Reservasi Wisata IO Travel.",
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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  );
}
