import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Dynamically connect to the blog platform's SQLite database via a Python script
    const dbPath = path.resolve(process.cwd(), '../blog_platform/db.sqlite3').replace(/\\/g, '/');
    
    // Python script to fetch from SQLite and print JSON
    const pythonScript = `
import sqlite3
import json

conn = sqlite3.connect('${dbPath}')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

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
conn.close()
    `;

    const { stdout } = await execAsync(`py -c "${pythonScript.replace(/"/g, '\\"')}"`);
    const blogPosts = JSON.parse(stdout);

    if (!blogPosts || blogPosts.length === 0) {
      return NextResponse.json({ message: 'No blog posts found to sync.' });
    }

    // Connect to Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Or service_role if available
    );

    let syncedCount = 0;

    // Sync each post to portfolio_projects
    for (const post of blogPosts) {
      // Map Django blog_post to portfolio_projects
      const projectData = {
        slug: post.slug,
        title: post.title,
        category: post.category_name || 'Blog Project',
        description: `${post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 200)}\n\nPrice: ${post.project_price || 'N/A'}\n\nRead more details: https://blogcraft.pythonanywhere.com/blog/${post.slug}/`,
        image: post.featured_image ? `https://blogcraft.pythonanywhere.com/media/${post.featured_image}` : '/images/placeholder.jpg',
        tech_array: post.tags || [],
        year: post.created_at ? post.created_at.substring(0, 4) : new Date().getFullYear().toString(),
        link: post.project_live_url || '',
        buyable: false,
        hide_link: !post.project_live_url
      };

      // Check if project exists by slug
      const { data: existing } = await supabase
        .from('portfolio_projects')
        .select('id')
        .eq('slug', post.slug)
        .single();

      if (existing) {
        // Update
        await supabase
          .from('portfolio_projects')
          .update(projectData)
          .eq('id', existing.id);
      } else {
        // Insert
        await supabase
          .from('portfolio_projects')
          .insert([projectData]);
      }
      
      syncedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: \`Successfully synced \${syncedCount} projects from blog platform to portfolio.\`,
      data: blogPosts 
    });

  } catch (error: any) {
    console.error('Sync Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
