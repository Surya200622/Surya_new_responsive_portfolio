export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, projects, messages, quotations, pageViews, subscribers } from '@/db/schema';
import { eq, inArray, and, notInArray, desc, sql, gte } from 'drizzle-orm';
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

    // 7. Page Views last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const views = await db.select({
      timestamp: pageViews.timestamp,
    })
    .from(pageViews)
    .where(gte(pageViews.timestamp, thirtyDaysAgo));

    // Group by day format YYYY-MM-DD
    const viewsByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      viewsByDay[dateStr] = 0;
    }

    views.forEach(v => {
      if (v.timestamp) {
        const d = new Date(v.timestamp);
        const dateStr = d.toISOString().split('T')[0];
        if (viewsByDay[dateStr] !== undefined) {
          viewsByDay[dateStr]++;
        }
      }
    });

    const pageViewsData = Object.keys(viewsByDay).map(date => ({
      date: date.split('-').slice(1).join('/'), // MM/DD
      views: viewsByDay[date]
    }));

    return NextResponse.json({
      clientCount,
      projectCount,
      unreadCount: unreadCountRes.count,
      revenue,
      recentClients,
      subscriberCount,
      pageViewsData
    });
  } catch (error) {
    console.error('Error fetching admin summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

