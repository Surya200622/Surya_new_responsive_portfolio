import PortfolioLayout from '@/components/PortfolioLayout';
import ContactSection from '@/sections/ContactSection';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Surya CS | Freelance Web Developer',
  description: 'Get in touch with Surya CS for web development, Python automation, and freelance projects. Hire a skilled Django & React developer based in Coimbatore.',
  alternates: {
    canonical: 'https://suryacs-websolutions.vercel.app/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PortfolioLayout>
        <div style={{ paddingTop: '80px' }}>
          <ContactSection />
        </div>
      </PortfolioLayout>
    </Suspense>
  );
}
