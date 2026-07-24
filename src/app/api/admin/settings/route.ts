import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/admin/settings?key=calculator_enabled
// Public endpoint — anyone can read site settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    const settings = await db.select().from(siteSettings).where(eq(siteSettings.key, key));

    if (settings.length === 0) {
      // If the setting doesn't exist, return a default
      return NextResponse.json({ key, value: true });
    }

    let parsedValue = settings[0].value;
    try {
      parsedValue = JSON.parse(parsedValue);
    } catch {
      // Keep as string if it isn't JSON
    }

    return NextResponse.json({ key, value: parsedValue });
  } catch (e) {
    console.error('Settings GET error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/settings
// Admin-only endpoint — updates a site setting
export async function PATCH(request: NextRequest) {
  try {
    // Verify the user is an admin
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 });
    }

    const valueStr = JSON.stringify(value);

    // Drizzle ORM upsert for SQLite
    await db.insert(siteSettings)
      .values({
        id: crypto.randomUUID(),
        key,
        value: valueStr,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: valueStr, updatedAt: new Date() },
      });

    return NextResponse.json({ success: true, key, value });
  } catch (e) {
    console.error('Settings PATCH error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
