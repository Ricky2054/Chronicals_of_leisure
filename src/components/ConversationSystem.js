import React, { useState, useEffect } from 'react';

const ConversationSystem = ({ isActive, conversation, onClose, playerSprite }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [spritesLoaded, setSpritesLoaded] = useState(false);

  // Load sprites for character portraits
  useEffect(() => {
    const loadSprites = async () => {
      try {
        const spritePromises = [
          '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
          '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0056-900920138.png',
          '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0063-4100537309.png',
          '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0064-4100537310.png'
        ].map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ src, img });
            img.onerror = () => {
              console.log(`Failed to load conversation sprite: ${src}`);
              resolve({ src, img: null });
            };
            img.src = src;
          });
        });

        await Promise.all(spritePromises);
        setSpritesLoaded(true);
      } catch (error) {
        console.log('Some sprites failed to load, using fallbacks');
        setSpritesLoaded(true);
      }
    };

    loadSprites();
  }, []);

  const handleNext = () => {
    if (isTyping) {
      // Skip typing animation
      const currentMessage = conversation.messages[currentMessageIndex];
      setDisplayedText(currentMessage.text);
      setIsTyping(false);
      return;
    }

    if (currentMessageIndex < conversation.messages.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
    } else {
      onClose();
    }
  };

  const handleSkipAll = () => {
    // Skip to the end of conversation
    onClose();
  };

  const handlePrevious = () => {
    if (currentMessageIndex > 0) {
      setCurrentMessageIndex(currentMessageIndex - 1);
    }
  };

  useEffect(() => {
    if (isActive && conversation && conversation.messages) {
      setCurrentMessageIndex(0);
      setDisplayedText('');
      setIsTyping(true);
    }
  }, [isActive, conversation]);

  // Add keyboard shortcuts
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, handleNext, onClose]);

  useEffect(() => {
    if (!isActive || !conversation || !conversation.messages) return;

    const currentMessage = conversation.messages[currentMessageIndex];
    if (!currentMessage) return;

    let currentCharIndex = 0;
    const typingSpeed = 5; // milliseconds per character (ultra fast typing)
    let timeoutId;

    const typeText = () => {
      if (currentCharIndex < currentMessage.text.length) {
        setDisplayedText(currentMessage.text.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        timeoutId = setTimeout(typeText, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    setIsTyping(true);
    setDisplayedText('');
    typeText();

    // Cleanup function to clear timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentMessageIndex, conversation, isActive]);

  if (!isActive || !conversation) return null;

  const currentMessage = conversation.messages[currentMessageIndex];
  if (!currentMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10001,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #2c3e50, #34495e)',
        border: '3px solid #FFD700',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '800px',
        width: '90%',
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
        position: 'relative'
      }}>
        {/* Character Portrait */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '180px',
            height: '180px',
            background: currentMessage.character?.color || '#4a90e2',
            border: '3px solid #FFD700',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            flexShrink: 0,
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            overflow: 'hidden',
            animation: 'float 3s ease-in-out infinite'
          }}>
            {spritesLoaded && currentMessage.character?.spritePath ? (
              <img 
                src={currentMessage.character.spritePath}
                alt={currentMessage.character?.name || 'Character'}
                style={{
                  width: '100%',
                  height: '100%',
                  imageRendering: 'pixelated',
                  objectFit: 'contain',
                  transform: 'scale(2.0)', // Make sprite even larger
                  animation: 'pulse 2s ease-in-out infinite'
                }}
                onError={(e) => {
                  console.log('Sprite failed to load, using fallback');
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div style={{
                fontSize: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                {currentMessage.character?.sprite || '👤'}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            {/* Character Name */}
            <h3 style={{
              color: '#FFD700',
              fontSize: '24px',
              margin: '0 0 10px 0',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
              fontFamily: '"Courier New", monospace',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              imageRendering: 'pixelated',
              WebkitFontSmoothing: 'none',
              MozOsxFontSmoothing: 'unset'
            }}>
              {currentMessage.character?.name || 'Unknown'}
            </h3>
            
            {/* Character Title */}
            {currentMessage.character?.title && (
              <div style={{
                color: '#E0E0E0',
                fontSize: '14px',
                fontStyle: 'italic',
                marginBottom: '15px',
                fontFamily: '"Courier New", monospace',
                letterSpacing: '0.5px',
                imageRendering: 'pixelated',
                WebkitFontSmoothing: 'none',
                MozOsxFontSmoothing: 'unset'
              }}>
                {currentMessage.character.title}
              </div>
            )}
          </div>
        </div>

        {/* Message Text */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '2px solid #444',
          borderRadius: '10px',
          padding: '20px',
          minHeight: '120px',
          position: 'relative'
        }}>
          <p style={{
            color: '#FFFFFF',
            fontSize: '18px',
            lineHeight: '1.6',
            margin: 0,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            fontFamily: '"Courier New", monospace',
            letterSpacing: '0.5px',
            imageRendering: 'pixelated',
            WebkitFontSmoothing: 'none',
            MozOsxFontSmoothing: 'unset'
          }}>
            {displayedText}
            {isTyping && (
              <span style={{
                animation: 'blink 1s infinite',
                color: '#FFD700',
                fontWeight: 'bold'
              }}>|</span>
            )}
            {!isTyping && displayedText.length > 0 && (
              <span style={{
                color: '#FFD700',
                fontSize: '12px',
                marginLeft: '10px'
              }}>
                (Press Enter/Space to continue)
              </span>
            )}
          </p>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentMessageIndex === 0}
            style={{
              background: currentMessageIndex === 0 ? '#666' : 'linear-gradient(45deg, #2196F3, #1976D2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: currentMessageIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentMessageIndex === 0 ? 0.5 : 1
            }}
          >
            ← Previous
          </button>
          
          <div style={{
            color: '#FFD700',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            {currentMessageIndex + 1} / {conversation.messages.length}
          </div>
          
          <button
            onClick={handleNext}
            style={{
              background: 'linear-gradient(45deg, #4CAF50, #45a049)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {currentMessageIndex === conversation.messages.length - 1 ? 'Close' : 'Next →'}
          </button>
        </div>

        {/* Skip Buttons */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '5px'
        }}>
          <button
            onClick={handleSkipAll}
            style={{
              background: 'rgba(255, 165, 0, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: '"Courier New", monospace',
              textTransform: 'uppercase'
            }}
            title="Skip All"
          >
            Skip All
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
        `}
      </style>
    </div>
  );
};

export default ConversationSystem;
