import { unstable_cache } from 'next/cache';
import { 
  createDb, 
  landingHero, 
  landingAbout, 
  landingTeam, 
  landingTestimonials, 
  landingFeatures, 
  landingCta, 
  tourPackages,
  seoMeta,
  companyProfile,
  articles,
  gallery
} from './db';
import { eq, desc } from 'drizzle-orm';

// Caching tags
export const TAGS = {
  HERO: 'hero',
  ABOUT: 'about',
  TEAM: 'team',
  TESTIMONIALS: 'testimonials',
  FEATURES: 'features',
  CTA: 'cta',
  PACKAGES: 'packages',
  SEO: 'seo',
  COMPANY: 'company',
  ARTICLES: 'articles',
  GALLERY: 'gallery',
};

export const getLandingData = unstable_cache(
  async () => {
    const db = createDb();
    
    const [heroData, aboutData, teamData, testimonialData, featureData, ctaData, packagesData, seoData, companyData] = await Promise.all([
      db.select().from(landingHero).limit(1),
      db.select().from(landingAbout).limit(1),
      db.select().from(landingTeam),
      db.select().from(landingTestimonials),
      db.select().from(landingFeatures),
      db.select().from(landingCta).limit(1),
      db.select().from(tourPackages).where(eq(tourPackages.status, 'PUBLISHED')).orderBy(desc(tourPackages.createdAt)),
      db.select().from(seoMeta).limit(1),
      db.select().from(companyProfile).limit(1),
    ]);

    return {
      hero: heroData[0] || null,
      about: aboutData[0] || null,
      team: teamData,
      testimonials: testimonialData,
      features: featureData,
      cta: ctaData[0] || null,
      packages: packagesData,
      seo: seoData[0] || null,
      company: companyData[0] || null,
    };
  },
  ['landing-page-data'],
  { tags: Object.values(TAGS) }
);

export const getArticles = unstable_cache(
  async () => {
    const db = createDb();
    return db.select().from(articles).where(eq(articles.status, 'PUBLISHED')).orderBy(desc(articles.createdAt));
  },
  ['articles-list'],
  { tags: [TAGS.ARTICLES] }
);

export const getArticleBySlug = unstable_cache(
  async (slug: string) => {
    const db = createDb();
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return result[0] || null;
  },
  ['article-detail'],
  { tags: [TAGS.ARTICLES] }
);

export const getPackageBySlug = unstable_cache(
  async (slug: string) => {
    const db = createDb();
    const result = await db.select().from(tourPackages).where(eq(tourPackages.slug, slug)).limit(1);
    return result[0] || null;
  },
  ['package-detail'],
  { tags: [TAGS.PACKAGES] }
);

export const getGallery = unstable_cache(
  async () => {
    const db = createDb();
    return db.select().from(gallery).orderBy(desc(gallery.createdAt));
  },
  ['gallery-list'],
  { tags: [TAGS.GALLERY] }
);
