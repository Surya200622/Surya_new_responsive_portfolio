import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';
import { getBrandEmailTemplate } from '@/lib/email-template';

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

    // 3. Send notification to admin
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const emailContent = `
        <h2 style="color: ${action === 'accept' ? '#22c55e' : '#ef4444'}; margin-bottom: 10px;">
          Quotation ${action === 'accept' ? 'Accepted' : 'Rejected'}
        </h2>
        <p>The client (<strong>${user.email}</strong>) has ${action === 'accept' ? 'accepted' : 'rejected'} the quotation for Project ID: ${projectId}.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://suryacs.is-a.dev'}/admin/quotations" class="button">
            View Quotation Details
          </a>
        </div>
      `;

      await resend.emails.send({
        from: `Portfolio System <noreply@${process.env.RESEND_FROM_EMAIL?.split('@')[1] || 'suryacs.is-a.dev'}>`,
        to: 'suryacs.is.a.dev@gmail.com',
        subject: `Quotation ${action === 'accept' ? 'Accepted' : 'Rejected'} by ${user.email}`,
        html: getBrandEmailTemplate(`Quotation ${action === 'accept' ? 'Accepted' : 'Rejected'}`, emailContent, 'Client Action Notification'),
      });
    } catch (emailErr) {
      console.error('Error sending quotation status email:', emailErr);
    }

    return NextResponse.json({ success: true, status: newQuoteStatus });
  } catch (error: any) {
    console.error('Error updating quotation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
