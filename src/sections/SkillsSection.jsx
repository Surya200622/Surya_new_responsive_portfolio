import { useRef, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Code2, Database, PenTool, Wrench } from 'lucide-react';
import { SKILLS } from '../data/projectsData';
import './SkillsSection.css';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
  frontend: Code2,
  backend: Database,
  design: PenTool,
  tools: Wrench,
};

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Group skills by category
  const categories = useMemo(() => {
    const grouped = SKILLS.reduce((acc, skill) => {
      const cat = skill.category.toLowerCase();
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, items]) => ({
      name,
      items,
      count: items.length
    }));
  }, []);

  useGSAP(() => {
    const panels = gsap.utils.toArray('.skills__category-panel');
    if (panels.length === 0) return;
    
    // Horizontal scroll
    const scrollTween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        start: 'top top',
        end: () => `+=${trackRef.current.offsetWidth}`,
        onUpdate: (self) => {
          const newIndex = Math.round(self.progress * (panels.length - 1));
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
        }
      },
    });

    // Animate progress bars
    panels.forEach((panel, i) => {
      const fills = panel.querySelectorAll('.skills__progress-fill');
      gsap.fromTo(fills, 
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'left center',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
  }, { scope: sectionRef, dependencies: [categories] });

  return (
    <section ref={sectionRef} className="skills section" id="skills">
      <div className="skills__orb--1" />
      <div className="skills__orb--2" />
      
      <div className="skills__header">
        <motion.div
          className="skills__label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="skills__label-line" />
          Expertise
        </motion.div>
        
        <motion.h2
          className="skills__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Technical <span className="text-gradient">Arsenal</span>
        </motion.h2>
        
        <motion.p
          className="skills__subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          A comprehensive toolkit honed through building scalable applications and premium user experiences.
        </motion.p>
      </div>

      <div className="skills__scroll-wrapper">
        <div ref={trackRef} className="skills__scroll-track">
          {categories.map((category, index) => {
            const Icon = ICON_MAP[category.name] || Code2;
            return (
              <div key={category.name} className="skills__category-panel">
                <div className="skills__category-header">
                  <div className={`skills__category-icon skills__category-icon--${category.name}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="skills__category-name" style={{ textTransform: 'capitalize' }}>
                      {category.name}
                    </h3>
                    <span className="skills__category-count">{category.count} Technologies</span>
                  </div>
                </div>
                
                <div className="skills__card-list">
                  {category.items.map((skill, idx) => (
                    <div key={skill.name} className="skills__card">
                      <div className="skills__card-header">
                        <span className="skills__card-name">{skill.name}</span>
                        <span className="skills__card-level">{skill.level}%</span>
                      </div>
                      <div className="skills__progress-track">
                        <div 
                          className={`skills__progress-fill skills__progress-fill--${category.name}`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="skills__scroll-indicator">
        <span className="skills__scroll-hint">Scroll to explore</span>
        <div className="skills__scroll-dots">
          {categories.map((_, idx) => (
            <div 
              key={idx} 
              className={`skills__scroll-dot ${idx === activeIndex ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
