'use client';

import { lazy, Suspense, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';

gsap.registerPlugin(ScrollTrigger);

// Lazy load below-fold sections for performance
const AboutSection = lazy(() => import('./sections/AboutSection'));
const SkillsSection = lazy(() => import('./sections/SkillsSection'));
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'));
const CalculatorSection = lazy(() => import('./sections/CalculatorSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));
const FooterSection = lazy(() => import('./sections/FooterSection'));

function SectionLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '40vh',
      color: 'var(--color-text-muted)',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-sm)',
      letterSpacing: '0.1em',
    }}>
      Loading...
    </div>
  );
}

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Refresh ScrollTrigger on dynamic content load
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <HeroSection />

        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>

        <div className="section-divider" />



        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection />
        </Suspense>

        <div className="section-divider" />

        <Suspense fallback={<SectionLoader />}>
          <CalculatorSection />
        </Suspense>

        <div className="section-divider" />

        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <FooterSection />
      </Suspense>
    </>
  );
}
