import { NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.key, 'resume_url')).limit(1);
    const resumeUrl = result[0]?.value;

    if (resumeUrl) {
      // Append fl_attachment to Cloudinary URLs to force download if desired,
      // but redirecting to the URL is generally sufficient.
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
