import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, projectId } = await req.json(); // action can be 'accept' or 'reject'

    if (!action || !projectId) {
      return NextResponse.json({ error: 'Missing action or projectId' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const newQuoteStatus = action === 'accept' ? 'accepted' : 'rejected';

    // 1. Update quotation status
    const { error: quoteError } = await supabaseAdmin
      .from('quotations')
      .update({ status: newQuoteStatus })
      .eq('id', params.id)
      .eq('client_id', user.id);

    if (quoteError) throw quoteError;

    // 2. If accepted, update the linked project status to 'in_progress'
    if (action === 'accept') {
      const { error: projectError } = await supabaseAdmin
        .from('projects')
        .update({ status: 'in_progress' })
        .eq('id', projectId);

      if (projectError) throw projectError;
    }

    return NextResponse.json({ success: true, status: newQuoteStatus });
  } catch (error) {
    console.error('Error updating quotation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
