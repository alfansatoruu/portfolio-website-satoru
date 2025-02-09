import StylizedText from './StylizedText';
import React, { useState, useRef, useEffect, Suspense } from "react"
import './index.css'
import { Canvas } from "@react-three/fiber"
import {
  Shadow,
  Html,
  CameraControls,
  useProgress,
  useGLTF
} from "@react-three/drei"
import Object from "./Object"
import LoadingScreen from "./LoadingScreen"

export default function Objects() {
  useGLTF.preload('./scene.gltf')
  const cameraControlRef = useRef();
  const bgAudioRef = useRef(null);
  const transitAudioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [start, setStart] = useState(false);
  const { progress } = useProgress();
  const [enterClicked, setEnterClicked] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = window.innerWidth < 768;

  // Initialize audio on component mount
  useEffect(() => {
    bgAudioRef.current = new Audio('./humnava.mp3');
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.1;
    
    transitAudioRef.current = new Audio('./whoosh.mp3');

    // Cleanup on unmount
    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = 0;
      }
      if (transitAudioRef.current) {
        transitAudioRef.current.pause();
        transitAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setFadeIn(true);
    }, 4000);
  }, []);

  const playTransitSound = () => {
    if (transitAudioRef.current) {
      transitAudioRef.current.currentTime = 0;
      transitAudioRef.current.play();
    }
  };

  const handleRotate260 = async () => {
    if (cameraControlRef.current) {
      // Stop background music if it's playing
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = 0;
      }
      setIsExploring(false);

      const initialPosition = isMobile ? [-3, 30, 80] : [7, 6, 13];
      await cameraControlRef.current.setPosition(...initialPosition, true);
      playTransitSound();
      
      setTimeout(() => {
        const radiansRotation = (260 * Math.PI) / 180;
        cameraControlRef.current.rotate(radiansRotation, 0, true);
        playTransitSound();
        setIsRotated(true);
      }, 1000);
    }
  };

  const handleCloseForm = () => {
    setShowContactForm(false);
    playTransitSound();
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleCloseForm();
  };

  const handleHome = () => {
    // Stop background music if it's playing
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current.currentTime = 0;
    }
    setIsExploring(false);
    
    isMobile
      ? cameraControlRef.current?.setPosition(-3, 30, 80, true)
      : cameraControlRef.current?.setPosition(7, 6, 13, true);
    playTransitSound();
    setIsRotated(false);
  };

  const handleExplore = () => {
    if (!isExploring) {
      isMobile
        ? cameraControlRef.current?.setPosition(2, 0, -9, true)
        : cameraControlRef.current?.setPosition(1, -1.89, -4, true);
      playTransitSound();
      
      // Start background music
      if (bgAudioRef.current) {
        bgAudioRef.current.currentTime = 0;
        bgAudioRef.current.play();
      }
      setIsExploring(true);
    }
    setIsRotated(false);
  };

  return (
    <>
      {loading && <LoadingScreen />}

      <Canvas
        shadows
        camera={{ fov: isMobile ? 90 : 75, position: isMobile ? [15, 30, 80] : [7, 6, 13] }}
      >
        <fog attach="fog" args={["#95a6e8", 20, 30]} />
        <CameraControls ref={cameraControlRef} enableTransition enableZoom={false} />
        <Shadow
          scale={2}
          bias={-0.001}
          width={1024}
          height={1024}
        />

        <Suspense fallback={null}>
          <Object />

          {/* Contact Form HTML remains the same */}
          {isRotated && (
            <Html position={[-5, 2, 0]}>
              {/* Your existing contact form code */}
            </Html>
          )}

          <Html wrapperClass="header">
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: isMobile ? '250px' : 'auto',
              }}
            >
              <StylizedText />
            </div>

            <div className="buttons"
              style={{
                position: 'absolute',
                top: 'calc(50% + 100px)',
                left: '50%',
                transform: 'translate(-50%, 0)',
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'row',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={handleHome}
              >
                Home
              </button>
              <button
                type="button"
                title="Click Folder"
                onClick={handleExplore}
              >
                Explore
              </button>
              <button
                type="button"
                title="Rotate 260°"
                onClick={handleRotate260}
              >
                Rotate 260°
              </button>
            </div>
          </Html>
        </Suspense>

      </Canvas>
    </>
  );
}