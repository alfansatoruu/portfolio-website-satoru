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
import './index.css';


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
      <div className="loading-container"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          padding: '20px',
          borderRadius: '10px',

          zIndex: 1000,
          fontFamily: "'Arial', sans-serif",
        }}
      >
        {/* Coffee Cup */}
        <div style={{
          position: 'relative',
          width: '80px',
          height: '100px',
          margin: '0 auto 20px',
        }}>
          {/* Coffee Liquid */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            height: `${progress}%`,
            width: '100%',
            background: 'linear-gradient(to right,rgb(255, 255, 255), #6f4e37)',
            borderRadius: '0 0 10px 10px',
            transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'inset 0 -3px 5px rgba(0,0,0,0.2)',
          }} />

          {/* Cup Shape */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '4px solid #6f4e37',
            borderRadius: '0 0 15px 15px',
            boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }} />

          {/* Steam Animation */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                width: '8px',
                height: '20px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '4px',
                animation: `steam 2s infinite ${i * 0.3}s`,
                opacity: 0,
              }} />
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <div style={{
          fontSize: '14px',
          color: '#4b3832',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          <div style={{ marginBottom: '4px' }}>
            Memuat..
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            ☕{Math.floor(progress)}% ({loaded}/{total})
          </div>
        </div>

        {/* Steam Animation Keyframes */}
        <style>
          {`
            @keyframes steam {
              0% { transform: translateY(0) scale(1); opacity: 0; }
              50% { transform: translateY(-15px) scale(1.2); opacity: 0.6; }
              100% { transform: translateY(-30px) scale(0.8); opacity: 0; }
            }
          `}
        </style>
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
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });
  const bgaudioRef = useRef(new Audio('./humnava.mp3'));
  const transitaudio = new Audio('./whoosh.mp3');
  const isMobile = window.innerWidth < 768;

  useGLTF.preload('./scene.gltf');

  useEffect(() => {
    const audio = bgaudioRef.current;
    audio.loop = true;
    audio.volume = 1.0;

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

      await cameraControlRef.current.setPosition(...initialPosition, true, 800);
      transitaudio.play();

      setTimeout(() => {
        const radiansRotation = (260 * Math.PI) / 180;

        cameraControlRef.current.rotate(radiansRotation, 0, true, 1000);
        transitaudio.play();
        setIsRotated(true);
      }, 1200);
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
    setIsExpanded(false);
    setShowContactForm(false);
    setEmailStatus({ type: '', message: '' });

    setTimeout(() => {
      setIsFormVisible(false);
      setIsRotated(false);
      setFormData({
        user_name: '',
        user_email: '',
        message: ''
      });
    }, 300);
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setEmailStatus({ message: '', type: '' });


    if (!isValidEmail(formData.user_email)) {
      setEmailStatus({ message: 'Invalid email format. Please enter a valid email.', type: 'error' });
      return;
    }

    try {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      const templateParams = {
        name: formData.user_name,
        email: formData.user_email,
        message: formData.message,
        date: formattedDate,
        reply_to: formData.user_email
      };

      await emailjs.send(
        "service_2gfv57d",
        "template_n44fqg7",
        templateParams,
        "UCKKih5IQspVduNdt"
      );

      setEmailStatus({
        message: <span style={{ color: 'green' }}>Message sent successfully!</span>,
        type: 'success'
      });


      setFormData({
        user_name: '',
        user_email: '',
        message: ''
      });

      setTimeout(() => {
        setEmailStatus({ message: '', type: '' });
        handleCloseForm();
      }, 3000);

    } catch (error) {
      console.error("Error:", error);
      setEmailStatus({
        message: <span style={{ color: 'red' }}>Error sending message. Please try again.</span>,
        type: 'error'
      });
    }
  };


  return (
    <>
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
          {isFormVisible && (
            <Html position={[-5, 2, 0]} style={{
              position: 'fixed',
              bottom: isMobile ? '-7vh' : '-7vh',
              left: isMobile ? '-12px' : '-12px',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '200px',
            }}>
              <div
                className={`contact-form-container transition-all duration-500 ${isExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-90'}`}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '10px',
                  borderRadius: '10px',
                  width: '320px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transform: `${isExpanded ? 'scale(1)' : 'scale(0.95)'}`,
                  transition: 'all 0.3s ease-in-out',
                  backdropFilter: 'blur(8px)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '200%',
                    height: '100%',
                    background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: 'shimmer 2s infinite linear',
                  }
                }}
                onClick={handleFormExpand}
              >
                {!showContactForm ? (
                  <div className="form-preview">
                    <div
                      className="flex justify-between items-center gap-4 p-4 border-b"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',

                      }}
                    >
                      <h5 className="text-lg font-bold mb-2">Contact Satoru</h5>
                      <img
                        src="gojo.png"
                        alt="Satoru Gojo"
                        className="rounded-full border-2 border-blue-500"
                        style={{
                          width: '30px',
                          height: '30px',
                          minWidth: '30px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>


                    <p style={{ fontSize: '14px', textAlign: 'center' }}>Click to open form</p>

                  </div>
                ) : (
                  <form
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

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md"
                        style={{
                          width: '100%',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                        }}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md"
                        style={{
                          width: '100%',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                        }}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md"
                        style={{
                          width: '100%',
                          minHeight: isMobile ? '80px' : '100px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                        }}
                        rows={isMobile ? "3" : "4"}
                        required
                      ></textarea>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        gap: '16px',
                        marginTop: '24px'
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleCloseForm}
                        className="px-6 py-2 bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
                        style={{
                          minWidth: isMobile ? '80px' : '100px',
                          border: 'none',
                          boxShadow: 'none',
                          color: 'red'
                        }}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                        disabled={emailStatus.type === 'success'}
                        style={{
                          minWidth: isMobile ? '80px' : '100px',
                          border: 'none',
                          boxShadow: 'none',
                          color: 'green'
                        }}
                      >
                        Send
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