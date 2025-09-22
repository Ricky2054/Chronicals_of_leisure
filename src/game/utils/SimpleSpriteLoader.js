export class SimpleSpriteLoader {
  constructor() {
    this.sprites = {};
    this.initializePlaceholderSprites();
  }

  async loadAll() {
    console.log('Loading placeholder sprites...');
    this.initializePlaceholderSprites();
    console.log('Placeholder sprites loaded successfully');
    return Promise.resolve();
  }

  initializePlaceholderSprites() {
    // Create knight sprites
    this.sprites.knight = {
      idle: this.createKnightFrames('idle', 4),
      run: this.createKnightFrames('run', 6),
      attack: this.createKnightFrames('attack', 4),
      jump: this.createKnightFrames('jump', 3),
      shield: this.createKnightFrames('shield', 2),
      death: this.createKnightFrames('death', 5),
      roll: this.createKnightFrames('roll', 4)
    };

    // Create dungeon tiles
    this.sprites.dungeon = {
      wallsFloor: this.createDungeonTiles(10),
      objects: this.createDungeonTiles(5),
      decorative: this.createDungeonTiles(3)
    };

    // Create monster sprites
    this.sprites.monsters = {
      monster_0: this.createMonsterSprite('forkling', '#ff4444'),
      monster_1: this.createMonsterSprite('coinGolem', '#ffd700'),
      monster_2: this.createMonsterSprite('nullShade', '#4444ff')
    };

    // Create particle textures
    this.sprites.particles = {
      slash: this.createParticleTexture('#ffffff'),
      fire: this.createParticleTexture('#ff4444'),
      coin: this.createParticleTexture('#ffd700'),
      void: this.createParticleTexture('#4444ff')
    };
  }

  createKnightFrames(animation, frameCount) {
    const frames = [];
    for (let i = 0; i < frameCount; i++) {
      frames.push(this.createKnightFrame(animation, i));
    }
    return frames;
  }

  createKnightFrame(animation, frameIndex) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Base knight color
    let color = '#4a90e2';
    if (animation === 'attack') color = '#ff6b6b';
    if (animation === 'shield') color = '#95a5a6';
    if (animation === 'death') color = '#7f8c8d';

    // Draw knight body
    ctx.fillStyle = color;
    ctx.fillRect(8, 12, 16, 20);

    // Draw head
    ctx.fillStyle = '#fdbcb4';
    ctx.fillRect(12, 4, 8, 8);

    // Draw sword for attack
    if (animation === 'attack') {
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(20, 8, 8, 2);
    }

    // Draw shield
    if (animation === 'shield') {
      ctx.fillStyle = '#34495e';
      ctx.fillRect(4, 8, 6, 12);
    }

    // Animation effect
    if (animation === 'run') {
      const offset = Math.sin(frameIndex * 0.5) * 2;
      ctx.translate(0, offset);
    }

    return canvas;
  }

  createDungeonTiles(count) {
    const tiles = [];
    for (let i = 0; i < count; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');

      // Create different tile types
      if (i < 3) {
        // Floor tiles
        ctx.fillStyle = `hsl(${30 + i * 20}, 40%, 30%)`;
        ctx.fillRect(0, 0, 32, 32);
        ctx.strokeStyle = '#666';
        ctx.strokeRect(0, 0, 32, 32);
      } else if (i < 6) {
        // Wall tiles
        ctx.fillStyle = `hsl(${20 + i * 15}, 50%, 25%)`;
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#444';
        ctx.fillRect(4, 4, 24, 24);
      } else {
        // Decorative tiles
        ctx.fillStyle = `hsl(${i * 40}, 60%, 40%)`;
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#fff';
        ctx.fillRect(8, 8, 16, 16);
      }

      tiles.push(canvas);
    }
    return tiles;
  }

  createMonsterSprite(type, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Base monster body
    ctx.fillStyle = color;
    ctx.fillRect(6, 8, 20, 20);

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(10, 12, 4, 4);
    ctx.fillRect(18, 12, 4, 4);
    ctx.fillStyle = '#000';
    ctx.fillRect(11, 13, 2, 2);
    ctx.fillRect(19, 13, 2, 2);

    // Type-specific features
    if (type === 'forkling') {
      // Horns
      ctx.fillStyle = '#333';
      ctx.fillRect(12, 6, 2, 4);
      ctx.fillRect(18, 6, 2, 4);
    } else if (type === 'coinGolem') {
      // Coin symbol
      ctx.fillStyle = '#ffa500';
      ctx.fillRect(14, 16, 4, 4);
    } else if (type === 'nullShade') {
      // Glitch effect
      ctx.fillStyle = '#000';
      ctx.fillRect(8, 20, 16, 2);
    }

    return canvas;
  }

  createParticleTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }

  getSprites(category) {
    return this.sprites[category] || {};
  }
}
