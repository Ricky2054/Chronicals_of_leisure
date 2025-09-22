import React from 'react';

const CollectibleCounter = ({ collectibleManager }) => {
  if (!collectibleManager) return null;

  const coins = collectibleManager.getCollectibleCount('coin');
  const healthPotions = collectibleManager.getCollectibleCount('health_potion');
  const speedBoosts = collectibleManager.getCollectibleCount('speed_boost');
  const damageBoosts = collectibleManager.getCollectibleCount('damage_boost');
  const defenseBoosts = collectibleManager.getCollectibleCount('defense_boost');
  const jumpBoosts = collectibleManager.getCollectibleCount('jump_boost');
  const rareGems = collectibleManager.getCollectibleCount('rare_gem');

  const totalCollectibles = coins + healthPotions + speedBoosts + damageBoosts + defenseBoosts + jumpBoosts + rareGems;

  if (totalCollectibles === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '150px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '8px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        zIndex: 1000,
        minWidth: '150px'
      }}
    >
      <div style={{ marginBottom: '6px', fontWeight: 'bold', borderBottom: '1px solid #444', paddingBottom: '2px' }}>
        Collectibles on Map
      </div>
      
      {coins > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>💰 Coins:</span>
          <span style={{ color: '#FFD700' }}>{coins}</span>
        </div>
      )}
      
      {healthPotions > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>🧪 Health:</span>
          <span style={{ color: '#FF0000' }}>{healthPotions}</span>
        </div>
      )}
      
      {speedBoosts > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>⚡ Speed:</span>
          <span style={{ color: '#00FF00' }}>{speedBoosts}</span>
        </div>
      )}
      
      {damageBoosts > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>⚔ Damage:</span>
          <span style={{ color: '#FF4500' }}>{damageBoosts}</span>
        </div>
      )}
      
      {defenseBoosts > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>🛡 Defense:</span>
          <span style={{ color: '#4169E1' }}>{defenseBoosts}</span>
        </div>
      )}
      
      {jumpBoosts > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>⬆ Jump:</span>
          <span style={{ color: '#FF69B4' }}>{jumpBoosts}</span>
        </div>
      )}
      
      {rareGems > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>💎 Gems:</span>
          <span style={{ color: '#8A2BE2' }}>{rareGems}</span>
        </div>
      )}
      
      <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #444', fontSize: '11px', color: '#aaa' }}>
        Total: {totalCollectibles} items
      </div>
    </div>
  );
};

export default CollectibleCounter;
