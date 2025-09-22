export class SpriteLoader {
  constructor() {
    this.sprites = {};
    this.loadPromises = [];
  }

  async loadAll() {
    console.log('Loading sprites...');
    
    try {
      // Load all sprites with timeout
      const loadPromises = [
        this.loadKnightSprites(),
        this.loadDungeonTiles(),
        this.loadMonsterSprites(),
        this.loadParticleTextures()
      ];

      await Promise.allSettled(loadPromises);
      console.log('Sprites loaded successfully');
    } catch (error) {
      console.error('Error loading sprites:', error);
      // Continue anyway with placeholder sprites
    }
  }

  async loadKnightSprites() {
    const knightSprites = {};
    
    // Load knight animation strips
    const animations = [
      'idle', 'run', 'attack', 'jump', 'shield', 'death', 'roll'
    ];
    
    for (const anim of animations) {
      try {
        const image = await this.loadImage(`/sprites/Knight/Knight/noBKG_Knight${this.capitalizeFirst(anim)}_strip.png`);
        knightSprites[anim] = this.extractFrames(image, 32, 32);
      } catch (error) {
        console.warn(`Failed to load knight ${anim} animation:`, error);
        // Create placeholder frames
        knightSprites[anim] = this.createPlaceholderFrames(4, 32, 32);
      }
    }
    
    this.sprites.knight = knightSprites;
  }

  async loadDungeonTiles() {
    const dungeonTiles = {};
    
    try {
      // Load main tileset
      const tileset = await this.loadImage('/sprites/craftpix-net-169442-free-2d-top-down-pixel-dungeon-asset-pack/PNG/walls_floor.png');
      dungeonTiles.wallsFloor = this.extractTiles(tileset, 32, 32);
      
      // Load objects
      const objects = await this.loadImage('/sprites/craftpix-net-169442-free-2d-top-down-pixel-dungeon-asset-pack/PNG/Objects.png');
      dungeonTiles.objects = this.extractTiles(objects, 32, 32);
      
      // Load decorative elements
      const decorative = await this.loadImage('/sprites/craftpix-net-169442-free-2d-top-down-pixel-dungeon-asset-pack/PNG/decorative_cracks_walls.png');
      dungeonTiles.decorative = this.extractTiles(decorative, 32, 32);
      
    } catch (error) {
      console.warn('Failed to load dungeon tiles:', error);
      dungeonTiles.wallsFloor = this.createPlaceholderTiles(10, 32, 32);
      dungeonTiles.objects = this.createPlaceholderTiles(5, 32, 32);
      dungeonTiles.decorative = this.createPlaceholderTiles(3, 32, 32);
    }
    
    this.sprites.dungeon = dungeonTiles;
  }

  async loadMonsterSprites() {
    const monsterSprites = {};
    
    try {
      // Load monster sprites
      const monsterFiles = [
        'pixel-0056-900920138.png',
        'pixel-0063-4100537309.png',
        'pixel-0064-4100537310.png',
        'pixel-0067-1577086740.png',
        'pixel-0069-1577086742.png'
      ];
      
      for (let i = 0; i < monsterFiles.length; i++) {
        try {
          const image = await this.loadImage(`/sprites/Monster Creature sprites (pack 1 by batareya)/${monsterFiles[i]}`);
          monsterSprites[`monster_${i}`] = image;
        } catch (error) {
          console.warn(`Failed to load monster sprite ${monsterFiles[i]}:`, error);
        }
      }
      
    } catch (error) {
      console.warn('Failed to load monster sprites:', error);
    }
    
    this.sprites.monsters = monsterSprites;
  }

  async loadParticleTextures() {
    const particleTextures = {};
    
    try {
      const particleFiles = [
        'dirt 2.png',
        'dust.png',
        'grunge crack.png',
        'ink splat.png',
        'smoke 2.png',
        'smoke.png'
      ];
      
      for (const file of particleFiles) {
        try {
          const image = await this.loadImage(`/sprites/Particle Textures/${file}`);
          const name = file.replace('.png', '').replace(' ', '_');
          particleTextures[name] = image;
        } catch (error) {
          console.warn(`Failed to load particle texture ${file}:`, error);
        }
      }
      
    } catch (error) {
      console.warn('Failed to load particle textures:', error);
    }
    
    this.sprites.particles = particleTextures;
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  extractFrames(image, frameWidth, frameHeight) {
    const frames = [];
    const framesPerRow = Math.floor(image.width / frameWidth);
    const rows = Math.floor(image.height / frameHeight);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < framesPerRow; col++) {
        const canvas = document.createElement('canvas');
        canvas.width = frameWidth;
        canvas.height = frameHeight;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(
          image,
          col * frameWidth, row * frameHeight, frameWidth, frameHeight,
          0, 0, frameWidth, frameHeight
        );
        
        frames.push(canvas);
      }
    }
    
    return frames;
  }

  extractTiles(image, tileWidth, tileHeight) {
    const tiles = [];
    const tilesPerRow = Math.floor(image.width / tileWidth);
    const rows = Math.floor(image.height / tileHeight);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < tilesPerRow; col++) {
        const canvas = document.createElement('canvas');
        canvas.width = tileWidth;
        canvas.height = tileHeight;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(
          image,
          col * tileWidth, row * tileHeight, tileWidth, tileHeight,
          0, 0, tileWidth, tileHeight
        );
        
        tiles.push(canvas);
      }
    }
    
    return tiles;
  }

  createPlaceholderFrames(count, width, height) {
    const frames = [];
    for (let i = 0; i < count; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Create a simple colored rectangle as placeholder
      ctx.fillStyle = `hsl(${i * 60}, 70%, 50%)`;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#000';
      ctx.fillText(`${i}`, width/2, height/2);
      
      frames.push(canvas);
    }
    return frames;
  }

  createPlaceholderTiles(count, width, height) {
    const tiles = [];
    for (let i = 0; i < count; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Create a simple tile pattern
      ctx.fillStyle = `hsl(${i * 30}, 30%, 40%)`;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#666';
      ctx.strokeRect(0, 0, width, height);
      
      tiles.push(canvas);
    }
    return tiles;
  }

  getSprites(category) {
    return this.sprites[category] || {};
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
