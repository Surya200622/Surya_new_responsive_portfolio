'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Code2, Rocket } from 'lucide-react';
import './ProcessSection.css';

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Understanding your vision, goals, and target audience through in-depth consultation.',
    details: ['Requirement analysis', 'Market research', 'Competitor audit', 'Project roadmap'],
    icon: Search,
    color: 'var(--color-accent-primary)',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Crafting pixel-perfect wireframes and prototypes that bring your ideas to life.',
    details: ['Wireframing', 'UI/UX design', 'Prototype review', 'Design iteration'],
    icon: PenTool,
    color: 'var(--color-accent-secondary)',
  },
  {
    number: '03',
    title: 'Development',
    description: 'Building with modern technologies for performance, scalability, and clean architecture.',
    details: ['Frontend development', 'Backend API', 'Database design', 'Testing & QA'],
    icon: Code2,
    color: 'var(--color-accent-tertiary)',
  },
  {
    number: '04',
    title: 'Delivery',
    description: 'Launching with confidence — deployment, optimization, and ongoing support.',
    details: ['Performance tuning', 'SEO optimization', 'Deployment', 'Maintenance & support'],
    icon: Rocket,
    color: 'var(--color-accent-warm)',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export default function ProcessSection() {
  return (
    <section className="process section" id="process">
      <div className="process__orb process__orb--1" aria-hidden="true" />
      <div className="process__orb process__orb--2" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="process__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="process__label">
            <span className="process__label-line" />
            How I Work
          </div>
          <h2 className="process__title">
            My <span className="text-gradient">Process</span>
          </h2>
          <p className="process__subtitle">
            A structured approach to turning your ideas into exceptional digital products.
          </p>
        </motion.div>

        <div className="process__grid">
          {/* Connecting Line */}
          <div className="process__connector" aria-hidden="true">
            <div className="process__connector-line" />
          </div>

          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="process__card"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Step Number Badge */}
                <div className="process__step-number" style={{ '--step-color': step.color }}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className="process__icon" style={{ '--step-color': step.color }}>
                  <Icon size={28} />
                  <div className="process__icon-glow" aria-hidden="true" />
                </div>

                {/* Content */}
                <h3 className="process__card-title">{step.title}</h3>
                <p className="process__card-desc">{step.description}</p>

                {/* Details */}
                <ul className="process__card-details">
                  {step.details.map((detail) => (
                    <li key={detail} className="process__card-detail">
                      <span className="process__detail-dot" style={{ background: step.color }} />
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Hover Gradient Border */}
                <div className="process__card-border" aria-hidden="true" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
