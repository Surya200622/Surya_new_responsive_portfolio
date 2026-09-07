import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { like } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await db.select().from(siteSettings).where(like(siteSettings.key, 'telegram_cmd_%'));
    
    const result = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(result);
  } catch (e) {
    console.error('Telegram Settings GET error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const inserts = Object.entries(body)
      .filter(([key]) => key.startsWith('telegram_cmd_'))
      .map(([key, value]) => ({
        id: crypto.randomUUID(),
        key,
        value: value as string,
        updatedAt: new Date(),
      }));

    if (inserts.length === 0) {
      return NextResponse.json({ success: true });
    }

    for (const item of inserts) {
      await db.insert(siteSettings)
        .values(item)
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: item.value, updatedAt: item.updatedAt },
        });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Telegram Settings PUT error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
