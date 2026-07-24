import PortfolioApp from '@/App';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PortfolioApp />
    </Suspense>
  );
}
