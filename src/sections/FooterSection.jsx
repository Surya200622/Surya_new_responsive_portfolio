'use client';
import { Globe, ExternalLink, Link2, Heart, Shield, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../data/projectsData';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
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
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navbar');
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <h3 className="footer__cta-text">
            {t('cta_1')} <span className="text-gradient">{t('cta_accent')}</span>
          </h3>
          <a className="btn btn--primary" href="/#contact" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {t('start_project')}
          </a>
        </div>

        <div className="footer__content">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/logo.svg" alt="Surya CS Logo" className="theme-adaptive-logo" style={{ height: '56px', width: 'auto' }} />
            </div>
            <p className="footer__brand-desc">
              {t('brand_desc')}
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__links-title">{t('quick_links')}</div>
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
              const linkLabel = link.label === 'Blog' ? 'Blog' : link.label === 'Calculator' ? tNav('calculator') : tNav(link.label.toLowerCase());
              return (
                <a key={link.href} className="footer__link" href={hrefPath} style={{ textDecoration: 'none' }}>
                  {linkLabel}
                </a>
              );
            })}
          </div>

          <div className="footer__links">
            <div className="footer__links-title">{t('legal')}</div>
            {LEGAL_LINKS.map(link => {
              const IconComp = link.icon;
              return (
                <Link
                  key={link.href}
                  className="footer__link footer__legal-link"
                  href={link.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <IconComp size={14} />
                  {link.label === 'Privacy Policy' ? t('privacy_policy') : t('terms_of_service')}
                </Link>
              );
            })}
          </div>

          <div className="footer__newsletter-socials" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div className="footer__links-title" style={{ marginBottom: '0.75rem' }}>{t('newsletter')}</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                {t('newsletter_desc')}
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
                      form.innerHTML = `<p style="color: #22c55e; font-size: 0.875rem;">${t('subscribe_success')}</p>`;
                    } else {
                      alert(data.message || 'Error subscribing');
                      btn.textContent = t('subscribe');
                      btn.disabled = false;
                    }
                  } catch (err) {
                    alert('Error subscribing');
                    btn.textContent = t('subscribe');
                    btn.disabled = false;
                  }
                }}
                style={{ display: 'flex', gap: '0.5rem' }}
              >
                <input 
                  type="email" 
                  name="email"
                  placeholder={t('email_placeholder')} 
                  required 
                  style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn btn--primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  {t('subscribe')}
                </button>
              </form>
            </div>

            <div>
              <div className="footer__links-title" style={{ marginBottom: '0.75rem' }}>{t('follow_me')}</div>
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
          <span className="footer__copyright">{t('copyright', { year: new Date().getFullYear() })}</span>
          <div className="footer__bottom-links">
            <Link href="/privacy-policy" className="footer__bottom-legal-link">{t('privacy_policy')}</Link>
            <span className="footer__bottom-divider">·</span>
            <Link href="/terms-of-service" className="footer__bottom-legal-link">{t('terms_of_service')}</Link>
          </div>
          <span className="footer__made">
            {t('crafted_with')} <Heart size={12} className="footer__heart" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }} /> {t('and_passion')}
          </span>
        </div>
      </div>
    </footer>
  );
}
