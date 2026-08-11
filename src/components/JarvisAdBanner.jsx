'use client';

import { Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import './JarvisAdBanner.css';

export default function JarvisAdBanner() {
  const [banner, setBanner] = useState({
    text: 'Meet Jarvis AI — Experience the next generation of AI assistance. Boost your productivity and streamline your workflow with Jarvis!',
    url: 'https://surya-cs.itch.io/jarvis',
    active: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch('/api/admin/settings?key=banner_settings');
        const data = await res.json();
        if (data && data.value && typeof data.value === 'object') {
          setBanner(data.value);
        }
      } catch (err) {
        console.error('Failed to fetch banner settings', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanner();
  }, []);

  if (!banner.active || loading) return null;

  return (
    <div className="jarvis-banner">
      <a href={banner.url} target="_blank" rel="noopener noreferrer" className="jarvis-banner__link">
        <div className="jarvis-banner__marquee">
          <div className="jarvis-banner__content">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="jarvis-banner__item">
                <Sparkles size={16} className="jarvis-banner__icon" />
                <span>{banner.text}</span>
                <span className="jarvis-banner__cta">
                  Go <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
}
