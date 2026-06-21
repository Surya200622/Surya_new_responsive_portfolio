import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import PaymentModal from '../components/payment/PaymentModal';
import './ProjectsSection.css';

gsap.registerPlugin(ScrollTrigger);

const VIEW_DETAILS_URLS = {
  'Porfolio': 'https://blogcraft.pythonanywhere.com/blog/portfolio-for-dr-gurumoorthi-assistant-professor/',
  'Attendence and salary calculator': 'https://blogcraft.pythonanywhere.com/blog/attendance-calculator/',
  'personal-portfolio': 'https://blogcraft.pythonanywhere.com/blog/portfolio/',
  'dental-experts': 'https://blogcraft.pythonanywhere.com/blog/dentalexperts/',
  'cipher-apparel': 'https://blogcraft.pythonanywhere.com/blog/cipherapparel/',
  'Blogsite': 'https://blogcraft.pythonanywhere.com/blog/blogcraft/'
};

const LIVE_URLS = {
  'Porfolio': 'https://drgurumoorthi-ap-commerce.vercel.app',
  'Attendence and salary calculator': 'https://attendance-calculator-dashboard.vercel.app/',
  'personal-portfolio': 'https://surya-cs-portfolio.vercel.app/',
  'dental-experts': 'https://suryacs.pythonanywhere.com/',
  'cipher-apparel': 'https://cipher-apperal.vercel.app/',
  'Blogsite': 'https://blogcraft.pythonanywhere.com/'
};

const PROJECT_PRICES = {
  'dental-experts': 15000,
  'cipher-apparel': 12000,
  'personal-portfolio': 5000,
  'Attendence and salary calculator': 3500
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [paymentModalState, setPaymentModalState] = useState({ isOpen: false, amount: 0, projectName: '' });
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
                      <div className="projects__card-inner" style={{ color: 'inherit' }}>
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
                          
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <a href={VIEW_DETAILS_URLS[project.slug] || `/project/${project.slug}`} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none' }}>
                              View Details <ArrowRight size={14} />
                            </a>
                            <a href={LIVE_URLS[project.slug] || '#'} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none', color: 'var(--color-accent-secondary)' }}>
                              Live URL <ArrowRight size={14} />
                            </a>
                            {project.buyable && !['Blogsite', 'Porfolio'].includes(project.slug) && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span className="projects__card-price" style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                                  ₹{PROJECT_PRICES[project.slug]?.toLocaleString('en-IN') || '5,000'}
                                </span>
                                <button 
                                  className="projects__card-link"
                                  style={{ color: '#25D366', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPaymentModalState({ isOpen: true, amount: PROJECT_PRICES[project.slug] || 5000, projectName: project.title });
                                  }}
                                >
                                  Buy Project <ArrowRight size={14} />
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div className="projects__card-inner" style={{ color: 'inherit' }}>
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
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <a href={VIEW_DETAILS_URLS[project.slug] || `/project/${project.slug}`} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none' }}>
                              View Details <ArrowRight size={14} />
                            </a>
                            <a href={LIVE_URLS[project.slug] || '#'} target="_blank" rel="noopener noreferrer" className="projects__card-link" style={{ textDecoration: 'none', color: 'var(--color-accent-secondary)' }}>
                              Live URL <ArrowRight size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      <PaymentModal 
        isOpen={paymentModalState.isOpen}
        onClose={() => setPaymentModalState({ ...paymentModalState, isOpen: false })}
        amount={paymentModalState.amount}
        projectName={paymentModalState.projectName}
      />
    </section>
  );
}
