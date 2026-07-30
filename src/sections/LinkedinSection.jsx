import React, { useEffect } from 'react';
import './LinkedinSection.css';

const LinkedinSection = () => {
  useEffect(() => {
    // Only inject the script once
    const scriptId = 'linkedin-badge-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://platform.linkedin.com/badges/js/profile.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section id="linkedin" className="linkedin-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <p className="section-subtitle">Find me on LinkedIn</p>
        </div>

        <div className="badge-container">
          {/* Small Badge (Mobile) - Light */}
          <div className="badge-wrapper badge-small theme-light">
            <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="suryacs22" data-version="v1">
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/suryacs22?trk=profile-badge">Surya CS</a>
            </div>
          </div>
          {/* Small Badge (Mobile) - Dark */}
          <div className="badge-wrapper badge-small theme-dark">
            <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="dark" data-type="VERTICAL" data-vanity="suryacs22" data-version="v1">
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/suryacs22?trk=profile-badge">Surya CS</a>
            </div>
          </div>

          {/* Medium Badge (Tablet) - Light */}
          <div className="badge-wrapper badge-medium theme-light">
            <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="light" data-type="HORIZONTAL" data-vanity="suryacs22" data-version="v1">
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/suryacs22?trk=profile-badge">Surya CS</a>
            </div>
          </div>
          {/* Medium Badge (Tablet) - Dark */}
          <div className="badge-wrapper badge-medium theme-dark">
            <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="dark" data-type="HORIZONTAL" data-vanity="suryacs22" data-version="v1">
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/suryacs22?trk=profile-badge">Surya CS</a>
            </div>
          </div>

          {/* Large Badge (Desktop) - Light */}
          <div className="badge-wrapper badge-large theme-light">
            <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="large" data-theme="light" data-type="VERTICAL" data-vanity="suryacs22" data-version="v1">
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/suryacs22?trk=profile-badge">Surya CS</a>
            </div>
          </div>
          {/* Large Badge (Desktop) - Dark */}
          <div className="badge-wrapper badge-large theme-dark">
            <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="large" data-theme="dark" data-type="VERTICAL" data-vanity="suryacs22" data-version="v1">
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/suryacs22?trk=profile-badge">Surya CS</a>
            </div>
          </div>

          {/* Extra-Large Badge (Large Desktop) - Light */}
          <div className="badge-wrapper badge-xlarge theme-light">
            <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="large" data-theme="light" data-type="HORIZONTAL" data-vanity="suryacs22" data-version="v1">
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/suryacs22?trk=profile-badge">Surya CS</a>
            </div>
          </div>
          {/* Extra-Large Badge (Large Desktop) - Dark */}
          <div className="badge-wrapper badge-xlarge theme-dark">
            <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="large" data-theme="dark" data-type="HORIZONTAL" data-vanity="suryacs22" data-version="v1">
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/suryacs22?trk=profile-badge">Surya CS</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinkedinSection;
