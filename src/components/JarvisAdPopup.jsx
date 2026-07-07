import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import './JarvisAdPopup.css';

export default function JarvisAdPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

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
                <div style={{ position: 'relative', width: '100%', height: '167px', borderRadius: '12px', overflow: 'hidden' }}>
                  {!iframeLoaded && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)' }}>
                      <Loader2 className="jarvis-popup-spinner" size={24} color="#a855f7" />
                    </div>
                  )}
                  <iframe 
                    onLoad={() => setIframeLoaded(true)}
                    frameBorder="0" 
                    src="https://itch.io/embed/4712303?linkback=true&amp;bg_color=e2e8f3&amp;fg_color=27a7f7&amp;link_color=27a7f7" 
                    width="100%" 
                    height="167"
                    style={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      opacity: iframeLoaded ? 1 : 0, 
                      transition: 'opacity 0.5s ease',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  >
                    <a href="https://surya-cs.itch.io/jarvis">Jarvis by surya-cs</a>
                  </iframe>
                </div>
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
