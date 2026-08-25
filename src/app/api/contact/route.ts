import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { getBrandEmailTemplate } from '@/lib/email-template';
import { db } from '@/db';
import { users, messages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getIp(request);
    const rateLimit = checkRateLimit(ip, 'contact', 3, 10 * 60 * 1000); // 3 requests per 10 minutes
    
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many contact requests. Please try again later.' }, { status: 429 });
    }

    const { name, email, phone, project, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailContent = `
      <p>You have received a new message from your portfolio contact form.</p>
      
      <div class="data-box">
        <div class="data-row">
          <div class="data-label">Name</div>
          <div class="data-value">${name}</div>
        </div>
        
        <div class="data-row">
          <div class="data-label">Email</div>
          <div class="data-value"><a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a></div>
        </div>
        
        <div class="data-row">
          <div class="data-label">Phone</div>
          <div class="data-value">${phone || 'Not provided'}</div>
        </div>
        
        <div class="data-row">
          <div class="data-label">Project Type</div>
          <div class="data-value">${project || 'Not provided'}</div>
        </div>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
        <p class="data-label">Message</p>
        <div style="background-color: rgba(255,255,255,0.02); padding: 15px; border-radius: 6px; font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #faf8f5;">${message}</div>
      </div>
    `;

    try {
      await sendEmail({
        to: 'cssurya2006@gmail.com',
        replyTo: email,
        subject: `New Portfolio Inquiry from ${name}`,
        html: getBrandEmailTemplate('New Contact Form Submission', emailContent, `Inquiry from ${name}`),
      });
    } catch (error: any) {
      console.error('Email error:', error);
      return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }

    // Save message to Turso database
    try {
      // Find the admin user
      const adminUsers = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin')).limit(1);

      if (adminUsers.length > 0) {
        await db.insert(messages).values({
          id: crypto.randomUUID(),
          receiverId: adminUsers[0].id,
          content: `From: ${name} (${email})\nPhone: ${phone || 'N/A'}\nProject: ${project || 'N/A'}\n\nMessage: ${message}`,
          createdAt: new Date(),
        });
      }
    } catch (dbError) {
      console.error('Failed to save to Turso:', dbError);
      // We don't fail the request if the email was sent successfully
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
