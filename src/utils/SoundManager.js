class SoundManager {
  constructor() {
    this.sounds = {};
    this.masterVolume = 0.5;
    this.sfxVolume = 0.7;
    this.musicVolume = 0.3;
    this.enabled = true;
    
    // Create audio context for better performance
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported, using HTML5 audio fallback');
    }
  }

  // Generate procedural sound effects using Web Audio API
  generateSound(type, duration = 0.1, frequency = 440) {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Configure based on sound type
    switch (type) {
      case 'attack':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
        gainNode.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
        
      case 'hit':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + duration);
        gainNode.gain.setValueAtTime(0.4 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
        
      case 'enemyDeath':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + duration * 2);
        gainNode.gain.setValueAtTime(0.5 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration * 2);
        duration *= 2;
        break;
        
      case 'playerDamage':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + duration);
        gainNode.gain.setValueAtTime(0.6 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
        
      case 'jump':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + duration);
        gainNode.gain.setValueAtTime(0.2 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
        
      case 'coin':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + duration);
        gainNode.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
        
      case 'levelUp':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + duration);
        gainNode.gain.setValueAtTime(0.4 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
        
      default:
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    }

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Play sound effect
  playSound(type, options = {}) {
    if (!this.enabled) return;
    
    const duration = options.duration || 0.1;
    const frequency = options.frequency || 440;
    
    this.generateSound(type, duration, frequency);
  }

  // Play multiple sounds for complex effects
  playComplexSound(type, options = {}) {
    if (!this.enabled) return;
    
    switch (type) {
      case 'explosion':
        // Multiple frequencies for explosion effect
        this.generateSound('hit', 0.2, 100);
        setTimeout(() => this.generateSound('hit', 0.15, 80), 50);
        setTimeout(() => this.generateSound('hit', 0.1, 60), 100);
        break;
        
      case 'powerUp':
        // Ascending tones for power-up
        this.generateSound('coin', 0.1, 400);
        setTimeout(() => this.generateSound('coin', 0.1, 600), 100);
        setTimeout(() => this.generateSound('coin', 0.1, 800), 200);
        break;
        
      case 'combo':
        // Quick succession of hits
        this.generateSound('hit', 0.05, 200);
        setTimeout(() => this.generateSound('hit', 0.05, 250), 50);
        setTimeout(() => this.generateSound('hit', 0.05, 300), 100);
        break;
    }
  }

  // Set volume levels
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  // Enable/disable sounds
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // Resume audio context (required for user interaction)
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

export default SoundManager;
