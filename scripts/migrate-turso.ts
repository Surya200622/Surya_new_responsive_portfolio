import { createClient } from '@supabase/supabase-js';
import { db } from '../src/db';
import * as schema from '../src/db/schema';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Starting migration to Turso...');

  // 1. Users (from profiles)
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
  if (pErr) console.error("Error fetching profiles:", pErr);
  if (profiles && profiles.length > 0) {
    for (const p of profiles) {
      try {
        await db.insert(schema.users).values({
          id: p.id,
          name: p.full_name,
          email: p.email || `${p.id}@example.com`,
          role: p.role || 'client',
          companyName: p.company_name,
          phone: p.phone,
        }).onConflictDoNothing();
      } catch (err) {
        console.error("Failed to insert user", p.id, err);
      }
    }
    console.log(`✅ Migrated ${profiles.length} users`);
  }

  // 2. Projects
  const { data: projects, error: prErr } = await supabase.from('projects').select('*');
  if (prErr) console.error("Error fetching projects:", prErr);
  if (projects && projects.length > 0) {
    for (const p of projects) {
      try {
        await db.insert(schema.projects).values({
          id: p.id,
          clientId: p.client_id,
          title: p.project_name || 'Untitled',
          description: p.description,
          budget: p.budget ? (typeof p.budget === 'string' ? parseInt(p.budget.replace(/[^0-9]/g, ''), 10) : Number(p.budget)) : null,
          timeline: p.timeline,
          status: p.status || 'pending',
          createdAt: p.created_at ? new Date(p.created_at) : undefined,
        }).onConflictDoNothing();
      } catch (err) {
        console.error("Failed to insert project", p.id, err);
      }
    }
    console.log(`✅ Migrated ${projects.length} projects`);
  }

  // 3. Quotations
  const { data: quotations, error: qErr } = await supabase.from('quotations').select('*');
  if (qErr) console.error("Error fetching quotations:", qErr);
  if (quotations && quotations.length > 0) {
    for (const q of quotations) {
      try {
        await db.insert(schema.quotations).values({
          id: q.id,
          projectId: q.project_id,
          clientId: q.client_id,
          amount: q.total || 0,
          status: q.status || 'pending',
          createdAt: q.created_at ? new Date(q.created_at) : undefined,
        }).onConflictDoNothing();
      } catch (err) {
         console.error("Failed to insert quotation", q.id, err);
      }
    }
    console.log(`✅ Migrated ${quotations.length} quotations`);
  }

  // 4. Messages
  const { data: messages, error: mErr } = await supabase.from('messages').select('*');
  if (mErr) console.error("Error fetching messages:", mErr);
  if (messages && messages.length > 0) {
    for (const m of messages) {
      try {
        await db.insert(schema.messages).values({
          id: m.id,
          senderId: m.sender_id,
          receiverId: m.receiver_id,
          content: m.content || '',
          readAt: m.is_read ? new Date() : null, // Approx
          createdAt: m.created_at ? new Date(m.created_at) : undefined,
        }).onConflictDoNothing();
      } catch (err) {
        console.error("Failed to insert message", m.id, err);
      }
    }
    console.log(`✅ Migrated ${messages.length} messages`);
  }

  // 5. Reviews
  const { data: reviews, error: rErr } = await supabase.from('reviews').select('*');
  if (rErr) console.error("Error fetching reviews:", rErr);
  if (reviews && reviews.length > 0) {
    for (const r of reviews) {
      try {
        await db.insert(schema.reviews).values({
          id: r.id,
          clientId: r.client_id,
          name: r.name || 'Anonymous',
          role: r.role,
          content: r.content || '',
          rating: r.rating || 5,
          createdAt: r.created_at ? new Date(r.created_at) : undefined,
        }).onConflictDoNothing();
      } catch (err) {
        console.error("Failed to insert review", r.id, err);
      }
    }
    console.log(`✅ Migrated ${reviews.length} reviews`);
  }

  // 6. Portfolio Projects
  const { data: portfolio, error: pfErr } = await supabase.from('portfolio_projects').select('*');
  if (pfErr) console.error("Error fetching portfolio_projects:", pfErr);
  if (portfolio && portfolio.length > 0) {
    for (const p of portfolio) {
      try {
        await db.insert(schema.portfolioProjects).values({
          slug: p.slug,
          title: p.title || 'Untitled',
          category: p.category || 'Web',
          description: p.description || '',
          image: p.image,
          techArray: p.tech_array,
          year: p.year,
          link: p.link,
          buyable: p.buyable,
          hideLink: p.hide_link,
          projectPrice: p.project_price,
          viewDetailsUrl: p.view_details_url,
          createdAt: p.created_at ? new Date(p.created_at) : undefined,
        }).onConflictDoNothing();
      } catch (err) {
         console.error("Failed to insert portfolio project", p.slug, err);
      }
    }
    console.log(`✅ Migrated ${portfolio.length} portfolio projects`);
  }

  // 7. Site Settings
  const { data: settings, error: sErr } = await supabase.from('site_settings').select('*');
  if (sErr) console.error("Error fetching site_settings:", sErr);
  if (settings && settings.length > 0) {
    for (const s of settings) {
      try {
        await db.insert(schema.siteSettings).values({
          id: s.id || crypto.randomUUID(),
          key: s.key,
          value: s.value,
          updatedAt: s.updated_at ? new Date(s.updated_at) : undefined,
        }).onConflictDoNothing();
      } catch (err) {
         console.error("Failed to insert site setting", s.key, err);
      }
    }
    console.log(`✅ Migrated ${settings.length} site settings`);
  }

  // 8. Offers
  const { data: offers, error: oErr } = await supabase.from('offers').select('*');
  if (oErr) console.error("Error fetching offers:", oErr);
  if (offers && offers.length > 0) {
    for (const o of offers) {
      try {
        await db.insert(schema.offers).values({
          id: o.id,
          title: o.title || 'Offer',
          description: o.description || '',
          discountPercentage: o.discount_percentage,
          validUntil: o.valid_until,
          imageUrl: o.image_url,
          isActive: o.is_active,
          createdAt: o.created_at ? new Date(o.created_at) : undefined,
        }).onConflictDoNothing();
      } catch (err) {
         console.error("Failed to insert offer", o.id, err);
      }
    }
    console.log(`✅ Migrated ${offers.length} offers`);
  }
  
  // 9. Notifications
  const { data: notifications, error: nErr } = await supabase.from('notifications').select('*');
  if (nErr) console.error("Error fetching notifications:", nErr);
  if (notifications && notifications.length > 0) {
    for (const n of notifications) {
      try {
        await db.insert(schema.notifications).values({
          id: n.id,
          userId: n.user_id,
          title: n.title || 'Notification',
          message: n.message || '',
          type: n.type || 'system',
          link: n.link,
          isRead: n.is_read || false,
          createdAt: n.created_at ? new Date(n.created_at) : undefined,
        }).onConflictDoNothing();
      } catch (err) {
         console.error("Failed to insert notification", n.id, err);
      }
    }
    console.log(`✅ Migrated ${notifications.length} notifications`);
  }


  console.log('Migration Complete!');
  process.exit(0);
}

migrate();
