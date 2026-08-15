import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PROJECTS, SKILLS, TIMELINE_DATA, CONTACT_INFO, SOCIAL_LINKS } from '@/data/projectsData';
import { db } from '@/db';
import { portfolioProjects, offers, reviews, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const getDynamicPrompt = (dbPortfolioProjects: any[], dbOffers: any[], dbReviews: any[]) => {
  // Combine projects and remove duplicates
  const allProjects = [...PROJECTS];
  dbPortfolioProjects.forEach(dbProj => {
    const exists = allProjects.find(p => p.title.toLowerCase() === dbProj.title.toLowerCase());
    if (!exists) {
      allProjects.push(dbProj);
    }
  });

  const combinedProjectsText = allProjects.map(p => `- ${p.title} (${p.year || 'N/A'}) [${p.category || 'Portfolio'}]: ${p.description}`).join('\n  ');
  const skillsText = SKILLS.map(s => `${s.name}`).join(', ');
  const timelineText = TIMELINE_DATA.map(t => `- ${t.year}: ${t.title} - ${t.description}`).join('\n  ');
  
  return `
You are the official, friendly, and highly intelligent AI business assistant representing Surya CS, a premium Full-Stack Python Developer and IT Consultant based in Coimbatore, India.
Your goal is to impress potential clients, showcase Surya's technical expertise, and confidently pitch his web development services. 
Act as a knowledgeable technical consultant. If a user asks about complex technical concepts, explain them clearly while highlighting how Surya's skills in Python, Django, React, and modern web architectures can solve their specific problems.

CRITICAL FACTS ABOUT SURYA:
- Education: B.COM.CA from Sri Ramakrishna College of Arts & Science.
- Current Status: Available for freelance opportunities, full-time IT roles, and contract work.
- Business Value & Approach: Focuses on delivering scalable, secure, and modern web applications. End-to-end development from UI/UX implementation to solid backend architectures.
- Services Offered: 
  1. Full-Stack Web Development (Frontend & Backend)
  2. Custom Python & Django Web Applications (SaaS, E-commerce, Booking Systems)
  3. React.js & Next.js Frontend Development
  4. Database Design & Optimization (MySQL, PostgreSQL, SQLite, Supabase)
  5. API Development & Third-Party Integration
  6. AI & Tech Consulting for Businesses

CONTACT INFO:
- Email: ${CONTACT_INFO.email}
- WhatsApp: ${CONTACT_INFO.whatsapp}
- Location: ${CONTACT_INFO.location}
- Socials: ${SOCIAL_LINKS.map(l => `${l.name} (${l.url})`).join(', ')}

SKILLS & TECH STACK:
  ${skillsText}

PORTFOLIO PROJECTS:
  ${combinedProjectsText}

CURRENT OFFERS:
  ${dbOffers.length > 0 ? dbOffers.map(o => `- ${o.title}: ${o.description} (${o.discountPercentage}% off until ${o.validUntil})`).join('\n  ') : 'No active offers.'}

CLIENT REVIEWS:
  ${dbReviews.length > 0 ? dbReviews.map(r => `- "${r.content}" - ${r.name} [Rating: ${r.rating}/5]`).join('\n  ') : 'No reviews yet.'}

SURYA'S JOURNEY (TIMELINE):
  ${timelineText}

INSTRUCTIONS FOR ANSWERING ACCURATELY:
- Actively promote Surya's services. If a client has a project idea, explain how Surya can build it efficiently using his tech stack.
- If a client asks for discounts, promotions, or pricing reductions, accurately provide the details from CURRENT OFFERS.
- If a client asks about credibility, past work, or testimonials, share the exact CLIENT REVIEWS provided above.
- If a client asks about your experience or background, use the TIMELINE and SKILLS sections.
- Always use the specific details provided above to answer client questions accurately. Do not invent information. Do not mention "database" or "hardcoded" data to the user.
- End your responses by naturally encouraging the client to reach out via WhatsApp or Email if they are interested in starting a project.
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
    let userId = null;
    
    if (session && session.user) {
      if (session.user.role === 'admin') {
        isAdmin = true;
      } else {
        userId = session.user.id;
      }
    }

    const { message, currentPath, currentUrl } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ip = getIp(req);
    const rateLimit = checkRateLimit(ip, 'chat', 10, 60 * 1000); // 10 requests per minute
    
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute before sending another message.' }, { status: 429 });
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

    let clientProjectsText = '';
    if (userId && !isAdmin) {
      const clientProjects = await db.select().from(projects).where(eq(projects.clientId, userId));
      if (clientProjects.length > 0) {
        clientProjectsText = `\n\nCLIENT'S ACTIVE PROJECTS:\nThe user you are speaking to is a logged-in client. They currently have the following active projects with Surya:\n` + 
          clientProjects.map(p => `- Project: ${p.title}\n  Status: ${p.status}\n  Description: ${p.description || 'N/A'}\n  Timeline: ${p.timeline || 'N/A'}\n  Budget: ${p.budget || 'N/A'}`).join('\n\n') +
          `\nIf the client asks about their project, use this information to provide an update or answer their questions.`;
      }
    }

    let pageContextText = '';
    if (currentPath) {
      pageContextText = `\n\nCURRENT PAGE CONTEXT:\nThe user is currently viewing this page/URL on the portfolio: ${currentUrl || currentPath}\nIf they ask a question like "what is this?" or refer to the current page, use this URL path to understand what they are looking at and assist them accordingly.`;
    }

    // Pass the BASE_PROMPT to BOTH clients and admins, just swap the restriction/admin instructions at the end!
    const BASE_PROMPT = getDynamicPrompt(dbPortfolioProjects, dbOffers, dbReviews);
    
    // Add formatting rule to the very end of the prompt so the AI prioritizes it heavily.
    // Remove restrictive markdown rule so the AI generates natural formatting with line breaks
    const formattingRule = `
CRITICAL FORMATTING RULE:
- Use markdown generously to format your answer.
- Use bolding (**text**) for emphasis and headers.
- Separate paragraphs and list items with blank lines (double newlines) so it is easy to read.`;

    const systemInstruction = isAdmin ? `${BASE_PROMPT}\n\n${ADMIN_PROMPT}${adminDataText}\n${pageContextText}\n${formattingRule}` : `${BASE_PROMPT}\n\n${CLIENT_RESTRICTION}${clientProjectsText}\n${pageContextText}\n${formattingRule}`;
    
    // We will attempt NVIDIA first, then fallback to Groq if it fails immediately.
    let responseStream: any = null;
    let isNvidia = true;
    
    try {
      responseStream = await openai.chat.completions.create({
        model: "z-ai/glm-5.2",
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        top_p: 1,
        max_tokens: 4000,
        stream: true
      });
    } catch (nvidiaError: any) {
      console.warn('NVIDIA API failed, falling back to Groq:', nvidiaError.message);
      isNvidia = false;
      
      try {
        if (!process.env.GROQ_API_KEY) throw new Error('Groq API Key not configured');
        responseStream = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: message }
          ],
          model: 'llama-3.1-8b-instant',
          stream: true
        });
      } catch (groqError: any) {
        console.error('Groq API Error:', groqError.message);
        return NextResponse.json({ error: 'The AI is currently experiencing high demand. Please try again in a few moments.' }, { status: 429 });
      }
    }

    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            // Both OpenAI and Groq format their streaming chunks identically
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (e) {
          console.error('Streaming error:', e);
          controller.enqueue(encoder.encode('\n\n[Connection interrupted]'));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      }
    });
    
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}
