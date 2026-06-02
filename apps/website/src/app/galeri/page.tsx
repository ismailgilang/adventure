import { getGallery, getLandingData } from "@/lib/data";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const [galleryItems, landingData] = await Promise.all([
    getGallery(),
    getLandingData()
  ]);

  return (
    <GalleryClient 
      galleryItems={galleryItems}
      seo={landingData.seo}
      company={landingData.company}
      packages={landingData.packages}
    />
  );
}
