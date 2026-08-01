import PortfolioLayout from '@/components/PortfolioLayout';
import ContactSection from '@/sections/ContactSection';
import { Suspense } from 'react';

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
