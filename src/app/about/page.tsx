import PortfolioLayout from '@/components/PortfolioLayout';
import AboutSection from '@/sections/AboutSection';
import { Suspense } from 'react';

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
