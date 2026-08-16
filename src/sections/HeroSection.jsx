'use client';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Briefcase, Heart, Award } from 'lucide-react';
import MorphingBrackets from '../components/MorphingBrackets';
import JarvisAdBanner from '../components/JarvisAdBanner';
import { useTranslations } from 'next-intl';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

// Moved to inside component
// const FLOATING_STATS = [
//   { value: '3+', label: 'Projects', icon: Briefcase },
//   { value: 'IBM & ITC', label: 'Trained', icon: Award },
//   { value: '10+', label: 'Technologies', icon: Heart },
// ];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};



export default function HeroSection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const portraitRef = useRef(null);
  const t = useTranslations('Hero');

  const FLOATING_STATS = [
    { value: '3+', label: t('stat_projects'), icon: Briefcase },
    { value: 'IBM & ITC', label: t('stat_trained'), icon: Award },
    { value: '10+', label: t('stat_tech'), icon: Heart },
  ];

  // Parallax on scroll
  useGSAP(() => {
    gsap.to(bgRef.current, {
      yPercent: 30,
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to(sectionRef.current, {
      opacity: 0.3,
      scale: 0.97,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: '60% top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: sectionRef });

  // Mouse parallax for portrait using direct DOM mutation to prevent React re-renders
  useEffect(() => {
    let animationFrameId;
    
    const handleMouseMove = (e) => {
      if (!portraitRef.current) return;
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
        const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
        
        const portraitX = normalizedX * 12;
        const portraitY = normalizedY * 8;
        const portraitRotateY = normalizedX * 3;
        const portraitRotateX = -normalizedY * 3;
        
        portraitRef.current.style.transform = `translate3d(${portraitX}px, ${portraitY}px, 0) rotateY(${portraitRotateY}deg) rotateX(${portraitRotateX}deg)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="hero" id="hero">
      {/* Background */}
      <div className="hero__bg" ref={bgRef}>
        <img
          src="/images/Gemini_Generated_Image_z7lt8hz7lt8hz7lt.png"
          alt=""
          className="hero__bg-img"
          loading="eager"
          aria-hidden="true"
        />
      </div>
      <div className="hero__bg-overlay" />
      <div className="hero__bg-vignette" />
      
      <div className="hero__ad-banner">
        <JarvisAdBanner />
      </div>

      <MorphingBrackets />

      {/* Gradient Orbs */}
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />

      {/* Main Content */}
      <motion.div
        className="hero__content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Portrait */}
        <motion.div className="hero__portrait-container" variants={itemVariants}>
          <div
            className="hero__portrait-wrapper"
            ref={portraitRef}
            style={{
              transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
          >
            <img
              src="/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png"
              alt="Surya CS — Full-Stack Python Developer"
              className="hero__portrait-img"
              loading="eager"
            />
            <div className="hero__portrait-sweep" aria-hidden="true" />
          </div>

          {/* Status Badge */}
          <motion.div
            className="hero__status-badge"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="hero__status-dot" />
            {t('available')}
          </motion.div>

          {/* Floating Stats */}
          <div className="hero__stats">
            {FLOATING_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="hero__stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="hero__stat-value">{stat.value}</div>
                <div className="hero__stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Text */}
        <div className="hero__text">
          <motion.div className="hero__label" variants={itemVariants}>
            <div className="hero__label-line" aria-hidden="true" />
            <span className="hero__typing-text">{t('role')}</span>
          </motion.div>

          <motion.h1 className="hero__title" variants={itemVariants}>
            {t('title_1')}<br />
            <span className="hero__title-accent">{t('title_accent')}</span>{' '}
            {t('title_2')}
          </motion.h1>

          <motion.p className="hero__subtitle" variants={itemVariants}>
            {t('subtitle')}
          </motion.p>

          <motion.div className="hero__cta-row" variants={itemVariants}>
            <a href="https://jarvis-official.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn btn--primary" style={{ background: 'linear-gradient(90deg, #f97316, #fb923c)', border: 'none', textDecoration: 'none' }}>
              {t('meet_jarvis')}
            </a>

            <a href="/SuryaCS-resume.pdf" download="SuryaCS-resume.pdf" className="btn btn--glass" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {t('download_resume')}
            </a>
            <button className="btn btn--glass" onClick={() => scrollToSection('#contact')}>
              {t('get_in_touch')}
            </button>
          </motion.div>
        </div>
      </motion.div>


    </section>
  );
}
