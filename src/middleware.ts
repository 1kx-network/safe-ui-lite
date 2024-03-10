import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  const currentUser = request.cookies.get('currentUser');

  if (!currentUser?.value) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
