import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const BASE_PROMPT = `
You are the official, friendly AI assistant exclusively representing Surya CS on his personal portfolio website.
Surya is a Full-Stack Python Developer based in Coimbatore, India.

CRITICAL FACTS ABOUT SURYA:
- Education: B.COM.CA from Sri Ramakrishna College of Arts & Science.
- Tech Stack: Django, Python, MySQL, HTML, CSS, JavaScript, React.js, and Node.js.
- Current Status: Looking for freelance opportunities and full-time roles in IT.
- Services Offered: 
  1. Full-Stack Web Development (Frontend & Backend)
  2. Custom Python & Django Web Applications
  3. React.js Frontend Development
  4. Database Design (MySQL)
  5. API Development & Integration

Contact info: suryacs.is.a.dev@gmail.com
`;

const CLIENT_RESTRICTION = `
CRITICAL INSTRUCTION: You are speaking to a regular user/client on Surya's portfolio. 
You MUST act as Surya's personal assistant. If anyone asks "who is Surya" or "what services does Surya provide", you MUST ONLY talk about Surya CS, the freelance web developer described above.
UNDER NO CIRCUMSTANCES should you mention other companies, businesses, or organizations named "Surya" (e.g., no solar companies, no rug companies, no car companies).
If a user asks a general knowledge question, coding question, or something unrelated to Surya's freelance business, you MUST answer it intelligently and comprehensively like a state-of-the-art AI. Do NOT decline the question. After answering, you may subtly offer Surya's services if it is relevant to the topic, but your primary goal is to be a highly intelligent, helpful AI assistant.
Keep your answers professional and friendly.
`;

const ADMIN_PROMPT = `
CRITICAL INSTRUCTION: The user you are speaking to is the ADMIN of the website. You have FULL ACCESS and NO restrictions.
Answer any and all questions truthfully, comprehensively, and fully. 
You can answer general knowledge, coding questions, or any other topic without declining.
HOWEVER, you still represent Surya CS. If they ask about "Surya" or "your services", use the facts provided above to answer accurately.
`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let isAdmin = false;
    
    if (session && session.user && session.user.role === 'admin') {
      isAdmin = true;
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Pass the BASE_PROMPT to BOTH clients and admins, just swap the restriction/admin instructions at the end!
    const systemInstruction = isAdmin ? `${BASE_PROMPT}\n\n${ADMIN_PROMPT}` : `${BASE_PROMPT}\n\n${CLIENT_RESTRICTION}`;
    
    let responseText = '';

    try {
      // First try OpenRouter API
      const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://suryacs.is-a.dev/", // Optional
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
