class SpriteLoader {
  constructor() {
    this.sprites = new Map();
    this.loadingPromises = new Map();
  }

  async loadSprite(name, src, frameWidth, frameHeight, frameCount = 1) {
    if (this.sprites.has(name)) {
      return this.sprites.get(name);
    }

    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const sprite = {
          image: img,
          frameWidth,
          frameHeight,
          frameCount,
          framesPerRow: Math.floor(img.width / frameWidth)
        };
        this.sprites.set(name, sprite);
        this.loadingPromises.delete(name);
        resolve(sprite);
      };
      img.onerror = () => {
        this.loadingPromises.delete(name);
        reject(new Error(`Failed to load sprite: ${name}`));
      };
      img.src = src;
    });

    this.loadingPromises.set(name, promise);
    return promise;
  }

  getSprite(name) {
    return this.sprites.get(name);
  }

  async loadAllSprites() {
    console.log('Loading real sprites...');
    
    const spritePromises = [];
    
    // Load Knight sprites
    const knightSprites = [
      { key: 'knight_idle', path: '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png', frames: 8 },
      { key: 'knight_run', path: '/sprites/Knight/Knight/noBKG_KnightRun_strip.png', frames: 8 },
      { key: 'knight_attack', path: '/sprites/Knight/Knight/noBKG_KnightAttack_strip.png', frames: 6 },
      { key: 'knight_jump', path: '/sprites/Knight/Knight/noBKG_KnightJumpAndFall_strip.png', frames: 6 },
      { key: 'knight_death', path: '/sprites/Knight/Knight/noBKG_KnightDeath_strip.png', frames: 6 }
    ];
    
    // Load Monster sprites
    const monsterSprites = [
      { key: 'monster_1', path: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0056-900920138.png', frames: 1 },
      { key: 'monster_2', path: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0063-4100537309.png', frames: 1 },
      { key: 'monster_3', path: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0064-4100537310.png', frames: 1 },
      { key: 'monster_4', path: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0067-1577086740.png', frames: 1 },
      { key: 'monster_5', path: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0069-1577086742.png', frames: 1 }
    ];
    
    // Load all sprites
    [...knightSprites, ...monsterSprites].forEach(sprite => {
      const promise = this.loadSprite(sprite.key, sprite.path, sprite.frames, 64, 64);
      spritePromises.push(promise);
    });
    
    try {
      await Promise.all(spritePromises);
      console.log('All real sprites loaded successfully!');
      return true;
    } catch (error) {
      console.error('Error loading sprites:', error);
      return false;
    }
  }

  async loadSprite(key, path, frameCount = 1, frameWidth = 64, frameHeight = 64) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Use provided frame dimensions or calculate from image
        const actualFrameWidth = frameWidth || Math.floor(img.width / frameCount);
        const actualFrameHeight = frameHeight || img.height;
        
        const spriteData = {
          image: img,
          frameWidth: actualFrameWidth,
          frameHeight: actualFrameHeight,
          frameCount: frameCount,
          framesPerRow: frameCount,
          totalWidth: img.width,
          totalHeight: img.height
        };
        
        this.sprites.set(key, spriteData);
        
        console.log(`✅ Loaded sprite: ${key} (${actualFrameWidth}x${actualFrameHeight}, ${frameCount} frames) from ${path}`);
        resolve(spriteData);
      };
      
      img.onerror = (error) => {
        console.error(`❌ Failed to load sprite: ${path}`, error);
        // Don't reject, just log the error and continue
        console.warn(`⚠️ Sprite ${key} will use fallback rendering`);
        resolve(null);
      };
      
      const fullPath = process.env.PUBLIC_URL + path;
      console.log(`Loading sprite: ${key} from ${fullPath}`);
      img.src = fullPath;
    });
  }
}

export default SpriteLoader;
