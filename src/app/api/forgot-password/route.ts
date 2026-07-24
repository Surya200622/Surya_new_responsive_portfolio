import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getBrandEmailTemplate } from '@/lib/email-template';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // We use the admin client to generate a secure reset link without relying on the default emailer
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Generate the reset link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
      }
    });

    if (linkError) {
      return NextResponse.json({ error: linkError.message }, { status: 400 });
    }

    const emailContent = `
      <p>We received a request to reset the password for the account associated with <strong>${email}</strong>.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="${linkData.properties.action_link}" class="button">
          Reset Password
        </a>
      </div>
      
      <p>If you did not request this, you can safely ignore this email. Your password will not be changed.</p>
    `;

    // 2. Send the custom email via Resend
    const { data, error } = await resend.emails.send({
      from: `Portfolio Admin <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: email, // Now sending directly to the user!
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
