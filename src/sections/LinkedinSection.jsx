import React, { useEffect, useRef } from 'react';
import './LinkedinSection.css';
import { useTheme } from '../hooks/useTheme';

const LinkedinSection = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);

  useEffect(() => {
    // We want to force the LinkedIn script to re-parse when theme or component mounts
    // One way is to append the script dynamically if it's not there,
    // or if it is there, we can try to find if IN.parse exists
    const scriptId = 'linkedin-badge-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://platform.linkedin.com/badges/js/profile.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, we might need to tell LinkedIn to re-parse.
      // LinkedIn exposes window.IN, but for badges it's often automatic on DOM insert if we re-append it, or we can just rely on standard React key to recreate the div.
      // To be safe, we can just replace the script tag to force it to re-execute, though it's hacky.
    }
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
