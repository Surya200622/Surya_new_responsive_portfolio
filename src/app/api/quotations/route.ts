import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, projects, quotations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email-service';
import { getBrandEmailTemplate } from '@/lib/email-template';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // 1. Create a Pending Project
    const projectName = data.projectType 
      ? data.projectType.charAt(0).toUpperCase() + data.projectType.slice(1) + ' Project'
      : 'Custom Project';
      
    const newProject = {
      id: crypto.randomUUID(),
      clientId: session.user.id,
      title: projectName,
      description: `Automated quotation for a ${data.pages || 1}-page ${projectName} (Package: ${data.selectedPackage || 'Standard'}). Generated via pricing calculator.`,
      budget: data.pricing?.total || 0,
      timeline: `${data.pricing?.timeline || 0} Days`,
      status: 'Pending',
      createdAt: new Date(),
    };

    await db.insert(projects).values(newProject);

    // 2. Create the Quotation
    const lineItems = data.pricing?.breakdown 
      ? data.pricing.breakdown.map((item: any) => ({
          name: item.label,
          description: '',
          price: item.cost,
          quantity: 1
        }))
      : [
          {
            name: `${projectName} Setup`,
            description: `Package: ${data.selectedPackage || 'Standard'}`,
            price: data.pricing?.total || 0,
            quantity: 1
          }
        ];

    const newQuotation = {
      id: crypto.randomUUID(),
      projectId: newProject.id,
      clientId: session.user.id,
      items: lineItems,
      amount: data.pricing?.total || 0,
      status: 'sent', // Auto-sent to client
      notes: `Raw Configuration:\n${JSON.stringify(data, null, 2)}`,
      createdAt: new Date(),
    };

    await db.insert(quotations).values(newQuotation);

    // 3. Send Quotation via Email
    if (session.user.email) {
      try {
        const emailContent = `
          <h2 style="color: #f97316; margin-bottom: 10px;">Your Project Quotation</h2>
          <p>Thank you for requesting a quotation for your <strong>${projectName}</strong>.</p>
          
          <div class="data-box" style="margin-top: 20px;">
            <div class="data-row">
              <div class="data-label">Project</div>
              <div class="data-value">${projectName}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Estimated Timeline</div>
              <div class="data-value">${data.pricing?.timeline || 0} Days</div>
            </div>
            <div class="data-row">
              <div class="data-label">Estimated Total</div>
              <div class="data-value" style="color: #a855f7; font-weight: bold;">₹${data.pricing?.total || 0}</div>
            </div>
          </div>
          
          <p style="margin-top: 20px;">We have outlined the details in your client dashboard. You can review the full breakdown, make adjustments, and approve the quotation when you are ready.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://suryacsweb.is-cool.dev'}/dashboard/quotations" class="button">
              View Full Quotation
            </a>
          </div>
        `;

        const htmlTemplate = getBrandEmailTemplate(
          `Your Quotation: ${projectName}`, 
          emailContent, 
          'Review your personalized project quotation'
        );

        await sendEmail({
          to: session.user.email,
          subject: `Your Project Quotation: ${projectName}`,
          html: htmlTemplate,
        });
      } catch (emailErr) {
        console.error('Error sending quotation email:', emailErr);
        // Continue even if email fails
      }
    }

    return NextResponse.json({ success: true, quotation: newQuotation });
  } catch (error: any) {
    console.error('Error auto-generating quotation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error', details: error }, { status: 500 });
  }
}
