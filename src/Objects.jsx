import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Shadow,
  Html,
  CameraControls,
  useProgress,
  useGLTF
} from "@react-three/drei";
import emailjs from '@emailjs/browser';
import StylizedText from './StylizedText';
import Object from "./Object";
import LoadingScreen from "./LoadingScreen";
import './index.css';
import './loading_load.css';

emailjs.init("UCKKih5IQspVduNdt");

const ModelPreloader = ({ onLoadComplete }) => {
  const { scene } = useGLTF('./scene.gltf');

  useEffect(() => {
    if (scene) {
      onLoadComplete(true);
    }
  }, [scene, onLoadComplete]);

  return null;
};

const LoadingIndicator = () => {
  const { progress, loaded, total } = useProgress();

  return (
    <Html center>
      <div className="loading-container">
        <div className="loading-progress">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="loading-text">
          Loading Assets: {Math.floor(progress)}%
          <br />
          {loaded}/{total} items loaded
        </div>
      </div>
    </Html>
  );
};

export default function Objects() {
  const cameraControlRef = useRef();
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [start, setStart] = useState(false);
  const [enterClicked, setEnterClicked] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);
  const [isRotated, setIsRotated] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [emailStatus, setEmailStatus] = useState({
    message: '',
    type: ''
  });
  const bgaudioRef = useRef(new Audio('./humnava.mp3'));
  const transitaudio = new Audio('./whoosh.mp3');
  const isMobile = window.innerWidth < 768;

  useGLTF.preload('./scene.gltf');

  useEffect(() => {
    const audio = bgaudioRef.current;
    audio.loop = true;
    audio.volume = 0.1;

    const loadAssets = async () => {
      try {
        await Promise.all([
          new Promise(resolve => {
            bgaudioRef.current.addEventListener('canplaythrough', resolve, { once: true });
            bgaudioRef.current.load();
          }),
          new Promise(resolve => {
            transitaudio.addEventListener('canplaythrough', resolve, { once: true });
            transitaudio.load();
          })
        ]);
        setAssetsReady(true);
      } catch (error) {
        console.error('Error loading assets:', error);
      }
    };

    loadAssets();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (modelLoaded && assetsReady) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [modelLoaded, assetsReady]);

  useEffect(() => {
    if (isRotated) {
      const timer = setTimeout(() => {
        setIsFormVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsFormVisible(false);
      setShowContactForm(false);
      setIsExpanded(false);
    }
  }, [isRotated]);

  const handleModelLoad = (loaded) => {
    setModelLoaded(loaded);
  };

  const handleAudio = () => {
    const audio = bgaudioRef.current;
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleRotate260 = async () => {
    if (cameraControlRef.current) {
      if (isPlaying) {
        bgaudioRef.current.pause();
        bgaudioRef.current.currentTime = 0;
        setIsPlaying(false);
      }

      setShowContactForm(false);
      setIsExpanded(false);

      const initialPosition = isMobile ? [-3, 30, 80] : [7, 6, 13];
      await cameraControlRef.current.setPosition(...initialPosition, true);
      transitaudio.play();

      setTimeout(() => {
        const radiansRotation = (260 * Math.PI) / 180;
        cameraControlRef.current.rotate(radiansRotation, 0, true);
        transitaudio.play();
        setIsRotated(true);
      }, 1000);
    }
  };

  const handleHomeClick = () => {
    if (cameraControlRef.current) {
      isMobile
        ? cameraControlRef.current?.setPosition(-3, 30, 80, true)
        : cameraControlRef.current?.setPosition(7, 6, 13, true);
      transitaudio.play();

      if (isPlaying) {
        bgaudioRef.current.pause();
        bgaudioRef.current.currentTime = 0;
        setIsPlaying(false);
      }

      setIsRotated(false);
    }
  };

  const handleExploreClick = async () => {
    if (cameraControlRef.current) {
      if (isRotated) {
        await cameraControlRef.current.rotate(0, 0, true);
        const initialPosition = isMobile ? [-3, 30, 80] : [7, 6, 13];
        await cameraControlRef.current.setPosition(...initialPosition, true);
        transitaudio.play();
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const explorePosition = isMobile ? [2, 0, -9] : [1, -1.89, -4];
      await cameraControlRef.current.setPosition(...explorePosition, true);
      transitaudio.play();
      handleAudio();
      setIsRotated(false);
    }
  };

  const handleFormExpand = () => {
    if (isFormVisible) {
      setIsExpanded(true);
      setShowContactForm(true);
    }
  };
  const handleCloseForm = () => {
    // Pertama, tutup form dengan animasi
    setIsExpanded(false);
    setShowContactForm(false);

    // Reset status email
    setEmailStatus({ type: '', message: '' });

    // Tunggu animasi selesai, baru sembunyikan form container
    setTimeout(() => {
      setIsFormVisible(false);
      setIsRotated(false); // Reset rotasi kamera juga
    }, 300); // Sesuaikan dengan durasi animasi (300ms)
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setEmailStatus({ message: '', type: '' });

    try {
      await emailjs.sendForm(
        "service_2gfv57d",
        "template_n44fqg7",
        formRef.current
      );

      setEmailStatus({
        message: 'Message sent successfully!',
        type: 'success'
      });

      formRef.current.reset();

      setTimeout(() => {
        setEmailStatus({ message: '', type: '' });
        handleCloseForm();
      }, 3000);

    } catch (error) {
      console.error("Error:", error);
      setEmailStatus({
        message: 'Error sending message. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen />}

      <Canvas
        shadows
        camera={{
          fov: isMobile ? 90 : 75,
          position: isMobile ? [15, 30, 80] : [7, 6, 13]
        }}
      >
        <fog attach="fog" args={["#95a6e8", 20, 30]} />
        <CameraControls
          ref={cameraControlRef}
          enableTransition
          enableZoom={false}
        />
        <Shadow
          scale={2}
          bias={-0.001}
          width={1024}
          height={1024}
        />

        <Suspense fallback={<LoadingIndicator />}>
          <ModelPreloader onLoadComplete={handleModelLoad} />
          {modelLoaded && <Object />}

          {/* Contact Form */}
          {isFormVisible && (
            <Html position={[-5, 2, 0]} style={{ bottom: '-17vh', left: '-1.5vh' }}>
              <div
                className={`contact-form-container transition-all duration-500 ${isExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
                  }`}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '20px',
                  borderRadius: '10px',
                  width: '300px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transform: `translateX(-50px) ${isExpanded ? 'scale(1)' : 'scale(0.95)'
                    }`,
                  transition: 'all 0.3s ease-in-out'
                }}
                onClick={handleFormExpand}
              >
                {!showContactForm ? (
                  <div className="form-preview">
                    <h3 className="text-lg font-bold mb-2">Contact Satoru</h3>
                    <p className="text-sm"  style={{textAlign:'center'}}>Click to open form</p>
                  </div>
                ) : (
                  <form
                    ref={formRef}
                    id="contactForm"
                    onSubmit={handleSubmitForm}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold mb-4">Contact Form</h3>

                    {emailStatus.message && (
                      <div
                        className={`p-3 rounded-md mb-4 ${emailStatus.type === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {emailStatus.message}
                      </div>
                    )}

                    <div style={{ textAlign: 'start', marginBottom: '15px' }}>
                      <label className="block text-sm font-medium mb-1" style={{ textAlign: 'start' }}>Name</label>
                      <input
                        type="text"
                        name="user_name"
                        className="w-full px-3 py-2 border rounded-md"
                        style={{
                          width: '90%',
                          margin: '0 auto',
                          display: 'block',
                             border:'none'
                        }}
                        required
                      />
                    </div>

                    <div style={{ textAlign: 'start', marginBottom: '15px' }}>
                      <label className="block text-sm font-medium mb-1" style={{ textAlign: 'start' }}>Email</label>
                      <input
                        type="email"
                        name="user_email"
                        className="w-full px-3 py-2 border rounded-md"
                        style={{
                          width: '90%',
                          margin: '0 auto',
                          display: 'block',
                             border:'none'
                        }}
                        required
                      />
                    </div>

                    <div style={{ textAlign: 'start', marginBottom: '15px' }}>
                      <label className="block text-sm font-medium mb-1" style={{ textAlign: 'start' }}>Message</label>
                      <textarea
                        name="message"
                        className="w-full px-3 py-2 border rounded-md"
                        style={{
                          width: '90%',
                          margin: '0 auto',
                          display: 'block',
                          minHeight: '100px',
                          border:'none'
                        }}
                        rows="4"
                        required
                      ></textarea>
                    </div>


                    <div style={{ display: 'flex', gap: '60px', justifyContent: 'center', marginTop: '15px' }}>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                        disabled={emailStatus.type === 'success'}
                        style={{ minWidth: '100px' }}
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseForm}
                        className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                        style={{ minWidth: '100px' }}
                      >
                        Close
                      </button>
                    </div>


                  </form>
                )}
              </div>
            </Html>
          )}

          {/* Header and Navigation */}
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
                onClick={handleHomeClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Home
              </button>
              <button
                type="button"
                title="Click Folder"
                onClick={handleExploreClick}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Explore
              </button>
              <button
                type="button"
                title="isi formulir"
                onClick={handleRotate260}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                Contact
              </button>
            </div>
          </Html>
        </Suspense>
      </Canvas>
    </>
  );
}