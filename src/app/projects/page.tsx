import PortfolioLayout from '@/components/PortfolioLayout';
import ProjectsSection from '@/sections/ProjectsSection';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio & Projects | Suryacs Web Solutions',
  description: 'Explore the amazing web development, Python automation, and software projects built by Surya CS.',
  keywords: 'Surya CS portfolio, web development projects, Python projects, React applications, software developer portfolio',
  openGraph: {
    title: 'Portfolio & Projects | Suryacs Web Solutions',
    description: 'Explore the amazing web development, Python automation, and software projects built by Surya CS.',
    url: 'https://suryacsweb.is-cool.dev/projects',
    images: [
      {
        url: '/images/Gemini_Generated_Image_7eech37eech37eec.png',
        width: 1200,
        height: 630,
        alt: 'Suryacs Web Solutions Portfolio',
      },
    ],
  }
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PortfolioLayout>
        <div style={{ paddingTop: '80px' }}>
          <ProjectsSection isStandalone={true} />
        </div>
      </PortfolioLayout>
    </Suspense>
  );
}
