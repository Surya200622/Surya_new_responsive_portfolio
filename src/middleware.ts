import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(request) {
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                        request.nextUrl.pathname.startsWith('/register') ||
                        request.nextUrl.pathname.startsWith('/forgot-password') ||
                        request.nextUrl.pathname.startsWith('/admin/login') ||
                        request.nextUrl.pathname.startsWith('/admin/register');
                        
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                             (request.nextUrl.pathname.startsWith('/admin') && !isAuthRoute);

    const token = request.nextauth.token;

    // Redirect unauthenticated users from protected routes to login
    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect authenticated users from auth routes to dashboard
    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Add SEO Link header
    const response = NextResponse.next();
    response.headers.set('Link', '<https://suryacs-web.vercel.app/sitemap.xml>; rel="sitemap"');
    return response;
  },
  {
    callbacks: {
      authorized: () => true, // We handle the redirect logic in the middleware function above
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
};
