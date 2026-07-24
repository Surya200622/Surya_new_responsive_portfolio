import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projectFiles } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    const files = await db
      .select()
      .from(projectFiles)
      .where(eq(projectFiles.projectId, projectId))
      .orderBy(desc(projectFiles.createdAt));

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching project files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    const formData = await request.formData();
    
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${projectId}/${fileName}`;

    // Upload to Supabase Storage using admin client
    const { error: uploadError } = await supabaseAdmin.storage
      .from('project-files')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('project-files')
      .getPublicUrl(filePath);

    // Save to Drizzle DB
    const [newFile] = await db.insert(projectFiles).values({
      id: crypto.randomUUID(),
      projectId,
      fileName: file.name,
      fileUrl: publicUrlData.publicUrl,
      fileType: file.type,
      fileSize: file.size,
      category,
      createdAt: new Date()
    }).returning();

    return NextResponse.json(newFile);
  } catch (error: any) {
    console.error('Error uploading project file:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const url = searchParams.get('url');

    if (!fileId || !url) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const path = url.split('/').slice(-2).join('/');
    const supabaseAdmin = createAdminClient();

    // Remove from storage
    await supabaseAdmin.storage.from('project-files').remove([path]);
    
    // Remove from DB
    await db.delete(projectFiles).where(eq(projectFiles.id, fileId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
