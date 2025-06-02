import React from 'react';
import './loading.css';

const LoadingClientAnimation = ({ message = "loading data..." }) => {
  return (
    <div className="loading-container">
      <div className="folder-container">
        <div className="folder">
          <div className="folder-tab"></div>
          <div className="folder-body"></div>
        </div>
        <div className="paper p1"></div>
        <div className="paper p2"></div>
        <div className="paper p3"></div>
        <div className="loading-dots">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingClientAnimation;