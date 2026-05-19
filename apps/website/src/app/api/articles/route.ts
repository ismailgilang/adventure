import { NextResponse } from 'next/server';
import { createDb, articles } from '../../../lib/db';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';
export const revalidate = 0;

export async function GET() {
  try {
    const db = createDb();
    const data = await db.select().from(articles).where(eq(articles.status, 'PUBLISHED'));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    }, { status: 500 });
  }
}
