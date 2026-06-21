import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import './ProjectsSection.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECT_URLS = {
  'Porfolio': 'https://blogcraft.pythonanywhere.com/blog/portfolio-for-dr-gurumoorthi-assistant-professor/',
  'Attendence and salary calculator': 'https://blogcraft.pythonanywhere.com/blog/attendance-calculator/',
  'personal-portfolio': 'https://blogcraft.pythonanywhere.com/blog/portfolio/',
  'dental-experts': 'https://blogcraft.pythonanywhere.com/blog/dentalexperts/',
  'cipher-apparel': 'https://blogcraft.pythonanywhere.com/blog/cipherapparel/',
  'Blogsite': 'https://blogcraft.pythonanywhere.com/blog/blogcraft/'
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        if (data) {
          setProjects(data);
          setCategories(['All', ...new Set(data.map(p => p.category))]);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  useGSAP(() => {
    if (loading || projects.length === 0) return;
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
  }, { scope: sectionRef, dependencies: [activeFilter, loading, projects], revertOnUpdate: true });

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
            Projects <span className="text-gradient">Works</span>
          </motion.h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-primary)]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-[var(--color-text-secondary)]">
            No projects available yet.
          </div>
        ) : (
          <>
            {/* Filters */}
            <motion.div
              className="projects__filters"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {categories.map(cat => (
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
                    {!project.hide_link ? (
                      <a href={PROJECT_URLS[project.slug] || `/project/${project.slug}`} target="_blank" rel="noopener noreferrer" className="projects__card-inner" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="projects__card-image">
                          <img src={project.image} alt={project.title} loading="lazy" />
                          <span className="projects__card-year">{project.year}</span>
                          <span className="projects__card-category">{project.category}</span>
                        </div>
                        <div className="projects__card-body">
                          <h3 className="projects__card-title">{project.title}</h3>
                          <p className="projects__card-desc">{project.description}</p>
                          <div className="projects__card-tech">
                            {project.tech_array.map(t => (
                              <span key={t} className="projects__card-tag">{t}</span>
                            ))}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '1rem' }}>
                            <span className="projects__card-link">
                              View Details <ArrowRight size={14} />
                            </span>
                            {project.buyable && (
                              <button 
                                className="projects__card-link"
                                style={{ color: '#25D366', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(`https://wa.me/919994566325?text=Hi%20Surya,%20I'm%20interested%20in%20buying%20the%20project:%20${encodeURIComponent(project.title)}`, '_blank');
                                }}
                              >
                                Buy Project <ArrowRight size={14} />
                              </button>
                            )}
                          </div>

                        </div>
                      </a>
                    ) : (
                      <a href={PROJECT_URLS[project.slug] || `/project/${project.slug}`} target="_blank" rel="noopener noreferrer" className="projects__card-inner" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="projects__card-image">
                          <img src={project.image} alt={project.title} loading="lazy" />
                          <span className="projects__card-year">{project.year}</span>
                          <span className="projects__card-category">{project.category}</span>
                        </div>
                        <div className="projects__card-body">
                          <h3 className="projects__card-title">{project.title}</h3>
                          <p className="projects__card-desc">{project.description}</p>
                          <div className="projects__card-tech">
                            {project.tech_array.map(t => (
                              <span key={t} className="projects__card-tag">{t}</span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '1rem' }}>
                            <span className="projects__card-link">
                              View Details <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </a>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
