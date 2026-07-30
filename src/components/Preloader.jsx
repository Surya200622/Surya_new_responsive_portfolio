import React, { useState, useEffect } from 'react';
import './Preloader.css';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out animation after 2 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);

    // Remove from DOM after animation completes (2.8 seconds total)
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`preloader ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="preloader-bg-overlay left"></div>
      <div className="preloader-bg-overlay right"></div>
      
      <div className="preloader-content">
        <div className="preloader-logo-pulse">
          <div className="preloader-logo-hue">
            <img src="/logo.svg" alt="Surya CS Logo" className="preloader-logo theme-adaptive-logo" />
          </div>
        </div>
        <div className="preloader-bar-container">
          <div className="preloader-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
