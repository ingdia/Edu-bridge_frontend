import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DASHBOARD_PATHS = ['/student', '/mentor', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  const isDashboard = DASHBOARD_PATHS.some((p) => pathname.startsWith(p));

  if (isDashboard && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/mentor/:path*', '/admin/:path*'],
};
