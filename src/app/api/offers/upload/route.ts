import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('offers')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabaseAdmin.storage
      .from('offers')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error: any) {
    console.error('Error uploading offer image:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload' }, { status: 500 });
  }
}
