import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /api/crud
  if (pathname.startsWith('/api/crud')) {
    const token = request.cookies.get('token')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/crud/:path*'],
};
