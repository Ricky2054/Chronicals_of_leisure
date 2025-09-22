import React from 'react';

const LevelObjective = ({ gameState, enemies }) => {
  if (!gameState) return null;

  const getObjective = () => {
    if (gameState.phase === 'enemies') {
      // Use actual enemy count if totalEnemies is 0 or incorrect
      const actualEnemyCount = enemies ? enemies.filter(e => !e.isDead).length : gameState.totalEnemies;
      const enemyCount = actualEnemyCount > 0 ? actualEnemyCount : gameState.totalEnemies;
      return `Level ${gameState.currentLevel}: Defeat all ${enemyCount} enemies to face the boss!`;
    } else if (gameState.phase === 'boss') {
      const bossNames = {
        1: 'Dragon Lord',
        2: 'Lich King', 
        3: 'Demon Prince'
      };
      return `Level ${gameState.currentLevel} Boss: Defeat the ${bossNames[gameState.currentLevel]}!`;
    }
    return '';
  };

  const objective = getObjective();
  if (!objective) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideInFromTop {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700; }
            50% { text-shadow: 0 0 20px #FFD700, 0 0 30px #FFD700; }
          }
        `}
      </style>
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          padding: '12px 20px',
          color: '#FFD700',
          fontFamily: '"Courier New", monospace',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          zIndex: 1000,
          animation: 'slideInFromTop 0.5s ease-out, glow 2s ease-in-out infinite',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          maxWidth: '600px',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
        }}
      >
        {objective}
      </div>
    </>
  );
};

export default LevelObjective;
