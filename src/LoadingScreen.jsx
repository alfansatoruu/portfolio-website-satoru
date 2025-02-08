import React from 'react';
import { useProgress } from "@react-three/drei";
import './LoadingScreen.css'

const LoadingScreen = () => {
  const { progress } = useProgress();
  
  return (
    <div className="loading-screen">
      <div className="loading-progress">
        <img src="./spinner.png" alt="alvan" />
        <div className="progress-container">
        <h3>Satoru</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">{progress.toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;