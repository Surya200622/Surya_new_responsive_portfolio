import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Admin" <${process.env.EMAIL_USER}>`,
      to: email, // Directly to the user
      subject: `Welcome to Your Client Portal${name ? `, ${name}` : ''}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Welcome to Your Client Portal</h2>
          
          <p style="font-size: 16px; color: #444; line-height: 1.5;">
            Your client account has been successfully created. Here are your registration details and secure login credentials:
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 25px 0;">
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Name</p>
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
            <strong>Important:</strong> Please keep this email safe or change your password after logging in for the first time.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Nodemailer error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
