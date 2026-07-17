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
const ProcessSection = lazy(() => import('./sections/ProcessSection'));
const SkillsSection = lazy(() => import('./sections/SkillsSection'));
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'));
const OffersSection = lazy(() => import('./sections/OffersSection'));
const TechStackSection = lazy(() => import('./sections/TechStackSection'));
const CalculatorSection = lazy(() => import('./sections/CalculatorSection'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'));
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

  // Update document title based on visible section
  useEffect(() => {
    const titles = {
      hero: 'Surya CS | Full-Stack Python Developer',
      projects: 'Portfolio | Surya CS',
      offers: 'Special Offers | Surya CS',
      calculator: 'Project Cost Calculator | Surya CS',
      about: 'About Me | Surya CS',
      process: 'Process | Surya CS',
      techstack: 'Tech Stack | Surya CS',
      skills: 'Skills | Surya CS',
      testimonials: 'Testimonials | Surya CS',
      contact: 'Contact | Surya CS'
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (titles[entry.target.id]) {
              document.title = titles[entry.target.id];
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <HeroSection />

        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection />
        </Suspense>

        <div className="section-divider" />

        <Suspense fallback={<SectionLoader />}>
          <OffersSection />
        </Suspense>

        <div className="section-divider" />

        <Suspense fallback={<SectionLoader />}>
          <CalculatorSection />
        </Suspense>

        <div className="section-divider" />

        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>

        <div className="section-divider" />

        <Suspense fallback={<SectionLoader />}>
          <ProcessSection />
        </Suspense>

        <div className="section-divider" />

        <Suspense fallback={<SectionLoader />}>
          <TechStackSection />
        </Suspense>

        <div className="section-divider" />

        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
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
