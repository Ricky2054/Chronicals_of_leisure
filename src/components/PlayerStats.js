import React from 'react';

const PlayerStats = ({ player, gameState }) => {
  if (!player) return null;

  const formatTime = (seconds) => {
    return Math.ceil(seconds).toString();
  };

  const renderPowerup = (name, duration, icon, color) => {
    if (duration <= 0) return null;
    
    return (
      <div
        key={name}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: `linear-gradient(90deg, ${color}40, ${color}20)`,
          border: `1px solid ${color}`,
          borderRadius: '4px',
          padding: '4px 8px',
          margin: '2px',
          fontSize: '12px',
          color: 'white',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        <span style={{ marginRight: '4px' }}>{icon}</span>
        <span>{formatTime(duration)}s</span>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid #444',
          borderRadius: '8px',
          padding: '12px',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          zIndex: 1000,
          minWidth: '200px'
        }}
      >
      <div style={{ marginBottom: '8px', fontWeight: 'bold', borderBottom: '1px solid #444', paddingBottom: '4px' }}>
        Player Stats
      </div>
      
      {/* Level and Phase Info */}
      {gameState && (
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span>Level:</span>
          <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{gameState.currentLevel || 1}</span>
        </div>
      )}
      
      {gameState && (
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span>Phase:</span>
          <span style={{ 
            color: gameState.phase === 'boss' ? '#FF6B6B' : '#4CAF50', 
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {gameState.phase === 'boss' ? '🐉 Boss Fight!' : '⚔ Enemies'}
          </span>
        </div>
      )}
      
      {/* Health Bar */}
      <div style={{ marginBottom: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
          <span>Health</span>
          <span>{player.health}/{player.maxHealth}</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '12px',
            background: '#333',
            borderRadius: '6px',
            overflow: 'hidden',
            border: player.health <= 0 ? '2px solid #ff4444' : 'none'
          }}
        >
          <div
            style={{
              width: `${Math.max(0, (player.health / player.maxHealth) * 100)}%`,
              height: '100%',
              background: player.health > 50 ? '#4CAF50' : player.health > 25 ? '#FF9800' : '#F44336',
              transition: 'width 0.3s ease',
              animation: player.health <= 25 && player.health > 0 ? 'pulse 1s infinite' : 'none'
            }}
          />
        </div>
      </div>

      {/* Points */}
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Points:</span>
        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{player.points}</span>
      </div>

      {/* Attack Damage */}
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Attack:</span>
        <span style={{ 
          color: player.damageBoost > 0 ? '#FF6B6B' : 'white',
          fontWeight: player.damageBoost > 0 ? 'bold' : 'normal'
        }}>
          {player.attackDamage}
          {player.damageBoost > 0 && ' ⚔'}
        </span>
      </div>

      {/* Active Powerups */}
      {(player.speedBoost > 0 || player.damageBoost > 0 || player.defenseBoost > 0 || player.jumpBoost > 0) && (
        <div style={{ marginTop: '8px', borderTop: '1px solid #444', paddingTop: '6px' }}>
          <div style={{ fontSize: '12px', marginBottom: '4px', color: '#ccc' }}>Active Powerups:</div>
          <div>
            {renderPowerup('Speed', player.speedBoost, '⚡', '#00FF00')}
            {renderPowerup('Damage', player.damageBoost, '⚔', '#FF4500')}
            {renderPowerup('Defense', player.defenseBoost, '🛡', '#4169E1')}
            {renderPowerup('Jump', player.jumpBoost, '⬆', '#FF69B4')}
          </div>
        </div>
      )}

      {/* Movement Status */}
      {(player.speedBoost > 0 || player.jumpBoost > 0) && (
        <div style={{ marginTop: '6px', fontSize: '11px', color: '#aaa' }}>
          {player.speedBoost > 0 && <div>• 50% faster movement</div>}
          {player.jumpBoost > 0 && <div>• 30% higher jumps</div>}
          {player.defenseBoost > 0 && <div>• 50% damage reduction</div>}
        </div>
      )}
    </div>
    </>
  );
};

export default PlayerStats;
