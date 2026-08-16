'use client';
import { useRef, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, PenTool, Wrench } from 'lucide-react';
import { SKILLS } from '../data/projectsData';
import { useTranslations } from 'next-intl';
import './SkillsSection.css';

const ICON_MAP = {
  frontend: Code2,
  backend: Database,
  design: PenTool,
  tools: Wrench,
};

export default function SkillsSection() {
  const t = useTranslations('Skills');
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

  // Duplicate categories for infinite marquee effect
  const marqueeItems = [...categories, ...categories];

  return (
    <section className="skills section" id="skills">
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
          {t('section_label')}
        </motion.div>
        
        <motion.h2
          className="skills__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {t('title_1')} <span className="text-gradient">{t('title_accent')}</span>
        </motion.h2>
        
        <motion.p
          className="skills__subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {t('subtitle')}
        </motion.p>
      </div>

      <div className="skills__scroll-wrapper">
        <div className="skills__marquee-track">
          {marqueeItems.map((category, index) => {
            const Icon = ICON_MAP[category.name] || Code2;
            return (
              <div key={`${category.name}-${index}`} className="skills__category-panel">
                <div className="skills__category-header">
                  <div className={`skills__category-icon skills__category-icon--${category.name}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="skills__category-name" style={{ textTransform: 'capitalize' }}>
                      {t(`categories.${category.name}`) || category.name}
                    </h3>
                    <span className="skills__category-count">{category.count} {t('technologies')}</span>
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
                          style={{ width: `${skill.level}%`, transform: 'scaleX(1)' }}
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
    </section>
  );
}
