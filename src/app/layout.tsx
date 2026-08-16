import type { Metadata } from 'next';
import '../index.css';
import './globals.css';
import ChatbotWidget from "@/components/ChatbotWidget";
import MagicCursor from "@/components/MagicCursor";
import Providers from "@/components/Providers";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { PROJECTS } from '../data/projectsData';

export const metadata: Metadata = {
  metadataBase: new URL('https://suryacs.is-a.dev'),
  applicationName: 'Surya CS',
  title: 'Surya CS | Full-Stack Python Developer | Coimbatore, India',
  description:
    'Portfolio of Surya CS, a Full-Stack Python Developer specializing in Django, React, and modern web solutions. View projects, resume, and contact for freelance work.',
  keywords:
    'Surya CS, Cssurya, Full Stack Developer, Python Developer, Django, React, Web Development, Coimbatore, Freelance Developer',
  authors: [{ name: 'Surya CS' }],
  creator: 'Surya CS',
  publisher: 'Surya CS',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://suryacs.is-a.dev',
    siteName: 'Surya CS',
    title: 'Surya CS | Full-Stack Python Developer',
    description:
      'Portfolio of Surya CS, a Full-Stack Python Developer specializing in Django, React, and modern web solutions.',
    images: ['/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png'],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surya CS | Full-Stack Python Developer',
    description:
      'Full-Stack Python Developer specializing in Django & React. Based in Coimbatore, India.',
    images: ['/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png'],
  },
  verification: {
    google: ['FXp4jqzCy6bxO6ThBXz34F29BgX2w0qgt9v4tONOfec'],
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Theme initialization — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('surya-portfolio-theme');if(!t)t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0a0a0f':'#faf8f5');}catch(e){}})()`,
          }}
        />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <meta name="theme-color" content="#0a0a0f" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                '@id': 'https://suryacs.is-a.dev/#website',
                name: 'Surya CS',
                alternateName: ['suryacs', 'SuryaCS', 'Surya.CS', 'Cssurya'],
                url: 'https://suryacs.is-a.dev/'
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Person',
                '@id': 'https://suryacs.is-a.dev/#person',
                name: 'Surya CS',
                url: 'https://suryacs.is-a.dev',
                image: 'https://suryacs.is-a.dev/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png',
                jobTitle: 'Full-Stack Python Developer',
                description:
                  'B.Com.CA graduate from Sri Ramakrishna College of Arts & Science. IBM & ITC trained in Python Pandas & NumPy. Django & React Specialist.',
                email: 'suryacs.is.a.dev@gmail.com',
                telephone: '+918220443165',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Coimbatore',
                  addressRegion: 'Tamil Nadu',
                  postalCode: '641027',
                  addressCountry: 'India',
                },
                alumniOf: {
                  '@type': 'CollegeOrUniversity',
                  name: 'Sri Ramakrishna College of Arts & Science',
                },
                sameAs: [
                  'https://github.com/Surya200622',
                  'https://linkedin.com/in/suryacs22/',
                  'https://suryacs.is-a.dev',
                  'https://www.instagram.com/suryacs.is_a.dev/'
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                '@id': 'https://suryacs.is-a.dev/#localbusiness',
                name: 'Suryacs Web Solutions',
                description: 'Full-Stack Python Developer specializing in Django, React, and modern web solutions.',
                url: 'https://suryacs.is-a.dev',
                image: 'https://suryacs.is-a.dev/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png',
                telephone: '+918220443165',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '137, Bakthavachalam street, Rathinapuri, Tatabad',
                  addressLocality: 'Coimbatore',
                  addressRegion: 'Tamil Nadu',
                  postalCode: '641027',
                  addressCountry: 'India',
                },
                priceRange: '$$',
                founder: {
                  '@type': 'Person',
                  name: 'Surya CS'
                }
              },
              ...PROJECTS.map((project) => ({
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                name: project.title,
                description: project.description,
                image: `https://suryacs.is-a.dev${project.image}`,
                url: project.link || 'https://suryacs.is-a.dev/projects',
                genre: project.category,
              }))
            ]),
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
          <ChatbotWidget />
          <MagicCursor />
          <CookieBanner />
          <AnalyticsTracker />
        </Providers>
      </body>
    </html>
  );
}
