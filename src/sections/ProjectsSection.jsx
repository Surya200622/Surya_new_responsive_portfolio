'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import PaymentModal from '../components/payment/PaymentModal';
import './ProjectsSection.css';

gsap.registerPlugin(ScrollTrigger);

const YoutubeCardVideo = ({ project }) => {
  return (
    <div 
      className="projects__card-image" 
      style={{ position: 'relative', width: '100%', paddingTop: '56.25%', display: 'block', textDecoration: 'none' }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${project.youtubeId}?rel=0`}
        title={project.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px', border: 'none' }}
      ></iframe>
      <span className="projects__card-year">{project.year}</span>
      <span className="projects__card-category">{project.category}</span>
    </div>
  );
};


export default function ProjectsSection() {
    const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeFilter, setActiveFilter] = useState('All');
  const [buyableFilter, setBuyableFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [paymentModalState, setPaymentModalState] = useState({ isOpen: false, amount: 0, projectName: '' });
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/portfolio-projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        if (data) {
          const sortedData = [...data].sort((a, b) => {
            if (a.isYoutube && !b.isYoutube) return 1;
            if (!a.isYoutube && b.isYoutube) return -1;
            return 0;
          });
          setProjects(sortedData);
          setCategories(['All', ...new Set(sortedData.map(p => p.category))]);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter(p => {
    const categoryMatch = activeFilter === 'All' || p.category === activeFilter;
    const buyableMatch = buyableFilter === 'All' 
      ? true 
      : buyableFilter === 'Available' 
        ? p.buyable && !['Blogsite', 'Porfolio'].includes(p.slug)
        : !(p.buyable && !['Blogsite', 'Porfolio'].includes(p.slug));
    return categoryMatch && buyableMatch;
  });

  const displayedProjects = (!showAll && filtered.length > 4)
    ? filtered.slice(0, 4)
    : filtered;

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
  }, { scope: sectionRef, dependencies: [activeFilter, buyableFilter, loading, projects], revertOnUpdate: true });

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
    <section ref={sectionRef} className="projects section" id="projects" style={{ minHeight: '100vh' }}>
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
            {"Portfolio"}
          </motion.div>
          <motion.h2
            className="projects__title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {"Projects"} <span className="text-gradient">{"Works"}</span>
          </motion.h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-primary)]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-[var(--color-text-secondary)]">
            {"No projects available yet."}
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
              style={{ alignItems: 'center', rowGap: '1rem' }}
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`projects__filter-btn${activeFilter === cat ? ' projects__filter-btn--active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat === 'All' ? "All" : cat}
                </button>
              ))}

              <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 4px' }} className="hidden sm:block" />

              <button
                className={`projects__filter-btn${buyableFilter === 'All' ? ' projects__filter-btn--active' : ''}`}
                onClick={() => setBuyableFilter('All')}
              >
                {"All Status"}
              </button>
              <button
                className={`projects__filter-btn${buyableFilter === 'Available' ? ' projects__filter-btn--active' : ''}`}
                onClick={() => setBuyableFilter('Available')}
              >
                {"For Sale"}
              </button>
              <button
                className={`projects__filter-btn${buyableFilter === 'Unavailable' ? ' projects__filter-btn--active' : ''}`}
                onClick={() => setBuyableFilter('Unavailable')}
              >
                {"Not For Sale"}
              </button>
            </motion.div>

            {/* Grid */}
            <div className="projects__grid">
              <AnimatePresence mode="popLayout">
                {displayedProjects.map(project => (
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
                    {project.isYoutube ? (
                      <div className="projects__card-inner" style={{ color: 'inherit' }}>
                        <YoutubeCardVideo project={project} />
                        <div className="projects__card-body">
                          <h3 className="projects__card-title">{project.title}</h3>
                          <p className="projects__card-desc">{project.description}</p>
                          <div className="projects__card-tech">
                            {(project.techArray || []).map(t => (
                              <span key={t} className="projects__card-tag">{t}</span>
                            ))}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <a href={project.viewDetailsUrl || `/project/${project.slug}`} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none' }}>
                              {"View Details"} <ArrowRight size={14} />
                            </a>
                            <a href={project.link || '#'} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none', color: 'var(--color-accent-secondary)' }}>
                              {"Live URL"} <ArrowRight size={14} />
                            </a>
                            {project.buyable && !['Blogsite', 'Porfolio'].includes(project.slug) && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {project.offersDiscountPrice ? (
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span className="projects__card-price" style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                                      ₹{Number(project.offersDiscountPrice).toLocaleString('en-IN')}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--color-text-secondary)', opacity: 0.9 }}>
                                      ₹{Number(project.projectPrice || 5000).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="projects__card-price" style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                                    ₹{Number(project.projectPrice || 5000).toLocaleString('en-IN')}
                                  </span>
                                )}
                                <button 
                                  className="projects__card-link"
                                  style={{ color: 'var(--color-accent-primary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const finalPrice = project.offersDiscountPrice ? Number(project.offersDiscountPrice) : Number(project.projectPrice || 5000);
                                    setPaymentModalState({ isOpen: true, amount: finalPrice, projectName: project.title });
                                  }}
                                >
                                  {"Buy Project"} <ArrowRight size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : !project.hideLink ? (
                      <div className="projects__card-inner" style={{ color: 'inherit' }}>
                        <a href={`/project/${project.slug}`} className="projects__card-image" style={{ display: 'block', textDecoration: 'none' }}>
                          <img src={project.image} alt={project.title} loading="lazy" />
                          <span className="projects__card-year">{project.year}</span>
                          <span className="projects__card-category">{project.category}</span>
                        </a>
                        <div className="projects__card-body">
                          <h3 className="projects__card-title">{project.title}</h3>
                          <p className="projects__card-desc">{project.description}</p>
                          <div className="projects__card-tech">
                            {(project.techArray || []).map(t => (
                              <span key={t} className="projects__card-tag">{t}</span>
                            ))}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <a href={project.viewDetailsUrl || `/project/${project.slug}`} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none' }}>
                              {"View Details"} <ArrowRight size={14} />
                            </a>
                            <a href={project.link || '#'} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none', color: 'var(--color-accent-secondary)' }}>
                              {"Live URL"} <ArrowRight size={14} />
                            </a>
                            {project.buyable && !['Blogsite', 'Porfolio'].includes(project.slug) && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {project.offersDiscountPrice ? (
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span className="projects__card-price" style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                                      ₹{Number(project.offersDiscountPrice).toLocaleString('en-IN')}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--color-text-secondary)', opacity: 0.9 }}>
                                      ₹{Number(project.projectPrice || 5000).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="projects__card-price" style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                                    ₹{Number(project.projectPrice || 5000).toLocaleString('en-IN')}
                                  </span>
                                )}
                                <button 
                                  className="projects__card-link"
                                  style={{ color: 'var(--color-accent-primary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const finalPrice = project.offersDiscountPrice ? Number(project.offersDiscountPrice) : Number(project.projectPrice || 5000);
                                    setPaymentModalState({ isOpen: true, amount: finalPrice, projectName: project.title });
                                  }}
                                >
                                  {"Buy Project"} <ArrowRight size={14} />
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div className="projects__card-inner" style={{ color: 'inherit' }}>
                        <a href={`/project/${project.slug}`} className="projects__card-image" style={{ display: 'block', textDecoration: 'none' }}>
                          <img src={project.image} alt={project.title} loading="lazy" />
                          <span className="projects__card-year">{project.year}</span>
                          <span className="projects__card-category">{project.category}</span>
                        </a>
                        <div className="projects__card-body">
                          <h3 className="projects__card-title">{project.title}</h3>
                          <p className="projects__card-desc">{project.description}</p>
                          <div className="projects__card-tech">
                            {(project.techArray || []).map(t => (
                              <span key={t} className="projects__card-tag">{t}</span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <a href={project.viewDetailsUrl || `/project/${project.slug}`} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none' }}>
                              {"View Details"} <ArrowRight size={14} />
                            </a>
                            <a href={project.link || '#'} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none', color: 'var(--color-accent-secondary)' }}>
                              {"Live URL"} <ArrowRight size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {!showAll && filtered.length > 4 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                <button 
                  className="btn btn--primary"
                  onClick={() => setShowAll(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {"View all projects"} <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

      </div>


      <PaymentModal 
        isOpen={paymentModalState.isOpen}
        onClose={() => setPaymentModalState({ ...paymentModalState, isOpen: false })}
        amount={paymentModalState.amount}
        projectName={paymentModalState.projectName}
        allowAdvance={false}
        allowRemaining={false}
      />
    </section>
  );
}
