import PortfolioApp from '@/App';
import Preloader from '@/components/Preloader';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suryacs Web Solutions | Full-Stack Python Developer',
  description: 'Portfolio of Surya CS, a Full-Stack Python Developer specializing in Django, React, and modern web solutions. View projects, resume, and contact for freelance work.',
  alternates: {
    canonical: 'https://suryacs-websolutions.vercel.app/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
        <PortfolioApp />
      </Suspense>
    </>
  );
}
