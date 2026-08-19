import { NextResponse } from 'next/server';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates: { id: number, sortOrder: number }[] = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Update each project's sort order
    await db.transaction(async (tx) => {
      for (const update of updates) {
        await tx
          .update(portfolioProjects)
          .set({ sortOrder: update.sortOrder })
          .where(eq(portfolioProjects.id, update.id));
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering portfolio projects:', error);
    return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 500 });
  }
}
