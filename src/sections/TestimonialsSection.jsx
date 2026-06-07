'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import './TestimonialsSection.css';

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) {
    return null; // Optionally show a skeleton or nothing if there are no reviews yet
  }

  return (
    <section className="testimonials section" id="testimonials">
      <div className="container">
        <motion.div
          className="about__section-label"
          style={{ justifyContent: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="about__section-label-line" />
          Testimonials
        </motion.div>

        <motion.h2
          className="testimonials__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          What Clients <span className="text-gradient">Say</span>
        </motion.h2>

        <motion.div
          className="testimonials__founder"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="testimonials__founder-content">
            <div className="testimonials__founder-quote">
              "I don't just build websites — I craft digital experiences. Every project I deliver combines beautiful design with powerful functionality."
            </div>
            <div className="testimonials__founder-name">Surya CS</div>
            <div className="testimonials__founder-role">Full-Stack Python Developer</div>
          </div>
          <div className="testimonials__founder-image">
            <img src="/images/surya-portrait.jpg" alt="Surya — Founder" loading="lazy" />
          </div>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="testimonials__grid">
          {reviews.map((t, i) => (
            <motion.div
              key={t.id}
              className="testimonials__card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="testimonials__quote-mark">"</div>
              <p className="testimonials__card-text">{t.content}</p>
              <div className="testimonials__card-stars">
                {Array.from({ length: t.rating || 5 }, (_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <div className="testimonials__card-author">
                <span className="testimonials__card-name">{t.name}</span>
                <span className="testimonials__card-role">{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
