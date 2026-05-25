import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Globe, ExternalLink, Link2, Send, CheckCircle } from 'lucide-react';
import { SOCIAL_LINKS, CONTACT_INFO } from '../data/projectsData';
import './ContactSection.css';

const ICON_MAP = { Github: Globe, Linkedin: ExternalLink, Instagram: Link2, Twitter: Globe };

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', project: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <motion.div
          className="about__section-label"
          style={{ justifyContent: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="about__section-label-line" />
          Contact
        </motion.div>

        <motion.h2
          className="contact__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Let's Build Something <span className="text-gradient">Amazing</span>
        </motion.h2>

        <motion.p
          className="contact__subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Ready to start your project? Get in touch and let's make it happen.
        </motion.p>

        <div className="contact__grid">
          {/* Form */}
          <motion.form
            className="contact__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <motion.div
                className="contact__success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
                <h3>Message Sent!</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                  Thank you for reaching out. I'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="contact__field">
                  <input
                    className="contact__input"
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    id="contact-name"
                  />
                </div>
                <div className="contact__field">
                  <input
                    className="contact__input"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    id="contact-email"
                  />
                </div>
                <div className="contact__field">
                  <input
                    className="contact__input"
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    id="contact-phone"
                  />
                </div>
                <div className="contact__field">
                  <input
                    className="contact__input"
                    type="text"
                    placeholder="Project Type (e.g., E-commerce Website)"
                    value={formData.project}
                    onChange={(e) => handleChange('project', e.target.value)}
                    id="contact-project"
                  />
                </div>
                <div className="contact__field">
                  <textarea
                    className="contact__textarea"
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                    id="contact-message"
                  />
                </div>
                <button className="contact__submit" type="submit">
                  <Send size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Send Message
                </button>
              </>
            )}
          </motion.form>

          {/* Info */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="contact__portrait">
              <img src="/images/WhatsApp Image 2026-03-03 at 10.04.23 AM.jpeg" alt="Surya" loading="lazy" />
            </div>

            <div className="contact__details">
              <div className="contact__detail-item">
                <div className="contact__detail-icon"><Mail size={20} /></div>
                <div>
                  <div className="contact__detail-label">Email</div>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="contact__detail-text">{CONTACT_INFO.email}</a>
                </div>
              </div>
              <div className="contact__detail-item">
                <div className="contact__detail-icon"><MessageSquare size={20} /></div>
                <div>
                  <div className="contact__detail-label">WhatsApp</div>
                  <div className="contact__detail-text">{CONTACT_INFO.whatsapp}</div>
                </div>
              </div>
              <div className="contact__detail-item">
                <div className="contact__detail-icon"><MapPin size={20} /></div>
                <div>
                  <div className="contact__detail-label">Location</div>
                  <div className="contact__detail-text">{CONTACT_INFO.location}</div>
                </div>
              </div>
            </div>

            <div className="contact__quick-actions">
              <a
                className="btn btn--primary"
                href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare size={14} /> WhatsApp
              </a>
              <a
                className="btn btn--glass"
                href={`mailto:${CONTACT_INFO.email}`}
              >
                <Mail size={14} /> Email
              </a>
            </div>

            <div className="contact__socials">
              {SOCIAL_LINKS.map(link => {
                const IconComp = ICON_MAP[link.icon] || Github;
                return (
                  <a
                    key={link.name}
                    className="contact__social-link"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                  >
                    <IconComp size={20} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
