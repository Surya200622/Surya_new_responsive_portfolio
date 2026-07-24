import { NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { unreadIds } = await request.json();

    if (!unreadIds || !Array.isArray(unreadIds) || unreadIds.length === 0) {
      return NextResponse.json({ success: true }); // Nothing to update
    }

    // Only update messages where the current user is the receiver
    await db.update(messages)
      .set({ readAt: new Date() })
      .where(
        and(
          inArray(messages.id, unreadIds),
          eq(messages.receiverId, currentUserId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 });
  }
}
