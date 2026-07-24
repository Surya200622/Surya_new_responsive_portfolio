import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const supabaseAdmin = createAdminClient();
    const folderPath = `${userId}/`;

    const { data: fileList, error: listError } = await supabaseAdmin.storage
      .from('client-files')
      .list(folderPath, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const realFiles = (fileList || []).filter(f => f.name !== '.emptyFolderPlaceholder');
    return NextResponse.json(realFiles);
  } catch (error: any) {
    console.error('Error fetching client files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const userId = session.user.id;
    const filePath = `${userId}/${Date.now()}_${file.name}`;
    const supabaseAdmin = createAdminClient();

    const { error: uploadError } = await supabaseAdmin.storage
      .from('client-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    return NextResponse.json({ success: true, filePath });
  } catch (error: any) {
    console.error('Error uploading client file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const { error } = await supabaseAdmin.storage
      .from('client-files')
      .remove([filePath]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting client file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
