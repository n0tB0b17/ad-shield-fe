import React, { useState, useEffect } from 'react';
import './toggle.css';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  return (
    <div className={`theme-toggle-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="theme-content">
        <div className="theme-visualization">
          <div className="theme-circle"></div>
        </div>
        <div className="button-container horizontal">
          <button 
            className={`theme-button ${isDarkMode ? 'active' : ''}`} 
            onClick={() => setIsDarkMode(true)}
          >
            Enable Dark Mode
          </button>
          <button 
            className={`theme-button ${!isDarkMode ? 'active' : ''}`} 
            onClick={() => setIsDarkMode(false)}
          >
            Enable Light Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;