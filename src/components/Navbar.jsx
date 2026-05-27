import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '/#hero' },
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Calculator', href: '/#calculator' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [mounted, setMounted] = useState(false);

  const handleScroll = useCallback(() => {
    const current = window.scrollY;
    setScrolled(current > 50);
    setHidden(current > 300 && current > lastScroll);
    setLastScroll(current);
  }, [lastScroll]);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (href) => {
    setMobileOpen(false);
    
    // If not on home page and trying to go to a hash section, navigate to home first
    if (window.location.pathname !== '/' && href.startsWith('/#')) {
      window.location.href = href;
      return;
    }
    
    // On home page, just scroll to the section
    const selector = href.startsWith('/#') ? href.substring(1) : href;
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}${hidden ? ' navbar--hidden' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar__inner">
          <a className="navbar__logo" onClick={() => scrollTo('#hero')} tabIndex={0}>
            Surya CS<span className="navbar__logo-dot">.</span>
          </a>

          <div className="navbar__links">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                className="navbar__link"
                onClick={() => scrollTo(link.href)}
                tabIndex={0}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="navbar__actions">
            <a 
              href="/login" 
              className="text-xs font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] px-4 py-2 border border-[var(--color-accent-primary)]/30 rounded-full hover:bg-[var(--color-accent-primary)]/10 transition-all hidden md:block"
            >
              Client Portal
            </a>
            
            <button
              className="navbar__theme-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
            </button>

            <button
              className="navbar__mobile-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`navbar__mobile-overlay${mobileOpen ? ' navbar__mobile-overlay--open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu${mobileOpen ? ' navbar__mobile-menu--open' : ''}`}>
        <button className="navbar__mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>

        <div className="navbar__mobile-links">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              className="navbar__mobile-link"
              onClick={() => scrollTo(link.href)}
              tabIndex={0}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            className="navbar__mobile-link text-[var(--color-accent-primary)]"
            tabIndex={0}
          >
            Client Portal
          </a>
        </div>

        <button className="navbar__theme-btn" onClick={toggleTheme} style={{ alignSelf: 'flex-start' }}>
          {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
        </button>
      </div>
    </>
  );
}
