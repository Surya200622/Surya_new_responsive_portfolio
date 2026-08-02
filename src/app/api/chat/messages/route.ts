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
    const { receiverId, content, fileUrl, fileName, projectId } = await request.json();

    if (!receiverId || (!content && !fileUrl)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newMessage] = await db.insert(messages).values({
      id: crypto.randomUUID(),
      senderId: currentUserId,
      receiverId,
      projectId: projectId || null,
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

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
      return NextResponse.json({ error: 'Missing message id' }, { status: 400 });
    }

    // Find message
    const [msg] = await db.select().from(messages).where(eq(messages.id, messageId));
    if (!msg) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Check permissions
    if (session.user.role !== 'admin' && msg.senderId !== currentUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete from Cloudinary if there's a file
    if (msg.fileUrl && msg.fileUrl.includes('cloudinary.com')) {
      const urlParts = msg.fileUrl.split('/');
      const folderAndFile = urlParts.slice(-2).join('/'); // 'chat_attachments/filename.pdf'
      const publicId = folderAndFile.substring(0, folderAndFile.lastIndexOf('.'));
      
      if (publicId) {
        // Import inline so it works if not used at the top
        const cloudinary = require('@/lib/cloudinary').default;
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        await cloudinary.uploader.destroy(publicId); // default image type
      }
    }

    // Delete from db
    await db.delete(messages).where(eq(messages.id, messageId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
