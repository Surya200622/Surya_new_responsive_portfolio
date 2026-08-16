import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pageViews } from '@/db/schema';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path, userAgent } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Hash the IP address for privacy
    // Note: In Next.js App Router, getting IP depends on deployment (e.g. Vercel headers)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : (realIp || 'unknown');
    
    let ipHash = 'unknown';
    if (ip !== 'unknown') {
      ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    }

    await db.insert(pageViews).values({
      id: crypto.randomUUID(),
      path,
      userAgent: userAgent || req.headers.get('user-agent') || 'unknown',
      ipHash,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
