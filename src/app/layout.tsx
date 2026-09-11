import type { Metadata } from 'next';
import '../index.css';
import './globals.css';
import dynamic from 'next/dynamic';
import { Outfit, Inter } from 'next/font/google';

const ChatbotWidget = dynamic(() => import('@/components/ChatbotWidget'), { ssr: false });
import MagicCursor from "@/components/MagicCursor";
import Providers from "@/components/Providers";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { PROJECTS } from '../data/projectsData';

export const metadata: Metadata = {
  metadataBase: new URL('https://suryacs-websolutions.vercel.app'),
  applicationName: 'Suryacs Web Solutions',
  title: 'Suryacs Web Solutions | Full-Stack Web Developer | Coimbatore, India',
  description:
    'Portfolio of Surya CS, a Full-Stack Web Developer specializing in Django, React, and modern web solutions. View projects, resume, and contact for freelance work.',
  keywords:
    'Surya CS, Cssurya, Full Stack Developer, Web Developer, Django, React, Web Development, Coimbatore, Freelance Developer, Suryacs web solutions',
  authors: [{ name: 'Surya CS' }],
  creator: 'Surya CS',
  publisher: 'Suryacs Web Solutions',
  openGraph: {
    type: 'website',
    url: 'https://suryacs-websolutions.vercel.app',
    siteName: 'Suryacs Web Solutions',
    title: 'Suryacs Web Solutions | Full-Stack Web Developer',
    description:
      'Portfolio of Surya CS, a Full-Stack Web Developer specializing in Django, React, and modern web solutions.',
    locale: 'en_IN',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Surya CS - Full-Stack Web Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suryacs Web Solutions | Full-Stack Web Developer',
    description:
      'Full-Stack Web Developer specializing in Django & React. Based in Coimbatore, India.',
    images: ['/images/og-image.jpg'],
  },
  appleWebApp: {
    title: 'Suryacs Web Solutions',
    statusBarStyle: 'default',
  },
  verification: {
    google: ['nzjJHjv3TTj8mUzNEFx4RH3ecj-OGGnMglPAKj3IubQ'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
};

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${outfit.variable} ${inter.variable}`}>
      <head>
        {/* Theme initialization — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('surya-portfolio-theme');if(!t)t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0a0a0f':'#faf8f5');}catch(e){}})()`,
          }}
        />

        {/* Fonts are now handled by next/font/google */}

        <meta name="theme-color" content="#0a0a0f" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                '@id': 'https://suryacs-websolutions.vercel.app/#website',
                name: 'Suryacs Web Solutions',
                alternateName: ['suryacs', 'SuryaCS', 'Surya.CS', 'Cssurya'],
                url: 'https://suryacs-websolutions.vercel.app/',
                publisher: {
                  '@type': 'Organization',
                  name: 'Suryacs Web Solutions',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://suryacs-websolutions.vercel.app/icon.svg'
                  }
                }
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Person',
                '@id': 'https://suryacs-websolutions.vercel.app/#person',
                name: 'Surya CS',
                url: 'https://suryacs-websolutions.vercel.app',
                image: 'https://suryacs-websolutions.vercel.app/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png',
                jobTitle: 'Full-Stack Web Developer',
                description:
                  'B.Com.CA graduate from Sri Ramakrishna College of Arts & Science. IBM & ITC trained in Data Analytics. Django & React Specialist.',
                email: 'cssurya2006@gmail.com',
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
                  'https://suryacs-websolutions.vercel.app',
                  'https://www.instagram.com/suryacs_web_solutions/'
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                '@id': 'https://suryacs-websolutions.vercel.app/#localbusiness',
                name: 'Suryacs Web Solutions',
                description: 'Full-Stack Web Developer specializing in Django, React, and modern web solutions.',
                url: 'https://suryacs-websolutions.vercel.app',
                image: 'https://suryacs-websolutions.vercel.app/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png',
                logo: 'https://suryacs-websolutions.vercel.app/icon.svg',
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
                image: `https://suryacs-websolutions.vercel.app${project.image}`,
                url: project.link || 'https://suryacs-websolutions.vercel.app/projects',
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
