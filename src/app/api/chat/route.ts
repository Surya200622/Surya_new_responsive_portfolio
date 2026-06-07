import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';

// Initialize the API clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

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
      if (!process.env.GROQ_API_KEY) throw new Error('Groq API Key not configured');
      
      // Try Groq First (Llama 3)
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: message }
        ],
        model: 'llama3-8b-8192',
      });
      
      responseText = chatCompletion.choices[0]?.message?.content || '';
      
    } catch (groqError: any) {
      console.warn('Groq failed, falling back to Gemini...', groqError.message);
      
      // Fallback to Gemini
      try {
        if (!process.env.GEMINI_API_KEY) throw new Error('Gemini API key not configured');
        
        const prompt = `${systemInstruction}\n\nUser: ${message}\nAssistant:`;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        
      } catch (geminiError: any) {
        if (geminiError.message && (geminiError.message.includes('503') || geminiError.message.includes('404'))) {
          console.warn('Gemini 1.5 Flash overloaded or missing. Falling back to gemini-pro.');
          const prompt = `${systemInstruction}\n\nUser: ${message}\nAssistant:`;
          const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
          const result = await fallbackModel.generateContent(prompt);
          responseText = result.response.text();
        } else {
          throw geminiError;
        }
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
