export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, messages } from '@/db/schema';
import { eq, or, and, desc, isNull } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminId = session.user.id;

    // Fetch all clients
    const clientsData = await db.select({
      id: users.id,
      full_name: users.name,
      email: users.email,
      company_name: users.companyName,
      avatar_url: users.image
    }).from(users).where(eq(users.role, 'client'));

    // Fetch last messages and unread counts for each client
    const clientsWithMessages = await Promise.all(
      clientsData.map(async (client) => {
        // Last message
        const lastMsgData = await db.select()
          .from(messages)
          .where(
            or(
              and(eq(messages.senderId, adminId), eq(messages.receiverId, client.id)),
              and(eq(messages.senderId, client.id), eq(messages.receiverId, adminId))
            )
          )
          .orderBy(desc(messages.createdAt))
          .limit(1);

        const lastMsg = lastMsgData[0];

        // Unread count
        const unreadMsgs = await db.select({ id: messages.id })
          .from(messages)
          .where(
            and(
              eq(messages.senderId, client.id),
              eq(messages.receiverId, adminId),
              isNull(messages.readAt)
            )
          );

        return {
          ...client,
          lastMessage: lastMsg ? {
            content: lastMsg.content,
            created_at: lastMsg.createdAt.toISOString(),
            unread_count: unreadMsgs.length
          } : null
        };
      })
    );

    return NextResponse.json({ clients: clientsWithMessages, currentUserId: adminId });
  } catch (error: any) {
    console.error('Error fetching admin chat clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}
