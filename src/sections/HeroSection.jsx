import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Briefcase, Heart, Award } from 'lucide-react';
import { useMousePosition } from '../hooks/useMousePosition';
import MorphingBrackets from '../components/MorphingBrackets';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

const FLOATING_STATS = [
  { value: '3+', label: 'Projects', icon: Briefcase },
  { value: 'IBM & ITC', label: 'Trained', icon: Award },
  { value: '10+', label: 'Technologies', icon: Heart },
];

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

// Typing effect hook
function useTypingEffect(texts, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (!isDeleting && displayText === currentText) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentText.substring(0, displayText.length - 1)
            : currentText.substring(0, displayText.length + 1)
        );
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

const TYPING_TEXTS = [
  'Full-Stack Python Developer',
  'Django & React Specialist',
  'UI/UX Enthusiast',
  'Problem Solver',
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const portraitRef = useRef(null);
  const mouse = useMousePosition();
  const typedText = useTypingEffect(TYPING_TEXTS);

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

  // Mouse parallax for portrait
  const portraitX = mouse.normalizedX * 12;
  const portraitY = mouse.normalizedY * 8;
  const portraitRotateY = mouse.normalizedX * 3;
  const portraitRotateX = -mouse.normalizedY * 3;

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="hero" id="hero">
      {/* Background */}
      <div className="hero__bg" ref={bgRef}>
        <img
          src="/images/surya-cinematic.jpg"
          alt=""
          className="hero__bg-img"
          loading="eager"
          aria-hidden="true"
        />
      </div>
      <div className="hero__bg-overlay" />
      <div className="hero__bg-vignette" />
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
          {/* Glowing Ring */}
          <div className="hero__portrait-ring" aria-hidden="true" />

          <div
            className="hero__portrait-wrapper"
            ref={portraitRef}
            style={{
              transform: `translate3d(${portraitX}px, ${portraitY}px, 0) rotateY(${portraitRotateY}deg) rotateX(${portraitRotateX}deg)`,
              transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
          >
            <img
              src="/images/WhatsApp Image 2026-06-14 at 8.19.47 PM.jpeg"
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
            Available for Hire
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
            <span className="hero__label-line" />
            <span className="hero__typing-text">{typedText}</span>
            <span className="hero__typing-cursor" aria-hidden="true">|</span>
          </motion.div>

          <motion.h1 className="hero__title" variants={itemVariants}>
            I Craft<br />
            <span className="hero__title-accent">Digital</span>{' '}
            Experiences
          </motion.h1>

          <motion.p className="hero__subtitle" variants={itemVariants}>
            Full-Stack Python Developer crafting modern, blazing-fast
            web solutions with Django & React. Based in Coimbatore, India.
          </motion.p>

          <motion.div className="hero__cta-row" variants={itemVariants}>
            <button className="btn btn--primary" onClick={() => scrollToSection('#projects')}>
              View My Work <ArrowRight size={16} />
            </button>
            <a href="/resume.pdf" download="Surya_CS_Resume.pdf" className="btn btn--glass" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Download Resume
            </a>
            <button className="btn btn--glass" onClick={() => scrollToSection('#contact')}>
              Get In Touch
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => scrollToSection('#about')}
      >
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  );
}
