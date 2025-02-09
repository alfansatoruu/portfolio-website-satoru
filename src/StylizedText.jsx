// StylizedText.jsx
import React from 'react';
import './teks_header.css';

const StylizedText = () => {
  return (
    <div className="text-container">
      <div className="text-wrapper">
        <h5 className="main-title">
          <span className="wave">Hii</span>
          <span className="emoji" role="img" aria-label="wave emoji">😅</span>
        </h5>
      </div>

      <div className="description">
        <p className="role-text">
          <span className="bullet">•</span>
          <span className="role">Programmer</span>
        </p>
      </div>

      <div className="main-teks">
        <span style={{ ['--delay']: '0' }}>A</span>
        <span style={{ ['--delay']: '1' }}>L</span>
        <span style={{ ['--delay']: '2' }}>V</span>
        <span style={{ ['--delay']: '3' }}>A</span>
        <span style={{ ['--delay']: '4' }}>N</span>
      </div>
    </div>
  );
};

export default StylizedText;
