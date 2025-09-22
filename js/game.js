// Main game engine for Chronicle of the Ledger
class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 1024;
        this.height = 576;
        
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
        this.player = null;
        this.enemies = [];
        this.particles = [];
        this.level = null;
        this.audio = null;
        this.blockchain = null;
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            smoothing: 0.1
        };
        
        // Input
        this.keys = {};
        this.previousKeys = {};
        
        debug.log('GameEngine initialized', 'info');
    }

    async initialize() {
        try {
            debug.log('Starting game initialization...', 'info');
            
            // Initialize systems
            this.audio = new AudioManager();
            this.blockchain = new BlockchainManager();
            this.level = new LevelManager();
            this.player = new Player(100, 400);
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize level
            await this.level.loadLevel(1);
            
            // Start game loop
            this.isRunning = true;
            this.gameLoop();
            
            debug.log('Game initialized successfully!', 'info');
            this.hideLoading();
            
        } catch (error) {
            debug.error(`Failed to initialize game: ${error.message}`);
            this.hideLoading();
        }
    }

    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Blockchain events
        document.getElementById('connectWallet').addEventListener('click', () => {
            this.blockchain.connectWallet();
        });
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update performance monitor
        performanceMonitor.update(currentTime);
        
        this.update(this.deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        if (this.gameState.gameOver) return;
        
        // Update input
        this.updateInput();
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime, this.keys);
        }
        
        // Update enemies
        this.enemies.forEach((enemy, index) => {
            enemy.update(deltaTime, this.player);
            if (enemy.isDead) {
                this.enemies.splice(index, 1);
                this.addScore(50);
            }
        });
        
        // Update particles
        this.particles.forEach((particle, index) => {
            particle.update(deltaTime);
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        // Update level
        if (this.level) {
            this.level.update(deltaTime);
        }
        
        // Update camera
        this.updateCamera();
        
        // Check collisions
        this.checkCollisions();
        
        // Spawn enemies
        this.spawnEnemies();
        
        // Update UI
        this.updateUI();
    }

    updateInput() {
        // Copy current keys to previous keys
        this.previousKeys = { ...this.keys };
    }

    updateCamera() {
        if (this.player) {
            this.camera.targetX = this.player.x - this.width / 2;
            this.camera.targetY = this.player.y - this.height / 2;
            
            // Smooth camera movement
            this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
            this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
            
            // Keep camera within level bounds
            const levelBounds = this.level ? this.level.getBounds() : { width: 2000, height: 1000 };
            this.camera.x = Math.max(0, Math.min(this.camera.x, levelBounds.width - this.width));
            this.camera.y = Math.max(0, Math.min(this.camera.y, levelBounds.height - this.height));
        }
    }

    checkCollisions() {
        // Player vs Enemies
        this.enemies.forEach(enemy => {
            if (this.checkCollision(this.player.getBounds(), enemy.getBounds())) {
                if (enemy.isAttacking && !this.player.invulnerable) {
                    this.player.takeDamage(enemy.damage);
                    this.createParticle('damage', this.player.x + this.player.width / 2, this.player.y);
                }
            }
        });
        
        // Player attacks vs Enemies
        if (this.player.isAttacking) {
            const attackBounds = this.player.getAttackBounds();
            this.enemies.forEach(enemy => {
                if (this.checkCollision(attackBounds, enemy.getBounds())) {
                    enemy.takeDamage(this.player.getAttackDamage());
                    this.createParticle('hit', enemy.x + enemy.width / 2, enemy.y);
                    this.addScore(10);
                }
            });
        }
        
        // Player vs Level
        if (this.level) {
            this.level.checkPlayerCollisions(this.player);
        }
    }

    spawnEnemies() {
        if (this.enemies.length < 3 && Math.random() < 0.01) {
            const enemyTypes = ['forkling', 'coinGolem', 'nullShade'];
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            
            const spawnDistance = 200;
            const angle = Math.random() * Math.PI * 2;
            const x = this.player.x + Math.cos(angle) * spawnDistance;
            const y = this.player.y + Math.sin(angle) * spawnDistance;
            
            this.enemies.push(new Enemy(type, x, y));
            debug.log(`Spawned ${type} enemy`, 'info');
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    createParticle(type, x, y) {
        this.particles.push(new Particle(type, x, y));
    }

    addScore(points) {
        this.gameState.score += points;
        this.gameState.coins += Math.floor(points / 10);
    }

    updateUI() {
        document.getElementById('health').textContent = this.gameState.health;
        document.getElementById('mana').textContent = Math.floor(this.gameState.mana);
        document.getElementById('score').textContent = `Score: ${this.gameState.score}`;
        document.getElementById('level').textContent = this.gameState.level;
        document.getElementById('house').textContent = this.gameState.house;
        document.getElementById('coins').textContent = this.gameState.coins;
        
        // Update health bar
        const healthPercentage = (this.gameState.health / this.gameState.maxHealth) * 100;
        document.getElementById('healthFill').style.width = `${healthPercentage}%`;
        
        // Update mana bar
        const manaPercentage = (this.gameState.mana / this.gameState.maxMana) * 100;
        document.getElementById('manaFill').style.width = `${manaPercentage}%`;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Save context for camera transform
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render level
        if (this.level) {
            this.level.render(this.ctx);
        }
        
        // Render enemies
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Render player
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        // Render particles
        this.particles.forEach(particle => particle.render(this.ctx));
        
        // Restore context
        this.ctx.restore();
        
        // Render debug info
        this.renderDebugInfo();
    }

    renderDebugInfo() {
        const stats = performanceMonitor.getStats();
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`FPS: ${stats.fps}`, 10, this.height - 30);
        this.ctx.fillText(`Frame Time: ${stats.frameTime.toFixed(2)}ms`, 10, this.height - 15);
        this.ctx.fillText(`Enemies: ${this.enemies.length}`, 10, this.height - 45);
        this.ctx.fillText(`Particles: ${this.particles.length}`, 10, this.height - 60);
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    gameOver() {
        this.gameState.gameOver = true;
        this.isRunning = false;
        
        const gameOverDiv = document.getElementById('gameOver');
        const finalScoreDiv = document.getElementById('finalScore');
        
        if (gameOverDiv && finalScoreDiv) {
            finalScoreDiv.textContent = `Final Score: ${this.gameState.score}`;
            gameOverDiv.style.display = 'block';
        }
        
        debug.log(`Game Over! Final Score: ${this.gameState.score}`, 'info');
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
        
        this.player = new Player(100, 400);
        this.enemies = [];
        this.particles = [];
        
        const gameOverDiv = document.getElementById('gameOver');
        if (gameOverDiv) {
            gameOverDiv.style.display = 'none';
        }
        
        this.isRunning = true;
        this.lastTime = 0;
        
        debug.log('Game restarted', 'info');
    }
}

// Global game instance
window.game = new GameEngine();
