import React from 'react';

const GameUI = ({ gameState }) => {
  const healthPercentage = (gameState.health / 100) * 100;
  const manaPercentage = (gameState.mana / 50) * 100;

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 100,
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 40, 0.8))',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #4a4a4a',
      color: 'white',
      fontFamily: 'Courier New, monospace',
      minWidth: '180px',
      boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
    }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#00ffff' }}>
        ⚔️ STATUS
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <div style={{ fontSize: '10px', marginBottom: '2px' }}>
          ❤️ <span style={{ color: '#ff4444', fontWeight: 'bold' }}>{gameState.health}</span>/100
        </div>
        <div style={{
          width: '120px',
          height: '12px',
          background: '#222',
          border: '1px solid #666',
          borderRadius: '6px',
          margin: '2px 0',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #ff4444, #ff6666)',
            width: `${healthPercentage}%`,
            transition: 'width 0.3s ease',
            borderRadius: '5px'
          }}></div>
        </div>
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <div style={{ fontSize: '10px', marginBottom: '2px' }}>
          🔮 <span style={{ color: '#4444ff', fontWeight: 'bold' }}>{Math.floor(gameState.mana)}</span>/50
        </div>
        <div style={{
          width: '120px',
          height: '12px',
          background: '#222',
          border: '1px solid #666',
          borderRadius: '6px',
          margin: '2px 0',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #4444ff, #6666ff)',
            width: `${manaPercentage}%`,
            transition: 'width 0.3s ease',
            borderRadius: '5px'
          }}></div>
        </div>
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        margin: '6px 0', 
        color: '#ffd700',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        🏆 {gameState.score}
      </div>
      
      <div style={{ 
        fontSize: '9px', 
        margin: '2px 0', 
        color: '#00ff88',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        💡 Convert points to ALGO!
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px' }}>
        <div>
          Lv: <span style={{ color: '#00ff00', fontWeight: 'bold' }}>{gameState.level}</span>
        </div>
        <div>
          <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{gameState.house}</span>
        </div>
      </div>
    </div>
  );
};

export default GameUI;
