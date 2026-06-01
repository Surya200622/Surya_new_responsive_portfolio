import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are Surya CS's friendly, professional AI assistant for his portfolio website.
Surya is a Full-Stack Python Developer based in Coimbatore, India.
He specializes in Django, React, Next.js, and Supabase.
He graduated with a B.COM.CA from Sri Ramakrishna College of Arts & Science.
He is looking for freelance opportunities and full-time roles in IT.
Keep your answers brief, friendly, and helpful. If you don't know the answer, tell them to contact Surya directly at cssurya2006@gmail.com.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Use Gemini 1.5 Flash for fast chat responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create the chat prompt with the system instructions
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}
