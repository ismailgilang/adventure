import { NextResponse } from 'next/server';
import { db, bookings } from '@adventure/database';

export const runtime = 'edge';
export const revalidate = 0;

// Fungsi helper untuk generate kode booking acak (contoh: IOT-9A2E7F)
function generateBookingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IOT-${randomPart}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageName, customerName, customerEmail, customerPhone, bookingDate, totalGuests, totalPrice } = body;

    // Validasi data input
    if (!packageName || !customerName || !customerEmail || !customerPhone || !bookingDate || !totalGuests || !totalPrice) {
      return NextResponse.json({
        success: false,
        message: 'Mohon lengkapi semua kolom formulir pemesanan!'
      }, { status: 400 });
    }

    const bookingCode = generateBookingCode();

    // Simpan ke database Neon melalui Drizzle
    const newBooking = await db.insert(bookings).values({
      bookingCode,
      packageName,
      customerName,
      customerEmail,
      customerPhone,
      bookingDate,
      totalGuests: parseInt(totalGuests.toString(), 10),
      totalPrice: parseInt(totalPrice.toString(), 10),
      status: 'PENDING'
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Pemesanan berhasil diajukan! Tim kami akan menghubungi Anda segera.',
      data: newBooking[0]
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat menyimpan pesanan Anda.'
    }, { status: 500 });
  }
}
