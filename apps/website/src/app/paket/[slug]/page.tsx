import { Metadata } from "next";
import { getPackageBySlug, getLandingData } from "../../../lib/data";
import PackageDetailClient from "./PackageDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  const landingData = await getLandingData();
  
  const siteSeo = landingData.seo;
  const company = landingData.company;
  const brandName = company?.name || "IO Travel";

  if (!pkg) {
    return {
      title: `Paket Tidak Ditemukan - ${brandName}`,
    };
  }

  const title = `${pkg.name} - ${brandName}`;
  const description = pkg.description?.substring(0, 160) || "";
  const version = siteSeo?.updatedAt ? new Date(siteSeo.updatedAt).getTime() : Date.now();
  const favicon = siteSeo?.faviconUrl || "/favicon.ico";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: pkg.imageUrl ? [{ url: pkg.imageUrl }] : (siteSeo?.ogImage ? [{ url: siteSeo.ogImage }] : []),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: pkg.imageUrl ? [pkg.imageUrl] : (siteSeo?.ogImage ? [siteSeo.ogImage] : []),
    },
    icons: {
      icon: favicon.includes("?") ? `${favicon}&v=${version}` : `${favicon}?v=${version}`,
    }
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch data in parallel
  const [pkg, landingData] = await Promise.all([
    getPackageBySlug(slug),
    getLandingData()
  ]);

  const recommended = landingData.packages.filter((p: any) => p.slug !== slug).slice(0, 3);

  return (
    <PackageDetailClient 
      pkg={pkg} 
      recommended={recommended} 
      seo={landingData.seo} 
      company={landingData.company}
    />
  );
}
