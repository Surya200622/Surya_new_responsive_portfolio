import { NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, or, and, asc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('otherUserId');

    if (!otherUserId) {
      return NextResponse.json({ error: 'Missing otherUserId' }, { status: 400 });
    }

    const currentUserId = session.user.id;

    const chatMessages = await db.select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, currentUserId), eq(messages.receiverId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.receiverId, currentUserId))
        )
      )
      .orderBy(asc(messages.createdAt));

    return NextResponse.json(chatMessages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { receiverId, content, fileUrl, fileName } = await request.json();

    if (!receiverId || (!content && !fileUrl)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newMessage] = await db.insert(messages).values({
      id: crypto.randomUUID(),
      senderId: currentUserId,
      receiverId,
      content: content || "",
      fileUrl,
      fileName,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
