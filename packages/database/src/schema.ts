import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

// ==========================================
// 1. TABEL ARTIKEL (BLOG)
// ==========================================
export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  status: text('status').default('DRAFT').notNull(), // 'DRAFT' | 'PUBLISHED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DBArticle = typeof articles.$inferSelect;
export type NewDBArticle = typeof articles.$inferInsert;

// ==========================================
// 2. TABEL USER (ADMIN AUTHENTICATION)
// ==========================================
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').default('ADMIN').notNull(), // 'ADMIN' | 'SUPERADMIN'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DBUser = typeof users.$inferSelect;
export type NewDBUser = typeof users.$inferInsert;

// ==========================================
// 3. TABEL PAKET WISATA (TOUR PACKAGES)
// ==========================================
export const tourPackages = pgTable('tour_packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  price: integer('price').notNull(),
  duration: text('duration').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  category: text('category').default('wisata').notNull(),
  status: text('status').default('DRAFT').notNull(), // 'DRAFT' | 'PUBLISHED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DBTourPackage = typeof tourPackages.$inferSelect;
export type NewDBTourPackage = typeof tourPackages.$inferInsert;

// ==========================================
// 4. TABEL RESERVASI / BOOKING
// ==========================================
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingCode: text('booking_code').unique().notNull(),
  packageName: text('package_name').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  bookingDate: text('booking_date').notNull(),
  totalGuests: integer('total_guests').notNull(),
  totalPrice: integer('total_price').notNull(),
  namaPemesan2: text('nama_pemesan2'),
  packageId: uuid('package_id'),
  villaId: uuid('villa_id'),
  paymentProof: text('payment_proof'),
  status: text('status').default('booking').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DBBooking = typeof bookings.$inferSelect;
export type NewDBBooking = typeof bookings.$inferInsert;

// ==========================================
// 5. TABEL LANDING: HERO SECTION
// ==========================================
export const landingHero = pgTable('landing_hero', {
  id: text('id').primaryKey(), // Default: 'hero_content'
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  buttonText: text('button_text').notNull(),
  imageUrl: text('image_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DBLandingHero = typeof landingHero.$inferSelect;
export type NewDBLandingHero = typeof landingHero.$inferInsert;

// ==========================================
// 6. TABEL LANDING: ABOUT US SECTION
// ==========================================
export const landingAbout = pgTable('landing_about', {
  id: text('id').primaryKey(), // Default: 'about_content'
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  description: text('description').notNull(),
  statsGuests: text('stats_guests').notNull(),
  statsDestinations: text('stats_destinations').notNull(),
  statsGuides: text('stats_guides').notNull(),
  imageUrl: text('image_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DBLandingAbout = typeof landingAbout.$inferSelect;
export type NewDBLandingAbout = typeof landingAbout.$inferInsert;

// ==========================================
// 7. TABEL LANDING: TEAM SECTION (LIST)
// ==========================================
export const landingTeam = pgTable('landing_team', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  imageUrl: text('image_url'),
  instagramUrl: text('instagram_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type DBLandingTeam = typeof landingTeam.$inferSelect;
export type NewDBLandingTeam = typeof landingTeam.$inferInsert;

// ==========================================
// 8. TABEL LANDING: TESTIMONIALS SECTION (LIST)
// ==========================================
export const landingTestimonials = pgTable('landing_testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  review: text('review').notNull(),
  rating: integer('rating').default(5).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type DBLandingTestimonial = typeof landingTestimonials.$inferSelect;
export type NewDBLandingTestimonial = typeof landingTestimonials.$inferInsert;

// ==========================================
// 9. TABEL LANDING: FEATURES (WHY CHOOSE US LIST)
// ==========================================
export const landingFeatures = pgTable('landing_features', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(), // Menyimpan nama icon / class SVG
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type DBLandingFeature = typeof landingFeatures.$inferSelect;
export type NewDBLandingFeature = typeof landingFeatures.$inferInsert;

// ==========================================
// 10. TABEL LANDING: CTA BOTTOM SECTION
// ==========================================
export const landingCta = pgTable('landing_cta', {
  id: text('id').primaryKey(), // Default: 'cta_content'
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  buttonText: text('button_text').notNull(),
  buttonUrl: text('button_url').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DBLandingCta = typeof landingCta.$inferSelect;
export type NewDBLandingCta = typeof landingCta.$inferInsert;

// ==========================================
// 11. TABEL SEO & BRANDING CONFIGURATION
// ==========================================
export const seoMeta = pgTable('seo_meta', {
  id: text('id').primaryKey(), // Default: 'seo_config'
  title: text('title').notNull(),
  description: text('description').notNull(),
  keywords: text('keywords').notNull(),
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

export type DBSeoMeta = typeof seoMeta.$inferSelect;
export type NewDBSeoMeta = typeof seoMeta.$inferInsert;

// ==========================================
// 12. TABEL PROFILE PERUSAHAAN (COMPANY PROFILE)
// ==========================================
export const companyProfile = pgTable('company_profile', {
  id: text('id').primaryKey(), // Default: 'company_config'
  name: text('name'),
  tagline: text('tagline'),
  description: text('description'),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  whatsapp: text('whatsapp'),
  mapsUrl: text('maps_url'),
  vision: text('vision'),
  mission: text('mission'), // Disimpan sebagai JSON atau text panjang
  history: text('description_history'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type DBCompanyProfile = typeof companyProfile.$inferSelect;
export type NewDBCompanyProfile = typeof companyProfile.$inferInsert;

// ==========================================
// 13. TABEL GALERI (GALLERY)
// ==========================================
export const gallery = pgTable('gallery', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  category: text('category').default('GENERAL').notNull(), // 'TOUR' | 'TEAM' | 'GENERAL'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type DBGallery = typeof gallery.$inferSelect;
export type NewDBGallery = typeof gallery.$inferInsert;

// ==========================================
// 14. TABEL LANDING: KATA KATA HARI INI
// ==========================================
export const landingQuotes = pgTable('landing_quotes', {
  id: text('id').primaryKey(), // Default: 'quotes_content'
  title: text('title').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DBLandingQuotes = typeof landingQuotes.$inferSelect;
export type NewDBLandingQuotes = typeof landingQuotes.$inferInsert;
