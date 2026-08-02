import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projectFiles, messages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let fileUrl = '';

    if (type === 'project_file') {
      const [file] = await db.select().from(projectFiles).where(eq(projectFiles.id, id));
      if (!file) return NextResponse.json({ error: 'File not found' }, { status: 404 });
      fileUrl = file.fileUrl;
      await db.delete(projectFiles).where(eq(projectFiles.id, id));
    } else if (type === 'chat_attachment') {
      const [msg] = await db.select().from(messages).where(eq(messages.id, id));
      if (!msg) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      fileUrl = msg.fileUrl || '';
      await db.delete(messages).where(eq(messages.id, id));
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Delete from Cloudinary
    if (fileUrl && fileUrl.includes('cloudinary.com')) {
      const urlParts = fileUrl.split('/');
      const folderAndFile = urlParts.slice(-2).join('/');
      const publicId = folderAndFile.substring(0, folderAndFile.lastIndexOf('.'));
      
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        await cloudinary.uploader.destroy(publicId); 
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
