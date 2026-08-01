import PortfolioLayout from '@/components/PortfolioLayout';
import CalculatorSection from '@/sections/CalculatorSection';
import { Suspense } from 'react';

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PortfolioLayout>
        <div style={{ paddingTop: '80px' }}>
          <CalculatorSection />
        </div>
      </PortfolioLayout>
    </Suspense>
  );
}
