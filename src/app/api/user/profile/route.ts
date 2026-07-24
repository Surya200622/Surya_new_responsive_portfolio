import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    const userResults = await db.select().from(users).where(eq(users.id, userId));
    const user = userResults[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map `users` table to `Profile` shape for the frontend
    const profile = {
      id: user.id,
      full_name: user.name,
      email: user.email,
      company_name: user.companyName,
      phone: user.phone,
      role: user.role,
      avatar_url: user.image,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const body = await req.json();

    const updates: any = {};
    if (body.full_name !== undefined) updates.name = body.full_name;
    if (body.company_name !== undefined) updates.companyName = body.company_name;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.avatar_url !== undefined) updates.image = body.avatar_url;

    if (body.new_password) {
      updates.password = await bcrypt.hash(body.new_password, 10);
    }

    await db.update(users).set(updates).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
