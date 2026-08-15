import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, users } from '@/db/schema';
import { eq, and, isNotNull, sql } from 'drizzle-orm';
import { Resend } from 'resend';
import { getBrandEmailTemplate } from '@/lib/email-template';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Note: In production you might want to protect this route with a secret key
    // For now, it's safe to run since it only sends targeted notification emails once
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Optional basic security for cron if CRON_SECRET is set
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeProjects = await db
      .select({
        project: projects,
        client: users
      })
      .from(projects)
      .innerJoin(users, eq(projects.clientId, users.id))
      .where(
        and(
          isNotNull(projects.startedAt),
          eq(projects.notified3DaysLeft, false),
          // Exclude projects that are completed or cancelled
          sql`${projects.status} NOT IN ('Completed', 'Cancelled', 'Review Phase')`
        )
      );

    const resend = new Resend(process.env.RESEND_API_KEY);
    let emailsSent = 0;

    for (const data of activeProjects) {
      const p = data.project;
      const clientEmail = data.client.email;

      if (!p.timeline || !p.startedAt || !clientEmail) continue;

      // Extract number from "20 Days", "3 Weeks", etc.
      let totalDays = 0;
      const match = p.timeline.match(/(\d+)\s*(day|week|month)/i);
      if (match) {
        const val = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        if (unit.startsWith('day')) totalDays = val;
        else if (unit.startsWith('week')) totalDays = val * 7;
        else if (unit.startsWith('month')) totalDays = val * 30;
      } else if (!isNaN(parseInt(p.timeline))) {
        totalDays = parseInt(p.timeline);
      } else {
        continue; // Unparseable timeline
      }

      const startedDate = new Date(p.startedAt);
      const currentDate = new Date();
      const elapsedMs = currentDate.getTime() - startedDate.getTime();
      const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
      
      const daysLeft = totalDays - elapsedDays;

      if (daysLeft <= 3 && daysLeft >= 0) {
        // Send email
        const emailContent = `
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 15px;">🚀</div>
            <h2 style="color: #222; font-size: 20px; margin-bottom: 20px;">Your Project is Almost Ready!</h2>
            <p style="color: #555; font-size: 16px; margin-bottom: 25px;">
              Great news! <strong>Your project is on the way!</strong> You are just <strong>${daysLeft} day(s)</strong> away from getting your project delivered.
            </p>
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; text-align: left; margin-bottom: 25px;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong>Timeline:</strong> ${p.timeline}</p>
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong>Started On:</strong> ${startedDate.toLocaleDateString()}</p>
              <p style="margin: 0; color: #666; font-size: 14px;"><strong>Status:</strong> <span style="color: #ba966b; font-weight: 500;">${p.status}</span></p>
            </div>
            <p style="color: #555; font-size: 15px;">
              I will be sharing the final preview links and deployment details with you shortly. If you have any last-minute assets or information, please share them now.
            </p>
          </div>
        `;

        try {
          await resend.emails.send({
            from: `Surya CS <noreply@${process.env.RESEND_FROM_EMAIL?.split('@')[1] || 'suryacs.is-a.dev'}>`,
            to: clientEmail,
            bcc: 'suryacs.is.a.dev@gmail.com',
            subject: `Action Required: 3 Days Left for ${p.title}`,
            html: getBrandEmailTemplate('Project Deadline Reminder', emailContent, 'Important Project Update'),
          });

          // Mark as notified
          await db.update(projects)
            .set({ notified3DaysLeft: true }) // Use true instead of 1 for boolean mode
            .where(eq(projects.id, p.id));
            
          emailsSent++;
        } catch (error) {
          console.error(`Error sending 3-day notification for project ${p.id}:`, error);
        }
      }
    }

    // --- 2. Quotation Expiry Reminders ---
    const { quotations } = await import('@/db/schema');
    const pendingQuotations = await db
      .select({
        quotation: quotations,
        client: users
      })
      .from(quotations)
      .innerJoin(users, eq(quotations.clientId, users.id))
      .where(
        and(
          eq(quotations.notifiedExpiry, false),
          sql`${quotations.status} IN ('pending', 'sent')`
        )
      );

    let quoteEmailsSent = 0;

    for (const data of pendingQuotations) {
      const q = data.quotation;
      const clientEmail = data.client.email;
      if (!clientEmail || !q.createdAt) continue;

      const createdDate = new Date(q.createdAt);
      const currentDate = new Date();
      const elapsedMs = currentDate.getTime() - createdDate.getTime();
      const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

      // Quotations are valid for 14 days. If it's been 11 days (3 days left), notify them!
      if (elapsedDays === 11) {
        const quoteEmailContent = `
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 15px;">⏳</div>
            <h2 style="color: #222; font-size: 20px; margin-bottom: 20px;">Your Quotation is Expiring Soon</h2>
            <p style="color: #555; font-size: 16px; margin-bottom: 25px;">
              This is a gentle reminder that your project quotation is valid for only <strong>3 more days</strong>.
            </p>
            <p style="color: #555; font-size: 15px; margin-bottom: 25px;">
              Please complete your advance payment through your dashboard to lock in this pricing and start the project countdown!
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://magical-portfolio.vercel.app'}/dashboard/quotations" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Dashboard</a>
          </div>
        `;

        try {
          await resend.emails.send({
            from: `Surya CS <noreply@${process.env.RESEND_FROM_EMAIL?.split('@')[1] || 'suryacs.is-a.dev'}>`,
            to: clientEmail,
            subject: `Action Required: Your Quotation Expires in 3 Days`,
            html: getBrandEmailTemplate('Quotation Reminder', quoteEmailContent, 'Action Required'),
          });

          await db.update(quotations)
            .set({ notifiedExpiry: true })
            .where(eq(quotations.id, q.id));
            
          quoteEmailsSent++;
        } catch (error) {
          console.error(`Error sending quotation reminder for ${q.id}:`, error);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      checkedProjects: activeProjects.length, 
      projectEmailsSent: emailsSent,
      checkedQuotations: pendingQuotations.length,
      quoteEmailsSent
    });
  } catch (error: any) {
    console.error('Error in check-deadlines cron:', error);
    return NextResponse.json({ error: 'Failed to run cron check' }, { status: 500 });
  }
}
