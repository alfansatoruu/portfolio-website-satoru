
import { useProgress } from "@react-three/drei"
import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';
import { motion, animate, AnimatePresence } from 'framer-motion';


const LoadingScreen = () => {
  const { progress } = useProgress();
  const [fade, setFade] = useState(false);
  useEffect(() => {

    const fadeOutTimeout = setTimeout(() => {
      setFade(true);
    }, 2000);

    return () => clearTimeout(fadeOutTimeout);
  }, []);

  return (
    <div className="loading-screen" style={{ opacity: fade ? 0 : 1, transition: "opacity 2s ease-in-out" }}
    >
      <div className="loader-card">
        <img src="./loadingpic.jpeg" alt="alvan" />
        <h3>Satoru</h3>
        <div className="progressbar-container">
          <div className="progressbar">
            <motion.div
              className="bar"
              animate={{
                width: `${progress}%`
              }}
              transition={{
                duration: 1.8,
                delay: 0.1
              }}
            />
          </div>
          <p>Please wait while we're setting up....</p>
        </div>
      </div>
    </div>
  );
};
export default LoadingScreen;