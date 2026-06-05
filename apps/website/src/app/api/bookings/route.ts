import { NextResponse } from 'next/server';
import { createDb, bookings } from '../../../lib/db';

export const revalidate = 0;

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
    const { packageName, customerName, customerEmail, customerPhone, bookingDate, totalGuests, totalPrice, namaPemesan2, packageId, villaId, paymentProof } = body;

    if (!packageName || !customerName || !customerEmail || !customerPhone || !bookingDate || !totalGuests || !totalPrice) {
      return NextResponse.json({
        success: false,
        message: 'Mohon lengkapi semua kolom formulir pemesanan!',
      }, { status: 400 });
    }

    const db = createDb();
    const bookingCode = generateBookingCode();

    const newBooking = await db.insert(bookings).values({
      bookingCode,
      packageName,
      customerName,
      customerEmail,
      customerPhone,
      bookingDate,
      totalGuests: parseInt(totalGuests.toString(), 10),
      totalPrice: parseInt(totalPrice.toString(), 10),
      namaPemesan2: namaPemesan2 || null,
      packageId: packageId || null,
      villaId: villaId || null,
      paymentProof: paymentProof || null,
      status: 'booking',
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Pemesanan berhasil diajukan! Tim kami akan menghubungi Anda segera.',
      data: newBooking[0],
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat menyimpan pesanan Anda.',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = createDb();
    // Fetch all active booking dates that are not cancelled
    const activeBookings = await db
      .select({ bookingDate: bookings.bookingDate })
      .from(bookings);
    
    const bookedDates = activeBookings.map((b: any) => b.bookingDate);
    return NextResponse.json({ success: true, data: bookedDates });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
