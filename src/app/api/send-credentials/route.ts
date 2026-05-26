import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: 'Portfolio Admin <onboarding@resend.dev>',
      to: ['cssurya2006@gmail.com'], // Hardcoded to verified email due to Resend free tier restrictions
      subject: `New Client Registration: ${name || email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Client Registered</h2>
          
          <p style="font-size: 16px; color: #444; line-height: 1.5;">
            A new client account has been successfully created. Here are their registration details and login credentials:
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 25px 0;">
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Client Name</p>
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${name || 'Not provided'}</p>
            </div>

            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Email / Username</p>
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${email}</p>
            </div>
            
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Password</p>
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${password}</p>
            </div>
          </div>
          
          <p style="font-size: 14px; color: #666; line-height: 1.5;">
            <strong>Note:</strong> Since you are on the Resend free tier, this email is sent directly to you. You can forward these credentials to the client manually.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
