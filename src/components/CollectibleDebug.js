import React from 'react';

const CollectibleDebug = ({ collectibleManager, mapData }) => {
  const regenerateCollectibles = () => {
    if (!collectibleManager || !mapData) return;
    
    let mapWidth, mapHeight;
    
    if (mapData.image) {
      mapWidth = mapData.image.width;
      mapHeight = mapData.image.height;
    } else if (mapData.tiles) {
      mapWidth = mapData.tiles[0].length * 32;
      mapHeight = mapData.tiles.length * 32;
    }
    
    if (mapWidth && mapHeight) {
      collectibleManager.generateCollectibles(mapData, mapWidth, mapHeight);
      console.log('🎁 Regenerated collectibles!');
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        zIndex: 1000
      }}
    >
      <button
        onClick={regenerateCollectibles}
        style={{
          background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'linear-gradient(45deg, #45a049, #5cbf60)';
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'linear-gradient(45deg, #4CAF50, #66BB6A)';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        }}
      >
        🎁 Regenerate Items
      </button>
    </div>
  );
};

export default CollectibleDebug;
