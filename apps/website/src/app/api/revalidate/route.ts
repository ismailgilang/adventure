import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { tag, secret } = await request.json();

    // Pastikan REVALIDATE_SECRET ada di environment variables
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: 'Tag is required' }, { status: 400 });
    }

    // @ts-ignore - revalidateTag in this environment might require a second argument 'profile'
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
