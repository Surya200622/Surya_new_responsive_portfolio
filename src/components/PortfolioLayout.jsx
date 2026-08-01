'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../hooks/useTheme';
import Preloader from './Preloader';
import Navbar from './Navbar';
import FooterSection from '../sections/FooterSection';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioLayout({ children }) {
  const { theme, toggleTheme } = useTheme();

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
  }, []);

  return (
    <>
      <Preloader />
      
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        {children}
      </main>

      <FooterSection />
    </>
  );
}
