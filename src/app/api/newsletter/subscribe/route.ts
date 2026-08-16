import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { Resend } from 'resend';
import { getBrandEmailTemplate } from '@/lib/email-template';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = subscribeSchema.parse(body);

    // Check if already subscribed
    const existingSubscriber = await db.select().from(subscribers).where(eq(subscribers.email, email));
    
    if (existingSubscriber.length > 0) {
      if (existingSubscriber[0].status === 'unsubscribed') {
        // Resubscribe
        await db.update(subscribers).set({ status: 'active' }).where(eq(subscribers.email, email));
        return NextResponse.json({ message: 'Resubscribed successfully!' }, { status: 200 });
      }
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 400 });
    }

    // Insert new subscriber
    await db.insert(subscribers).values({
      id: crypto.randomUUID(),
      email,
      status: 'active',
      createdAt: new Date(),
    });

    // Send Welcome Email
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const emailContent = `
        <p>Thank you for subscribing to my newsletter!</p>
        <p>You will now receive updates on my latest projects, articles, and offers.</p>
        <br/>
        <p>Best regards,<br/>Surya CS</p>
      `;

      await resend.emails.send({
        from: \`Newsletter <\${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>\`,
        to: email,
        subject: 'Welcome to the Newsletter!',
        html: getBrandEmailTemplate('Welcome to the Newsletter!', emailContent, 'Welcome!'),
      });
    }

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
