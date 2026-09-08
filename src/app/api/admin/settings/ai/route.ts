import { NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groqSetting = await db.select().from(siteSettings).where(eq(siteSettings.key, 'AI_GROQ_MODELS')).limit(1);
    const openRouterSetting = await db.select().from(siteSettings).where(eq(siteSettings.key, 'AI_OPENROUTER_MODELS')).limit(1);
    
    return NextResponse.json({ 
      groqModels: groqSetting.length > 0 ? groqSetting[0].value : 'groq/compound, qwen/qwen3.8-27b, openai/gpt-oss-120b',
      openRouterModels: openRouterSetting.length > 0 ? openRouterSetting[0].value : 'nvidia/nemotron-3.5-lightning:free, liquid/lfm-2.5-2.6b:free'
    });
  } catch (error) {
    console.error('AI Settings GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { groqModels, openRouterModels } = await req.json();

    if (!groqModels || !openRouterModels) {
      return NextResponse.json({ error: 'Both Groq and OpenRouter models are required' }, { status: 400 });
    }

    // Upsert AI_GROQ_MODELS
    const existingGroq = await db.select().from(siteSettings).where(eq(siteSettings.key, 'AI_GROQ_MODELS')).limit(1);
    if (existingGroq.length > 0) {
      await db.update(siteSettings).set({ value: groqModels, updatedAt: new Date() }).where(eq(siteSettings.key, 'AI_GROQ_MODELS'));
    } else {
      await db.insert(siteSettings).values({ id: crypto.randomUUID(), key: 'AI_GROQ_MODELS', value: groqModels, updatedAt: new Date() });
    }

    // Upsert AI_OPENROUTER_MODELS
    const existingOpenRouter = await db.select().from(siteSettings).where(eq(siteSettings.key, 'AI_OPENROUTER_MODELS')).limit(1);
    if (existingOpenRouter.length > 0) {
      await db.update(siteSettings).set({ value: openRouterModels, updatedAt: new Date() }).where(eq(siteSettings.key, 'AI_OPENROUTER_MODELS'));
    } else {
      await db.insert(siteSettings).values({ id: crypto.randomUUID(), key: 'AI_OPENROUTER_MODELS', value: openRouterModels, updatedAt: new Date() });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('AI Settings POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
