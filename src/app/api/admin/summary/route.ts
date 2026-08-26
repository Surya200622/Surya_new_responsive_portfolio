export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, projects, messages, quotations, subscribers } from '@/db/schema';
import { eq, inArray, and, notInArray, desc, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    // 1. Client count
    const [clientCountRes] = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'client'));
    const clientCount = clientCountRes.count;

    // 2. Active Projects count
    const [projectCountRes] = await db.select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(notInArray(projects.status, ['Completed', 'Cancelled', 'completed', 'cancelled']));
    const projectCount = projectCountRes.count;

    // 3. Unread Messages count for admin
    const [unreadCountRes] = await db.select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(and(eq(messages.receiverId, userId), sql`${messages.readAt} IS NULL`));
    
    // 4. Revenue calculation
    const revenueQuots = await db.select({ amount: quotations.amount })
      .from(quotations)
      .where(inArray(quotations.status, ['accepted', 'advance_paid', 'fully_paid']));
    const revenue = revenueQuots.reduce((sum, q) => sum + (q.amount || 0), 0);

    // 5. Recent clients
    const recentClients = await db.select()
      .from(users)
      .where(eq(users.role, 'client'))
      .orderBy(desc(users.createdAt))
      .limit(5);

    // 6. Total Subscribers
    const [subscriberCountRes] = await db.select({ count: sql<number>`count(*)` })
      .from(subscribers);
    const subscriberCount = subscriberCountRes.count;

    return NextResponse.json({
      clientCount,
      projectCount,
      unreadCount: unreadCountRes.count,
      revenue,
      recentClients,
      subscriberCount,
    });
  } catch (error) {
    console.error('Error fetching admin summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

