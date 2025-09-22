import React, { useState } from 'react';

const MapSelector = ({ mapLoader, currentMapId, onMapChange, onClose }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState('all');

  const allMaps = mapLoader.getAllMaps();
  const filteredMaps = allMaps.filter(map => {
    const typeMatch = selectedType === 'all' || map.type === selectedType;
    const themeMatch = selectedTheme === 'all' || map.theme === selectedTheme;
    return typeMatch && themeMatch;
  });

  const types = ['all', ...new Set(allMaps.map(map => map.type))];
  const themes = ['all', ...new Set(allMaps.map(map => map.theme))];

  const getMapIcon = (type) => {
    switch (type) {
      case 'dungeon': return '🏰';
      case 'village': return '🏘️';
      case 'castle': return '🏰';
      case 'arena': return '⚔️';
      case 'encounter': return '🌲';
      case 'throne_room': return '👑';
      case 'crypt': return '💀';
      case 'mountain': return '⛰️';
      case 'underground': return '🕳️';
      default: return '🗺️';
    }
  };

  const getThemeColor = (theme) => {
    switch (theme) {
      case 'dark': return '#2a2a2a';
      case 'desert': return '#d2b48c';
      case 'medieval': return '#8b4513';
      case 'destroyed': return '#696969';
      case 'ruins': return '#a0522d';
      case 'magical': return '#9370db';
      case 'mystical': return '#4b0082';
      case 'royal': return '#ffd700';
      case 'ancient': return '#cd853f';
      case 'winter': return '#f0f8ff';
      case 'spring': return '#90ee90';
      case 'poison': return '#9acd32';
      case 'nature': return '#228b22';
      default: return '#4a4a4a';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 40, 0.95))',
        border: '2px solid #4a4a4a',
        borderRadius: '15px',
        padding: '20px',
        width: '800px',
        maxHeight: '600px',
        color: 'white',
        fontFamily: 'Courier New, monospace',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, color: '#00ffff' }}>🗺️ MAP SELECTOR</h2>
          <button
            onClick={onClose}
            style={{
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '5px 10px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          padding: '10px',
          background: '#2a2a2a',
          borderRadius: '8px'
        }}>
          <div>
            <label style={{ fontSize: '12px', color: '#ccc' }}>Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                background: '#4a4a4a',
                color: 'white',
                border: '1px solid #666',
                borderRadius: '4px',
                padding: '5px',
                marginLeft: '5px'
              }}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#ccc' }}>Theme:</label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              style={{
                background: '#4a4a4a',
                color: 'white',
                border: '1px solid #666',
                borderRadius: '4px',
                padding: '5px',
                marginLeft: '5px'
              }}
            >
              {themes.map(theme => (
                <option key={theme} value={theme}>
                  {theme === 'all' ? 'All Themes' : theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {filteredMaps.map(map => (
            <div
              key={map.id}
              onClick={() => {
                onMapChange(map.id);
                onClose();
              }}
              style={{
                background: currentMapId === map.id ? '#4a4a4a' : '#2a2a2a',
                border: currentMapId === map.id ? '2px solid #00ffff' : '1px solid #666',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '5px'
              }}>
                <span style={{ fontSize: '20px' }}>{getMapIcon(map.type)}</span>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  {map.name}
                </div>
              </div>
              
              <div style={{ fontSize: '10px', color: '#888', marginBottom: '5px' }}>
                Size: {map.size.width}×{map.size.height}
              </div>
              
              <div style={{
                display: 'flex',
                gap: '5px',
                marginBottom: '5px'
              }}>
                <span style={{
                  background: getThemeColor(map.theme),
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '8px'
                }}>
                  {map.theme}
                </span>
                <span style={{
                  background: '#666',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '8px'
                }}>
                  {map.type}
                </span>
              </div>
              
              {currentMapId === map.id && (
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  color: '#00ffff',
                  fontSize: '12px'
                }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
