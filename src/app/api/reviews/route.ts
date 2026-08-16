import { NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// GET /api/reviews - Fetch all approved/public reviews (or all reviews if admin)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get('all') === 'true';

    let condition = eq(reviews.isApproved, true);

    if (fetchAll) {
      const session = await getServerSession(authOptions);
      if (session?.user?.role === 'admin') {
        condition = undefined as any; // No filter
      }
    }

    const query = db
      .select({
        id: reviews.id,
        name: reviews.name,
        role: reviews.role,
        content: reviews.content,
        rating: reviews.rating,
        isApproved: reviews.isApproved,
        created_at: reviews.createdAt,
      })
      .from(reviews);

    if (condition) {
      query.where(condition);
    }
    
    const fetchedReviews = await query.orderBy(desc(reviews.createdAt));

    return NextResponse.json({ reviews: fetchedReviews });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews - Submit a new review
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, content, rating } = body;

    if (!name || !content || !rating) {
      return NextResponse.json({ error: 'Name, content, and rating are required' }, { status: 400 });
    }

    await db.insert(reviews).values({
      id: crypto.randomUUID(),
      name,
      role: role || 'Client',
      content,
      rating: Number(rating),
      isApproved: false, // Default to false
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Review submitted successfully and is pending approval.' }, { status: 201 });
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
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
