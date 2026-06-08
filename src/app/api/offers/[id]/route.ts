import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// DELETE: Remove an offer by id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing offer id' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
      .from('offers')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Offers API DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete offer' }, { status: 500 });
  }
}

// PUT: Update an existing offer by id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing offer id' }, { status: 400 });
    }

    const { title, description, discount_percentage, valid_until, image_url } = await req.json();

    if (!title || !description || !valid_until) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: offer, error } = await supabaseAdmin
      .from('offers')
      .update({
        title,
        description,
        discount_percentage: discount_percentage || 0,
        valid_until,
        ...(image_url !== undefined && { image_url })
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error('Offers API PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update offer' }, { status: 500 });
  }
}
