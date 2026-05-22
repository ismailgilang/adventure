import { getLandingData } from "@/lib/data";
import PackagesClient from "./PackagesClient";

export default async function PackagesPage() {
  const data = await getLandingData();

  return (
    <PackagesClient 
      packages={data.packages}
      seo={data.seo}
      company={data.company}
    />
  );
}
