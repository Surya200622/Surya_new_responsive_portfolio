import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Briefcase, Heart, Award, Code, Coffee, Zap, Globe2, Layers } from 'lucide-react';
import { SKILLS, TIMELINE_DATA, STATS } from '../data/projectsData';
import GithubStats from '../components/GithubStats';
import './AboutSection.css';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = { Briefcase, Heart, Award, Code };

const STORY_BLOCKS = [
  {
    title: 'Who I Am',
    text: 'I\'m Surya CS — an Full-Stack Python Developer based in Coimbatore, India. I\'m a B.COM.CA graduate from Sri Ramakrishna College of Arts & Science with IBM & ITC collaborative training in Python Pandas & NumPy. I don\'t just build websites — I craft digital experiences.',
  },
  {
    title: 'What I Do',
    text: 'I specialize in Django and React to build modern, blazing-fast web solutions. From dental booking systems to fashion e-commerce platforms, every project I deliver combines beautiful design with powerful functionality.',
  },
  {
    title: 'My Goal',
    text: 'I\'m actively seeking to apply my Python full-stack development skills, contribute to innovative projects, and grow professionally. I\'m passionate about creating experiences that convert visitors into customers.',
  },
];





const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function AboutSection() {
  const sectionRef = useRef(null);
  const storyRef = useRef(null);
  const revealRef = useRef(null);
  const timelineRef = useRef(null);
  const skillsRef = useRef(null);
  const tiltRef = useRef(null);

  // 3D tilt effect on story image
  const handleMouseMove = (e) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -15;
    const rotateY = (x - 0.5) * 15;
    tiltRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  };

  useGSAP(() => {
    // Story blocks reveal
    const blocks = storyRef.current?.querySelectorAll('.about__story-block');
    if (blocks) {
      blocks.forEach((block) => {
        gsap.to(block, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }

    // Image clip-path reveal
    if (revealRef.current) {
      const revealContainer = revealRef.current.querySelector('.about__reveal-container');
      const symbolsBg = revealRef.current.querySelector('.about__reveal-symbols');
      
      if (revealContainer) {
        gsap.to(revealContainer, {
          clipPath: 'circle(75% at 50% 50%)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: revealRef.current,
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          },
        });
      }

      const symbols = revealRef.current.querySelectorAll('.about__symbol');
      if (symbols.length > 0) {
        symbols.forEach((symbol, index) => {
          const speed = (index % 3 + 1) * 30; // 30, 60, 90
          const dir = index % 2 === 0 ? -1 : 1;
          gsap.to(symbol, {
            yPercent: speed * dir,
            rotation: `+=${dir * 60}`,
            ease: 'none',
            scrollTrigger: {
              trigger: revealRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
      }
    }

    // Timeline items — parallax + scroll effects for desktop
    const timelineItems = timelineRef.current?.querySelectorAll('.about__timeline-item');
    if (timelineItems) {
      const mm = gsap.matchMedia();

      // ===== DESKTOP: Timeline animation with left/right slide-in =====
      mm.add('(min-width: 969px)', () => {
        timelineItems.forEach((item, idx) => {
          const isLeft = idx % 2 === 0;
          const card = item.querySelector('.about__timeline-card');
          const dot = item.querySelector('.about__timeline-dot');
          const yearEl = item.querySelector('.about__timeline-year');

          // Reset the CSS initial state so we can control it entirely with GSAP
          gsap.set(item, { opacity: 1, y: 0 });
          
          if (card) {
            gsap.set(card, { x: isLeft ? -100 : 100, opacity: 0, rotateY: isLeft ? -15 : 15, scale: 0.9 });
          }
          if (dot) {
            gsap.set(dot, { scale: 0, opacity: 0 });
          }
          if (yearEl) {
            gsap.set(yearEl, { opacity: 0, y: 20 });
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          });

          if (dot) {
            tl.to(dot, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' });
          }
          
          if (yearEl) {
            tl.to(yearEl, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3');
          }
          
          if (card) {
            tl.to(card, {
              x: 0,
              opacity: 1,
              rotateY: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
            }, '-=0.3');
          }
        });
      });

      // ===== MOBILE/TABLET: simple fade-in (bidirectional) =====
      mm.add('(max-width: 968px)', () => {
        timelineItems.forEach((item) => {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
          });
        });
      });
    }

    // Timeline progress line
    const progressLine = timelineRef.current?.querySelector('.about__timeline-progress');
    if (progressLine) {
      gsap.to(progressLine, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: true,
        },
      });
    }

    // Skill bars
    const skillFills = skillsRef.current?.querySelectorAll('.about__skill-fill');
    if (skillFills) {
      skillFills.forEach((fill) => {
        const target = fill.getAttribute('data-level');
        gsap.to(fill, {
          width: `${target}%`,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: fill,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="about section" id="about">
      <div className="container">
        {/* Intro */}
        <div className="about__intro">
          <motion.div
            className="about__section-label"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="about__section-label-line" />
            About Me
          </motion.div>

          <motion.h2
            className="about__title"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Crafting the Future of <span className="text-gradient" style={{ position: 'relative' }}>
              Web Experiences
              <motion.svg 
                width="120%" height="20" viewBox="0 0 200 20" 
                style={{ position: 'absolute', bottom: '-10px', left: '-10%', zIndex: -1 }}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
              >
                <motion.path 
                  d="M5,15 Q100,5 195,15" 
                  fill="none" 
                  stroke="var(--color-accent-primary)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                />
              </motion.svg>
            </span>
          </motion.h2>
        </div>

        {/* Story Grid */}
        <div className="about__story" ref={storyRef}>
          <div
            className="about__story-image about__tilt-card"
            ref={tiltRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src="/images/WhatsApp Image 2026-06-14 at 8.25.27 PM.jpeg"
              alt="Surya CS — Full-Stack Python Developer"
              loading="lazy"
            />
            {/* 3D Tilt Shine Effect */}
            <div className="about__tilt-shine" aria-hidden="true" />
          </div>

          <div className="about__story-text">
            {STORY_BLOCKS.map((block) => (
              <div key={block.title} className="about__story-block">
                <h3 className="about__story-block-title">{block.title}</h3>
                <p className="about__story-block-text">{block.text}</p>
              </div>
            ))}
          </div>
        </div>




        {/* Stats */}
        <div className="about__stats">
          {STATS.map((stat, i) => {
            const IconComp = ICON_MAP[stat.icon] || Briefcase;
            return (
              <motion.div
                key={stat.label}
                className="about__stat"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="about__stat-icon"><IconComp size={28} /></div>
                <div className="about__stat-value">{stat.value}</div>
                <div className="about__stat-label">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <GithubStats username="Surya200622" />

        {/* Timeline */}
        <div className="about__timeline" ref={timelineRef}>
          <motion.h2
            className="about__title"
            style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            My <span className="text-gradient">Journey</span>
          </motion.h2>

          <div style={{ position: 'relative' }}>
            <div className="about__timeline-line" aria-hidden="true" />
            <div className="about__timeline-progress" aria-hidden="true" />

            <div className="about__timeline-items">
              {TIMELINE_DATA.map((item, i) => (
                <div key={i} className="about__timeline-item">
                  <div className={`about__timeline-content ${i % 2 === 0 ? 'about__timeline-content--left' : 'about__timeline-content--right'}`}>
                    <div className="about__timeline-parallax">
                      <div className="about__timeline-card">
                        <h4 className="about__timeline-title">{item.title}</h4>
                        <p className="about__timeline-desc">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="about__timeline-center">
                    <div className={`about__timeline-dot${item.type === 'current' ? ' about__timeline-dot--current' : ''}`} />
                    <span className="about__timeline-year">{item.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="about__skills" ref={skillsRef}>
          <motion.h2
            className="about__title"
            style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            My <span className="text-gradient">Skills</span>
          </motion.h2>

          <div className="about__skills-marquee">
            <div className="about__skills-track">
              {/* Group 1 */}
              <div className="about__skills-group">
                {SKILLS.map((skill) => (
                  <div key={`g1-${skill.name}`} className="about__skill-card">
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: skill.category === 'Frontend' ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)' }} />
                    <div className="about__skill-name">{skill.name}</div>
                  </div>
                ))}
              </div>
              {/* Group 2 */}
              <div className="about__skills-group">
                {SKILLS.map((skill) => (
                  <div key={`g2-${skill.name}`} className="about__skill-card">
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: skill.category === 'Frontend' ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)' }} />
                    <div className="about__skill-name">{skill.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
