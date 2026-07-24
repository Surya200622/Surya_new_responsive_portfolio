import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';
import { getBrandEmailTemplate } from '@/lib/email-template';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Use admin client to bypass RLS for inserting records
    const supabaseAdmin = createAdminClient();

    // === ENSURE PROFILE EXISTS ===
    // Some users (Google OAuth, auto-confirmed) may not have a profiles row
    // if the handle_new_user trigger failed or didn't fire.
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingProfile) {
      // Profile doesn't exist — create one from auth metadata
      const meta = user.user_metadata || {};
      const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'User';
      const email = user.email || '';

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fullName,
          email: email,
          company_name: meta.company_name || null,
          phone: meta.phone || null,
          role: 'client',
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return NextResponse.json({
          error: `Could not create user profile: ${profileError.message}`,
          details: profileError
        }, { status: 500 });
      }
    }

    // 1. Create a Pending Project
    const projectName = data.projectType 
      ? data.projectType.charAt(0).toUpperCase() + data.projectType.slice(1) + ' Project'
      : 'Custom Project';
      
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        client_id: user.id,
        project_name: projectName,
        description: `Automated quotation for a ${data.pages || 1}-page ${projectName} (Package: ${data.selectedPackage || 'Standard'}). Generated via pricing calculator.`,
        budget: data.pricing?.total || 0,
        timeline: `${data.pricing?.timeline || 0} Days`,
        status: 'Pending'
      })
      .select()
      .single();

    if (projectError) {
      console.error('Error creating project:', projectError);
      return NextResponse.json({
        error: `Failed to create project: ${projectError.message}`,
        details: projectError
      }, { status: 500 });
    }

    // 2. Create the Quotation
    const lineItems = [
      {
        name: `${projectName} Setup`,
        description: `Includes ${data.pages} pages, ${data.uiComplexity} UI complexity, and ${data.animationLevel} animations.`,
        price: data.pricing?.total || 0,
        quantity: 1
      }
    ];

    const { data: quotation, error: quoteError } = await supabaseAdmin
      .from('quotations')
      .insert({
        project_id: project.id,
        client_id: user.id,
        items: lineItems,
        total: data.pricing?.total || 0,
        status: 'sent', // Auto-sent to client
        notes: `Raw Configuration:\n${JSON.stringify(data, null, 2)}`
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quotation:', quoteError);
      return NextResponse.json({
        error: `Failed to create quotation: ${quoteError.message}`,
        details: quoteError
      }, { status: 500 });
    }

    // 3. Send Quotation via Email
    if (user.email) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const emailContent = `
          <h2 style="color: #f97316; margin-bottom: 10px;">Your Project Quotation</h2>
          <p>Thank you for requesting a quotation for your <strong>${projectName}</strong>.</p>
          
          <div class="data-box" style="margin-top: 20px;">
            <div class="data-row">
              <div class="data-label">Project</div>
              <div class="data-value">${projectName}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Estimated Timeline</div>
              <div class="data-value">${data.pricing?.timeline || 0} Days</div>
            </div>
            <div class="data-row">
              <div class="data-label">Estimated Total</div>
              <div class="data-value" style="color: #f97316; font-weight: bold;">$${data.pricing?.total || 0}</div>
            </div>
          </div>
          
          <p style="margin-top: 20px;">We have outlined the details in your client dashboard. You can review the full breakdown, make adjustments, and approve the quotation when you are ready.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://suryacs.is-a.dev'}/dashboard/quotations" class="button">
              View Full Quotation
            </a>
          </div>
        `;

        const htmlTemplate = getBrandEmailTemplate(
          `Your Quotation: ${projectName}`, 
          emailContent, 
          'Review your personalized project quotation'
        );

        await resend.emails.send({
          from: `Surya CS <noreply@${process.env.RESEND_FROM_EMAIL?.split('@')[1] || 'suryacs.is-a.dev'}>`,
          to: user.email,
          subject: `Your Project Quotation: ${projectName}`,
          html: htmlTemplate,
        });
      } catch (emailErr) {
        console.error('Error sending quotation email:', emailErr);
        // Continue even if email fails
      }
    }

    return NextResponse.json({ success: true, quotation });
  } catch (error: any) {
    console.error('Error auto-generating quotation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error', details: error }, { status: 500 });
  }
}
