import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string })?.role;

  // Protect all /admin/* routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (role !== 'admin' && role !== 'staff') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Protect API admin routes
  if (pathname.startsWith('/api/admin')) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
