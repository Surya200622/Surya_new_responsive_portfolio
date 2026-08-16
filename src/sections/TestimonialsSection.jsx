'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import './TestimonialsSection.css';

export default function TestimonialsSection() {
  const t = useTranslations('Testimonials');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', content: '', rating: 5 });
  const [submitStatus, setSubmitStatus] = useState('idle');

  useEffect(() => {
    async function fetchReviews() {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/reviews?t=${timestamp}`, { cache: 'no-store' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus('idle');
          setFormData({ name: '', role: '', content: '', rating: 5 });
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
  };

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
          {t('section_label')}
        </motion.div>

        <motion.h2
          className="testimonials__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
          <div>{t('title_1')} <span className="text-gradient">{t('title_accent')}</span></div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn--outline"
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            {t('leave_review')}
          </button>
        </motion.h2>

        {/* Leave Review Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', padding: '1rem' }}>
            <div style={{ background: 'var(--color-bg-primary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', width: '100%', maxWidth: '500px', position: 'relative' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '1.5rem' }}
              >
                &times;
              </button>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>{t('modal_title')}</h3>
              
              {submitStatus === 'success' ? (
                <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '0.5rem', textAlign: 'center' }}>
                  {t('success_msg')}
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{t('name')}</label>
                    <input 
                      required
                      className="input-field"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder={t('name_placeholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{t('role')}</label>
                    <input 
                      className="input-field"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      placeholder={t('role_placeholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{t('review_label')}</label>
                    <textarea 
                      required
                      className="input-field"
                      rows={4}
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      placeholder={t('review_placeholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{t('rating')}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[1,2,3,4,5].map(star => (
                        <Star 
                          key={star} 
                          size={24} 
                          fill={star <= formData.rating ? 'var(--color-accent-primary)' : 'none'}
                          stroke={star <= formData.rating ? 'var(--color-accent-primary)' : 'var(--color-text-muted)'}
                          onClick={() => setFormData({...formData, rating: star})}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                  </div>
                  {submitStatus === 'error' && <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{t('error_msg')}</div>}
                  <button type="submit" className="btn btn--primary" disabled={submitStatus === 'submitting'} style={{ marginTop: '1rem' }}>
                    {submitStatus === 'submitting' ? t('submitting') : t('submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Testimonial Cards */}
        {!loading && reviews.length > 0 && (
          reviews.length < 4 ? (
            <div className="testimonials__static-grid">
              {reviews.map((t, i) => (
                <div key={t.id} className="testimonials__card">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="testimonials__scroll-wrapper">
              <div className="testimonials__marquee-track">
                {/* Render reviews enough times to guarantee a seamless loop */}
                {[...reviews, ...reviews, ...reviews, ...reviews].map((t, i) => (
                  <div key={`${t.id}-${i}`} className="testimonials__card">
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
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
