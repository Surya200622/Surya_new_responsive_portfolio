import { Sparkles, ArrowRight } from 'lucide-react';
import './JarvisAdBanner.css';

export default function JarvisAdBanner() {
  return (
    <div className="jarvis-banner">
      <a href="https://surya-cs.itch.io/jarvis" target="_blank" rel="noopener noreferrer" className="jarvis-banner__link">
        <div className="jarvis-banner__marquee">
          <div className="jarvis-banner__content">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="jarvis-banner__item">
                <Sparkles size={16} className="jarvis-banner__icon" />
                <span>Meet Jarvis AI — Experience the next generation of AI assistance. Boost your productivity and streamline your workflow with Jarvis!</span>
                <span className="jarvis-banner__cta">
                  Try Jarvis Now <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
}
