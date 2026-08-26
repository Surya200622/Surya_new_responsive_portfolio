import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email-service';
import { getBrandEmailTemplate } from '@/lib/email-template';

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

    const projectResults = await db.select().from(projects).where(eq(projects.id, id));
    const project = projectResults[0];

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updateData: any = { 
      status: body.status !== undefined ? body.status : project.status,
      budget: body.budget !== undefined ? body.budget : project.budget,
      title: body.title !== undefined ? body.title : project.title,
      timeline: body.timeline !== undefined ? body.timeline : project.timeline,
      description: body.description !== undefined ? body.description : project.description
    };

    if (body.status === 'Development Phase' && !project.startedAt) {
      updateData.startedAt = new Date();
    }

    // Check if we need to send a review request email
    let clientEmail = '';
    let clientName = '';
    if (body.status === 'Completed' && project.status !== 'Completed' && project.clientId) {
      const { users } = await import('@/db/schema');
      const clientResults = await db.select().from(users).where(eq(users.id, project.clientId));
      if (clientResults.length > 0) {
        clientEmail = clientResults[0].email;
        clientName = clientResults[0].name || 'Client';
      }
    }

    await db.update(projects)
      .set(updateData)
      .where(eq(projects.id, id));

    // Send the email if applicable
    if (clientEmail) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://suryacsweb.is-cool.dev';
      const reviewUrl = `${appUrl}/dashboard/reviews`;

      const emailContent = `
        <p>Hi ${clientName},</p>
        <p>Your project "<strong>${project.title}</strong>" has been marked as completed!</p>
        <p>It was a pleasure working with you. If you have a moment, I would deeply appreciate it if you could leave a review for my portfolio.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${reviewUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Leave a Review</a>
        </div>
        <p style="margin-top: 30px;">Best regards,<br/>Surya CS</p>
      `;

      try {
        await sendEmail({
          to: clientEmail,
          subject: 'Project Completed - Your feedback is appreciated!',
          html: getBrandEmailTemplate('Project Completed', emailContent, 'Review Request'),
        });
      } catch (err) {
        console.error('Failed to send review request email:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
