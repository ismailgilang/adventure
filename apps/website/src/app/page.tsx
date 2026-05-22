import { getLandingData } from "@/lib/data";
import HomeClient from "./HomeClient";

export default async function Home() {
  const data = await getLandingData();

  return (
    <HomeClient 
      hero={data.hero}
      about={data.about}
      team={data.team}
      testimonials={data.testimonials}
      features={data.features}
      cta={data.cta}
      packages={data.packages}
      seo={data.seo}
      company={data.company}
    />
  );
}
