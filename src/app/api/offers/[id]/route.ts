import { NextResponse } from 'next/server';
import { db } from '@/db';
import { offers } from '@/db/schema';
import { eq } from 'drizzle-orm';

// DELETE: Remove an offer by id
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing offer id' }, { status: 400 });
    }

    await db.delete(offers).where(eq(offers.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Offers API DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete offer' }, { status: 500 });
  }
}

// PUT: Update an existing offer by id
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing offer id' }, { status: 400 });
    }

    const { title, description, discount_percentage, valid_until, image_url } = await req.json();

    if (!title || !description || !valid_until) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedOffer = {
      title,
      description,
      discountPercentage: discount_percentage || 0,
      validUntil: valid_until,
      ...(image_url !== undefined && { imageUrl: image_url })
    };

    const result = await db.update(offers)
      .set(updatedOffer)
      .where(eq(offers.id, id))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
    }

    return NextResponse.json({ success: true, offer: result[0] });
  } catch (error: any) {
    console.error('Offers API PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update offer' }, { status: 500 });
  }
}

// GET: Fetch a single offer by id
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing offer id' }, { status: 400 });
    }

    const fetchedOffers = await db.select().from(offers).where(eq(offers.id, id));

    if (fetchedOffers.length === 0) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ offer: fetchedOffers[0] });
  } catch (error: any) {
    console.error('Fetch single offer error:', error);
    return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 });
  }
}
