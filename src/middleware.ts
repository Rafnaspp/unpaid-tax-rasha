import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/admin/login',
    '/taxpayer/login',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/simple-forgot-password',
    '/auth/change-password',
    '/api/login',
    '/api/admin/login',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/simple-forgot-password',
    '/api/auth/change-password'
  ];

  // Check if the current path is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // For admin routes, we can't check localStorage in middleware
  // Instead, we'll rely on client-side checks in the components
  // But we can still add basic protection for API routes
  
  // Check for admin API routes (except login)
  if (pathname.startsWith('/api/admin') && !pathname.includes('/api/admin/login')) {
    // For API routes, we'll let the client handle authentication
    // The API endpoints should check for valid session
    return NextResponse.next();
  }

  // Check for user API routes
  if (pathname.startsWith('/api/user')) {
    // For API routes, we'll let the client handle authentication
    // The API endpoints should check for valid session
    return NextResponse.next();
  }

  // For page routes, we'll let the client-side AuthContext handle authentication
  // The components will check localStorage and redirect if needed
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
