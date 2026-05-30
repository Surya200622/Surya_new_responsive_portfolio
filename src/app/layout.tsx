import type { Metadata } from 'next';
import '../index.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://suryacs.is-a.dev'),
  title: 'Surya CS | Full-Stack Python Developer | Coimbatore, India',
  description:
    'Portfolio of Surya CS, an Full-Stack Python Developer specializing in Django, React, and modern web solutions. View projects, resume, and contact for freelance work.',
  keywords:
    'Surya CS, Cssurya, Full Stack Developer, Python Developer, Django, React, Web Development, Coimbatore, Freelance Developer',
  authors: [{ name: 'Surya CS' }],
  openGraph: {
    type: 'website',
    url: 'https://suryacs.is-a.dev',
    siteName: 'Surya CS',
    title: 'Surya CS | Full-Stack Python Developer',
    description:
      'Portfolio of Surya CS, an Full-Stack Python Developer specializing in Django, React, and modern web solutions.',
    images: ['/images/surya-portrait.jpg'],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surya CS | Full-Stack Python Developer',
    description:
      'Full-Stack Python Developer specializing in Django & React. Based in Coimbatore, India.',
    images: ['/images/surya-portrait.jpg'],
  },
  verification: {
    google: ['nzjJHjv3TTj8mUzNEFx4RH3ecj-OGGnMglPAKj3IubQ', 'FXp4jqzCy6bxO6ThBXz34F29BgX2w0qgt9v4tONOfec'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Theme initialization — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('surya-portfolio-theme');if(!t)t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0a0a0f':'#faf8f5');}catch(e){}})()`,
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
                name: 'Surya CS',
                url: 'https://suryacs.is-a.dev'
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'Surya CS',
                url: 'https://suryacs.is-a.dev',
                image: '/images/surya-portrait.jpg',
                jobTitle: 'Full-Stack Python Developer',
                description:
                  'B.COM.CA graduate from Sri Ramakrishna College of Arts & Science. IBM & ITC trained in Python Pandas & NumPy. Django & React Specialist.',
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
                  'https://suryacs.is-a.dev',
                  'https://www.instagram.com/surya_codes_/'
                ],
              }
            ]),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
