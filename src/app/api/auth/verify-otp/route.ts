import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, pendingRegistrations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const rateLimit = checkRateLimit(ip, 5, 10 * 60 * 1000); // 5 attempts per 10 mins
    
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many verification attempts. Please try again later.' }, { status: 429 });
    }

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // Find pending registration
    const pendingResults = await db.select().from(pendingRegistrations).where(
      and(
        eq(pendingRegistrations.email, email),
        eq(pendingRegistrations.otp, otp)
      )
    );

    const pending = pendingResults[0];

    if (!pending) {
      return NextResponse.json({ error: 'Invalid OTP or email' }, { status: 400 });
    }

    if (new Date() > new Date(pending.expiresAt)) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Check if user already exists (double check)
    const existingUsers = await db.select().from(users).where(eq(users.email, pending.email));
    
    if (existingUsers.length > 0) {
      // Clean up pending registration just in case
      await db.delete(pendingRegistrations).where(eq(pendingRegistrations.email, pending.email));
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create user
    const newUser = {
      id: crypto.randomUUID(),
      email: pending.email,
      name: pending.name,
      companyName: pending.companyName,
      phone: pending.phone,
      password: pending.password,
      role: pending.role,
      emailVerified: new Date(),
      createdAt: new Date(),
    };

    await db.insert(users).values(newUser);

    // Delete pending registration
    await db.delete(pendingRegistrations).where(eq(pendingRegistrations.email, pending.email));

    return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
