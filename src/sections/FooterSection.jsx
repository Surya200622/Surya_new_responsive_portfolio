import { Globe, ExternalLink, Link2, Heart, Shield, FileText } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/projectsData';
import './FooterSection.css';

const ICON_MAP = { Github: Globe, Linkedin: ExternalLink, Instagram: Link2, Twitter: Globe };

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
          <button className="btn btn--primary" onClick={() => scrollTo('#contact')}>
            Start a Project
          </button>
        </div>

        <div className="footer__content">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/logo.svg" alt="Surya CS Logo" className="theme-adaptive-logo" style={{ height: '40px', width: 'auto' }} />
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
              return (
                <span key={link.href} className="footer__link" onClick={() => scrollTo(link.href)}>
                  {link.label}
                </span>
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
