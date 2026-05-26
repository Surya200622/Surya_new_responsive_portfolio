import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, project, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['cssurya2006@gmail.com'],
      replyTo: email,
      subject: `New Portfolio Inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Name</p>
            <p style="margin: 0; font-size: 16px;"><strong>${name}</strong></p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Email</p>
            <p style="margin: 0; font-size: 16px;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a></p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Phone</p>
            <p style="margin: 0; font-size: 16px;">${phone || 'Not provided'}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Project Type</p>
            <p style="margin: 0; font-size: 16px;">${project || 'Not provided'}</p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Message</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; font-size: 15px; line-height: 1.5; white-space: pre-wrap;">${message}</div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
