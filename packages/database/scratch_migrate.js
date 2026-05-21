const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const connectionString = "postgresql://neondb_owner:npg_z3EFfln8uJgQ@ep-fragrant-bread-aohjazjq.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(connectionString);

async function main() {
  console.log("🚀 Starting database tables creation and seeding on Neon DB...");
  try {
    // 1. Create Articles Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "articles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" text NOT NULL,
        "slug" text NOT NULL,
        "content" text NOT NULL,
        "image_url" text,
        "status" text DEFAULT 'DRAFT' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "articles_slug_unique" UNIQUE("slug")
      );
    `);
    console.log("✅ Created 'articles' table.");

    // 2. Create Users Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "username" text NOT NULL,
        "password" text NOT NULL,
        "name" text NOT NULL,
        "role" text DEFAULT 'ADMIN' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_username_unique" UNIQUE("username")
      );
    `);
    console.log("✅ Created 'users' table.");

    // 3. Create Tour Packages Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "tour_packages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "slug" text NOT NULL,
        "price" integer NOT NULL,
        "duration" text NOT NULL,
        "description" text,
        "image_url" text,
        "status" text DEFAULT 'DRAFT' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "tour_packages_slug_unique" UNIQUE("slug")
      );
    `);
    console.log("✅ Created 'tour_packages' table.");

    // 4. Create Bookings Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "bookings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "booking_code" text NOT NULL,
        "package_name" text NOT NULL,
        "customer_name" text NOT NULL,
        "customer_email" text NOT NULL,
        "customer_phone" text NOT NULL,
        "booking_date" text NOT NULL,
        "total_guests" integer NOT NULL,
        "total_price" integer NOT NULL,
        "status" text DEFAULT 'PENDING' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "bookings_booking_code_unique" UNIQUE("booking_code")
      );
    `);
    console.log("✅ Created 'bookings' table.");

    // 5. Create Landing Hero Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "landing_hero" (
        "id" text PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "subtitle" text NOT NULL,
        "button_text" text NOT NULL,
        "image_url" text,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✅ Created 'landing_hero' table.");

    // 6. Create Landing About Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "landing_about" (
        "id" text PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "subtitle" text NOT NULL,
        "description" text NOT NULL,
        "stats_guests" text NOT NULL,
        "stats_destinations" text NOT NULL,
        "stats_guides" text NOT NULL,
        "image_url" text,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✅ Created 'landing_about' table.");

    // 7. Create Landing Team Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "landing_team" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "role" text NOT NULL,
        "image_url" text,
        "instagram_url" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✅ Created 'landing_team' table.");

    // 8. Create Landing Testimonials Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "landing_testimonials" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "role" text NOT NULL,
        "review" text NOT NULL,
        "rating" integer DEFAULT 5 NOT NULL,
        "image_url" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✅ Created 'landing_testimonials' table.");

    // 9. Create Landing Features Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "landing_features" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "icon" text NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✅ Created 'landing_features' table.");

    // 10. Create Landing CTA Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "landing_cta" (
        "id" text PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "subtitle" text NOT NULL,
        "button_text" text NOT NULL,
        "button_url" text NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✅ Created 'landing_cta' table.");

    // 11. Create SEO Meta Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "seo_meta" (
        "id" text PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "keywords" text NOT NULL,
        "logo_url" text,
        "favicon_url" text,
        "og_title" text,
        "og_description" text,
        "og_image" text,
        "twitter_card" text DEFAULT 'summary_large_image',
        "canonical_url" text,
        "robots" text DEFAULT 'index, follow',
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✅ Created 'seo_meta' table.");

    // =========================================================================
    // SEEDING DEFAULT DATA
    // =========================================================================
    console.log("\n🌱 Seeding default data to Neon DB...");

    // Seed default administrator
    const hashedPassword = await bcrypt.hash('password', 10);
    await sql.query(`DELETE FROM "users" WHERE "username" = 'admin'`);
    await sql.query(`
      INSERT INTO "users" ("username", "password", "name", "role")
      VALUES ('admin', '${hashedPassword}', 'Admin Utama IO Travel', 'ADMIN')
    `);
    console.log("👤 Seeded default admin user: admin / password");

    // Seed default packages
    const existingPackages = await sql.query(`SELECT * FROM "tour_packages"`);
    if (existingPackages.length === 0) {
      await sql.query(`
        INSERT INTO "tour_packages" ("name", "slug", "price", "duration", "description", "status")
        VALUES 
        ('Ubud Culture & Nature Escape', 'ubud-escape', 3500000, '4 Hari 3 Malam', 'Nikmati keindahan sawah terasering Ubud dan budaya Bali yang kental.', 'PUBLISHED'),
        ('Raja Ampat Diving Expeditions', 'raja-ampat-diving', 12000000, '5 Hari 4 Malam', 'Jelajahi surga bawah laut terindah di dunia dengan instruktur selam bersertifikat.', 'PUBLISHED'),
        ('Labuan Bajo Islands Explorer', 'labuan-bajo-explorer', 7500000, '4 Hari 3 Malam', 'Berlayar dengan Phinisi mewah ke Pulau Komodo dan Pink Beach.', 'PUBLISHED')
      `);
      console.log("✈️ Seeded 3 default tour packages.");
    }

    // Seed Landing Hero
    await sql.query(`DELETE FROM "landing_hero" WHERE "id" = 'hero_content'`);
    await sql.query(`
      INSERT INTO "landing_hero" ("id", "title", "subtitle", "button_text", "image_url")
      VALUES ('hero_content', 'Jelajahi Keindahan Dunia Bersama Kami', 'Petualangan menanti Anda. Rencanakan liburan impian Anda dengan layanan profesional terbaik kami.', 'Jelajahi Sekarang', '/bg-hero.jpg')
    `);
    console.log("🏠 Seeded Hero Section content.");

    // Seed Landing About
    await sql.query(`DELETE FROM "landing_about" WHERE "id" = 'about_content'`);
    await sql.query(`
      INSERT INTO "landing_about" ("id", "title", "subtitle", "description", "stats_guests", "stats_destinations", "stats_guides", "image_url")
      VALUES ('about_content', 'Tentang Kami', 'Petualangan Terpercaya Anda Sejak 2018', 'Kami adalah agen perjalanan terpercaya yang didedikasikan untuk menghadirkan pengalaman liburan terbaik dan tak terlupakan bagi Anda. Dengan jaringan destinasi luas, pemandu profesional, dan pelayanan bintang lima, kami siap menemani setiap langkah petualangan impian Anda.', '12K+', '50+', '100+', '/about-us.jpg')
    `);
    console.log("ℹ️ Seeded About Section content.");

    // Seed Landing Team
    const existingTeam = await sql.query(`SELECT * FROM "landing_team"`);
    if (existingTeam.length === 0) {
      await sql.query(`
        INSERT INTO "landing_team" ("name", "role", "image_url", "instagram_url")
        VALUES 
        ('M. Fahmi Maellana', 'Founder & CEO', '/team/ceo.jpg', 'https://instagram.com/maellana'),
        ('Sarah Amelia', 'Head of Travel Planner', '/team/sarah.jpg', 'https://instagram.com/sarah'),
        ('Budi Pratama', 'Senior Tour Guide & Adventurer', '/team/budi.jpg', 'https://instagram.com/budi')
      `);
      console.log("👥 Seeded 3 Team members.");
    }

    // Seed Landing Testimonials
    const existingTestimonials = await sql.query(`SELECT * FROM "landing_testimonials"`);
    if (existingTestimonials.length === 0) {
      await sql.query(`
        INSERT INTO "landing_testimonials" ("name", "role", "review", "rating", "image_url")
        VALUES 
        ('Budi Santoso', 'Solo Traveler', 'Pelayanan luar biasa! Trip Raja Ampat benar-benar terencana dengan matang dan sangat menyenangkan.', 5, '/testi/budi.jpg'),
        ('Diana Lestari', 'Family Adventurer', 'Liburan keluarga ke Ubud menjadi momen tak terlupakan berkat panduan profesional dari IO Travel.', 5, '/testi/diana.jpg'),
        ('Rian Hidayat', 'Backpacker', 'Harga sangat bersahabat dibanding fasilitas premium yang didapat. Sangat direkomendasikan!', 5, '/testi/rian.jpg')
      `);
      console.log("⭐ Seeded 3 customer Testimonials.");
    }

    // Seed Landing Features (Why Choose Us)
    const existingFeatures = await sql.query(`SELECT * FROM "landing_features"`);
    if (existingFeatures.length === 0) {
      await sql.query(`
        INSERT INTO "landing_features" ("title", "description", "icon")
        VALUES 
        ('Destinasi Pilihan', 'Kami menawarkan pilihan rute petualangan terbaik dan paling eksotis di seluruh Indonesia.', 'compass'),
        ('Pemandu Profesional', 'Setiap destinasi didampingi oleh pemandu lokal berlisensi, berpengalaman, dan ramah.', 'users'),
        ('Harga Terbaik & Transparan', 'Fasilitas premium dengan penawaran harga paling jujur tanpa biaya tersembunyi.', 'shield'),
        ('Layanan Siaga 24/7', 'Tim dukungan pelanggan kami siap membantu perjalanan Anda kapan pun dan di mana pun.', 'support')
      `);
      console.log("🌟 Seeded 4 dynamic Feature highlights.");
    }

    // Seed Landing CTA Bottom
    await sql.query(`DELETE FROM "landing_cta" WHERE "id" = 'cta_content'`);
    await sql.query(`
      INSERT INTO "landing_cta" ("id", "title", "subtitle", "button_text", "button_url")
      VALUES ('cta_content', 'Siap Memulai Petualangan Berikutnya?', 'Hubungi tim spesialis perjalanan kami hari ini untuk merencanakan dan mengamankan liburan impian Anda bersama keluarga.', 'Hubungi Kami Via WhatsApp', 'https://wa.me/628123456789')
    `);
    console.log("📞 Seeded Bottom CTA Section content.");

    // Seed SEO Meta
    await sql.query(`DELETE FROM "seo_meta" WHERE "id" = 'seo_config'`);
    await sql.query(`
      INSERT INTO "seo_meta" ("id", "title", "description", "keywords", "logo_url", "favicon_url", "og_title", "og_description", "og_image")
      VALUES ('seo_config', 'Adventure IO - Biro Perjalanan Wisata Terbaik', 'Temukan pengalaman liburan tak terlupakan bersama Adventure IO. Kami menyediakan paket wisata eksotis ke seluruh Indonesia.', 'wisata, liburan, petualangan, bali, raja ampat, labuan bajo', '/logo.svg', '/favicon.ico', 'Adventure IO Travel', 'Jelajahi keindahan Indonesia bersama kami.', '/og-image.jpg')
    `);
    console.log("🔍 Seeded SEO & Branding configuration.");

    console.log("\n🏆 Database tables creation and seeding completed successfully on Neon!");

  } catch (error) {
    console.error("❌ Error executing schema and seed script:", error);
  }
}

main();
