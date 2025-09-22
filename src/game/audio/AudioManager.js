export class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = {};
    this.masterVolume = 0.7;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.6;
    this.audioContext = null;
    
    this.initializeAudioContext();
  }

  initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  async loadSounds() {
    // In a real implementation, you would load actual audio files
    // For now, we'll create synthetic sounds
    this.createSyntheticSounds();
  }

  createSyntheticSounds() {
    if (!this.audioContext) return;
    
    // Create synthetic sound effects
    this.sounds = {
      jump: this.createTone(200, 0.1, 'sine'),
      attack: this.createTone(400, 0.2, 'square'),
      heavyAttack: this.createTone(300, 0.3, 'sawtooth'),
      shield: this.createTone(150, 0.5, 'triangle'),
      dash: this.createTone(500, 0.1, 'sine'),
      hurt: this.createTone(100, 0.3, 'square'),
      death: this.createTone(80, 1.0, 'sawtooth'),
      enemyHit: this.createTone(250, 0.2, 'square'),
      coin: this.createTone(800, 0.1, 'sine'),
      levelUp: this.createTone(600, 0.5, 'sine')
    };
  }

  createTone(frequency, duration, type = 'sine') {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.sfxVolume * this.masterVolume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    };
  }

  playSound(soundName) {
    if (this.sounds[soundName]) {
      try {
        this.sounds[soundName]();
      } catch (error) {
        console.warn(`Failed to play sound ${soundName}:`, error);
      }
    }
  }

  playMusic(musicName, loop = true) {
    // In a real implementation, you would play actual music files
    console.log(`Playing music: ${musicName}`);
  }

  stopMusic() {
    // Stop any playing music
    console.log('Stopping music');
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
