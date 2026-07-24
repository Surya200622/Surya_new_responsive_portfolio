import { NextResponse } from 'next/server';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Dynamically connect to the blog platform's SQLite database via a Python script
    const dbPath = path.resolve(process.cwd(), '../blog_platform/db.sqlite3').replace(/\\/g, '/');
    
    // Python script to fetch from SQLite and print JSON
    const pythonScript = `
import sqlite3
import json
import sys
import os

if not os.path.exists('${dbPath}'):
    print(json.dumps({"error": "Database not found"}))
    sys.exit(0)

conn = sqlite3.connect('${dbPath}')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

try:
    cursor.execute("""
        SELECT p.title, p.slug, p.content, p.excerpt, p.featured_image, 
               p.created_at, p.project_live_url, p.project_price, c.name as category_name
        FROM blog_post p
        LEFT JOIN blog_category c ON p.category_id = c.id
        WHERE p.status = 'published'
    """)
    posts = [dict(r) for r in cursor.fetchall()]

    # Get tags
    for post in posts:
        cursor.execute("""
            SELECT t.name 
            FROM blog_tag t
            JOIN blog_post_tags pt ON pt.tag_id = t.id
            JOIN blog_post bp ON pt.post_id = bp.id
            WHERE bp.slug = ?
        """, (post['slug'],))
        post['tags'] = [r['name'] for r in cursor.fetchall()]

    print(json.dumps(posts))
except sqlite3.OperationalError as e:
    print(json.dumps({"error": str(e)}))
finally:
    conn.close()
    `;

    let blogPosts = [];
    try {
      const { stdout } = await execAsync(`py -c "${pythonScript.replace(/"/g, '\\"')}"`);
      const result = JSON.parse(stdout);
      
      if (result.error) {
        console.warn('Blog DB error (may not exist locally):', result.error);
        return NextResponse.json({ message: 'Blog DB not found or missing tables, skipping sync.', error: result.error });
      }
      
      blogPosts = result;
    } catch (execError) {
      console.warn('Python execution failed (may not have python installed locally):', execError);
      return NextResponse.json({ message: 'Could not run Python script to sync blog.', error: String(execError) });
    }

    if (!blogPosts || blogPosts.length === 0) {
      return NextResponse.json({ message: 'No blog posts found to sync.' });
    }

    let syncedCount = 0;

    // Sync each post to portfolio_projects in Turso
    for (const post of blogPosts) {
      // Map Django blog_post to portfolio_projects
      const projectData = {
        slug: post.slug,
        title: post.title,
        category: post.category_name || 'Blog Project',
        description: `${post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 200)}\n\nPrice: ${post.project_price || 'N/A'}\n\nRead more details: https://blogcraft.pythonanywhere.com/blog/${post.slug}/`,
        image: post.featured_image ? `https://blogcraft.pythonanywhere.com/media/${post.featured_image}` : '/images/placeholder.jpg',
        techArray: JSON.stringify(post.tags || []),
        year: post.created_at ? post.created_at.substring(0, 4) : new Date().getFullYear().toString(),
        link: post.project_live_url || '',
        buyable: false,
        hideLink: !post.project_live_url,
        projectPrice: post.project_price ? String(post.project_price) : null,
      };

      // Check if project exists by slug
      const existingProjects = await db.select({ id: portfolioProjects.id }).from(portfolioProjects).where(eq(portfolioProjects.slug, post.slug));
      
      if (existingProjects.length > 0) {
        // Update
        await db.update(portfolioProjects)
          .set(projectData)
          .where(eq(portfolioProjects.id, existingProjects[0].id));
      } else {
        // Insert
        await db.insert(portfolioProjects).values(projectData);
      }
      
      syncedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${syncedCount} projects from blog platform to portfolio.`,
      data: blogPosts 
    });

  } catch (error: any) {
    console.error('Sync Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
