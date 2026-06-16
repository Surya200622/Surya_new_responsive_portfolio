import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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

    return NextResponse.json({ success: true, quotation });
  } catch (error: any) {
    console.error('Error auto-generating quotation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error', details: error }, { status: 500 });
  }
}
