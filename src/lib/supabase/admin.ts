import { createClient } from '@supabase/supabase-js';

// Note: This client uses the service role key and bypasses RLS.
// ONLY use this in secure server-side environments (e.g., API routes, server actions)
// NEVER use this on the client side.
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
