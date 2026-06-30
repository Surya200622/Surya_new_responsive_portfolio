import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import './JarvisAdPopup.css';

export default function JarvisAdPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenJarvisPopup');
    
    if (!hasSeenPopup) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenJarvisPopup', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="jarvis-popup-overlay" onClick={handleClose}>
          <motion.div
            className="jarvis-popup-content premium-glass"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="jarvis-popup-close" onClick={handleClose} aria-label="Close">
              <X size={20} />
            </button>
            
            <div className="jarvis-popup-body">
              <div className="jarvis-popup-header">
                <Sparkles className="jarvis-popup-icon-small" size={18} />
                <h2 className="jarvis-popup-title">Meet Jarvis AI</h2>
              </div>
              
              <p className="jarvis-popup-desc">
                Experience the next generation of AI assistance. Boost your productivity and streamline your workflow with Jarvis.
              </p>
              
              <div className="jarvis-popup-actions">
                <a 
                  href="https://jarvis-official.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="jarvis-popup-btn primary"
                  onClick={handleClose}
                >
                  Try it now <ArrowRight size={16} />
                </a>
                <button className="jarvis-popup-btn secondary" onClick={handleClose}>
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
