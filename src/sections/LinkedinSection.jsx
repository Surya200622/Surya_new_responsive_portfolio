import React, { useEffect, useRef } from 'react';
import './LinkedinSection.css';
import { useTheme } from '../hooks/useTheme';

const LinkedinSection = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);

  useEffect(() => {
    // Force the LinkedIn script to re-execute by removing the old script
    // and clearing its global state (window.LI) before injecting a new one.
    const scriptId = 'linkedin-badge-script';
    const oldScript = document.getElementById(scriptId);
    
    if (oldScript) {
      oldScript.remove();
    }

    // LinkedIn uses the LI global variable. Deleting it ensures the new script runs cleanly.
    if (typeof window !== 'undefined' && window.LI) {
      delete window.LI;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://platform.linkedin.com/badges/js/profile.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [theme]);

  // We use CSS to handle responsiveness so we don't have to re-render in React on every resize
  // We'll render all 4 sizes for the current theme, and CSS will hide the ones that don't match the breakpoint.
  
  return (
    <section id="linkedin" className="linkedin-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <p className="section-subtitle">Find me on LinkedIn</p>
        </div>

        <div className="badge-container" ref={containerRef} key={theme}>
          {/* Small Badge (Mobile) */}
          <div className="badge-wrapper badge-small">
            <div
              className="badge-base LI-profile-badge"
              data-locale="en_US"
              data-size="medium"
              data-theme={theme}
              data-type="VERTICAL"
              data-vanity="suryacs22"
              data-version="v1"
            >
              <a
                className="badge-base__link LI-simple-link"
                href="https://in.linkedin.com/in/suryacs22?trk=profile-badge"
              >
                Surya CS
              </a>
            </div>
          </div>

          {/* Medium Badge (Tablet) */}
          <div className="badge-wrapper badge-medium">
            <div
              className="badge-base LI-profile-badge"
              data-locale="en_US"
              data-size="medium"
              data-theme={theme}
              data-type="HORIZONTAL"
              data-vanity="suryacs22"
              data-version="v1"
            >
              <a
                className="badge-base__link LI-simple-link"
                href="https://in.linkedin.com/in/suryacs22?trk=profile-badge"
              >
                Surya CS
              </a>
            </div>
          </div>

          {/* Large Badge (Desktop) */}
          <div className="badge-wrapper badge-large">
            <div
              className="badge-base LI-profile-badge"
              data-locale="en_US"
              data-size="large"
              data-theme={theme}
              data-type="VERTICAL"
              data-vanity="suryacs22"
              data-version="v1"
            >
              <a
                className="badge-base__link LI-simple-link"
                href="https://in.linkedin.com/in/suryacs22?trk=profile-badge"
              >
                Surya CS
              </a>
            </div>
          </div>

          {/* Extra-Large Badge (Large Desktop) */}
          <div className="badge-wrapper badge-xlarge">
            <div
              className="badge-base LI-profile-badge"
              data-locale="en_US"
              data-size="large"
              data-theme={theme}
              data-type="HORIZONTAL"
              data-vanity="suryacs22"
              data-version="v1"
            >
              <a
                className="badge-base__link LI-simple-link"
                href="https://in.linkedin.com/in/suryacs22?trk=profile-badge"
              >
                Surya CS
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinkedinSection;
