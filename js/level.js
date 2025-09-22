// Level manager for Chronicle of the Ledger
class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.tileSize = 32;
        this.tiles = [];
        this.width = 0;
        this.height = 0;
        
        debug.log('LevelManager initialized', 'info');
    }

    async loadLevel(levelNumber) {
        this.currentLevel = levelNumber;
        
        debug.log(`Loading level ${levelNumber}...`, 'info');
        
        // Generate level based on number
        switch (levelNumber) {
            case 1:
                this.generateLevel1();
                break;
            case 2:
                this.generateLevel2();
                break;
            case 3:
                this.generateLevel3();
                break;
        }
        
        debug.log(`Level ${levelNumber} loaded successfully`, 'info');
    }

    generateLevel1() {
        // House of Forks - Red theme, lava, instability
        this.width = 50;
        this.height = 20;
        this.tiles = [];
        
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                if (y === this.height - 1) {
                    // Ground
                    this.tiles[y][x] = { type: 'floor', variant: 0, solid: true, color: '#8B4513' };
                } else if (y === this.height - 2 && x % 3 === 0) {
                    // Platforms
                    this.tiles[y][x] = { type: 'floor', variant: 1, solid: true, color: '#A0522D' };
                } else if (x === 0 || x === this.width - 1) {
                    // Walls
                    this.tiles[y][x] = { type: 'wall', variant: 0, solid: true, color: '#654321' };
                } else if (y < this.height - 5 && Math.random() < 0.1) {
                    // Lava pools
                    this.tiles[y][x] = { type: 'lava', variant: 0, solid: false, damage: 20, color: '#ff4444' };
                } else if (y < this.height - 3 && Math.random() < 0.05) {
                    // Decorative elements
                    this.tiles[y][x] = { type: 'decoration', variant: 0, solid: false, color: '#ff6666' };
                } else {
                    // Air
                    this.tiles[y][x] = { type: 'air', variant: 0, solid: false, color: 'transparent' };
                }
            }
        }
    }

    generateLevel2() {
        // House of Greed - Gold theme, coins, wealth
        this.width = 50;
        this.height = 20;
        this.tiles = [];
        
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                if (y === this.height - 1) {
                    // Golden floor
                    this.tiles[y][x] = { type: 'floor', variant: 2, solid: true, color: '#FFD700' };
                } else if (y === this.height - 2 && x % 2 === 0) {
                    // Golden platforms
                    this.tiles[y][x] = { type: 'floor', variant: 3, solid: true, color: '#FFA500' };
                } else if (x === 0 || x === this.width - 1) {
                    // Golden walls
                    this.tiles[y][x] = { type: 'wall', variant: 1, solid: true, color: '#B8860B' };
                } else if (y < this.height - 4 && Math.random() < 0.08) {
                    // Coin piles
                    this.tiles[y][x] = { type: 'coin', variant: 0, solid: false, collectible: true, color: '#FFD700' };
                } else if (y < this.height - 3 && Math.random() < 0.06) {
                    // Golden decorations
                    this.tiles[y][x] = { type: 'decoration', variant: 1, solid: false, color: '#FFAA00' };
                } else {
                    // Air
                    this.tiles[y][x] = { type: 'air', variant: 0, solid: false, color: 'transparent' };
                }
            }
        }
    }

    generateLevel3() {
        // House of Silence - Blue theme, void, corruption
        this.width = 50;
        this.height = 20;
        this.tiles = [];
        
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                if (y === this.height - 1) {
                    // Void floor
                    this.tiles[y][x] = { type: 'floor', variant: 4, solid: true, color: '#4A4A4A' };
                } else if (y === this.height - 2 && x % 4 === 0) {
                    // Floating platforms
                    this.tiles[y][x] = { type: 'floor', variant: 5, solid: true, color: '#6A6A6A' };
                } else if (x === 0 || x === this.width - 1) {
                    // Void walls
                    this.tiles[y][x] = { type: 'wall', variant: 2, solid: true, color: '#2F2F2F' };
                } else if (y < this.height - 5 && Math.random() < 0.12) {
                    // Void portals
                    this.tiles[y][x] = { type: 'void', variant: 0, solid: false, damage: 30, color: '#4444FF' };
                } else if (y < this.height - 3 && Math.random() < 0.07) {
                    // Glitch decorations
                    this.tiles[y][x] = { type: 'decoration', variant: 2, solid: false, color: '#6666FF' };
                } else {
                    // Air
                    this.tiles[y][x] = { type: 'air', variant: 0, solid: false, color: 'transparent' };
                }
            }
        }
    }

    update(deltaTime) {
        // Update animated tiles, traps, etc.
        // This could include moving platforms, animated decorations, etc.
    }

    checkPlayerCollisions(player) {
        const playerBounds = player.getBounds();
        
        // Check tile collisions
        const leftTile = Math.floor(playerBounds.x / this.tileSize);
        const rightTile = Math.floor((playerBounds.x + playerBounds.width) / this.tileSize);
        const topTile = Math.floor(playerBounds.y / this.tileSize);
        const bottomTile = Math.floor((playerBounds.y + playerBounds.height) / this.tileSize);
        
        // Ground collision
        if (bottomTile < this.height && this.tiles[bottomTile]) {
            for (let x = leftTile; x <= rightTile; x++) {
                if (x >= 0 && x < this.width && this.tiles[bottomTile][x] && this.tiles[bottomTile][x].solid) {
                    player.y = bottomTile * this.tileSize - playerBounds.height;
                    player.onGround = true;
                    player.velocityY = 0;
                    break;
                }
            }
        } else {
            player.onGround = false;
        }
        
        // Wall collisions
        if (leftTile >= 0 && leftTile < this.width) {
            for (let y = topTile; y <= bottomTile; y++) {
                if (y >= 0 && y < this.height && this.tiles[y][leftTile] && this.tiles[y][leftTile].solid) {
                    player.x = (leftTile + 1) * this.tileSize;
                    player.velocityX = 0;
                    break;
                }
            }
        }
        
        if (rightTile >= 0 && rightTile < this.width) {
            for (let y = topTile; y <= bottomTile; y++) {
                if (y >= 0 && y < this.height && this.tiles[y][rightTile] && this.tiles[y][rightTile].solid) {
                    player.x = rightTile * this.tileSize - playerBounds.width;
                    player.velocityX = 0;
                    break;
                }
            }
        }
        
        // Check for damage tiles
        this.checkDamageTiles(player, leftTile, rightTile, topTile, bottomTile);
        
        // Check for collectibles
        this.checkCollectibles(player, leftTile, rightTile, topTile, bottomTile);
    }

    checkDamageTiles(player, leftTile, rightTile, topTile, bottomTile) {
        for (let y = topTile; y <= bottomTile; y++) {
            for (let x = leftTile; x <= rightTile; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    const tile = this.tiles[y][x];
                    if (tile && tile.damage && tile.damage > 0) {
                        player.takeDamage(tile.damage);
                    }
                }
            }
        }
    }

    checkCollectibles(player, leftTile, rightTile, topTile, bottomTile) {
        for (let y = topTile; y <= bottomTile; y++) {
            for (let x = leftTile; x <= rightTile; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    const tile = this.tiles[y][x];
                    if (tile && tile.collectible) {
                        // Collect the item
                        this.tiles[y][x] = { type: 'air', variant: 0, solid: false, color: 'transparent' };
                        if (window.game) {
                            window.game.addScore(50);
                        }
                        debug.log('Collected item', 'info');
                    }
                }
            }
        }
    }

    render(ctx) {
        if (!this.tiles) return;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                const tileX = x * this.tileSize;
                const tileY = y * this.tileSize;
                
                if (tile && tile.color && tile.color !== 'transparent') {
                    ctx.fillStyle = tile.color;
                    ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);
                    
                    // Add borders for solid tiles
                    if (tile.solid) {
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(tileX, tileY, this.tileSize, this.tileSize);
                    }
                }
            }
        }
    }

    getBounds() {
        return {
            x: 0,
            y: 0,
            width: this.width * this.tileSize,
            height: this.height * this.tileSize
        };
    }

    getCurrentLevel() {
        return this.currentLevel;
    }
}
