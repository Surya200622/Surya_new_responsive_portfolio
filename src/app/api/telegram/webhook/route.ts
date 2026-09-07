import { NextResponse } from 'next/server';
export const maxDuration = 60; // Prevent Vercel from killing the stream after 10s
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { getDynamicPrompt, CLIENT_RESTRICTION } from '@/app/api/chat/route';
import { db } from '@/db';
import { portfolioProjects, offers, reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || 'dummy_key_to_bypass_build_error',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

const sendTelegramMessage = async (chatId: number, text: string) => {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!TELEGRAM_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set');
    return;
  }
  
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};

const sendTelegramDocument = async (chatId: number, documentUrl: string, caption: string = '') => {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!TELEGRAM_TOKEN) return;
  
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`;
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        document: documentUrl,
        caption: caption,
      }),
    });
  } catch (error) {
    console.error('Error sending document to Telegram:', error);
  }
};

const filterThinkTags = (text: string) => {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
};

export async function POST(req: Request) {
  try {
    const update = await req.json();
    
    // Telegram webhook verification challenge or empty body
    if (!update || (!update.message && !update.callback_query)) {
      return NextResponse.json({ success: true });
    }

    const message = update.message;
    if (!message || !message.text) {
      return NextResponse.json({ success: true });
    }

    const chatId = message.chat.id;
    const userText = message.text;
    
    // Handle /start command
    if (userText === '/start') {
      await sendTelegramMessage(
        chatId, 
        "Hi! I am Surya's AI assistant. Ask me anything about his full-stack web development services, experience, or request a quote!"
      );
      return NextResponse.json({ success: true });
    }

    // Handle /resume command
    if (userText === '/resume') {
      await sendTelegramDocument(
        chatId,
        'https://suryacs-websolutions.vercel.app/SuryaCS-resume.pdf',
        'Here is Surya CS\'s latest resume! 🚀'
      );
      return NextResponse.json({ success: true });
    }
    
    // Send a typing action to let the user know we are processing
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (TELEGRAM_TOKEN) {
      fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action: 'typing' })
      }).catch(() => {});
    }
    
    // Fetch DB data safely (excluding users table)
    const dbPortfolioProjects = await db.select().from(portfolioProjects);
    const dbOffers = await db.select().from(offers).where(eq(offers.isActive, true));
    const dbReviews = await db.select().from(reviews);

    const BASE_PROMPT = getDynamicPrompt(dbPortfolioProjects, dbOffers, dbReviews);
    
    const formattingRule = `
CRITICAL FORMATTING RULE FOR TELEGRAM:
- Do NOT use markdown asterisks (* or **). Just use plain text.
- Use emojis generously.
- Keep paragraphs short.`;

    const systemInstruction = `${BASE_PROMPT}\n\n${CLIENT_RESTRICTION}\n${formattingRule}`;
    
    let rawResponse = '';
    
    const openRouterModels = [
      "google/gemini-2.0-flash-lite-preview-02-05:free",
      "google/gemini-2.0-pro-exp-02-05:free",
      "meta-llama/llama-3.3-70b-instruct:free"
    ];

    let success = false;
    for (const model of openRouterModels) {
      try {
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        if (!OPENROUTER_API_KEY) throw new Error('OpenRouter API Key not configured');
        const openrouter = new OpenAI({
          apiKey: OPENROUTER_API_KEY,
          baseURL: 'https://openrouter.ai/api/v1',
        });
        
        const completion = await openrouter.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userText }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        });
        
        rawResponse = completion.choices[0]?.message?.content || '';
        if (rawResponse) {
          success = true;
          break;
        }
      } catch (e: any) {
        console.warn(`OpenRouter API failed for model ${model}:`, e.message);
      }
    }
    
    // Attempt NVIDIA (Fallback)
    if (!success) {
      const nvidiaModels = [
        "meta/llama-3.1-8b-instruct",
        "mistralai/mistral-large-2-instruct",
        "nvidia/llama-3.1-nemotron-70b-instruct"
      ];
  
      for (const model of nvidiaModels) {
        try {
          if (!process.env.NVIDIA_API_KEY) throw new Error('NVIDIA API Key not configured');
          const completion = await openai.chat.completions.create({
            model: model,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: userText }
            ],
            temperature: 0.7,
            top_p: 1,
            max_tokens: 1500,
          });
          
          rawResponse = completion.choices[0]?.message?.content || '';
          if (rawResponse) {
            success = true;
            break;
          }
        } catch (e: any) {
          console.warn(`NVIDIA API failed for model ${model}:`, e.message);
        }
      }
    }
    
    // Attempt Groq (Last Resort)
    if (!success) {
      const groqModels = [
        "qwen/qwen3.6-27b",
        "llama-3.3-70b-versatile",
        "llama3-70b-8192",
        "gemma2-9b-it"
      ];
      
      for (const model of groqModels) {
        try {
          if (!process.env.GROQ_API_KEY) throw new Error('Groq API Key not configured');
          const completion = await groq.chat.completions.create({
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: userText }
            ],
            model: model,
          });
          
          rawResponse = completion.choices[0]?.message?.content || '';
          if (rawResponse) {
            success = true;
            break;
          }
        } catch (e: any) {
          console.warn(`Groq API failed for model ${model}:`, e.message);
        }
      }
    }
    
    if (!success) {
      await sendTelegramMessage(chatId, "I'm currently experiencing high demand. Please try again in a moment.");
      return NextResponse.json({ success: true });
    }
    
    const finalResponse = filterThinkTags(rawResponse);
    await sendTelegramMessage(chatId, finalResponse);
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Telegram Webhook Error:', error);
    // Return 200 even on error so Telegram doesn't keep retrying
    return NextResponse.json({ success: true, error: error.message });
  }
}
