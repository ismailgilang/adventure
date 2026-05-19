"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.landingCta = exports.landingFeatures = exports.landingTestimonials = exports.landingTeam = exports.landingAbout = exports.landingHero = exports.bookings = exports.tourPackages = exports.users = exports.articles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// ==========================================
// 1. TABEL ARTIKEL (BLOG)
// ==========================================
exports.articles = (0, pg_core_1.pgTable)('articles', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    slug: (0, pg_core_1.text)('slug').unique().notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    imageUrl: (0, pg_core_1.text)('image_url'),
    status: (0, pg_core_1.text)('status').default('DRAFT').notNull(), // 'DRAFT' | 'PUBLISHED'
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ==========================================
// 2. TABEL USER (ADMIN AUTHENTICATION)
// ==========================================
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    username: (0, pg_core_1.text)('username').unique().notNull(),
    password: (0, pg_core_1.text)('password').notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    role: (0, pg_core_1.text)('role').default('ADMIN').notNull(), // 'ADMIN' | 'SUPERADMIN'
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ==========================================
// 3. TABEL PAKET WISATA (TOUR PACKAGES)
// ==========================================
exports.tourPackages = (0, pg_core_1.pgTable)('tour_packages', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    slug: (0, pg_core_1.text)('slug').unique().notNull(),
    price: (0, pg_core_1.integer)('price').notNull(),
    duration: (0, pg_core_1.text)('duration').notNull(),
    description: (0, pg_core_1.text)('description'),
    imageUrl: (0, pg_core_1.text)('image_url'),
    status: (0, pg_core_1.text)('status').default('DRAFT').notNull(), // 'DRAFT' | 'PUBLISHED'
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ==========================================
// 4. TABEL RESERVASI / BOOKING
// ==========================================
exports.bookings = (0, pg_core_1.pgTable)('bookings', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    bookingCode: (0, pg_core_1.text)('booking_code').unique().notNull(),
    packageName: (0, pg_core_1.text)('package_name').notNull(),
    customerName: (0, pg_core_1.text)('customer_name').notNull(),
    customerEmail: (0, pg_core_1.text)('customer_email').notNull(),
    customerPhone: (0, pg_core_1.text)('customer_phone').notNull(),
    bookingDate: (0, pg_core_1.text)('booking_date').notNull(),
    totalGuests: (0, pg_core_1.integer)('total_guests').notNull(),
    totalPrice: (0, pg_core_1.integer)('total_price').notNull(),
    status: (0, pg_core_1.text)('status').default('PENDING').notNull(), // 'PENDING' | 'CONFIRMED' | 'CANCELLED'
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ==========================================
// 5. TABEL LANDING: HERO SECTION
// ==========================================
exports.landingHero = (0, pg_core_1.pgTable)('landing_hero', {
    id: (0, pg_core_1.text)('id').primaryKey(), // Default: 'hero_content'
    title: (0, pg_core_1.text)('title').notNull(),
    subtitle: (0, pg_core_1.text)('subtitle').notNull(),
    buttonText: (0, pg_core_1.text)('button_text').notNull(),
    imageUrl: (0, pg_core_1.text)('image_url'),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ==========================================
// 6. TABEL LANDING: ABOUT US SECTION
// ==========================================
exports.landingAbout = (0, pg_core_1.pgTable)('landing_about', {
    id: (0, pg_core_1.text)('id').primaryKey(), // Default: 'about_content'
    title: (0, pg_core_1.text)('title').notNull(),
    subtitle: (0, pg_core_1.text)('subtitle').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    statsGuests: (0, pg_core_1.text)('stats_guests').notNull(),
    statsDestinations: (0, pg_core_1.text)('stats_destinations').notNull(),
    statsGuides: (0, pg_core_1.text)('stats_guides').notNull(),
    imageUrl: (0, pg_core_1.text)('image_url'),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ==========================================
// 7. TABEL LANDING: TEAM SECTION (LIST)
// ==========================================
exports.landingTeam = (0, pg_core_1.pgTable)('landing_team', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    role: (0, pg_core_1.text)('role').notNull(),
    imageUrl: (0, pg_core_1.text)('image_url'),
    instagramUrl: (0, pg_core_1.text)('instagram_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ==========================================
// 8. TABEL LANDING: TESTIMONIALS SECTION (LIST)
// ==========================================
exports.landingTestimonials = (0, pg_core_1.pgTable)('landing_testimonials', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    role: (0, pg_core_1.text)('role').notNull(),
    review: (0, pg_core_1.text)('review').notNull(),
    rating: (0, pg_core_1.integer)('rating').default(5).notNull(),
    imageUrl: (0, pg_core_1.text)('image_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ==========================================
// 9. TABEL LANDING: FEATURES (WHY CHOOSE US LIST)
// ==========================================
exports.landingFeatures = (0, pg_core_1.pgTable)('landing_features', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(), // Menyimpan nama icon / class SVG
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ==========================================
// 10. TABEL LANDING: CTA BOTTOM SECTION
// ==========================================
exports.landingCta = (0, pg_core_1.pgTable)('landing_cta', {
    id: (0, pg_core_1.text)('id').primaryKey(), // Default: 'cta_content'
    title: (0, pg_core_1.text)('title').notNull(),
    subtitle: (0, pg_core_1.text)('subtitle').notNull(),
    buttonText: (0, pg_core_1.text)('button_text').notNull(),
    buttonUrl: (0, pg_core_1.text)('button_url').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
