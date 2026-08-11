import { NextResponse } from 'next/server';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const projects = await db.select().from(portfolioProjects).orderBy(desc(portfolioProjects.createdAt));
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const [newProject] = await db.insert(portfolioProjects).values({
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
      offersDiscountPrice: body.offers_discount_price?.toString(),
      buyable: body.buyable,
      hideLink: body.hide_link,
      createdAt: new Date()
    }).returning();

    return NextResponse.json(newProject);
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
