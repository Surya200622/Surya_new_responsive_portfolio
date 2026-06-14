import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Database, PenTool, Wrench, Sparkles } from 'lucide-react';
import { SKILLS } from '../data/projectsData';
import './TechStackSection.css';

const CATEGORIES = [
  { key: 'all', label: 'All', icon: Sparkles },
  { key: 'frontend', label: 'Frontend', icon: Code2 },
  { key: 'backend', label: 'Backend', icon: Database },
];

// Skill icons/colors map
const SKILL_COLORS = {
  Python: '#3776AB',
  Django: '#092E20',
  'React.js': '#61DAFB',
  JavaScript: '#F7DF1E',
  HTML5: '#E34F26',
  CSS3: '#1572B6',
  Bootstrap: '#7952B3',
  SQLite: '#003B57',
};

function AnimatedRing({ level, color, size = 80, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="techstack__ring"
    >
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          '--ring-circumference': circumference,
          '--ring-target': offset,
          transformOrigin: 'center',
          transform: 'rotate(-90deg)',
          transition: 'stroke-dashoffset 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      />
    </svg>
  );
}

function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 8}s`,
    size: `${2 + Math.random() * 3}px`,
  }));

  return (
    <div className="techstack__particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="techstack__particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

export default function TechStackSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  const filteredSkills = activeFilter === 'all'
    ? SKILLS
    : SKILLS.filter((s) => s.category.toLowerCase() === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="techstack section" id="techstack">
      <ParticleField />
      <div className="techstack__orb techstack__orb--1" aria-hidden="true" />
      <div className="techstack__orb techstack__orb--2" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          className="techstack__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="techstack__label">
            <span className="techstack__label-line" />
            Technologies
          </div>
          <h2 className="techstack__title">
            Tech <span className="text-gradient">Stack</span>
          </h2>
          <p className="techstack__subtitle">
            The tools and technologies I use to build modern, scalable web applications.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="techstack__filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                className={`techstack__filter-btn ${activeFilter === cat.key ? 'techstack__filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(cat.key)}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Bento Grid */}
        <div className="techstack__bento">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => {
              const skillColor = SKILL_COLORS[skill.name] || 'var(--color-accent-primary)';
              return (
                <motion.div
                  key={skill.name}
                  className="techstack__card"
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="techstack__card-inner">
                    {/* Ring */}
                    <div className="techstack__ring-wrap">
                      {inView && (
                        <AnimatedRing
                          level={skill.level}
                          color={skillColor}
                          size={90}
                          strokeWidth={5}
                        />
                      )}
                      <div className="techstack__ring-label">{skill.level}%</div>
                    </div>

                    {/* Info */}
                    <div className="techstack__card-info">
                      <h3 className="techstack__card-name">{skill.name}</h3>
                      <span
                        className="techstack__card-category"
                        style={{ color: skillColor }}
                      >
                        {skill.category}
                      </span>
                    </div>

                    {/* Proficiency Bar */}
                    <div className="techstack__bar-track">
                      <motion.div
                        className="techstack__bar-fill"
                        style={{ background: skillColor }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 1.2, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div
                    className="techstack__card-glow"
                    style={{ '--glow-color': skillColor }}
                    aria-hidden="true"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
