import { NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.key, 'resume_url')).limit(1);
    let resumeUrl = result[0]?.value;

    if (resumeUrl) {
      try {
        resumeUrl = JSON.parse(resumeUrl);
      } catch (e) {
        // ignore if not JSON
      }

      if (typeof resumeUrl === 'string' && resumeUrl.includes('cloudinary.com')) {
        // Remove fl_attachment as it's not supported for 'raw' resource types on Cloudinary
        resumeUrl = resumeUrl.replace('fl_attachment/', '');
        
        try {
          // Fetch the file and serve it with explicit PDF headers so the browser downloads it correctly
          const response = await fetch(resumeUrl);
          if (response.ok) {
            const blob = await response.blob();
            return new NextResponse(blob, {
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="SuryaCS-resume.pdf"',
              },
            });
          }
        } catch (e) {
          console.error('Failed to proxy resume from Cloudinary:', e);
        }
      }

      return NextResponse.redirect(resumeUrl);
    }

    // Fallback to local public file
    const url = new URL('/SuryaCS-resume.pdf', request.url);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error fetching resume url:', error);
    const url = new URL('/SuryaCS-resume.pdf', request.url);
    return NextResponse.redirect(url);
  }
}
