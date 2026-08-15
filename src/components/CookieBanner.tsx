'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('surya_cookie_consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('surya_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('surya_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:bottom-8 z-[100] sm:w-[400px] max-w-full"
        >
          <div className="bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <Cookie size={20} className="text-orange-500" />
                <h3 className="font-semibold text-lg">Cookie Preferences</h3>
              </div>
              <button 
                onClick={handleDecline}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies. Read our{' '}
              <Link href="/privacy-policy" className="text-orange-500 hover:underline">
                Privacy Policy
              </Link>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleDecline}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors text-sm font-medium"
              >
                Decline
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors text-sm font-medium shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
