import { Globe, ExternalLink, Link2, Heart } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/projectsData';
import './FooterSection.css';

const ICON_MAP = { Github: Globe, Linkedin: ExternalLink, Instagram: Link2, Twitter: Globe };

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Contact', href: '#contact' },
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
              Surya CS<span className="footer__logo-dot">.</span>
            </div>
            <p className="footer__brand-desc">
              Full-Stack Python Developer crafting modern web solutions with Django & React from Coimbatore, India.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__links-title">Quick Links</div>
            {NAV_LINKS.map(link => (
              <span key={link.href} className="footer__link" onClick={() => scrollTo(link.href)}>
                {link.label}
              </span>
            ))}
          </div>

          <div>
            <div className="footer__links-title" style={{ marginBottom: '0.75rem' }}>Follow Me</div>
            <div className="footer__socials">
              {SOCIAL_LINKS.map(link => {
                const IconComp = ICON_MAP[link.icon] || Github;
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
          <span className="footer__made">
            Crafted with <Heart size={12} className="footer__heart" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }} /> and passion
          </span>
        </div>
      </div>
    </footer>
  );
}
