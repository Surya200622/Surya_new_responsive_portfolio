import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { PROJECTS } from '../data/projectsData';
import './ProjectsSection.css';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['All', ...new Set(PROJECTS.map(p => p.category))];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const sectionRef = useRef(null);

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll('.projects__card');
    if (cards) {
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, { scope: sectionRef, dependencies: [activeFilter], revertOnUpdate: true });

  const handleCardMouse = useCallback((e, cardEl) => {
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardEl.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  }, []);

  const handleCardLeave = useCallback((cardEl) => {
    cardEl.style.transform = '';
  }, []);

  return (
    <section ref={sectionRef} className="projects section" id="projects">
      <div className="container">
        <div className="projects__header">
          <motion.div
            className="about__section-label"
            style={{ justifyContent: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="about__section-label-line" />
            Portfolio
          </motion.div>
          <motion.h2
            className="projects__title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Selected <span className="text-gradient">Works</span>
          </motion.h2>
        </div>

        {/* Filters */}
        <motion.div
          className="projects__filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`projects__filter-btn${activeFilter === cat ? ' projects__filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="projects__grid">
          <AnimatePresence mode="popLayout">
            {filtered.map(project => (
              <motion.div
                key={project.id}
                className="projects__card"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                onMouseMove={(e) => handleCardMouse(e, e.currentTarget)}
                onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
              >
                {!project.hideLink ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="projects__card-inner">
                    <div className="projects__card-image">
                      <img src={project.image} alt={project.title} loading="lazy" />
                      <span className="projects__card-year">{project.year}</span>
                      <span className="projects__card-category">{project.category}</span>
                    </div>
                    <div className="projects__card-body">
                      <h3 className="projects__card-title">{project.title}</h3>
                      <p className="projects__card-desc">{project.description}</p>
                      <div className="projects__card-tech">
                        {project.tech.map(t => (
                          <span key={t} className="projects__card-tag">{t}</span>
                        ))}
                      </div>
                      <span className="projects__card-link">
                        View Project <ArrowRight size={14} />
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="projects__card-inner">
                    <div className="projects__card-image">
                      <img src={project.image} alt={project.title} loading="lazy" />
                      <span className="projects__card-year">{project.year}</span>
                      <span className="projects__card-category">{project.category}</span>
                    </div>
                    <div className="projects__card-body">
                      <h3 className="projects__card-title">{project.title}</h3>
                      <p className="projects__card-desc">{project.description}</p>
                      <div className="projects__card-tech">
                        {project.tech.map(t => (
                          <span key={t} className="projects__card-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
