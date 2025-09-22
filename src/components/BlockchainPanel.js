import React from 'react';

const BlockchainPanel = ({ connected, address, coins, relics, onConnectWallet }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 40, 0.8))',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #4a4a4a',
      zIndex: 100,
      color: 'white',
      fontFamily: 'Courier New, monospace',
      minWidth: '160px',
      boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
    }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#00ffff' }}>
        ⛓️ BLOCKCHAIN
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <div style={{ fontSize: '10px', marginBottom: '2px' }}>
          🪙 <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{coins}</span>
        </div>
        <div style={{
          width: '100px',
          height: '12px',
          background: '#222',
          border: '1px solid #666',
          borderRadius: '6px',
          margin: '2px 0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffd700',
          fontWeight: 'bold',
          fontSize: '8px'
        }}>
          {coins} Coins
        </div>
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <div style={{ fontSize: '10px', marginBottom: '2px' }}>
          💎 <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{relics}</span>
        </div>
        <div style={{
          width: '100px',
          height: '12px',
          background: '#222',
          border: '1px solid #666',
          borderRadius: '6px',
          margin: '2px 0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff6b6b',
          fontWeight: 'bold',
          fontSize: '8px'
        }}>
          {relics} Relics
        </div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '10px', marginBottom: '2px' }}>
          ⛓️ Status: 
        </div>
        <div style={{
          width: '100px',
          height: '16px',
          background: connected ? '#1a4d1a' : '#4d1a1a',
          border: `1px solid ${connected ? '#00ff00' : '#ff4444'}`,
          borderRadius: '8px',
          margin: '2px 0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: connected ? '#00ff00' : '#ff4444',
          fontWeight: 'bold',
          fontSize: '8px'
        }}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
      
      {connected && address && (
        <div style={{ 
          fontSize: '12px', 
          color: '#888', 
          marginBottom: '10px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.3)',
          padding: '5px',
          borderRadius: '5px'
        }}>
          {address.substring(0, 8)}...{address.substring(address.length - 8)}
        </div>
      )}
      
      <button
        onClick={onConnectWallet}
        style={{
          background: connected 
            ? 'linear-gradient(45deg, #1a4d1a, #2d6d2d)' 
            : 'linear-gradient(45deg, #4a4a4a, #666)',
          color: 'white',
          border: 'none',
          padding: '6px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'Courier New, monospace',
          marginTop: '6px',
          width: '100%',
          fontSize: '10px',
          fontWeight: 'bold'
        }}
      >
        {connected ? '🔌 Disconnect' : '🔗 Connect'}
      </button>
    </div>
  );
};

export default BlockchainPanel;