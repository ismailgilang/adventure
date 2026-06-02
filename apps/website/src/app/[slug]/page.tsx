import { Metadata } from "next";
import { getArticleBySlug, getArticles, getLandingData } from "../../lib/data";
import BlogDetailClient from "./BlogDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const landingData = await getLandingData();
  
  const siteSeo = landingData.seo;
  const company = landingData.company;
  const brandName = company?.name || "Villa Situ Cileunca";

  if (!article) {
    return {
      title: `Artikel Tidak Ditemukan - ${brandName}`,
    };
  }

  const title = `${article.title} - ${brandName}`;
  const description = article.content.replace(/<[^>]*>/g, '').substring(0, 160);
  const version = siteSeo?.updatedAt ? new Date(siteSeo.updatedAt).getTime() : Date.now();
  const favicon = siteSeo?.faviconUrl || "/favicon.ico";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: article.imageUrl ? [{ url: article.imageUrl }] : (siteSeo?.ogImage ? [{ url: siteSeo.ogImage }] : []),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.imageUrl ? [article.imageUrl] : (siteSeo?.ogImage ? [siteSeo.ogImage] : []),
    },
    icons: {
      icon: favicon.includes("?") ? `${favicon}&v=${version}` : `${favicon}?v=${version}`,
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch data in parallel
  const [article, landingData, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getLandingData(),
    getArticles()
  ]);

  const recommended = allArticles.filter((a: any) => a.slug !== slug).slice(0, 3);

  return (
    <BlogDetailClient 
      article={article} 
      recommended={recommended} 
      seo={landingData.seo} 
      company={landingData.company}
      slug={slug}
      packages={landingData.packages}
    />
  );
}
