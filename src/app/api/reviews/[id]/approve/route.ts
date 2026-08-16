import { NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    await db.update(reviews)
      .set({ isApproved: body.isApproved })
      .where(eq(reviews.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Approve review error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
