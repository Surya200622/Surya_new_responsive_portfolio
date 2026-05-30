import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getBrandEmailTemplate } from '@/lib/email-template';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { name, email, phone, project, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Portfolio Inquiry from ${name}`,
      html: getBrandEmailTemplate('New Contact Form Submission', emailContent, `Inquiry from ${name}`),
    });

    // Save message to Supabase
    try {
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Find the admin user
      const { data: adminUser } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
        .single();

      if (adminUser) {
        await supabaseAdmin
          .from('messages')
          .insert({
            receiver_id: adminUser.id,
            content: `From: ${name} (${email})\nPhone: ${phone || 'N/A'}\nProject: ${project || 'N/A'}\n\nMessage: ${message}`,
            is_read: false
          });
      }
    } catch (dbError) {
      console.error('Failed to save to Supabase:', dbError);
      // We don't fail the request if the email was sent successfully
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Nodemailer error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
