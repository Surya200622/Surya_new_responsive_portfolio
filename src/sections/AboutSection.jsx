import { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Briefcase, Heart, Award, Code } from 'lucide-react';
import { SKILLS, TIMELINE_DATA, STATS } from '../data/projectsData';
import './AboutSection.css';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = { Briefcase, Heart, Award, Code };

const STORY_BLOCKS = [
  {
    title: 'Who I Am',
    text: 'I\'m Surya CS — an IBM Certified Full-Stack Python Developer based in Coimbatore, India. I\'m a B.COM.CA graduate from Sri Ramakrishna College of Arts & Science with IBM & ITC Python certifications. I don\'t just build websites — I craft digital experiences.',
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
      const revealImage = revealRef.current.querySelector('.about__reveal-image');
      if (revealImage) {
        gsap.to(revealImage, {
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
    }

    // Timeline items
    const timelineItems = timelineRef.current?.querySelectorAll('.about__timeline-item');
    if (timelineItems) {
      timelineItems.forEach((item) => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
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
            Crafting the Future of <span className="text-gradient">Web Experiences</span>
          </motion.h2>
        </div>

        {/* Story Grid */}
        <div className="about__story" ref={storyRef}>
          <div className="about__story-image">
            <img
              src="/images/surya-nature.jpg"
              alt="Surya CS — Full-Stack Python Developer"
              loading="lazy"
            />
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

        {/* Image Reveal */}
        <div className="about__reveal" ref={revealRef}>
          <div className="about__reveal-image">
            <img
              src="/images/surya-casual.jpg"
              alt="Surya CS"
              loading="lazy"
            />
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
                <div key={item.year} className="about__timeline-item">
                  {i % 2 === 0 ? (
                    <>
                      <div className="about__timeline-card">
                        <h4 className="about__timeline-title">{item.title}</h4>
                        <p className="about__timeline-desc">{item.description}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <div className={`about__timeline-dot${item.type === 'current' ? ' about__timeline-dot--current' : ''}`} />
                        <span className="about__timeline-year">{item.year}</span>
                      </div>
                      <div className="about__timeline-spacer" />
                    </>
                  ) : (
                    <>
                      <div className="about__timeline-spacer" />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <div className={`about__timeline-dot${item.type === 'current' ? ' about__timeline-dot--current' : ''}`} />
                        <span className="about__timeline-year">{item.year}</span>
                      </div>
                      <div className="about__timeline-card">
                        <h4 className="about__timeline-title">{item.title}</h4>
                        <p className="about__timeline-desc">{item.description}</p>
                      </div>
                    </>
                  )}
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
