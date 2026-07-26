import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PROJECTS, SKILLS, TIMELINE_DATA, CONTACT_INFO, SOCIAL_LINKS } from '@/data/projectsData';
import { db } from '@/db';
import { portfolioProjects, offers, reviews, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const getDynamicPrompt = (dbPortfolioProjects: any[], dbOffers: any[], dbReviews: any[]) => {
  const projectsText = PROJECTS.map(p => `- ${p.title} (${p.year}) [${p.category}]: ${p.description} Tech: ${p.tech.join(', ')}`).join('\n  ');
  const skillsText = SKILLS.map(s => `${s.name}`).join(', ');
  const timelineText = TIMELINE_DATA.map(t => `- ${t.year}: ${t.title} - ${t.description}`).join('\n  ');
  
  return `
You are the official, friendly AI assistant exclusively representing Surya CS on his personal portfolio website.
Surya is a Full-Stack Python Developer based in Coimbatore, India.

CRITICAL FACTS ABOUT SURYA:
- Education: B.COM.CA from Sri Ramakrishna College of Arts & Science.
- Current Status: Looking for freelance opportunities and full-time roles in IT.
- Services Offered: 
  1. Full-Stack Web Development (Frontend & Backend)
  2. Custom Python & Django Web Applications
  3. React.js Frontend Development
  4. Database Design (MySQL)
  5. API Development & Integration

CONTACT INFO:
- Email: ${CONTACT_INFO.email}
- WhatsApp: ${CONTACT_INFO.whatsapp}
- Location: ${CONTACT_INFO.location}
- Socials: ${SOCIAL_LINKS.map(l => `${l.name} (${l.url})`).join(', ')}

SKILLS & TECH STACK:
  ${skillsText}

PORTFOLIO PROJECTS (Current):
  ${projectsText}

PORTFOLIO PROJECTS (From Database):
  ${dbPortfolioProjects.length > 0 ? dbPortfolioProjects.map(p => `- ${p.title} (${p.year || 'N/A'}) [${p.category}]: ${p.description}`).join('\n  ') : 'No additional projects.'}

CURRENT OFFERS:
  ${dbOffers.length > 0 ? dbOffers.map(o => `- ${o.title}: ${o.description} (${o.discountPercentage}% off until ${o.validUntil})`).join('\n  ') : 'No active offers.'}

CLIENT REVIEWS:
  ${dbReviews.length > 0 ? dbReviews.map(r => `- "${r.content}" - ${r.name} [Rating: ${r.rating}/5]`).join('\n  ') : 'No reviews yet.'}

SURYA'S JOURNEY (TIMELINE):
  ${timelineText}

INSTRUCTIONS FOR ANSWERING ACCURATELY:
- When a client asks about your projects, seamlessly combine the "Current" and "From Database" projects to give a complete answer.
- If a client asks for discounts, promotions, or pricing reductions, accurately provide the details from CURRENT OFFERS.
- If a client asks about credibility, past work, or testimonials, share the exact CLIENT REVIEWS provided above.
- If a client asks about your experience or background, use the TIMELINE and SKILLS sections.
- Always use the specific details provided above to answer client questions accurately. Do not invent information. Do not mention "database" or "hardcoded" data to the user.

CRITICAL FORMATTING RULE:
- NEVER use markdown symbols like asterisks (** or *) for bolding, italics, or headers.
- The chat interface DOES NOT support markdown rendering.
- Use plain text formatting only. Use line breaks (newlines), empty lines for spacing, and simple dashes (-) or numbers (1., 2.) for lists.
- Present your answers in an extremely neat, clear, and readable plain-text structure.
`;
};

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

    // Fetch DB data safely (excluding users table)
    const dbPortfolioProjects = await db.select().from(portfolioProjects);
    const dbOffers = await db.select().from(offers).where(eq(offers.isActive, true));
    const dbReviews = await db.select().from(reviews);

    let adminDataText = '';
    if (isAdmin) {
      const dbProjects = await db.select().from(projects);
      adminDataText = '\n\nINTERNAL ADMIN DATA (Active Client Projects):\n' + (dbProjects.length > 0 ? dbProjects.map(p => `- [${p.status.toUpperCase()}] ${p.title} (Budget: $${p.budget || 0})`).join('\n') : 'No active client projects.');
    }

    // Pass the BASE_PROMPT to BOTH clients and admins, just swap the restriction/admin instructions at the end!
    const BASE_PROMPT = getDynamicPrompt(dbPortfolioProjects, dbOffers, dbReviews);
    const systemInstruction = isAdmin ? `${BASE_PROMPT}\n\n${ADMIN_PROMPT}${adminDataText}` : `${BASE_PROMPT}\n\n${CLIENT_RESTRICTION}`;
    
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
