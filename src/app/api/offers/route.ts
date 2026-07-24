import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getBrandEmailTemplate } from '@/lib/email-template';
import { PROJECT_TYPES } from '@/data/calculatorData';

// POST: Create a new offer and optionally send it via email to clients
export async function POST(req: Request) {
  try {
    const { title, description, discount_percentage, valid_until, send_email, image_url } = await req.json();

    if (!title || !description || !valid_until) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use service role key to bypass RLS for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Insert offer into Supabase
    const { data: offer, error: insertError } = await supabaseAdmin
      .from('offers')
      .insert([
        {
          title,
          description,
          discount_percentage: discount_percentage || 0,
          valid_until,
          image_url: image_url || null,
          is_active: true
        }
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 2. Broadcast via Email if requested
    if (send_email) {
      // Fetch all clients
      const { data: clients, error: clientError } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name')
        .eq('role', 'client');

      if (!clientError && clients && clients.length > 0) {
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Determine if there is a specific project type associated with this offer
        let serviceQuery = '';
        const offerTitleLower = title.toLowerCase();
        const matchedProject = PROJECT_TYPES.find((p: any) => {
          const nameLower = p.name.toLowerCase();
          const idLower = p.id.toLowerCase();
          const firstWord = nameLower.split(' ')[0];
          return offerTitleLower.includes(nameLower) || 
                 offerTitleLower.includes(idLower) || 
                 offerTitleLower.includes(firstWord);
        });
        
        if (matchedProject) {
          serviceQuery = `?service=${matchedProject.id}`;
        }

        const emailContent = `
          <h2 style="color: #f97316; margin-bottom: 10px;">${discount_percentage ? `${discount_percentage}% OFF!` : 'New Special Offer!'}</h2>
          ${image_url ? `<img src="${image_url}" alt="${title}" style="max-width: 100%; border-radius: 12px; margin-bottom: 20px;" />` : ''}
          <p>${description.replace(/\n/g, '<br>')}</p>
          <div class="data-box" style="margin-top: 20px;">
            <div class="data-label">Valid Until</div>
            <div class="data-value" style="color: #f97316;">${(() => { const d = new Date(valid_until); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; })()}</div>
          </div>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://suryacs.is-a.dev'}/${serviceQuery}#calculator" class="button">
              Claim Offer Now
            </a>
          </div>
        `;

        const htmlTemplate = getBrandEmailTemplate(`Exclusive Offer: ${title}`, emailContent, 'You have a new exclusive freelance offer');

        // Send to all clients
        const emailPromises = clients.map(client => {
          if (client.email) {
            return resend.emails.send({
              from: `Surya CS <noreply@${process.env.RESEND_FROM_EMAIL?.split('@')[1] || 'suryacs.is-a.dev'}>`,
              to: client.email,
              subject: `Exclusive Offer: ${title}`,
              html: htmlTemplate,
            });
          }
        });

        await Promise.all(emailPromises);
      }
    }

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error('Offers API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}

// GET: Fetch active offers (public)
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: offers, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .gt('valid_until', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ offers });
  } catch (error: any) {
    console.error('Fetch offers error:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}
