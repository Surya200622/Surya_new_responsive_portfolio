import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import { getBrandEmailTemplate } from '@/lib/email-template';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = getIp(req);
    const rateLimit = checkRateLimit(ip, 'forgot-password', 3, 10 * 60 * 1000); // 3 requests per 10 minutes
    
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many password reset requests. Please try again later.' }, { status: 429 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length === 0) {
      // Don't leak whether user exists or not
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomUUID();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token valid for 1 hour

    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    const emailContent = `
      <p>We received a request to reset the password for the account associated with <strong>${email}</strong>.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetLink}" class="button">
          Reset Password
        </a>
      </div>
      
      <p>If you did not request this, you can safely ignore this email. Your password will not be changed.</p>
    `;

    const { error } = await resend.emails.send({
      from: `Portfolio Admin <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: email, 
      subject: 'Reset Your Password - Client Portal',
      html: getBrandEmailTemplate('Password Reset Request', emailContent, 'Reset your client portal password'),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
