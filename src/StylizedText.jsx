import React from 'react';

const StylizedText = () => {
    return (
        <div className="text-container">
            <div className="text-wrapper">
                <h5 className="main-title">ALVAN</h5>
                <div className="description">
                    <p className="role-text">
                        <span className="bullet">•</span>Programmer
                    </p>
                </div>
            </div>

            <style jsx>{`
        .text-container {
          display: flex;
          justify-content: center;
          align-items: center;
         
          text-align: center;
          min-height: 300px;
          padding: 20px;
        }

        .text-wrapper {
          padding: 20px;
        }

        .main-title {
       
          font-size: 1.5rem;
          font-weight: 300;
          color: #ffffff;
          text-shadow: 
            3px 3px 0px #4E63D9,
            6px 6px 0px rgba(255, 255, 255, 0.2);
          letter-spacing: 8px;
           margin-left:100vh;
          margin-bottom: 40px;  /* Increased bottom margin */
          margin-top: 25vh;     /* Added top margin */
          transform-style: preserve-3d;
          animation: titleFloat 3s ease-in-out infinite;
        }

        .description {
         margin-left:50vh;
          position: relative;
          padding: 15px;
          margin-top: 5vh;    /* Added top margin */
          margin-bottom: 30px; /* Added bottom margin */
        }

       .role-text {
       margin-left: 13vh
       ;    /* Added top margin */
       margin-top: 30px;    /* Added top margin */
          margin-right: 20%;
          font-size: 1.2rem;
          color: #ffffff;
          line-height: 2;
        
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .bullet {

          color: #4E63D9;
          font-size: 1.4rem;
          margin-right: 10px;
          
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        @keyframes titleFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg);
          }
          50% {
            transform: translateY(-10px) rotateX(5deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 3rem;
            letter-spacing: 4px;
            margin-bottom: 30px; /* Adjusted for mobile */
            margin-top: 20px;    /* Adjusted for mobile */
          }

          .description {
            margin-top: 20px;    /* Adjusted for mobile */
            margin-bottom: 20px; /* Adjusted for mobile */
          }

          .role-text {
            font-size: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default StylizedText;