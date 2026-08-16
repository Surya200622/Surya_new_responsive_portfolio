'use client';
import { Globe, ExternalLink, Link2, Heart, Shield, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../data/projectsData';
import './FooterSection.css';

const ICON_MAP = { Github: FaGithub, Linkedin: FaLinkedin, Instagram: FaInstagram, Facebook: FaFacebook, Youtube: FaYoutube };

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Blog', href: 'https://blogcraft.pythonanywhere.com' },
  { label: 'Contact', href: '#contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy', icon: Shield },
  { label: 'Terms of Service', href: '/terms-of-service', icon: FileText },
];

export default function FooterSection() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <h3 className="footer__cta-text">
            Let's work <span className="text-gradient">together</span>
          </h3>
          <a className="btn btn--primary" href="/#contact" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Start a Project
          </a>
        </div>

        <div className="footer__content">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/logo.svg" alt="Surya CS Logo" className="theme-adaptive-logo" style={{ height: '56px', width: 'auto' }} />
            </div>
            <p className="footer__brand-desc">
              Full-Stack Python Developer crafting modern web solutions with Django & React from Coimbatore, India.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__links-title">Quick Links</div>
            {NAV_LINKS.map(link => {
              if (link.href.startsWith('http')) {
                return (
                  <a
                    key={link.href}
                    className="footer__link"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', textDecoration: 'none' }}
                  >
                    {link.label}
                  </a>
                );
              }
              // Prepend with / so it redirects to the home page sections correctly from any route
              const hrefPath = link.href.startsWith('#') ? `/${link.href}` : link.href;
              return (
                <a key={link.href} className="footer__link" href={hrefPath} style={{ textDecoration: 'none' }}>
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="footer__links">
            <div className="footer__links-title">Legal</div>
            {LEGAL_LINKS.map(link => {
              const IconComp = link.icon;
              return (
                <a
                  key={link.href}
                  className="footer__link footer__legal-link"
                  href={link.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <IconComp size={14} />
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="footer__newsletter-socials" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div className="footer__links-title" style={{ marginBottom: '0.75rem' }}>Subscribe to Newsletter</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Get updates on my latest projects and articles.
              </p>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const email = form.email.value;
                  const btn = form.querySelector('button');
                  btn.textContent = '...';
                  btn.disabled = true;
                  try {
                    const res = await fetch('/api/newsletter/subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      form.innerHTML = '<p style="color: #22c55e; font-size: 0.875rem;">Successfully subscribed!</p>';
                    } else {
                      alert(data.message || 'Error subscribing');
                      btn.textContent = 'Subscribe';
                      btn.disabled = false;
                    }
                  } catch (err) {
                    alert('Error subscribing');
                    btn.textContent = 'Subscribe';
                    btn.disabled = false;
                  }
                }}
                style={{ display: 'flex', gap: '0.5rem' }}
              >
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your email" 
                  required 
                  style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn btn--primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  Subscribe
                </button>
              </form>
            </div>

            <div>
              <div className="footer__links-title" style={{ marginBottom: '0.75rem' }}>Follow Me</div>
              <div className="footer__socials">
                {SOCIAL_LINKS.map(link => {
                  const IconComp = ICON_MAP[link.icon] || Globe;
                  return (
                    <a
                      key={link.name}
                      className="footer__social-link"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                    >
                      <IconComp size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__copyright">© {new Date().getFullYear()} Surya CS. All rights reserved.</span>
          <div className="footer__bottom-links">
            <a href="/privacy-policy" className="footer__bottom-legal-link">Privacy Policy</a>
            <span className="footer__bottom-divider">·</span>
            <a href="/terms-of-service" className="footer__bottom-legal-link">Terms of Service</a>
          </div>
          <span className="footer__made">
            Crafted with <Heart size={12} className="footer__heart" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }} /> and passion
          </span>
        </div>
      </div>
    </footer>
  );
}
