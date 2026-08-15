import { NextResponse } from 'next/server';
import { db } from '@/db';
import { quotations, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Resend } from 'resend';
import { getBrandEmailTemplate } from '@/lib/email-template';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, projectId, paymentType, transactionId } = body; // action can be 'accept', 'reject', or 'pay'

    if (!action || !projectId) {
      return NextResponse.json({ error: 'Missing action or projectId' }, { status: 400 });
    }

    let newQuoteStatus = 'pending';
    if (action === 'accept') newQuoteStatus = 'accepted';
    if (action === 'reject') newQuoteStatus = 'rejected';
    
    // Auto-update logic for payments
    if (action === 'pay') {
      newQuoteStatus = 'advance_paid';
      if (paymentType === 'full' || paymentType === 'remaining') newQuoteStatus = 'fully_paid';
    }

    // 1. Fetch quotation to verify ownership
    const quotationResults = await db.select().from(quotations).where(eq(quotations.id, id));
    const quotation = quotationResults[0];

    if (!quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    // Verify ownership: the logged-in user must be the client on this quotation
    if (quotation.clientId !== session.user.id) {
      return NextResponse.json({ error: 'You do not have permission to modify this quotation' }, { status: 403 });
    }

    // Update quotation status
    await db.update(quotations)
      .set({ status: newQuoteStatus })
      .where(eq(quotations.id, id));

    // 2. If accepted or paid, update the linked project status
    if (action === 'accept' || action === 'pay') {
      try {
        let newProjStatus = 'pending';
        // If they pay advance or full, it's time to start development
        let startedAtValue: Date | undefined = undefined;
        if (action === 'pay' && (paymentType === 'advance' || paymentType === 'full' || paymentType === 'remaining')) {
          newProjStatus = 'Development Phase';
          startedAtValue = new Date();
        }

        const projectResults = await db.select().from(projects).where(eq(projects.id, projectId));
        const project = projectResults[0];

        const updateData: any = { status: newProjStatus };
        if (startedAtValue && project && !project.startedAt) {
          updateData.startedAt = startedAtValue;
        }

        await db.update(projects)
          .set(updateData)
          .where(eq(projects.id, projectId));
      } catch (projectError) {
        console.error('Error updating project status:', projectError);
        // Don't fail the whole operation — the quotation was already updated
      }
    }

    // 3. Send notification to admin
    try {
      if (session.user.email) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        let actionTitle = `Quotation ${action === 'accept' ? 'Accepted' : 'Rejected'}`;
        let actionBody = `The client (<strong>${session.user.email}</strong>) has ${action === 'accept' ? 'accepted' : 'rejected'} the quotation for Project ID: ${projectId}.`;
        
        if (action === 'pay') {
          actionTitle = `Payment Submitted (${paymentType})`;
          actionBody = `The client (<strong>${session.user.email}</strong>) has submitted a ${paymentType} payment for Project ID: ${projectId}. Transaction ID: ${transactionId || 'Not provided'}`;
        }
        
        const emailContent = `
          <h2 style="color: ${action === 'reject' ? '#ef4444' : '#22c55e'}; margin-bottom: 10px;">
            ${actionTitle}
          </h2>
          <p>${actionBody}</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://suryacs.is-a.dev'}/admin/quotations" class="button">
              View Quotation Details
            </a>
          </div>
        `;

        await resend.emails.send({
          from: `Portfolio System <noreply@${process.env.RESEND_FROM_EMAIL?.split('@')[1] || 'suryacs.is-a.dev'}>`,
          to: 'suryacs.is.a.dev@gmail.com',
          subject: `${actionTitle} by ${session.user.email}`,
          html: getBrandEmailTemplate(actionTitle, emailContent, 'Client Action Notification'),
        });
      }
    } catch (emailErr) {
      console.error('Error sending quotation status email:', emailErr);
    }

    return NextResponse.json({ success: true, status: newQuoteStatus });
  } catch (error: any) {
    console.error('Error updating quotation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    await db.update(quotations)
      .set({ status: body.status })
      .where(eq(quotations.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to update quotation' },
      { status: 500 }
    );
  }
}
