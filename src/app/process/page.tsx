import PortfolioLayout from '@/components/PortfolioLayout';
import ProcessSection from '@/sections/ProcessSection';
import { Suspense } from 'react';

export default function ProcessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PortfolioLayout>
        <div style={{ paddingTop: '80px' }}>
          <ProcessSection />
        </div>
      </PortfolioLayout>
    </Suspense>
  );
}
