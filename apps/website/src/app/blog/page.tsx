import { getArticles, getLandingData } from "@/lib/data";
import BlogClient from "./BlogClient";

export default async function BlogPage() {
  const [articles, landingData] = await Promise.all([
    getArticles(),
    getLandingData()
  ]);

  return (
    <BlogClient 
      articles={articles}
      seo={landingData.seo}
      company={landingData.company}
    />
  );
}
