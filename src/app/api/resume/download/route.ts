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

      // Force download for Cloudinary URLs by adding fl_attachment
      if (typeof resumeUrl === 'string' && resumeUrl.includes('cloudinary.com')) {
        if (!resumeUrl.includes('fl_attachment')) {
          resumeUrl = resumeUrl.replace('/upload/', '/upload/fl_attachment/');
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
