import PortfolioApp from '@/App';
import Preloader from '@/components/Preloader';
import { Suspense } from 'react';

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
