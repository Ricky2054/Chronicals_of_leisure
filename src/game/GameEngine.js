import { Player } from './entities/Player';
import { EnemyManager } from './entities/EnemyManager';
import { LevelManager } from './levels/LevelManager';
import { ParticleSystem } from './effects/ParticleSystem';
import { AudioManager } from './audio/AudioManager';
import { SimpleSpriteLoader } from './utils/SimpleSpriteLoader';
import { InputManager } from './input/InputManager';

export class GameEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = options.width || 1024;
    this.height = options.height || 576;
    
    this.onStateChange = options.onStateChange || (() => {});
    this.onGameOver = options.onGameOver || (() => {});
    
    this.gameState = {
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      score: 0,
      level: 1,
      house: 'Forks',
      coins: 0,
      relics: 0,
      gameOver: false
    };
    
    this.lastTime = 0;
    this.deltaTime = 0;
    this.isRunning = false;
    
    // Game systems
    this.spriteLoader = new SimpleSpriteLoader();
    this.inputManager = new InputManager();
    this.player = null;
    this.enemyManager = null;
    this.levelManager = null;
    this.particleSystem = null;
    this.audioManager = null;
    
    // Camera
    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      smoothing: 0.1
    };
  }

  async initialize() {
    try {
      console.log('Initializing game engine...');
      
      // Load sprites (this will use placeholders)
      await this.spriteLoader.loadAll();
      
      // Initialize game systems
      console.log('Initializing game systems...');
      this.audioManager = new AudioManager();
      this.particleSystem = new ParticleSystem(this.ctx);
      this.levelManager = new LevelManager(this.spriteLoader);
      this.enemyManager = new EnemyManager(this.spriteLoader, this.particleSystem);
      
      // Initialize player
      console.log('Initializing player...');
      this.player = new Player(
        this.spriteLoader,
        this.particleSystem,
        this.audioManager
      );
      
      // Set up player event listeners
      this.player.onHealthChange = (health, maxHealth) => {
        this.updateGameState({ health, maxHealth });
      };
      
      this.player.onManaChange = (mana, maxMana) => {
        this.updateGameState({ mana, maxMana });
      };
      
      this.player.onScoreChange = (score) => {
        this.updateGameState({ score: this.gameState.score + score });
      };
      
      this.player.onDeath = () => {
        this.gameOver();
      };
      
      // Initialize level
      console.log('Loading level...');
      await this.levelManager.loadLevel(1);
      this.player.setPosition(100, 400);
      
      // Start game loop
      console.log('Starting game loop...');
      this.isRunning = true;
      this.gameLoop();
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      // Continue with placeholder sprites
      this.initializeWithPlaceholders();
    }
  }

  initializeWithPlaceholders() {
    console.log('Initializing with placeholder sprites...');
    
    // Initialize game systems with placeholders
    this.audioManager = new AudioManager();
    this.particleSystem = new ParticleSystem(this.ctx);
    this.levelManager = new LevelManager(this.spriteLoader);
    this.enemyManager = new EnemyManager(this.spriteLoader, this.particleSystem);
    
    // Initialize player
    this.player = new Player(
      this.spriteLoader,
      this.particleSystem,
      this.audioManager
    );
    
    // Set up player event listeners
    this.player.onHealthChange = (health, maxHealth) => {
      this.updateGameState({ health, maxHealth });
    };
    
    this.player.onManaChange = (mana, maxMana) => {
      this.updateGameState({ mana, maxMana });
    };
    
    this.player.onScoreChange = (score) => {
      this.updateGameState({ score: this.gameState.score + score });
    };
    
    this.player.onDeath = () => {
      this.gameOver();
    };
    
    // Initialize level
    this.levelManager.loadLevel(1);
    this.player.setPosition(100, 400);
    
    // Start game loop
    this.isRunning = true;
    this.gameLoop();
  }

  gameLoop(currentTime = 0) {
    if (!this.isRunning) return;
    
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    this.update(this.deltaTime);
    this.render();
    
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  update(deltaTime) {
    if (this.gameState.gameOver) return;
    
    // Update input
    this.inputManager.update();
    
    // Update player
    this.player.update(deltaTime, this.inputManager);
    
    // Update enemies
    this.enemyManager.update(deltaTime, this.player);
    
    // Update level
    this.levelManager.update(deltaTime);
    
    // Update particles
    this.particleSystem.update(deltaTime);
    
    // Update camera
    this.updateCamera();
    
    // Check collisions
    this.checkCollisions();
  }

  updateCamera() {
    if (this.player) {
      this.camera.targetX = this.player.x - this.width / 2;
      this.camera.targetY = this.player.y - this.height / 2;
      
      // Smooth camera movement
      this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
      this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
      
      // Keep camera within level bounds
      const levelBounds = this.levelManager.getBounds();
      this.camera.x = Math.max(0, Math.min(this.camera.x, levelBounds.width - this.width));
      this.camera.y = Math.max(0, Math.min(this.camera.y, levelBounds.height - this.height));
    }
  }

  checkCollisions() {
    // Player vs Enemies
    this.enemyManager.checkPlayerCollisions(this.player);
    
    // Player vs Level
    this.levelManager.checkPlayerCollisions(this.player);
    
    // Player attacks vs Enemies
    this.enemyManager.checkAttackCollisions(this.player);
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Save context for camera transform
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);
    
    // Render level
    this.levelManager.render(this.ctx);
    
    // Render enemies
    this.enemyManager.render(this.ctx);
    
    // Render player
    this.player.render(this.ctx);
    
    // Render particles
    this.particleSystem.render();
    
    // Restore context
    this.ctx.restore();
  }

  updateGameState(updates) {
    this.gameState = { ...this.gameState, ...updates };
    this.onStateChange(this.gameState);
  }

  gameOver() {
    this.gameState.gameOver = true;
    this.isRunning = false;
    this.onGameOver(this.gameState.score);
  }

  restart() {
    this.gameState = {
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      score: 0,
      level: 1,
      house: 'Forks',
      coins: 0,
      relics: 0,
      gameOver: false
    };
    
    this.player.reset();
    this.enemyManager.reset();
    this.levelManager.loadLevel(1);
    this.particleSystem.clear();
    
    this.isRunning = true;
    this.lastTime = 0;
  }

  handleKeyDown(event) {
    this.inputManager.handleKeyDown(event);
  }

  handleKeyUp(event) {
    this.inputManager.handleKeyUp(event);
  }

  async mintAchievement() {
    // This would integrate with Algorand to mint an NFT achievement
    console.log('Minting achievement for score:', this.gameState.score);
    return { score: this.gameState.score, timestamp: Date.now() };
  }

  destroy() {
    this.isRunning = false;
    if (this.audioManager) {
      this.audioManager.destroy();
    }
  }
}
