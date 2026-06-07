import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client for secure backend fetching
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

// GET /api/reviews - Fetch all approved/public reviews
export async function GET() {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, name, role, content, rating, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

// DELETE /api/reviews - Securely delete a review
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token or unauthorized' }, { status: 401 });
    }

    // Use the admin client to delete the review, bypassing any RLS issues
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('client_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete review' }, { status: 500 });
  }
}
