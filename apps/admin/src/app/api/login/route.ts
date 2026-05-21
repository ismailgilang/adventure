import { NextResponse } from 'next/server';
import { db, users, eq } from '@adventure/database';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username dan Password wajib diisi!'
      }, { status: 400 });
    }

    // 1. Cari user berdasarkan username di database Neon
    const results = await db.select().from(users).where(eq(users.username, username));

    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Username atau Password salah!'
      }, { status: 401 });
    }

    const dbUser = results[0];

    // 2. Periksa kesamaan password menggunakan Bcrypt (keamanan tingkat tinggi)
    const isPasswordMatch = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordMatch) {
      return NextResponse.json({
        success: false,
        message: 'Username atau Password salah!'
      }, { status: 401 });
    }

    // 3. Generate JWT Token
    const token = await signJWT({
      id: dbUser.id,
      username: dbUser.username,
      name: dbUser.name,
      role: dbUser.role
    });

    // 4. Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2 // 2 hours
    });

    // 5. Login Sukses
    return NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      user: {
        id: dbUser.id,
        username: dbUser.username,
        name: dbUser.name,
        role: dbUser.role
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Terjadi kesalahan sistem.'
    }, { status: 500 });
  }
}
