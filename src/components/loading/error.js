import React from 'react';
import './error.css';


const ErrorAnimation = ({ message = 'Could not load client details.' }) => {
    return (
      <div className="error-container">
        <div className="error-animation">
          <div className="computer">
            <div className="computer-screen">
              <div className="error-icon">
                <div className="error-x left"></div>
                <div className="error-x right"></div>
              </div>
            </div>
            <div className="computer-base"></div>
          </div>
          <div className="error-cloud">
            <div className="cloud-body"></div>
            <div className="lightning bolt1"></div>
            <div className="lightning bolt2"></div>
          </div>
        </div>
        <p className="error-text">{message}</p>
      </div>
    );
  };
  
  export default ErrorAnimation;
  