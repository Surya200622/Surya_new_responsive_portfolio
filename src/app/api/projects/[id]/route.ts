import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
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

    const projectResults = await db.select().from(projects).where(eq(projects.id, id));
    const project = projectResults[0];

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updateData: any = { 
      status: body.status !== undefined ? body.status : project.status,
      budget: body.budget !== undefined ? body.budget : project.budget,
      title: body.title !== undefined ? body.title : project.title,
      timeline: body.timeline !== undefined ? body.timeline : project.timeline,
      description: body.description !== undefined ? body.description : project.description
    };

    if (body.status === 'Development Phase' && !project.startedAt) {
      updateData.startedAt = new Date();
    }

    await db.update(projects)
      .set(updateData)
      .where(eq(projects.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
