import { NextResponse } from 'next/server';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const [updatedProject] = await db.update(portfolioProjects)
      .set({
        slug: body.slug,
        title: body.title,
        category: body.category,
        description: body.description,
        image: body.image,
        techArray: body.tech_array,
        year: body.year,
        link: body.link,
        viewDetailsUrl: body.view_details_url,
        projectPrice: body.project_price?.toString(),
        buyable: body.buyable,
        hideLink: body.hide_link,
      })
      .where(eq(portfolioProjects.id, Number(id)))
      .returning();

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await db.delete(portfolioProjects)
      .where(eq(portfolioProjects.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
