'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ProcessSection from './sections/ProcessSection';
import ProjectsSection from './sections/ProjectsSection';
import OffersSection from './sections/OffersSection';
import CalculatorSection from './sections/CalculatorSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [calculatorEnabled, setCalculatorEnabled] = useState(true);

  // Fetch calculator visibility setting
  useEffect(() => {
    async function checkCalculatorSetting() {
      try {
        const res = await fetch('/api/admin/settings?key=calculator_enabled');
        const data = await res.json();
        setCalculatorEnabled(data.value === true || data.value === 'true');
      } catch {
        // Default to showing calculator if fetch fails
        setCalculatorEnabled(true);
      }
    }
    checkCalculatorSetting();
  }, []);

  // Refresh ScrollTrigger when any dynamic content loads or changes height
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    let timeoutId;
    const resizeObserver = new ResizeObserver(() => {
      // Debounce to prevent excessive refreshing
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });

    resizeObserver.observe(mainElement);
    
    // Initial refresh just in case
    const initialTimer = setTimeout(() => ScrollTrigger.refresh(true), 600);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
      clearTimeout(initialTimer);
    };
  }, [calculatorEnabled]);

  // Update document title based on visible section
  useEffect(() => {
    const titles = {
      hero: 'Surya CS | Full-Stack Python Developer',
      projects: 'Portfolio | Surya CS',
      offers: 'Special Offers | Surya CS',
      calculator: 'Project Cost Calculator | Surya CS',
      about: 'About Me | Surya CS',
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

        <ProjectsSection />

        <div className="section-divider" />

        <OffersSection />

        <div className="section-divider" />

        {calculatorEnabled && (
          <>
            <CalculatorSection />

            <div className="section-divider" />
          </>
        )}

        <AboutSection />

        <div className="section-divider" />

        <ProcessSection />

        <div className="section-divider" />

        <TestimonialsSection />

        <div className="section-divider" />

        <div className="section-divider" />

        <ContactSection />
      </main>

      <FooterSection />
    </>
  );
}
