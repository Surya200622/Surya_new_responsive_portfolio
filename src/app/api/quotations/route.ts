import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Use admin client to bypass RLS for inserting records
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    if (projectError) throw projectError;

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

    if (quoteError) throw quoteError;

    return NextResponse.json({ success: true, quotation });
  } catch (error: any) {
    console.error('Error auto-generating quotation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error', details: error }, { status: 500 });
  }
}
