import React from 'react';

const GameOverScreen = ({ gameState, player, onRestart }) => {
  if (!gameState.gameOver) return null;

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    }
  };

  const handleMainMenu = () => {
    // This would navigate back to the main menu
    window.location.reload(); // Simple reload for now
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Animated background effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 70%)',
        animation: 'pulse 2s infinite'
      }} />
      
      {/* Game Over Title */}
      <div style={{
        fontSize: '72px',
        fontWeight: 'bold',
        color: '#FF0000',
        textShadow: '0 0 20px #FF0000, 0 0 40px #FF0000',
        marginBottom: '20px',
        animation: 'glow 1.5s ease-in-out infinite alternate',
        textAlign: 'center'
      }}>
        GAME OVER
      </div>

      {/* Death Message */}
      <div style={{
        fontSize: '24px',
        color: '#FFD700',
        marginBottom: '40px',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
      }}>
        The brave knight has fallen in battle...
      </div>

      {/* Final Stats */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.7)',
        border: '2px solid #444',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '40px',
        minWidth: '400px',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          color: '#FFD700', 
          marginBottom: '20px',
          fontSize: '28px',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        }}>
          Final Statistics
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '15px',
          fontSize: '18px'
        }}>
          <div style={{ 
            background: 'rgba(255, 0, 0, 0.2)', 
            padding: '10px', 
            borderRadius: '5px',
            border: '1px solid #FF0000'
          }}>
            <div style={{ color: '#FF6B6B', fontWeight: 'bold' }}>Health</div>
            <div>{player?.health || 0} / {player?.maxHealth || 100}</div>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 215, 0, 0.2)', 
            padding: '10px', 
            borderRadius: '5px',
            border: '1px solid #FFD700'
          }}>
            <div style={{ color: '#FFD700', fontWeight: 'bold' }}>Points</div>
            <div>{player?.points || 0}</div>
          </div>
          
          <div style={{ 
            background: 'rgba(0, 255, 0, 0.2)', 
            padding: '10px', 
            borderRadius: '5px',
            border: '1px solid #00FF00'
          }}>
            <div style={{ color: '#90EE90', fontWeight: 'bold' }}>Attack Damage</div>
            <div>{player?.attackDamage || 15}</div>
          </div>
          
          <div style={{ 
            background: 'rgba(0, 191, 255, 0.2)', 
            padding: '10px', 
            borderRadius: '5px',
            border: '1px solid #00BFFF'
          }}>
            <div style={{ color: '#87CEEB', fontWeight: 'bold' }}>Speed</div>
            <div>{player?.speed || 400}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={handleRestart}
          style={{
            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '15px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
          }}
        >
          🔄 Try Again
        </button>
        
        <button
          onClick={handleMainMenu}
          style={{
            background: 'linear-gradient(45deg, #2196F3, #1976D2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '15px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
          }}
        >
          🏠 Main Menu
        </button>
      </div>

      {/* Death Quote */}
      <div style={{
        marginTop: '40px',
        fontSize: '16px',
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
        maxWidth: '600px',
        lineHeight: '1.5'
      }}>
        "Every hero's journey must come to an end, but legends never die. 
        Your courage will inspire others to take up the sword and continue the fight."
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
          }
          
          @keyframes glow {
            from { text-shadow: 0 0 20px #FF0000, 0 0 40px #FF0000; }
            to { text-shadow: 0 0 30px #FF0000, 0 0 60px #FF0000, 0 0 80px #FF0000; }
          }
        `}
      </style>
    </div>
  );
};

export default GameOverScreen;