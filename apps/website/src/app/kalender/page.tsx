import { Metadata } from "next";
import { getLandingData } from "../../lib/data";
import CalendarClient from "../kalender/CalendarClient";

export async function generateMetadata(): Promise<Metadata> {
  const landingData = await getLandingData();
  const siteSeo = landingData.seo;
  const company = landingData.company;
  const brandName = company?.name || "Villa Situ Cileunca";

  const title = `Kalender Ketersediaan - ${brandName}`;
  const description = `Lihat kalender ketersediaan jadwal ${brandName} secara real-time. Temukan hari kosong untuk merencanakan liburan Anda.`;
  const version = siteSeo?.updatedAt ? new Date(siteSeo.updatedAt).getTime() : Date.now();
  const favicon = siteSeo?.faviconUrl || "/favicon.ico";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: siteSeo?.ogImage ? [{ url: siteSeo.ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: siteSeo?.ogImage ? [siteSeo.ogImage] : [],
    },
    icons: {
      icon: favicon.includes("?") ? `${favicon}&v=${version}` : `${favicon}?v=${version}`,
    }
  };
}

export default async function KalenderPage() {
  const landingData = await getLandingData();

  return (
    <CalendarClient
      seo={landingData.seo}
      company={landingData.company}
    />
  );
}
