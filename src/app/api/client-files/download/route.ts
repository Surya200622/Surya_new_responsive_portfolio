import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileName } = await request.json();
    if (!fileName) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
    }

    const userId = session.user.id;
    const filePath = `${userId}/${fileName}`;
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin.storage
      .from('client-files')
      .createSignedUrl(filePath, 60);

    if (error) throw error;

    return NextResponse.json({ url: data.signedUrl });
  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
