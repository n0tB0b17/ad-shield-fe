import React from 'react';
import './success.css';

const SuccessRedirectAnimation = ({message = "success"}) => {
    return (
        <div className="success-container">
            <div className="success-animation">
                <div className="success-circle">
                    <div className="checkmark"></div>
                </div>
                <div className="success-sparkles">
                    <div className="sparkle sp1"></div>
                    <div className="sparkle sp2"></div>
                    <div className="sparkle sp3"></div>
                    <div className="sparkle sp4"></div>
                    <div className="sparkle sp5"></div>
                    <div className="sparkle sp6"></div>
                </div>
                <div className="success-stars">
                    <div className="star st1">★</div>
                    <div className="star st2">★</div>
                    <div className="star st3">★</div>
                </div>
            </div>
            <p className="success-text">{message}</p>
        </div>
    );
};

export default SuccessRedirectAnimation;