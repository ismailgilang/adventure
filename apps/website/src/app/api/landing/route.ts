import { NextResponse } from 'next/server';
import { createDb, landingHero, landingAbout, landingTeam, landingTestimonials, landingFeatures, landingCta, tourPackages } from '../../../lib/db';
import { eq } from 'drizzle-orm';

export const revalidate = 0;

export async function GET() {
  try {
    const db = createDb();

    const [heroData, aboutData, teamData, testimonialData, featureData, ctaData, packagesData] = await Promise.all([
      db.select().from(landingHero).limit(1),
      db.select().from(landingAbout).limit(1),
      db.select().from(landingTeam),
      db.select().from(landingTestimonials),
      db.select().from(landingFeatures),
      db.select().from(landingCta).limit(1),
      db.select().from(tourPackages).where(eq(tourPackages.status, 'PUBLISHED')),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        hero: heroData[0] || null,
        about: aboutData[0] || null,
        team: teamData,
        testimonials: testimonialData,
        features: featureData,
        cta: ctaData[0] || null,
        packages: packagesData,
      },
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Gagal memuat data landing page dari database.',
    }, { status: 500 });
  }
}
