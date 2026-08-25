import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { getBrandEmailTemplate } from '@/lib/email-template';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }


    const emailContent = `
      <p>Your client account has been successfully created. Here are your registration details and secure login credentials:</p>
      
      <div class="data-box">
        <div class="data-row">
          <div class="data-label">Name</div>
          <div class="data-value">${name || 'Not provided'}</div>
        </div>
        
        <div class="data-row">
          <div class="data-label">Email / Username</div>
          <div class="data-value">${email}</div>
        </div>
        
        <div class="data-row">
          <div class="data-label">Password</div>
          <div class="data-value">${password}</div>
        </div>
      </div>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">
          Login to Client Portal
        </a>
      </div>
      
      <p style="font-size: 14px; color: #71717a;">
        <strong>Important:</strong> Please keep this email safe or change your password after logging in for the first time.
      </p>
    `;

    try {
      await sendEmail({
        to: email, // Directly to the user
        subject: `Welcome to Your Client Portal${name ? `, ${name}` : ''}`,
        html: getBrandEmailTemplate('Welcome to Your Client Portal', emailContent, 'Your account details and login credentials'),
      });
    } catch (error: any) {
      console.error('Email error:', error);
      return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
