import PortfolioLayout from '@/components/PortfolioLayout';
import AboutSection from '@/sections/AboutSection';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Surya CS | Full-Stack Python Developer',
  description: 'Learn more about Surya CS, a B.Com.CA graduate and Full-Stack Python Developer specialized in Django and React. View skills, experience, and background.',
  alternates: {
    canonical: 'https://suryacs-websolutions.vercel.app/about',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PortfolioLayout>
        <div style={{ paddingTop: '80px' }}>
          <AboutSection />
        </div>
      </PortfolioLayout>
    </Suspense>
  );
}
