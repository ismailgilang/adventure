import { NextResponse } from 'next/server';
import { db, landingHero, landingAbout, landingTeam, landingTestimonials, landingFeatures, landingCta, tourPackages, eq } from '@adventure/database';

export const runtime = 'edge'; // Edge runtime untuk performa serverless maksimal di Cloudflare
export const revalidate = 0; // Fresh content every time

export async function GET() {
  try {
    // 1. Ambil data Hero (Baris Pertama / default)
    const heroData = await db.select().from(landingHero).limit(1);

    // 2. Ambil data About Us (Baris Pertama / default)
    const aboutData = await db.select().from(landingAbout).limit(1);

    // 3. Ambil data Tim Kami
    const teamData = await db.select().from(landingTeam);

    // 4. Ambil data Testimonial
    const testimonialData = await db.select().from(landingTestimonials);

    // 5. Ambil data Keunggulan (Mengapa Memilih Kami)
    const featureData = await db.select().from(landingFeatures);

    // 6. Ambil data CTA Banner Bawah
    const ctaData = await db.select().from(landingCta).limit(1);

    // 7. Ambil Paket Wisata yang Berstatus Aktif (PUBLISHED)
    // @ts-ignore
    const packagesData = await db.select().from(tourPackages).where(eq(tourPackages.status, 'PUBLISHED'));

    return NextResponse.json({
      success: true,
      data: {
        hero: heroData[0] || null,
        about: aboutData[0] || null,
        team: teamData,
        testimonials: testimonialData,
        features: featureData,
        cta: ctaData[0] || null,
        packages: packagesData
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Gagal memuat data landing page dari database.'
    }, { status: 500 });
  }
}
