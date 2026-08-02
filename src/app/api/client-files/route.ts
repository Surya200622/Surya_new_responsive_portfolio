import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const folderPath = `client-files/${userId}`;

    // Note: Cloudinary Admin API has rate limits, this is fine for a small dashboard
    const searchResult = await cloudinary.search
      .expression(`folder:${folderPath}`)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const realFiles = searchResult.resources.map((f: any) => ({
      name: f.filename,
      public_id: f.public_id,
      created_at: f.created_at,
      metadata: { size: f.bytes, mimetype: `${f.resource_type}/${f.format}` }
    }));

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
    const buffer = await file.arrayBuffer();
    const fileBytes = Buffer.from(buffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `client-files/${userId}`,
          public_id: `${Date.now()}_${file.name.split('.')[0]}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(fileBytes);
    });

    return NextResponse.json({ success: true, filePath: (uploadResult as any).public_id });
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
    // For Cloudinary, fileName passed here is actually the public_id or filename
    // If they pass public_id, we can destroy directly.
    // Wait, the client might just pass the filename. If so, public_id is `client-files/${userId}/${fileName}`.
    // Actually the POST returns `filePath: public_id`. So fileName in DELETE is likely the public_id.
    const publicId = fileName.includes('client-files/') ? fileName : `client-files/${userId}/${fileName.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    await cloudinary.uploader.destroy(publicId); // also try default (image)

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting client file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
