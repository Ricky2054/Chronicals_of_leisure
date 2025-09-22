import React from 'react';

const ControlsPanel = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 40, 0.8))',
      padding: '8px',
      borderRadius: '8px',
      border: '1px solid #4a4a4a',
      fontSize: '10px',
      color: 'white',
      fontFamily: 'Courier New, monospace',
      zIndex: 100,
      minWidth: '140px',
      boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
    }}>
      <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', color: '#00ffff' }}>
        🎮 CONTROLS
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', fontSize: '8px' }}>
        <div>🔄 WASD</div>
        <div>Move</div>
        <div>⬆️ Space</div>
        <div>Jump</div>
        <div>⚔️ J</div>
        <div>Attack</div>
        <div>🛡️ L</div>
        <div>Shield</div>
        <div>💨 Shift</div>
        <div>Dash</div>
      </div>
    </div>
  );
};

export default ControlsPanel;