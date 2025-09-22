import React, { useState, useEffect } from 'react';

const HomePage = ({ onStartGame }) => {
  const [animationTime, setAnimationTime] = useState(0);
  const [spritesLoaded, setSpritesLoaded] = useState(false);

  // Load sprites for background animation
  useEffect(() => {
    const loadSprites = async () => {
      try {
        // Preload sprite images with correct paths
        const spritePromises = [
          '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
          '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0056-900920138.png', // Orc-like creature
          '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0063-4100537309.png', // Goblin-like creature
          '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0064-4100537310.png'  // Skeleton-like creature
        ].map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ src, img });
            img.onerror = () => {
              console.log(`Failed to load sprite: ${src}`);
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

  // Animation loop for background effects
  useEffect(() => {
    const animate = () => {
      setAnimationTime(prev => prev + 0.016); // ~60fps
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const handleStartGame = () => {
    if (onStartGame) {
      onStartGame();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#1a1a2e',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Sprite Fighting Animation Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#0f0f0f',
        opacity: 0.4
      }}>
        {/* Knight Sprite */}
        <div style={{
          position: 'absolute',
          left: '20%',
          top: '60%',
          width: '64px',
          height: '64px',
          transform: `translateX(${Math.sin(animationTime * 2) * 30}px) scaleX(${Math.sin(animationTime * 2) > 0 ? 1 : -1})`,
          animation: 'knightFight 2s ease-in-out infinite'
        }}>
          {spritesLoaded ? (
            <img 
              src="/sprites/Knight/Knight/noBKG_KnightIdle_strip.png"
              alt="Knight"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated',
                objectFit: 'contain'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: '#4a90e2',
              imageRendering: 'pixelated'
            }} />
          )}
        </div>
        
        {/* Monster Sprite */}
        <div style={{
          position: 'absolute',
          left: '70%',
          top: '60%',
          width: '64px',
          height: '64px',
          transform: `translateX(${Math.sin(animationTime * 2 + Math.PI) * 30}px) scaleX(${Math.sin(animationTime * 2 + Math.PI) > 0 ? 1 : -1})`,
          animation: 'monsterFight 2s ease-in-out infinite'
        }}>
          {spritesLoaded ? (
            <img 
              src="/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0056-900920138.png"
              alt="Monster"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated',
                objectFit: 'contain'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: '#e74c3c',
              imageRendering: 'pixelated'
            }} />
          )}
        </div>
        
        {/* Sword Slash Effect */}
        <div style={{
          position: 'absolute',
          left: '45%',
          top: '55%',
          width: '32px',
          height: '32px',
          opacity: Math.sin(animationTime * 4) > 0 ? 1 : 0,
          animation: 'swordSlash 0.5s ease-in-out infinite',
          background: 'radial-gradient(circle, #f1c40f, transparent)',
          borderRadius: '50%'
        }} />
        
        {/* Additional fighting sprites scattered around */}
        {[
          { type: 'goblin', x: 10, y: 20, sprite: 'pixel-0063-4100537309.png' },
          { type: 'skeleton', x: 25, y: 45, sprite: 'pixel-0064-4100537310.png' },
          { type: 'goblin', x: 40, y: 15, sprite: 'pixel-0067-1577086740.png' },
          { type: 'skeleton', x: 55, y: 35, sprite: 'pixel-0069-1577086742.png' },
          { type: 'goblin', x: 75, y: 25, sprite: 'pixel-0071-2562867672.png' },
          { type: 'skeleton', x: 85, y: 50, sprite: 'pixel-0074-2562867675.png' }
        ].map((char, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${char.x}%`,
            top: `${char.y}%`,
            width: '48px',
            height: '48px',
            transform: `translateX(${Math.sin(animationTime * 1.5 + i) * 20}px) scaleX(${Math.sin(animationTime * 1.5 + i) > 0 ? 1 : -1})`,
            animation: `characterMove ${2 + (i % 2)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`
          }}>
            {spritesLoaded ? (
              <img 
                src={`/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/${char.sprite}`}
                alt={char.type}
                style={{
                  width: '100%',
                  height: '100%',
                  imageRendering: 'pixelated',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: char.type === 'goblin' ? '#27ae60' : '#95a5a6',
                imageRendering: 'pixelated'
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Main Content - Centered */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center'
      }}>
        {/* Game Title */}
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#FFD700',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
          fontFamily: '"Courier New", monospace',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          imageRendering: 'pixelated',
          WebkitFontSmoothing: 'none',
          MozOsxFontSmoothing: 'unset'
        }}>
          CHRONICLE OF THE LEDGER
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: '20px',
          color: '#E0E0E0',
          marginBottom: '50px',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          fontFamily: '"Courier New", monospace',
          letterSpacing: '1px',
          imageRendering: 'pixelated',
          WebkitFontSmoothing: 'none',
          MozOsxFontSmoothing: 'unset'
        }}>
          A Knight's Quest to Defeat the Three Bosses
        </div>

        {/* Start Adventure Button */}
        <button
          onClick={handleStartGame}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '15px 30px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            fontFamily: '"Courier New", monospace',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            imageRendering: 'pixelated',
            WebkitFontSmoothing: 'none',
            MozOsxFontSmoothing: 'unset'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#45a049';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#4CAF50';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ⚔️ START ADVENTURE
        </button>
      </div>

      {/* Enhanced CSS Animations for Sprites */}
      <style>
        {`
          /* Global pixelated text styling */
          * {
            image-rendering: pixelated;
            -webkit-font-smoothing: none;
            -moz-osx-font-smoothing: unset;
          }
          
          @keyframes knightFight {
            0%, 100% { 
              transform: translateX(0px) scaleX(1); 
              filter: brightness(1);
            }
            25% { 
              transform: translateX(15px) scaleX(1); 
              filter: brightness(1.2);
            }
            50% { 
              transform: translateX(30px) scaleX(-1); 
              filter: brightness(1.1);
            }
            75% { 
              transform: translateX(15px) scaleX(-1); 
              filter: brightness(1.2);
            }
          }
          
          @keyframes monsterFight {
            0%, 100% { 
              transform: translateX(0px) scaleX(1); 
              filter: brightness(1);
            }
            25% { 
              transform: translateX(-15px) scaleX(1); 
              filter: brightness(1.2);
            }
            50% { 
              transform: translateX(-30px) scaleX(-1); 
              filter: brightness(1.1);
            }
            75% { 
              transform: translateX(-15px) scaleX(-1); 
              filter: brightness(1.2);
            }
          }
          
          @keyframes swordSlash {
            0% { 
              opacity: 0; 
              transform: scale(0.3) rotate(0deg); 
            }
            25% { 
              opacity: 0.8; 
              transform: scale(0.8) rotate(45deg); 
            }
            50% { 
              opacity: 1; 
              transform: scale(1.2) rotate(90deg); 
            }
            75% { 
              opacity: 0.8; 
              transform: scale(0.8) rotate(135deg); 
            }
            100% { 
              opacity: 0; 
              transform: scale(0.3) rotate(180deg); 
            }
          }
          
          @keyframes characterMove {
            0%, 100% { 
              transform: translateX(0px) scaleX(1); 
              filter: brightness(1);
            }
            50% { 
              transform: translateX(20px) scaleX(-1); 
              filter: brightness(1.1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
