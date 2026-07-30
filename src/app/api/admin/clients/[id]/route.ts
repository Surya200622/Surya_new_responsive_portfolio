import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, projects, messages, quotations, reviews, notifications, accounts, sessions, invoices, projectFiles } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientId } = await params;

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    // Verify the caller is an authenticated admin
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Prevent admin from deleting themselves
    if (clientId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Delete associated data first to prevent foreign key constraint failures
    await db.delete(messages).where(or(eq(messages.senderId, clientId), eq(messages.receiverId, clientId)));
    await db.delete(notifications).where(eq(notifications.userId, clientId));
    await db.delete(reviews).where(eq(reviews.clientId, clientId));
    await db.delete(quotations).where(eq(quotations.clientId, clientId));

    // Handle projects and their related data
    const userProjects = await db.select({ id: projects.id }).from(projects).where(eq(projects.clientId, clientId));
    for (const p of userProjects) {
      await db.delete(invoices).where(eq(invoices.projectId, p.id));
      await db.delete(quotations).where(eq(quotations.projectId, p.id));
      await db.delete(projectFiles).where(eq(projectFiles.projectId, p.id));
      await db.delete(projects).where(eq(projects.id, p.id));
    }

    await db.delete(accounts).where(eq(accounts.userId, clientId));
    await db.delete(sessions).where(eq(sessions.userId, clientId));

    // Delete user from Turso
    await db.delete(users).where(eq(users.id, clientId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/clients/[id]:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
