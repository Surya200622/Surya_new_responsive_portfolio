import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, projects, messages, quotations } from '@/db/schema';
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
      .where(and(eq(messages.receiverId, userId), sql`${messages.readAt} IS NULL`)); // Wait, earlier used `is_read` but in schema we don't have is_read! Let me verify messages table.
      // Wait, let's just use `readAt` IS NULL for now, we'll check schema next.
    
    // 4. Revenue calculation
    const revenueQuots = await db.select({ amount: quotations.amount })
      .from(quotations)
      .where(inArray(quotations.status, ['accepted', 'advance_paid', 'fully_paid']));
    const revenue = revenueQuots.reduce((sum, q) => sum + (q.amount || 0), 0);

    // 5. Recent clients
    const recentClients = await db.select()
      .from(users)
      .where(eq(users.role, 'client'))
      .orderBy(desc(users.id)) // users don't have createdAt, id is ok or we can use another field. Actually schema doesn't have createdAt for users? Let's check.
      .limit(5);

    // If users doesn't have createdAt, sort by ID is best approximation. Wait, did they have createdAt in Turso? Supabase profiles had created_at. NextAuth users table usually doesn't have createdAt unless specified.

    return NextResponse.json({
      clientCount,
      projectCount,
      unreadCount: unreadCountRes.count,
      revenue,
      recentClients,
    });
  } catch (error) {
    console.error('Error fetching admin summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
