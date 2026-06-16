import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { action, projectId } = await req.json(); // action can be 'accept' or 'reject'

    if (!action || !projectId) {
      return NextResponse.json({ error: 'Missing action or projectId' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    const newQuoteStatus = action === 'accept' ? 'accepted' : 'rejected';

    // 1. Update quotation status
    // Use admin client to bypass RLS, but verify the quotation belongs to this user first
    const { data: quotation, error: fetchError } = await supabaseAdmin
      .from('quotations')
      .select('id, client_id')
      .eq('id', id)
      .single();

    if (fetchError || !quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    // Verify ownership: the logged-in user must be the client on this quotation
    if (quotation.client_id !== user.id) {
      return NextResponse.json({ error: 'You do not have permission to modify this quotation' }, { status: 403 });
    }

    const { error: quoteError } = await supabaseAdmin
      .from('quotations')
      .update({ status: newQuoteStatus })
      .eq('id', id);

    if (quoteError) {
      console.error('Error updating quotation status:', quoteError);
      return NextResponse.json({ error: `Failed to update quotation: ${quoteError.message}` }, { status: 500 });
    }

    // 2. If accepted, update the linked project status
    if (action === 'accept') {
      const { error: projectError } = await supabaseAdmin
        .from('projects')
        .update({ status: 'Development Phase' })
        .eq('id', projectId);

      if (projectError) {
        console.error('Error updating project status:', projectError);
        // Don't fail the whole operation — the quotation was already updated
      }
    }

    return NextResponse.json({ success: true, status: newQuoteStatus });
  } catch (error: any) {
    console.error('Error updating quotation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
