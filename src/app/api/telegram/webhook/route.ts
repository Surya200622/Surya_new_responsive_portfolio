import { NextResponse } from 'next/server';
export const maxDuration = 60; // Prevent Vercel from killing the stream after 10s
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { getDynamicPrompt, CLIENT_RESTRICTION } from '@/app/api/chat/route';
import { db } from '@/db';
import { portfolioProjects, offers, reviews, siteSettings } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || 'dummy_key_to_bypass_build_error',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '', timeout: 4000 });

const sendTelegramMessage = async (chatId: number, text: string, businessConnectionId?: string) => {
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
        business_connection_id: businessConnectionId,
      }),
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};

const sendTelegramDocument = async (chatId: number, documentUrl: string, caption: string = '', businessConnectionId?: string) => {
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
        business_connection_id: businessConnectionId,
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
    if (update.business_connection) {
      return NextResponse.json({ success: true });
    }

    if (!update || (!update.message && !update.callback_query && !update.business_message)) {
      return NextResponse.json({ success: true });
    }

    const message = update.message || update.business_message;
    if (!message || !message.text) {
      return NextResponse.json({ success: true });
    }

    const chatId = message.chat.id;
    const userText = message.text;
    const businessConnectionId = message.business_connection_id;
    
    // Fetch custom telegram settings
    const telegramSettings = await db.select().from(siteSettings).where(like(siteSettings.key, 'telegram_cmd_%'));
    const getSetting = (cmd: string) => telegramSettings.find(s => s.key === `telegram_cmd_${cmd}`)?.value;
    
    // Handle /start command
    if (userText === '/start') {
      const customText = getSetting('start');
      await sendTelegramMessage(
        chatId, 
        customText || "Hi! I am Surya's AI assistant. Ask me anything about his full-stack web development services, experience, or request a quote!",
        businessConnectionId
      );
      return NextResponse.json({ success: true });
    }

    // Handle /resume command
    if (userText === '/resume') {
      await sendTelegramDocument(
        chatId,
        'https://suryacs-websolutions.vercel.app/SuryaCS-resume.pdf',
        'Here is Surya CS\'s latest resume! 🚀',
        businessConnectionId
      );
      return NextResponse.json({ success: true });
    }

    // Handle /services command
    if (userText === '/services') {
      const customText = getSetting('services');
      await sendTelegramMessage(
        chatId,
        customText || `Welcome to Surya CS — Services Page
You're viewing the Services section of Surya CS's official portfolio website (suryacs-websolutions.vercel.app).

---
🛠️ Services Offered by Surya CS
Surya is a Full-Stack Web Developer & IT Consultant based in Coimbatore, India. He specializes in building scalable, secure, and modern web applications from end-to-end — covering everything from UI/UX implementation to solid backend architectures.

Here's a breakdown of the professional services available:

1. Full-Stack Web Development
Complete frontend + backend development tailored to your business needs. Whether you need a custom dashboard, a client portal, or a complete SaaS platform, Surya delivers it all.

2. Custom Python & Django Web Applications
Specialized in building robust applications including:
- SaaS platforms
- E-commerce stores
- Booking & scheduling systems
- Custom business automation tools

3. React.js & Next.js Frontend Development
Modern, responsive, and lightning-fast frontends with smooth animations and pixel-perfect UI. Ideal for portfolios, landing pages, and complex web apps.

4. Database Design & Optimization
Expertise in designing efficient schemas and optimizing queries using:
- MySQL
- PostgreSQL
- SQLite
- Supabase
- Turso (LibSQL)

5. API Development & Third-Party Integration
RESTful APIs, payment gateway integrations, Cloudinary media handling, AI API integrations (Groq, Gemini, OpenRouter, Pollinations), and more.

6. AI & Tech Consulting for Businesses
Need guidance on how to integrate AI into your business? Surya provides strategic consulting to help you leverage modern tech — from AI chatbots to smart automation.

---
💼 Current Special Offers
Surya is currently running limited-time promotional offers for select services:

🛍️ E-commerce Website — 15% OFF
Includes free custom design, priority support, and a complimentary SEO audit.
> *Offer valid until 2026-09-15*

🏢 Business Website — 12% OFF
Includes free custom design, priority support, and a complimentary SEO audit.
> *Offer valid until 2026-09-15*

---
🚀 Why Choose Surya?
- ✅ Skilled Tech Stack: Python, Django, React, Next.js, Bootstrap, Supabase, Turso, Vercel, GitHub
- ✅ Proven Portfolio: DentalExperts (Booking System), CipherApparel (E-commerce), Jarvis AI, BlogCraft, Restaurant POS, and more
- ✅ Full Ownership: From concept to deployment — you get a complete, production-ready product
- ✅ Modern & Responsive: Every project is optimized for speed, SEO, and all devices

> ⭐ *"I am just amazed by Surya's web design ideas! He does outstanding work and has developed many unique creations."* — Dr. V. Gurumoorthi (5/5)

---
📞 Ready to Start Your Project?
If any of these services align with your goals, Surya would love to hear from you!
- 📱 WhatsApp: +91 82204 43165
- 📧 Email: cssurya2006@gmail.com
- 📍 Location: Coimbatore, Tamil Nadu, India

👉 Reach out today for a free consultation and let's bring your idea to life!`,
        businessConnectionId
      );
      return NextResponse.json({ success: true });
    }

    // Handle /portfolio command
    if (userText === '/portfolio') {
      const customText = getSetting('portfolio');
      await sendTelegramMessage(
        chatId,
        customText || `Portfolio Page — Surya CS Web Solutions
You're currently viewing the Portfolio section of Surya CS's official website at suryacs-websolutions.vercel.app!

This is the showcase hub where Surya's best work takes center stage. Let me walk you through what you'll find here:

Featured Projects
Surya has built an impressive collection of full-stack web applications spanning multiple industries:

Booking Systems
- DentalExperts (2025) — A comprehensive clinic management platform with appointment booking, patient records, and doctor schedules.

E-commerce Platforms
- CipherApparel (2025) — A modern fashion e-commerce app with secure auth, cart management, dynamic offers, and admin dashboard powered by Django.

AI-Powered Apps
- Jarvis AI (2026) — A futuristic personal assistant with multi-provider AI integration (Groq, Gemini, OpenRouter, Pollinations), voice input, weather queries, and image generation.
- Face Swap Photo & Video Editor (2025) — Professional AI editing tool.

Restaurant & Food Tech
- Spice Kitchen (2026) — A QR-ready digital menu with smart Veg/Non-Veg filtering.
- Point of Sale & Billing System (2026) — A full restaurant POS with QR code payments, Cloudinary media management, and Turso edge database.

Content & Productivity
- Blogcraft (2026) — A modern blogging platform with rich-text editor, Supabase backend, and secure authentication.
- Attendance & Salary Calculator (2026) — Smart pay estimation with tax calculations.

Professional Portfolios
- Personal Portfolio (2025) — Built with React Vite featuring cinematic parallax effects.
- Dr. Gurumoorthi's Academic Portfolio (2026) — Scholarly hub for an Assistant Professor.

---
What Makes This Portfolio Stand Out?
- 🎨 Diverse Industry Experience — From AI tools to e-commerce to restaurant tech
- ⚡ Modern Tech Stack — Python, Django, React, Next.js, Supabase, Turso, Cloudinary
- 📱 Production-Ready Apps — All deployed and live (not just demos)
- 🔄 Full-Cycle Development — UI/UX to backend to deployment

---
Want to Start Your Own Project?
If any of these projects inspired an idea for your own business, Surya would love to bring it to life! Currently available for:
- 🛒 E-commerce Websites — *15% off until September 15, 2026*
- 💼 Business Websites — *12% off until September 15, 2026*

Get in touch:
- 📧 Email: cssurya2006@gmail.com
- 📱 WhatsApp: +91 8220443165

Would you like me to deep-dive into any specific project, or discuss how Surya can build something similar for your business? 🚀`,
        businessConnectionId
      );
      return NextResponse.json({ success: true });
    }

    // Handle /offers command
    if (userText === '/offers') {
      const customText = getSetting('offers');
      await sendTelegramMessage(
        chatId,
        customText || "I occasionally run special discounts for web development services! Please check my website or ask my AI for the latest current offers:\nhttps://suryacs-websolutions.vercel.app/",
        businessConnectionId
      );
      return NextResponse.json({ success: true });
    }

    // Handle /contact command
    if (userText === '/contact') {
      const customText = getSetting('contact');
      await sendTelegramMessage(
        chatId,
        customText || "You can contact me via:\n\nEmail: contact@suryacs-websolutions.vercel.app\nWebsite: https://suryacs-websolutions.vercel.app/#contact\n\nFeel free to reach out for a quick chat!",
        businessConnectionId
      );
      return NextResponse.json({ success: true });
    }

    // Handle /about command
    if (userText === '/about') {
      const customText = getSetting('about');
      await sendTelegramMessage(
        chatId,
        customText || `Welcome to the About Page! 👋
You're currently on the About section of Surya CS Web Solutions — Surya's personal portfolio and freelance business hub.

Let me tell you a bit about who Surya is and what this page represents:

---
🌟 Who is Surya CS?
Surya CS is a premium Full-Stack Web Developer and IT Consultant based in Coimbatore, Tamil Nadu, India. He specializes in building modern, scalable, and secure web applications from end to end — handling everything from UI/UX design to backend architecture and deployment.

---
🎓 Background & Journey
- 2023 – Began studies in B.COM.CA (Computer Applications) at Sri Ramakrishna College of Arts & Science, Coimbatore, where he discovered his passion for web development.
- 2025 – Completed a Data Analytics program (IBM & ITC in association with Sri Ramakrishna College).
- 2025 – Finished an intensive Full-Stack Python training at Indra Institute of Education (July – December 2025).
- 2025 – Launched his first major projects: DentalExperts, CipherApparel, and a cinematic personal portfolio built with React & Vite.
- 2026 – Now actively seeking freelance opportunities, full-time IT roles, and contract work to apply his skills on innovative projects.

---
🛠️ Core Skills & Tech Stack
Languages & Frameworks:
- Python, JavaScript, HTML, CSS
- Django, Django REST, React.js, Next.js, Bootstrap

Databases & Cloud:
- MySQL, PostgreSQL, SQLite, Supabase, Turso

Tools & Concepts:
- GitHub, VS Code, PythonAnywhere, Vercel
- REST APIs, Responsive Web Design, Auth & Auth, MVC/MVT Architecture

---
💼 What Services Does Surya Offer?
1. Full-Stack Web Development (Frontend & Backend)
2. Custom Python & Django Web Applications (SaaS, E-commerce, Booking Systems)
3. React.js & Next.js Frontend Development
4. Database Design & Optimization
5. API Development & Third-Party Integration
6. AI & Tech Consulting for Businesses

---
⭐ What Clients Are Saying
> *"I am just amazed by Surya's web design ideas! He does outstanding work and has developed many unique creations."*
> — Dr. V. Gurumoorthi ⭐⭐⭐⭐⭐

---
💡 What's Next?
If you're impressed by what you've seen and have a project idea, a business problem to solve, or simply want to learn more about the services, Surya would love to hear from you!

📱 WhatsApp: +91 82204 43165
📧 Email: cssurya2006@gmail.com

---
Is there anything specific about Surya's background, skills, or services you'd like to explore further? 😊`,
        businessConnectionId
      );
      return NextResponse.json({ success: true });
    }

    // Handle /skills command
    if (userText === '/skills') {
      const customText = getSetting('skills');
      await sendTelegramMessage(
        chatId,
        customText || `Surya CS – Skills Overview
Hey there! 👋 Here's a detailed breakdown of the technologies and skills Surya CS brings to the table as a Full-Stack Web Developer & IT Consultant based in Coimbatore.

---
💻 Programming Languages
- Python – Core language for backend development, automation, and AI integrations
- JavaScript (ES6+) – Modern frontend development and async logic
- HTML5 & CSS3 – Semantic markup and responsive styling

---
🚀 Frameworks & Libraries
Backend
- Django – Robust, scalable web applications
- Django REST Framework (DRF) – Building RESTful APIs
- Node.js & Express.js – For full-stack JavaScript-based backends

Frontend
- React.js – Component-based, dynamic user interfaces
- Next.js – Server-side rendering and SEO-friendly apps
- Bootstrap – Rapid responsive design
- Vite – Lightning-fast frontend tooling
- Framer Motion & GSAP – Premium animations and transitions
- Tailwind CSS – Utility-first modern styling

---
🗄️ Databases
- MySQL – Reliable relational database
- PostgreSQL – Advanced relational database
- SQLite – Lightweight database for smaller apps
- Supabase – Modern backend-as-a-service
- Turso (LibSQL) – Edge-optimized SQLite for high performance

---
🌐 APIs & Integrations
- REST API Development – Clean, scalable endpoints
- Third-Party API Integration – Payment gateways, Cloudinary, QR code services
- AI API Integration:
- 🤖 Groq API – Ultra-fast AI responses
- 🤖 Google Gemini API – Reasoning & content generation
- 🤖 OpenRouter API – Access to multiple LLMs
- 🤖 Pollinations AI – AI image generation

---
🧠 Architecture & Concepts
- MVC / MVT Architecture – Clean, maintainable code structure
- Authentication & Authorization – Secure user login systems
- Responsive Web Design – Mobile-first, cross-device compatibility
- State Management – Efficient data flow in React apps

---
☁️ Deployment & DevOps
- GitHub – Version control & collaboration
- VS Code – Primary development environment
- PythonAnywhere – Python app hosting
- Vercel – Frontend & full-stack deployment
- Cloudinary – Image & media management

---
🛠️ Professional Skills
- ✅ Problem Solving – Tackling complex technical challenges
- ✅ Communication – Clear client and team collaboration
- ✅ Adaptability – Quick learner with new technologies
- ✅ Creativity – Innovative design and feature ideas
- ✅ Team Collaboration – Effective in team environments

---
🎯 What This Means For You
With this robust tech stack, Surya can build virtually any type of web solution — from e-commerce platforms and booking systems to AI-powered assistants and restaurant POS systems.

> 💡 Ready to start? Let's turn your idea into a reality. Reach out today!

📱 WhatsApp: +91 82204 43165
📧 Email: cssurya2006@gmail.com`,
        businessConnectionId
      );
      return NextResponse.json({ success: true });
    }

    // Handle /reviews command
    if (userText === '/reviews') {
      const customText = getSetting('reviews');
      await sendTelegramMessage(
        chatId,
        customText || "I've worked with multiple amazing clients who have left great reviews for my work. You can read their detailed testimonials directly on my portfolio:\nhttps://suryacs-websolutions.vercel.app/#testimonials",
        businessConnectionId
      );
      return NextResponse.json({ success: true });
    }
    
    // Send a typing action to let the user know we are processing
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (TELEGRAM_TOKEN) {
      fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action: 'typing', business_connection_id: businessConnectionId })
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
    
    const explabsModels = [
      "gpt-6-astra",
      "gpt-5.6-luna",
      "claude-fable-5.1"
    ];

    let success = false;
    for (const model of explabsModels) {
      try {
        const EXPLABS_API_KEY = process.env.EXPLABS_API_KEY;
        if (!EXPLABS_API_KEY) throw new Error('Experiential Labs API Key not configured');
        const client = new OpenAI({
          apiKey: EXPLABS_API_KEY,
          baseURL: 'https://api.experientiallabs.ai/v1',
          timeout: 4000,
        });
        
        const completion = await client.chat.completions.create({
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
        console.warn(`Experiential Cloud API failed for model ${model}:`, e.message);
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
          const nvidiaClient = new OpenAI({
            apiKey: process.env.NVIDIA_API_KEY,
            baseURL: 'https://integrate.api.nvidia.com/v1',
            timeout: 4000,
          });
          const completion = await nvidiaClient.chat.completions.create({
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
      await sendTelegramMessage(chatId, "I'm currently experiencing high demand. Please try again in a moment.", businessConnectionId);
      return NextResponse.json({ success: true });
    }
    
    const finalResponse = filterThinkTags(rawResponse);
    await sendTelegramMessage(chatId, finalResponse, businessConnectionId);
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Telegram Webhook Error:', error);
    // Return 200 even on error so Telegram doesn't keep retrying
    return NextResponse.json({ success: true, error: error.message });
  }
}
