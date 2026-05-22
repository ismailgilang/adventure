import * as serverless from '@neondatabase/serverless';
import * as neonHttp from 'drizzle-orm/neon-http';
import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

// Helper to safely extract exports from CommonJS or ESM imports in edge bundlers
const getExport = (module: any, key: string) => {
  if (!module) return undefined;
  if (module[key] !== undefined) return module[key];
  if (module.default && module.default[key] !== undefined) return module.default[key];
  return undefined;
};

const neon = getExport(serverless, 'neon');
const drizzle = getExport(neonHttp, 'drizzle');

// ==========================================
// Schema (inline, edge-safe — no CJS interop)
// ==========================================

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  status: text('status').default('DRAFT').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tourPackages = pgTable('tour_packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  duration: text('duration').notNull(),
  imageUrl: text('image_url'),
  status: text('status').default('DRAFT').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingCode: text('booking_code').unique().notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  packageId: uuid('package_id').notNull(),
  packageName: text('package_name').notNull(),
  totalGuests: integer('total_guests').notNull(),
  totalPrice: integer('total_price').notNull(),
  bookingDate: text('booking_date').notNull(),
  status: text('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const landingHero = pgTable('landing_hero', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  buttonText: text('button_text').notNull(),
  imageUrl: text('image_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const landingAbout = pgTable('landing_about', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  description: text('description').notNull(),
  statsGuests: text('stats_guests').notNull(),
  statsDestinations: text('stats_destinations').notNull(),
  statsGuides: text('stats_guides').notNull(),
  imageUrl: text('image_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const landingTeam = pgTable('landing_team', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  imageUrl: text('image_url'),
  instagramUrl: text('instagram_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const landingTestimonials = pgTable('landing_testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  review: text('review').notNull(),
  rating: integer('rating').default(5),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const landingFeatures = pgTable('landing_features', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const landingCta = pgTable('landing_cta', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  buttonText: text('button_text').notNull(),
  buttonUrl: text('button_url').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const seoMeta = pgTable('seo_meta', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  keywords: text('keywords'),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  ogTitle: text('og_title'),
  ogDescription: text('og_description'),
  ogImage: text('og_image'),
  twitterCard: text('twitter_card').default('summary_large_image'),
  canonicalUrl: text('canonical_url'),
  robots: text('robots').default('index, follow'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const companyProfile = pgTable('company_profile', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  tagline: text('tagline'),
  description: text('description').notNull(),
  address: text('address').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  whatsapp: text('whatsapp'),
  mapsUrl: text('maps_url'),
  vision: text('vision'),
  mission: text('mission'),
  history: text('description_history'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const gallery = pgTable('gallery', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  category: text('category').default('GENERAL').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type DBArticle = typeof articles.$inferSelect;

// ==========================================
// DB factory — creates a fresh connection per request
// Safe for Cloudflare Edge Runtime (no global state)
// ==========================================

export function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined");
  }
  
  const sql = neon(url);
  return drizzle(sql, { 
    schema: {
      articles,
      tourPackages,
      bookings,
      landingHero,
      landingAbout,
      landingTeam,
      landingTestimonials,
      landingFeatures,
      landingCta,
      seoMeta,
      companyProfile,
      gallery
    } 
  });
}
