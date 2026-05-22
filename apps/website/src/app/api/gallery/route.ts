import { NextResponse } from 'next/server';
import { 
  createDb, 
  gallery
} from '../../../lib/db';
import { desc } from 'drizzle-orm';

export const revalidate = 0;

export async function GET() {
  try {
    const db = createDb();
    const galleryData = await db.select().from(gallery).orderBy(desc(gallery.createdAt));

    return NextResponse.json({
      success: true,
      data: galleryData,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Gagal memuat data galeri dari database.',
    }, { status: 500 });
  }
}
