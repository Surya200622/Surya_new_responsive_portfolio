import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, pendingRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';
import { checkRateLimit, getIp } from '@/lib/rate-limit';
import { Resend } from 'resend';
import { getBrandEmailTemplate } from '@/lib/email-template';

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const rateLimit = checkRateLimit(ip, 3, 60 * 60 * 1000); // 3 registrations per hour
    
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const validData = registerSchema.parse(body);

    // Check if user already exists
    const existingUsers = await db.select().from(users).where(eq(users.email, validData.email));
    
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Determine role based on secret key for admin registration
    let role = 'client';
    if (body.secretKey) {
      if (body.secretKey !== 'SURYA_ADMIN_SECURE') {
        return NextResponse.json({ error: 'Invalid admin secret key' }, { status: 403 });
      }
      role = 'admin';
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validData.password, 10);

    // Generate 4-digit PIN
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Valid for 30 mins

    // Upsert to pendingRegistrations
    await db.insert(pendingRegistrations).values({
      email: validData.email,
      name: validData.fullName,
      companyName: validData.companyName || null,
      phone: validData.phone || null,
      password: hashedPassword,
      role: role,
      otp,
      expiresAt,
    }).onConflictDoUpdate({
      target: pendingRegistrations.email,
      set: {
        name: validData.fullName,
        companyName: validData.companyName || null,
        phone: validData.phone || null,
        password: hashedPassword,
        role: role,
        otp,
        expiresAt,
      }
    });

    // Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const emailContent = `
      <p>Hello ${validData.fullName},</p>
      <p>Thank you for starting your registration. Please use the following 4-digit PIN to verify your email address and complete your signup:</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #1a1a1a; padding: 10px 20px; background-color: #f3f4f6; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      
      <p>This PIN is valid for 30 minutes. If you did not request this registration, you can safely ignore this email.</p>
    `;

    const { error } = await resend.emails.send({
      from: `Portfolio Admin <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: validData.email, 
      subject: 'Your Registration Verification PIN',
      html: getBrandEmailTemplate('Verify Your Email', emailContent, 'Use this PIN to complete your registration'),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message || 'Failed to send verification email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('Registration OTP error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
