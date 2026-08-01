import PortfolioLayout from '@/components/PortfolioLayout';
import TestimonialsSection from '@/sections/TestimonialsSection';
import { Suspense } from 'react';

export default function TestimonialsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PortfolioLayout>
        <div style={{ paddingTop: '80px' }}>
          <TestimonialsSection />
        </div>
      </PortfolioLayout>
    </Suspense>
  );
}
