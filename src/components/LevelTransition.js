import React, { useState, useEffect } from 'react';

const LevelTransition = ({ isActive, level, onComplete }) => {
  const [showTransition, setShowTransition] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowTransition(true);
      setTimeout(() => setShowText(true), 500);
      setTimeout(() => {
        setShowTransition(false);
        setShowText(false);
        onComplete();
      }, 3000);
    }
  }, [isActive, onComplete]);

  if (!showTransition) return null;

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700; }
            50% { text-shadow: 0 0 20px #FFD700, 0 0 30px #FFD700, 0 0 40px #FFD700; }
          }
        `}
      </style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        {showText && (
          <>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#FFD700',
                marginBottom: '20px',
                textAlign: 'center',
                animation: 'slideIn 0.8s ease-out, glow 2s ease-in-out infinite',
                fontFamily: '"Courier New", monospace',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}
            >
              Level {level}
            </div>
            
            <div
              style={{
                fontSize: '24px',
                color: '#FFFFFF',
                textAlign: 'center',
                animation: 'slideIn 0.8s ease-out 0.3s both',
                fontFamily: '"Courier New", monospace',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              {level === 1 && "Defeat all enemies to face the Dragon Lord!"}
              {level === 2 && "Defeat all enemies to face the Lich King!"}
              {level === 3 && "Defeat all enemies to face the Demon Prince!"}
            </div>
            
            <div
              style={{
                fontSize: '16px',
                color: '#CCCCCC',
                textAlign: 'center',
                marginTop: '20px',
                animation: 'slideIn 0.8s ease-out 0.6s both',
                fontFamily: '"Courier New", monospace'
              }}
            >
              Prepare for battle...
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LevelTransition;
