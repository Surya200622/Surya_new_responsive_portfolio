import PortfolioLayout from '@/components/PortfolioLayout';
import OffersSection from '@/sections/OffersSection';
import { Suspense } from 'react';

export default function OffersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PortfolioLayout>
        <div style={{ paddingTop: '80px' }}>
          <OffersSection />
        </div>
      </PortfolioLayout>
    </Suspense>
  );
}
