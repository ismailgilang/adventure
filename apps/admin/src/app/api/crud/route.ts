import { NextResponse } from 'next/server';
import { 
  db, 
  articles, 
  users, 
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
  gallery,
  eq 
} from '@adventure/database';
import * as bcrypt from 'bcryptjs';

export const revalidate = 0;

// Mapping table names to schema objects
const tableMap: Record<string, any> = {
  articles,
  users,
  packages: tourPackages,
  bookings,
  hero: landingHero,
  about: landingAbout,
  team: landingTeam,
  testimonials: landingTestimonials,
  features: landingFeatures,
  cta: landingCta,
  meta: seoMeta,
  company: companyProfile,
  gallery
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const tableName = url.searchParams.get('table');

    if (!tableName || !tableMap[tableName]) {
      return NextResponse.json({ success: false, message: `Nama tabel "${tableName}" tidak valid!` }, { status: 400 });
    }

    const tableSchema = tableMap[tableName];
    const data = await db.select().from(tableSchema);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const tableName = url.searchParams.get('table');

    if (!tableName || !tableMap[tableName]) {
      return NextResponse.json({ success: false, message: `Nama tabel "${tableName}" tidak valid!` }, { status: 400 });
    }

    const body = await request.json();
    const tableSchema = tableMap[tableName];

    // Khusus untuk tabel users, hash password menggunakan bcrypt
    if (tableName === 'users' && body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    // Generate slug otomatis jika ada title/name tetapi slug tidak diberikan (untuk seo-friendly URLs)
    if ((tableName === 'articles' || tableName === 'packages') && !body.slug) {
      const textToSlug = body.title || body.name || '';
      body.slug = textToSlug.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    // Untuk tabel satu baris (single record config)
    if (tableName === 'hero' || tableName === 'about' || tableName === 'cta' || tableName === 'meta' || tableName === 'company') {
      const recordId = body.id || (tableName === 'company' ? 'company_config' : `${tableName}_content`);
      const existing = await db.select().from(tableSchema).where(eq(tableSchema.id, recordId));
      if (existing.length > 0) {
        const updated = await db.update(tableSchema)
          .set({ ...body, updatedAt: new Date() })
          .where(eq(tableSchema.id, recordId))
          .returning();
        return NextResponse.json({ success: true, data: updated[0] });
      } else {
        const inserted = await db.insert(tableSchema)
          .values({ ...body, id: recordId })
          .returning();
        return NextResponse.json({ success: true, data: inserted[0] });
      }
    }

    const inserted = await db.insert(tableSchema).values(body).returning();
    return NextResponse.json({ success: true, data: inserted[0] });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const tableName = url.searchParams.get('table');
    const id = url.searchParams.get('id');

    if (!tableName || !tableMap[tableName]) {
      return NextResponse.json({ success: false, message: `Nama tabel "${tableName}" tidak valid!` }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan untuk operasi update!' }, { status: 400 });
    }

    const body = await request.json();
    const tableSchema = tableMap[tableName];

    // Khusus untuk tabel users, hash password baru jika diubah
    if (tableName === 'users' && body.password) {
      if (!body.password.startsWith('$2a$') && !body.password.startsWith('$2b$')) {
        body.password = await bcrypt.hash(body.password, 10);
      }
    }

    // Hapus id dan timestamp kolom dari payload update
    delete body.id;
    delete body.createdAt;
    delete body.updatedAt;

    const updated = await db.update(tableSchema)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(tableSchema.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const tableName = url.searchParams.get('table');
    const id = url.searchParams.get('id');

    if (!tableName || !tableMap[tableName]) {
      return NextResponse.json({ success: false, message: `Nama tabel "${tableName}" tidak valid!` }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan untuk operasi penghapusan!' }, { status: 400 });
    }

    const tableSchema = tableMap[tableName];
    await db.delete(tableSchema).where(eq(tableSchema.id, id));

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus!' });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
