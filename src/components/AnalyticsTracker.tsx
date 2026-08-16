'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const hasTracked = useRef(new Set<string>());

  useEffect(() => {
    // Only track if we haven't tracked this path in this session yet
    // OR if you want to track every navigation, remove the Set logic.
    // Let's track every unique page view per session for simplicity.
    if (!pathname || hasTracked.current.has(pathname)) return;

    // Optional: Avoid tracking admin/dashboard paths if you don't want to skew data
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) return;

    hasTracked.current.add(pathname);

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        path: pathname,
        userAgent: navigator.userAgent
      }),
      // Use keepalive so the request isn't cancelled if the user navigates away quickly
      keepalive: true 
    }).catch(err => {
      // Silently fail for analytics
      console.warn('Analytics error:', err);
    });
    
  }, [pathname]);

  return null;
}
