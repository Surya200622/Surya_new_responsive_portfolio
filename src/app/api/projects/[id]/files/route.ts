import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projectFiles } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

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

    const buffer = await file.arrayBuffer();
    const fileBytes = Buffer.from(buffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `project-files/${projectId}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(fileBytes);
    });

    const publicUrl = (uploadResult as any).secure_url;

    // Save to Drizzle DB
    const [newFile] = await db.insert(projectFiles).values({
      id: crypto.randomUUID(),
      projectId,
      fileName: file.name,
      fileUrl: publicUrl,
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

    // Extract public ID from Cloudinary URL (e.g. project-files/projectId/filename)
    const urlParts = url.split('/');
    const folderAndFile = urlParts.slice(-2).join('/');
    const publicId = folderAndFile.substring(0, folderAndFile.lastIndexOf('.'));
    
    // Remove from storage
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }); // might be image/raw/video, use 'image' by default or try both?
      // Better: just delete it without knowing resource type by trying raw and image
      await cloudinary.uploader.destroy(publicId); 
    }
    
    // Remove from DB
    await db.delete(projectFiles).where(eq(projectFiles.id, fileId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
