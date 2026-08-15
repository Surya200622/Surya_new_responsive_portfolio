import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const rateLimit = checkRateLimit(ip, 'register', 3, 60 * 60 * 1000); // 3 registrations per hour
    
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const validData = registerSchema.parse(body);

    // Check if user exists
    const existingUsers = await db.select().from(users).where(eq(users.email, validData.email));
    
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validData.password, 10);

    let role = 'client';
    if (body.secretKey) {
      if (body.secretKey !== 'SURYA_ADMIN_SECURE') {
        return NextResponse.json({ error: 'Invalid admin secret key' }, { status: 403 });
      }
      role = 'admin';
    }

    // Create user
    const newUser = {
      id: crypto.randomUUID(),
      email: validData.email,
      name: validData.fullName,
      companyName: validData.companyName || null,
      phone: validData.phone || null,
      password: hashedPassword,
      role: role,
      createdAt: new Date(),
    };

    await db.insert(users).values(newUser);

    return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
