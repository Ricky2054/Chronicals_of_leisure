import React, { useState, useEffect } from 'react';

const SoundSettings = ({ soundManager }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.7);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (soundManager) {
      setMasterVolume(soundManager.masterVolume);
      setSfxVolume(soundManager.sfxVolume);
      setMusicVolume(soundManager.musicVolume);
      setEnabled(soundManager.enabled);
    }
  }, [soundManager]);

  const handleMasterVolumeChange = (value) => {
    setMasterVolume(value);
    if (soundManager) {
      soundManager.setMasterVolume(value);
    }
  };

  const handleSfxVolumeChange = (value) => {
    setSfxVolume(value);
    if (soundManager) {
      soundManager.setSFXVolume(value);
    }
  };

  const handleMusicVolumeChange = (value) => {
    setMusicVolume(value);
    if (soundManager) {
      soundManager.setMusicVolume(value);
    }
  };

  const handleEnabledChange = (enabled) => {
    setEnabled(enabled);
    if (soundManager) {
      soundManager.setEnabled(enabled);
    }
  };

  const testSound = (type) => {
    if (soundManager) {
      soundManager.playSound(type);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: '1px solid #444',
          borderRadius: '4px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 1000
        }}
      >
        🔊 Sound
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '250px',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Sound Settings</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => handleEnabledChange(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Enable Sounds
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          Master Volume: {Math.round(masterVolume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={masterVolume}
          onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          SFX Volume: {Math.round(sfxVolume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={sfxVolume}
          onChange={(e) => handleSfxVolumeChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          Music Volume: {Math.round(musicVolume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={musicVolume}
          onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <div style={{ fontSize: '12px', marginBottom: '8px', color: '#ccc' }}>Test Sounds:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <button
            onClick={() => testSound('attack')}
            style={{
              background: 'rgba(255, 100, 100, 0.3)',
              border: '1px solid #ff6464',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Attack
          </button>
          <button
            onClick={() => testSound('hit')}
            style={{
              background: 'rgba(255, 150, 100, 0.3)',
              border: '1px solid #ff9664',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Hit
          </button>
          <button
            onClick={() => testSound('enemyDeath')}
            style={{
              background: 'rgba(100, 255, 100, 0.3)',
              border: '1px solid #64ff64',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Death
          </button>
          <button
            onClick={() => testSound('coin')}
            style={{
              background: 'rgba(255, 255, 100, 0.3)',
              border: '1px solid #ffff64',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Coin
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoundSettings;
