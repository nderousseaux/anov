import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? 'fallback-dev-secret-32-chars-min!!'
);

const COOKIE_NAME = 'anov_admin_token';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const nextParam = request.nextUrl.searchParams.get('next');

  const getSafeNextPath = (value: string | null): string => {
    if (!value) return '/admin/reservation';
    if (!(value.startsWith('/admin') || value.startsWith('/keystatic'))) {
      return '/admin/reservation';
    }
    if (value.startsWith('/admin/login')) return '/admin/reservation';
    return value;
  };

  if (pathname.startsWith('/admin/login')) {
    if (!token) return NextResponse.next();
    try {
      const { payload } = await jwtVerify(token, SECRET);
      if (payload.role === 'admin') {
        return NextResponse.redirect(new URL(getSafeNextPath(nextParam), request.url));
      }
    } catch {
      // Ignore invalid token and keep login accessible.
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/keystatic/:path*', '/api/keystatic/:path*'],
};
