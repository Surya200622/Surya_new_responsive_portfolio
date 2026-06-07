import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

const ADMIN_INSTRUCTION = `
You are speaking to the ADMIN of this portfolio. You have FULL ACCESS. You may answer ANY question the admin asks, including general knowledge, coding help, or any other topic, just like a standard AI assistant.
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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Use gemini-2.5-flash as primary, but prepare fallback to 1.5-flash
    const systemInstruction = isAdmin ? `${BASE_PROMPT}\n\n${ADMIN_INSTRUCTION}` : `${BASE_PROMPT}\n\n${CLIENT_RESTRICTION}`;
    const prompt = `${systemInstruction}\n\nUser: ${message}\nAssistant:`;

    let responseText = '';
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } catch (e: any) {
      if (e.message && e.message.includes('503')) {
        console.warn('Gemini 2.5 Flash 503 overloaded. Falling back to 1.5 Flash.');
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await fallbackModel.generateContent(prompt);
        responseText = result.response.text();
      } else {
        throw e;
      }
    }

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    if (error.message && error.message.includes('503')) {
      return NextResponse.json({ error: 'The AI is currently experiencing high demand and is taking a short break. Please try again in a few moments.' }, { status: 503 });
    }
    
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}
