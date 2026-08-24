import { NextResponse } from 'next/server';
import { db } from '@/db';
import { offers, users } from '@/db/schema';
import { eq, desc, and, gt } from 'drizzle-orm';
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

    // 1. Insert offer into Turso
    const newOffer = {
      id: crypto.randomUUID(),
      title,
      description,
      discountPercentage: discount_percentage || 0,
      validUntil: valid_until,
      imageUrl: image_url || null,
      isActive: true,
    };

    await db.insert(offers).values(newOffer);

    // 2. Broadcast via Email if requested
    if (send_email) {
      // Fetch all clients
      const clients = await db
        .select({
          email: users.email,
          name: users.name,
        })
        .from(users)
        .where(eq(users.role, 'client'));

      if (clients && clients.length > 0) {
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
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://suryacs-web.vercel.app'}/${serviceQuery}#calculator" class="button">
              Claim Offer Now
            </a>
          </div>
        `;

        const htmlTemplate = getBrandEmailTemplate(`Exclusive Offer: ${title}`, emailContent, 'You have a new exclusive freelance offer');

        // Send to all clients
        const emailPromises = clients.map(client => {
          if (client.email) {
            return resend.emails.send({
              from: `Surya CS <noreply@${process.env.RESEND_FROM_EMAIL?.split('@')[1] || 'suryacs-web.vercel.app'}>`,
              to: client.email,
              subject: `Exclusive Offer: ${title}`,
              html: htmlTemplate,
            });
          }
        });

        await Promise.all(emailPromises);
      }
    }

    return NextResponse.json({ success: true, offer: newOffer });
  } catch (error: any) {
    console.error('Offers API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}

// GET: Fetch active offers (public)
export async function GET() {
  try {
    const fetchedOffers = await db
      .select()
      .from(offers)
      .where(
        and(
          eq(offers.isActive, true),
          gt(offers.validUntil, new Date().toISOString())
        )
      )
      .orderBy(desc(offers.createdAt));

    return NextResponse.json({ offers: fetchedOffers });
  } catch (error: any) {
    console.error('Fetch offers error:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}
