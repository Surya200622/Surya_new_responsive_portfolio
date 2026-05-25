import type { Metadata } from 'next';
import '../index.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Surya CS | IBM Certified Full-Stack Python Developer | Coimbatore, India',
  description:
    'Portfolio of Surya CS, an IBM Certified Full-Stack Python Developer specializing in Django, React, and modern web solutions. View projects, resume, and contact for freelance work.',
  keywords:
    'Surya CS, Cssurya, Full Stack Developer, Python Developer, Django, React, Web Development, Coimbatore, Freelance Developer, IBM Certified',
  authors: [{ name: 'Surya CS' }],
  openGraph: {
    type: 'website',
    url: 'https://suryacs.unaux.com/',
    title: 'Surya CS | IBM Certified Full-Stack Python Developer',
    description:
      'Portfolio of Surya CS, an IBM Certified Full-Stack Python Developer specializing in Django, React, and modern web solutions.',
    images: ['/images/surya-cinematic.jpg'],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surya CS | Full-Stack Python Developer',
    description:
      'IBM Certified Full-Stack Python Developer specializing in Django & React. Based in Coimbatore, India.',
    images: ['/images/surya-cinematic.jpg'],
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

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="theme-color" content="#0a0a0f" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Surya CS',
              url: 'https://suryacs.unaux.com',
              image: '/images/surya-cinematic.jpg',
              jobTitle: 'IBM Certified Full-Stack Python Developer',
              description:
                'B.COM.CA graduate from Sri Ramakrishna College of Arts & Science. IBM & ITC Python Certified. Django & React Specialist.',
              email: 'cssurya2006@gmail.com',
              telephone: '+918220443165',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Coimbatore',
                addressRegion: 'Tamil Nadu',
                addressCountry: 'India',
              },
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Sri Ramakrishna College of Arts & Science',
              },
              sameAs: [
                'https://github.com/Surya200622',
                'https://linkedin.com/in/suryacs22/',
                'https://surya-cs-portfolio.vercel.app',
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
