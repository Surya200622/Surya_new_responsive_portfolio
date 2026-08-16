'use client';

import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LegalThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Placeholder to avoid layout shift
  }

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-8 right-8 p-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] transition-all flex items-center justify-center shadow-md hover:shadow-lg"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
