// NotFoundAnimation.jsx
import React from 'react';
import './notFound.css';

const NotFoundAnimation = ({ message = "not found" }) => {
    return (
        <div className="not-found-container">
            <div className="not-found-animation">
                <div className="search-icon">
                    <div className="magnifying-glass">
                        <div className="glass"></div>
                        <div className="handle"></div>
                    </div>
                </div>
                <div className="folder-empty">
                    <div className="folder-tab"></div>
                    <div className="folder-body"></div>
                    {/* <div className="question-mark">?</div> */}
                </div>
                <div className="pixel-dust">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={`dust d${i + 1}`}></div>
                    ))}
                </div>
            </div>
            <p className="not-found-text">{message}</p>
        </div>
    );
};

export default NotFoundAnimation;