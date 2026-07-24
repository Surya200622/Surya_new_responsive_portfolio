import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Sun, Moon, Menu, X, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '/#hero' },
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Jarvis AI', href: 'https://jarvis-official.vercel.app/' },
  { label: 'Resume', href: '/resume' },
  { label: 'Calculator', href: '/#calculator' },
  { label: 'Reviews', href: '/#testimonials' },
  { label: 'Blog', href: 'https://blogcraft.pythonanywhere.com' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const profile = session?.user;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [calculatorEnabled, setCalculatorEnabled] = useState(true);

  // Fetch calculator visibility setting
  useEffect(() => {
    async function checkCalculatorSetting() {
      try {
        const res = await fetch('/api/admin/settings?key=calculator_enabled');
        const data = await res.json();
        setCalculatorEnabled(data.value === true || data.value === 'true');
      } catch {
        setCalculatorEnabled(true);
      }
    }
    checkCalculatorSetting();
  }, []);

  // Filter nav links based on settings
  const filteredNavLinks = useMemo(() => {
    return NAV_LINKS.filter(link => {
      if (link.href === '/#calculator' && !calculatorEnabled) return false;
      return true;
    });
  }, [calculatorEnabled]);

  const pathname = usePathname();



  const handleScroll = useCallback(() => {
    const current = window.scrollY;
    
    setScrolled(prev => {
      const isScrolled = current > 50;
      if (prev !== isScrolled) return isScrolled;
      return prev;
    });
    
    if (current > lastScrollRef.current && current > 300) {
      setHidden(true); // Scrolling down past 300px
    } else if (current < lastScrollRef.current) {
      setHidden(false); // Scrolling up
    }
    
    lastScrollRef.current = current;
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    setTimeout(() => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => observer.observe(section));
    }, 100);

    return () => observer.disconnect();
  }, [pathname]);

  const router = useRouter();

  const scrollTo = (href) => {
    setMobileOpen(false);
    
    // If it's a direct page link like /resume
    if (href.startsWith('/') && !href.startsWith('/#')) {
      router.push(href);
      return;
    }

    // If not on home page and trying to go to a hash section, navigate to home first
    if (window.location.pathname !== '/' && href.startsWith('/#')) {
      router.push(href);
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
          <a className="navbar__logo flex items-center" onClick={() => scrollTo('#hero')} tabIndex={0} style={{ textDecoration: 'none' }}>
            <img src="/logo.svg" alt="Surya CS Logo" className="theme-adaptive-logo" style={{ height: '52px', width: 'auto', marginTop: '4px' }} />
          </a>

          <div className="navbar__links">
            {filteredNavLinks.map(link => {
              if (link.href.startsWith('http')) {
                return (
                  <a
                    key={link.href}
                    className="navbar__link"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={0}
                  >
                    {link.label}
                  </a>
                );
              }
              const isHash = link.href.startsWith('/#');
              const isActive = isHash 
                ? (pathname === '/' && activeSection === link.href.substring(2))
                : pathname === link.href;

              return (
                <a
                  key={link.href}
                  className="navbar__link"
                  onClick={() => scrollTo(link.href)}
                  tabIndex={0}
                  style={{ position: 'relative' }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="navbar__actions">
            {user ? (
              <div className="relative group shrink-0" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-primary)] transition-colors"
                >
                  {profile?.image || profile?.avatar_url ? (
                    <img src={profile.image || profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
                      {(profile?.name || profile?.full_name)?.charAt(0)?.toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>
                <div className={`absolute right-0 top-full mt-2 w-[calc(100vw-24px)] sm:w-48 max-w-[200px] bg-white border border-gray-200 rounded-xl shadow-xl transition-all ${dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'} flex flex-col overflow-hidden z-[60]`}>
                  <a href={profile?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-800 font-medium text-sm transition-colors border-b border-gray-100">
                    <LayoutDashboard size={16} /> Dashboard
                  </a>
                  <a href="/dashboard/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-800 font-medium text-sm transition-colors border-b border-gray-100">
                    <Settings size={16} /> Account Settings
                  </a>
                  <button 
                    onClick={async () => {
                      await signOut();
                    }} 
                    className="flex items-center gap-2 px-4 py-3 hover:bg-red-500/10 text-red-500 hover:text-red-400 text-sm text-left transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <a 
                href="/login" 
                className="text-xs sm:text-sm font-semibold text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all shadow-md hover:shadow-lg"
                style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', animation: 'hue-shift 8s linear infinite' }}
              >
                Login
              </a>
            )}
            
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
          {filteredNavLinks.map(link => {
            if (link.href.startsWith('http')) {
              return (
                <a
                  key={link.href}
                  className="navbar__mobile-link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={0}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              );
            }
            const isHash = link.href.startsWith('/#');
            const isActive = isHash 
              ? (pathname === '/' && activeSection === link.href.substring(2))
              : pathname === link.href;

            return (
              <a
                key={link.href}
                className={`navbar__mobile-link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={() => scrollTo(link.href)}
                tabIndex={0}
              >
                {link.label}
              </a>
            );
          })}
          {user ? (
            <>
              <a href={profile?.role === 'admin' ? '/admin' : '/dashboard'} className="navbar__mobile-link text-[var(--color-accent-primary)] flex items-center gap-2">
                <LayoutDashboard size={18} /> Dashboard
              </a>
              <a href="/dashboard/settings" className="navbar__mobile-link text-[var(--color-text-primary)] flex items-center gap-2">
                <Settings size={18} /> Account Settings
              </a>
              <button 
                onClick={async () => {
                  await signOut();
                }} 
                className="navbar__mobile-link text-red-500 flex items-center gap-2 mt-4 text-left w-full"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="navbar__mobile-link text-[var(--color-accent-primary)] mt-4"
              tabIndex={0}
            >
              Client Portal
            </a>
          )}
        </div>

      </div>
    </>
  );
}
