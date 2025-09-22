import React from 'react';

const DebugConsole = ({ logs }) => {
  const getLogColor = (type) => {
    switch (type) {
      case 'error': return '#ff4444';
      case 'warn': return '#ffaa00';
      case 'info': return '#00ff00';
      default: return '#ffffff';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 40, 0.9))',
      padding: '15px',
      borderRadius: '15px',
      border: '2px solid #4a4a4a',
      fontSize: '10px',
      maxWidth: '320px',
      maxHeight: '180px',
      overflowY: 'auto',
      zIndex: 100,
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
    }}>
      <div style={{ 
        color: '#00ffff', 
        fontWeight: 'bold', 
        marginBottom: '8px',
        fontSize: '12px'
      }}>
        🔧 DEBUG CONSOLE
      </div>
      {logs.slice(0, 15).map((log, index) => (
        <div
          key={index}
          style={{
            color: getLogColor(log.type),
            margin: '1px 0',
            fontSize: '9px',
            fontFamily: 'monospace',
            lineHeight: '1.2'
          }}
        >
          [{log.timestamp}] {log.message}
        </div>
      ))}
    </div>
  );
};

export default DebugConsole;
