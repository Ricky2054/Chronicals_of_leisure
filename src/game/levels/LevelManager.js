export class LevelManager {
  constructor(spriteLoader) {
    this.spriteLoader = spriteLoader;
    this.currentLevel = 1;
    this.tileSize = 32;
    this.levelData = null;
    this.tiles = [];
    this.collisionMap = [];
    this.width = 0;
    this.height = 0;
    
    this.initializeLevels();
  }

  initializeLevels() {
    this.levels = {
      1: {
        name: 'House of Forks',
        theme: 'forks',
        width: 50,
        height: 20,
        tiles: this.generateLevel1(),
        bossSpawn: { x: 1400, y: 300 }
      },
      2: {
        name: 'House of Greed',
        theme: 'greed',
        width: 50,
        height: 20,
        tiles: this.generateLevel2(),
        bossSpawn: { x: 1400, y: 300 }
      },
      3: {
        name: 'House of Silence',
        theme: 'silence',
        width: 50,
        height: 20,
        tiles: this.generateLevel3(),
        bossSpawn: { x: 1400, y: 300 }
      }
    };
  }

  generateLevel1() {
    // House of Forks - Red theme, lava, instability
    const tiles = [];
    const width = 50;
    const height = 20;
    
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        if (y === height - 1) {
          // Ground
          tiles[y][x] = { type: 'floor', variant: 0, solid: true };
        } else if (y === height - 2 && x % 3 === 0) {
          // Platforms
          tiles[y][x] = { type: 'floor', variant: 1, solid: true };
        } else if (x === 0 || x === width - 1) {
          // Walls
          tiles[y][x] = { type: 'wall', variant: 0, solid: true };
        } else if (y < height - 5 && Math.random() < 0.1) {
          // Lava pools
          tiles[y][x] = { type: 'lava', variant: 0, solid: false, damage: 20 };
        } else if (y < height - 3 && Math.random() < 0.05) {
          // Decorative elements
          tiles[y][x] = { type: 'decoration', variant: 0, solid: false };
        } else {
          // Air
          tiles[y][x] = { type: 'air', variant: 0, solid: false };
        }
      }
    }
    
    return tiles;
  }

  generateLevel2() {
    // House of Greed - Gold theme, coins, wealth
    const tiles = [];
    const width = 50;
    const height = 20;
    
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        if (y === height - 1) {
          // Golden floor
          tiles[y][x] = { type: 'floor', variant: 2, solid: true };
        } else if (y === height - 2 && x % 2 === 0) {
          // Golden platforms
          tiles[y][x] = { type: 'floor', variant: 3, solid: true };
        } else if (x === 0 || x === width - 1) {
          // Golden walls
          tiles[y][x] = { type: 'wall', variant: 1, solid: true };
        } else if (y < height - 4 && Math.random() < 0.08) {
          // Coin piles
          tiles[y][x] = { type: 'coin', variant: 0, solid: false, collectible: true };
        } else if (y < height - 3 && Math.random() < 0.06) {
          // Golden decorations
          tiles[y][x] = { type: 'decoration', variant: 1, solid: false };
        } else {
          // Air
          tiles[y][x] = { type: 'air', variant: 0, solid: false };
        }
      }
    }
    
    return tiles;
  }

  generateLevel3() {
    // House of Silence - Blue theme, void, corruption
    const tiles = [];
    const width = 50;
    const height = 20;
    
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        if (y === height - 1) {
          // Void floor
          tiles[y][x] = { type: 'floor', variant: 4, solid: true };
        } else if (y === height - 2 && x % 4 === 0) {
          // Floating platforms
          tiles[y][x] = { type: 'floor', variant: 5, solid: true };
        } else if (x === 0 || x === width - 1) {
          // Void walls
          tiles[y][x] = { type: 'wall', variant: 2, solid: true };
        } else if (y < height - 5 && Math.random() < 0.12) {
          // Void portals
          tiles[y][x] = { type: 'void', variant: 0, solid: false, damage: 30 };
        } else if (y < height - 3 && Math.random() < 0.07) {
          // Glitch decorations
          tiles[y][x] = { type: 'decoration', variant: 2, solid: false };
        } else {
          // Air
          tiles[y][x] = { type: 'air', variant: 0, solid: false };
        }
      }
    }
    
    return tiles;
  }

  async loadLevel(levelNumber) {
    this.currentLevel = levelNumber;
    const level = this.levels[levelNumber];
    
    if (!level) {
      console.error(`Level ${levelNumber} not found`);
      return;
    }
    
    this.levelData = level;
    this.tiles = level.tiles;
    this.width = level.width;
    this.height = level.height;
    
    // Build collision map
    this.buildCollisionMap();
    
    console.log(`Loaded level ${levelNumber}: ${level.name}`);
  }

  buildCollisionMap() {
    this.collisionMap = [];
    
    for (let y = 0; y < this.height; y++) {
      this.collisionMap[y] = [];
      for (let x = 0; x < this.width; x++) {
        const tile = this.tiles[y][x];
        this.collisionMap[y][x] = tile.solid;
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
    if (bottomTile < this.height && this.collisionMap[bottomTile]) {
      for (let x = leftTile; x <= rightTile; x++) {
        if (x >= 0 && x < this.width && this.collisionMap[bottomTile][x]) {
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
        if (y >= 0 && y < this.height && this.collisionMap[y][leftTile]) {
          player.x = (leftTile + 1) * this.tileSize;
          player.velocityX = 0;
          break;
        }
      }
    }
    
    if (rightTile >= 0 && rightTile < this.width) {
      for (let y = topTile; y <= bottomTile; y++) {
        if (y >= 0 && y < this.height && this.collisionMap[y][rightTile]) {
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
          if (tile.damage && tile.damage > 0) {
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
          if (tile.collectible) {
            // Collect the item
            this.collectTile(x, y);
            player.addScore(50);
            player.addCoins(10);
          }
        }
      }
    }
  }

  collectTile(x, y) {
    this.tiles[y][x] = { type: 'air', variant: 0, solid: false };
  }

  render(ctx) {
    if (!this.tiles) return;
    
    const dungeonTiles = this.spriteLoader.getSprites('dungeon');
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.tiles[y][x];
        const tileX = x * this.tileSize;
        const tileY = y * this.tileSize;
        
        this.renderTile(ctx, tile, tileX, tileY, dungeonTiles);
      }
    }
  }

  renderTile(ctx, tile, x, y, dungeonTiles) {
    let sprite = null;
    let color = '#333';
    
    switch (tile.type) {
      case 'floor':
        if (dungeonTiles.wallsFloor && dungeonTiles.wallsFloor[tile.variant]) {
          sprite = dungeonTiles.wallsFloor[tile.variant];
        } else {
          color = tile.variant === 0 ? '#8B4513' : 
                 tile.variant === 1 ? '#A0522D' :
                 tile.variant === 2 ? '#FFD700' :
                 tile.variant === 3 ? '#FFA500' :
                 tile.variant === 4 ? '#4A4A4A' : '#6A6A6A';
        }
        break;
        
      case 'wall':
        if (dungeonTiles.wallsFloor && dungeonTiles.wallsFloor[tile.variant + 5]) {
          sprite = dungeonTiles.wallsFloor[tile.variant + 5];
        } else {
          color = tile.variant === 0 ? '#654321' :
                 tile.variant === 1 ? '#B8860B' :
                 tile.variant === 2 ? '#2F2F2F' : '#654321';
        }
        break;
        
      case 'lava':
        color = '#FF4444';
        break;
        
      case 'coin':
        color = '#FFD700';
        break;
        
      case 'void':
        color = '#4444FF';
        break;
        
      case 'decoration':
        if (dungeonTiles.decorative && dungeonTiles.decorative[tile.variant]) {
          sprite = dungeonTiles.decorative[tile.variant];
        } else {
          color = tile.variant === 0 ? '#FF6666' :
                 tile.variant === 1 ? '#FFAA00' :
                 tile.variant === 2 ? '#6666FF' : '#666666';
        }
        break;
    }
    
    if (sprite) {
      ctx.drawImage(sprite, x, y, this.tileSize, this.tileSize);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, this.tileSize, this.tileSize);
      
      // Add borders for solid tiles
      if (tile.solid) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, this.tileSize, this.tileSize);
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

  getLevelData() {
    return this.levelData;
  }
}
