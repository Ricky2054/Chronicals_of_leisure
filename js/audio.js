// Audio manager for Chronicle of the Ledger
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        
        this.initializeAudioContext();
        this.createSyntheticSounds();
        
        debug.log('AudioManager initialized', 'info');
    }

    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            debug.log('Web Audio API initialized', 'info');
        } catch (error) {
            debug.warning('Web Audio API not supported: ' + error.message);
        }
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
        
        debug.log('Synthetic sounds created', 'info');
    }

    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.audioContext) return;
            
            try {
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
            } catch (error) {
                debug.warning(`Failed to play sound: ${error.message}`);
            }
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            try {
                this.sounds[soundName]();
                debug.log(`Playing sound: ${soundName}`, 'info');
            } catch (error) {
                debug.warning(`Failed to play sound ${soundName}: ${error.message}`);
            }
        } else {
            debug.warning(`Sound not found: ${soundName}`);
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        debug.log(`Master volume set to: ${this.masterVolume}`, 'info');
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        debug.log(`SFX volume set to: ${this.sfxVolume}`, 'info');
    }

    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
            debug.log('Audio context closed', 'info');
        }
    }
}
