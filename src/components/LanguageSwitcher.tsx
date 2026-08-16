'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read locale from cookie if present
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) {
      setLocale(match[2]);
    }
  }, []);

  const changeLanguage = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(newLocale);
    setIsOpen(false);
    // Refresh the router to apply the new translations
    router.refresh();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-primary)]/50 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">{locale}</span>
      </button>

      {isOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-[var(--color-bg-primary)] border border-[var(--color-glass-border)] rounded-lg shadow-xl z-50 overflow-hidden">
          {[
            { code: 'en', label: 'English (EN)' },
            { code: 'fr', label: 'Français (FR)' },
            { code: 'es', label: 'Español (ES)' },
            { code: 'de', label: 'Deutsch (DE)' },
            { code: 'ta', label: 'தமிழ் (TA)' },
            { code: 'hi', label: 'हिन्दी (HI)' },
            { code: 'ar', label: 'العربية (AR)' }
          ].map((lang) => (
            <button 
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-bg-tertiary)] transition-colors ${locale === lang.code ? 'text-[var(--color-accent-primary)] font-medium bg-[var(--color-bg-tertiary)]' : 'text-[var(--color-text-primary)]'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
