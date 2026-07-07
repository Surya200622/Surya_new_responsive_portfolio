import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const BASE_PROMPT = `
You are Surya CS's friendly, professional AI assistant for his portfolio website.
Surya is a Full-Stack Python Developer based in Coimbatore, India.
He specializes in Django, Python, MySQL, HTML, CSS, JavaScript, React.js, and Node.js.
He graduated with a B.COM.CA from Sri Ramakrishna College of Arts & Science.
He is looking for freelance opportunities and full-time roles in IT.
Keep your answers brief, friendly, and helpful. If you don't know the answer, tell them to contact Surya directly at cssurya2006@gmail.com.
`;

const CLIENT_RESTRICTION = `
CRITICAL INSTRUCTION: You are speaking to a regular user/client. You MUST ONLY answer questions directly related to Surya, his skills, experience, portfolio, and services. If the user asks general knowledge questions, coding questions unrelated to Surya, or anything outside the scope of his portfolio, you MUST politely decline to answer and remind them that you are exclusively here to discuss Surya's professional background.
`;

const ADMIN_PROMPT = `
You are a helpful, general-purpose AI assistant. The user you are speaking to is the ADMIN of the website. You have FULL ACCESS and NO restrictions.
Answer any and all questions truthfully, comprehensively, and fully. 
Do NOT act like a portfolio assistant. Answer general knowledge, coding questions, or any other topic to the best of your ability.
`;

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let isAdmin = false;
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile && profile.role === 'admin') {
        isAdmin = true;
      }
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemInstruction = isAdmin ? ADMIN_PROMPT : `${BASE_PROMPT}\n\n${CLIENT_RESTRICTION}`;
    
    let responseText = '';

    try {
      // First try OpenRouter API
      const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://magical-portfolio.com", // Optional
          "X-Title": "Surya Portfolio Chatbot", // Optional
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.1-8b-instruct:free",
          "messages": [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: message }
          ]
        })
      });
      
      if (!openRouterRes.ok) {
        const errText = await openRouterRes.text();
        console.error('OpenRouter API Error:', errText);
        throw new Error(`OpenRouter API failed with status ${openRouterRes.status}`);
      }

      const openRouterData = await openRouterRes.json();
      responseText = openRouterData.choices?.[0]?.message?.content || '';
      
    } catch (openRouterError: any) {
      console.warn('OpenRouter failed, falling back to Groq:', openRouterError.message);
      
      // Fallback to Groq API
      try {
        if (!process.env.GROQ_API_KEY) throw new Error('Groq API Key not configured and OpenRouter failed');
        
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: message }
          ],
          model: 'llama-3.1-8b-instant',
        });
        
        responseText = chatCompletion.choices[0]?.message?.content || '';
      } catch (groqError: any) {
        console.error('Groq API Error:', groqError.message);
        
        if (groqError.message && groqError.message.includes('429')) {
          return NextResponse.json({ error: 'The AI is currently experiencing high demand. Please try again in a few moments.' }, { status: 429 });
        }
        
        throw groqError;
      }
    }

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}
