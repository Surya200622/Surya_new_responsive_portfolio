import PortfolioLayout from '@/components/PortfolioLayout';
import ProjectsSection from '@/sections/ProjectsSection';
import { Suspense } from 'react';

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PortfolioLayout>
        <div style={{ paddingTop: '80px' }}>
          <ProjectsSection />
        </div>
      </PortfolioLayout>
    </Suspense>
  );
}
