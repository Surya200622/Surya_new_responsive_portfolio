import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Update session and get the base response
  const response = await updateSession(request);

  // Add SEO Link header to help search engines easily find the sitemap
  response.headers.set('Link', '<https://suryacs.is-a.dev/sitemap.xml>; rel="sitemap"');

  // Simple auth check for route protection
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Handled by updateSession
        },
        remove(name: string, options: CookieOptions) {
          // Handled by updateSession
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register') ||
                      request.nextUrl.pathname.startsWith('/forgot-password') ||
                      request.nextUrl.pathname.startsWith('/admin/login') ||
                      request.nextUrl.pathname.startsWith('/admin/register');
                      
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           (request.nextUrl.pathname.startsWith('/admin') && !isAuthRoute);

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Admin route protection is handled in the server components
  // since they can securely query the profiles table.

  return response;
}

export const config = {
  matcher: [
    // Ignore api, _next/static, _next/image, favicon.ico, sitemap.xml, robots.txt and all static images
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
};
