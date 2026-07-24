import { NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/reviews - Fetch all approved/public reviews
export async function GET() {
  try {
    const fetchedReviews = await db
      .select({
        id: reviews.id,
        name: reviews.name,
        role: reviews.role,
        content: reviews.content,
        rating: reviews.rating,
        created_at: reviews.createdAt,
      })
      .from(reviews)
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ reviews: fetchedReviews });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

// DELETE /api/reviews - Securely delete a review
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // A user can only delete their own review
    await db.delete(reviews).where(eq(reviews.clientId, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete review' }, { status: 500 });
  }
}
