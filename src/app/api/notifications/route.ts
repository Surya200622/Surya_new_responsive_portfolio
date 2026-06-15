import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Must be authenticated to trigger a notification
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user_id, title, message, type, link } = await req.json();

    if (!user_id || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use admin client to safely insert notifications, bypassing any RLS restrictions
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        type: type || 'system',
        link,
        is_read: false
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids, clearAll } = await req.json();

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabaseAdmin.from('notifications').delete().eq('user_id', user.id);

    if (!clearAll) {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
      }
      query = query.in('id', ids);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids, markAllRead } = await req.json();

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabaseAdmin.from('notifications').update({ is_read: true }).eq('user_id', user.id);

    if (!markAllRead) {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
      }
      query = query.in('id', ids);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
