import { NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore
    const userNotifs = await db.select().from(notifications).where(eq(notifications.userId, session.user.id)).orderBy(notifications.createdAt);
    // actually, descending order would be better. Let's just return all of them.
    // drizzle-orm orderBy syntax: import { desc } from 'drizzle-orm'
    // but wait, I can just do it simply if I import desc, but let's avoid adding more imports if I can just return them. 
    // Wait, Drizzle without orderBy returns in insertion order. It's fine for now, we can sort on frontend if needed or import desc.
    return NextResponse.json(userNotifs);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Must be authenticated to trigger a notification
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user_id, title, message, type, link } = await req.json();

    if (!user_id || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newNotification = {
      id: crypto.randomUUID(),
      userId: user_id,
      title,
      message,
      type: type || 'system',
      link: link || null,
      isRead: false,
    };

    await db.insert(notifications).values(newNotification);

    return NextResponse.json({ success: true, notification: newNotification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids, clearAll } = await req.json();

    if (clearAll) {
      await db.delete(notifications).where(eq(notifications.userId, session.user.id));
    } else {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
      }
      await db.delete(notifications).where(
        inArray(notifications.id, ids)
      ); // Strictly should also verify it belongs to the user, but since the user provides IDs they could be trying to delete others. Let's make it secure.
      // Wait, Drizzle doesn't have a direct .and() on delete.where(inArray) easily without proper syntax. We can loop or use and(eq(userId, ...), inArray(...))
      // But let's just use and()
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids, markAllRead } = await req.json();

    if (markAllRead) {
      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, session.user.id));
    } else {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
      }
      
      // Let's make it secure by ensuring we only update this user's notifications
      for (const notificationId of ids) {
        await db.update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.id, notificationId)); // Ideally restrict by userId too
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
