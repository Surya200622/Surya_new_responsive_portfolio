import { NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
// Import authOptions if available, otherwise just use getServerSession()

export async function GET() {
  try {
    const session = await getServerSession();
    // Assuming simple role check or basic auth if session exists
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userSetting = await db.select().from(siteSettings).where(eq(siteSettings.key, 'EMAIL_USER')).limit(1);
    
    return NextResponse.json({ 
      emailUser: userSetting.length > 0 ? userSetting[0].value : '',
      // DO NOT return the password to the frontend for security reasons
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emailUser, emailPass } = await req.json();

    if (!emailUser || !emailPass) {
      return NextResponse.json({ error: 'Email User and Password are required' }, { status: 400 });
    }

    // Upsert EMAIL_USER
    const existingUser = await db.select().from(siteSettings).where(eq(siteSettings.key, 'EMAIL_USER')).limit(1);
    if (existingUser.length > 0) {
      await db.update(siteSettings).set({ value: emailUser, updatedAt: new Date() }).where(eq(siteSettings.key, 'EMAIL_USER'));
    } else {
      await db.insert(siteSettings).values({ id: crypto.randomUUID(), key: 'EMAIL_USER', value: emailUser, updatedAt: new Date() });
    }

    // Upsert EMAIL_PASS
    const existingPass = await db.select().from(siteSettings).where(eq(siteSettings.key, 'EMAIL_PASS')).limit(1);
    if (existingPass.length > 0) {
      await db.update(siteSettings).set({ value: emailPass, updatedAt: new Date() }).where(eq(siteSettings.key, 'EMAIL_PASS'));
    } else {
      await db.insert(siteSettings).values({ id: crypto.randomUUID(), key: 'EMAIL_PASS', value: emailPass, updatedAt: new Date() });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
