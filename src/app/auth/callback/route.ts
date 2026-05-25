import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Successful auth, redirect to the intended page
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Fallback if there's an error or no code
  return NextResponse.redirect(new URL('/login?error=Could not authenticate user', request.url));
}
