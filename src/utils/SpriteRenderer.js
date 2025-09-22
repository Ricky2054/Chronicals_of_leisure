class SpriteRenderer {
  constructor(spriteLoader) {
    this.spriteLoader = spriteLoader;
  }

  drawSprite(ctx, spriteName, x, y, frame = 0, flipX = false, scale = 1) {
    const sprite = this.spriteLoader.getSprite(spriteName);
    if (!sprite || !sprite.image) {
      // Fallback to colored rectangle if sprite not found
      ctx.fillStyle = spriteName.includes('knight') ? 'blue' : 'red';
      ctx.fillRect(x, y, 32 * scale, 32 * scale);
      return;
    }

    const { image, frameWidth, frameHeight, framesPerRow } = sprite;
    
    // Validate image before drawing
    if (!image || image.complete === false || image.naturalWidth === 0) {
      console.warn(`⚠️ Invalid image for sprite: ${spriteName}, using fallback`);
      ctx.fillStyle = spriteName.includes('knight') ? 'blue' : 'red';
      ctx.fillRect(x, y, 32 * scale, 32 * scale);
      return;
    }
    
    // Calculate source position
    const sourceX = (frame % framesPerRow) * frameWidth;
    const sourceY = Math.floor(frame / framesPerRow) * frameHeight;
    
    // Calculate destination position and size
    const destX = flipX ? x + frameWidth * scale : x;
    const destWidth = frameWidth * scale;
    const destHeight = frameHeight * scale;

    ctx.save();
    
    if (flipX) {
      ctx.scale(-1, 1);
    }
    
    try {
      ctx.drawImage(
        image,
        sourceX, sourceY, frameWidth, frameHeight,
        destX, y, destWidth, destHeight
      );
    } catch (error) {
      console.error(`❌ Error drawing sprite ${spriteName}:`, error);
      // Fallback to colored rectangle
      ctx.fillStyle = spriteName.includes('knight') ? 'blue' : 'red';
      ctx.fillRect(x, y, 32 * scale, 32 * scale);
    }
    
    ctx.restore();
  }

  drawAnimatedSprite(ctx, spriteName, x, y, animationTime, fps = 10, flipX = false, scale = 1) {
    const sprite = this.spriteLoader.getSprite(spriteName);
    if (!sprite || !sprite.image) {
      // Fallback
      ctx.fillStyle = spriteName.includes('knight') ? 'blue' : 'red';
      ctx.fillRect(x, y, 32 * scale, 32 * scale);
      return;
    }

    const frame = Math.floor(animationTime * fps) % sprite.frameCount;
    this.drawSprite(ctx, spriteName, x, y, frame, flipX, scale);
  }

  drawPlayer(ctx, player, animationTime) {
    // Determine animation state and sprite
    let spriteName = 'knight_idle';
    let animationSpeed = 8;
    
    if (Math.abs(player.velocityX) > 10) {
      spriteName = 'knight_run';
      animationSpeed = 12; // Smoother run animation
    } else if (Math.abs(player.velocityY) > 10) {
      spriteName = 'knight_jump';
      animationSpeed = 8; // Smoother jump animation
    } else if (player.isAttacking) {
      spriteName = 'knight_attack';
      animationSpeed = 15; // Smoother attack animation
    }

    // Use real sprites now that movement is working
    const sprite = this.spriteLoader.getSprite(spriteName);
    
    if (sprite && sprite.image && sprite.image.complete && sprite.image.naturalWidth > 0) {
      // Use real sprite with proper animation timing
      this.drawAnimatedSprite(ctx, spriteName, player.x, player.y, !player.facingRight, animationSpeed, 1, animationTime);
    } else {
      // Use fallback sprite
      console.log('Using fallback sprite for player:', spriteName, 'sprite exists:', !!sprite, 'image exists:', !!(sprite && sprite.image), 'complete:', !!(sprite && sprite.image && sprite.image.complete));
      this.drawPlayerFallback(ctx, player, animationTime);
    }
  }

  drawAnimatedSprite(ctx, spriteName, x, y, flipX = false, fps = 8, scale = 1, animationTime = 0) {
    const sprite = this.spriteLoader.getSprite(spriteName);
    if (!sprite || !sprite.image) {
      console.log(`Sprite not found or not loaded: ${spriteName}`);
      return;
    }
    
    ctx.save();
    
    // Apply transformations
    ctx.translate(x, y);
    if (flipX) {
      ctx.scale(-1, 1);
      ctx.translate(-sprite.frameWidth * scale, 0);
    }
    ctx.scale(scale, scale);

    // Calculate current frame with proper animation timing
    const frame = Math.floor(animationTime * fps) % sprite.frameCount;
    
    // Debug logging (disabled to reduce spam)
    // if (Math.random() < 0.001) { // Log very rarely to avoid spam
    //   console.log(`Animating ${spriteName}: frame ${frame}/${sprite.frameCount}, time: ${animationTime}, fps: ${fps}`);
    // }
    
    // Calculate source position
    const sourceX = frame * sprite.frameWidth;
    const sourceY = 0;
    
    // Draw the sprite
    ctx.drawImage(
      sprite.image,
      sourceX, sourceY, sprite.frameWidth, sprite.frameHeight,
      0, 0, sprite.frameWidth, sprite.frameHeight
    );
    
    ctx.restore();
  }

  drawAnimatedPlayer(ctx, player, animationTime, state, fps) {
    ctx.save();
    
    // Flash effect when invulnerable
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 10) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Create animated sprite based on state
    const frameCount = this.getPlayerFrameCount(state);
    const frame = Math.floor(animationTime * fps) % frameCount;
    
    // Draw player with animation
    this.drawPlayerFrame(ctx, player, state, frame);
    
    ctx.restore();
  }

  getPlayerFrameCount(state) {
    switch (state) {
      case 'idle': return 4;
      case 'run': return 6;
      case 'jump': return 3;
      case 'attack': return 4;
      default: return 1;
    }
  }

  drawPlayerFrame(ctx, player, state, frame) {
    // Use consistent colors to prevent flickering
    const baseColor = '#4a90e2';
    const highlightColor = '#5ba0f2';
    const shadowColor = '#3a80d2';

    ctx.save();
    
    if (!player.facingRight) {
      ctx.scale(-1, 1);
      ctx.translate(-player.x - player.width, player.y);
    } else {
      ctx.translate(player.x, player.y);
    }

    // Draw knight with smooth animation
    ctx.fillStyle = baseColor;
    ctx.fillRect(8, 8, 48, 48);
    
    // Add subtle animation effects
    if (state === 'run') {
      // Running animation - slight bounce
      const bounce = Math.sin(frame * 0.5) * 1;
      ctx.translate(0, bounce);
    } else if (state === 'attack') {
      // Attack animation - forward thrust
      const thrust = Math.min(frame * 2, 8);
      ctx.translate(thrust, 0);
    } else if (state === 'jump') {
      // Jump animation - upward motion
      const jump = Math.min(frame * 2, 6);
      ctx.translate(0, -jump);
    }

    // Draw knight details with consistent colors
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 12, 40, 40);
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(16, 16, 32, 32);
    
    // Add weapon for attack state
    if (state === 'attack') {
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(40, 20, 16, 4);
    }

    // Add armor highlights
    ctx.fillStyle = highlightColor;
    ctx.fillRect(10, 10, 44, 4);
    ctx.fillRect(10, 10, 4, 44);

    ctx.restore();
  }

  drawEnemy(ctx, enemy, animationTime) {
    // Map enemy types to sprite names
    let spriteName = 'monster_1';
    if (enemy.type === 'goblin') spriteName = 'monster_1';
    else if (enemy.type === 'orc') spriteName = 'monster_2';
    else if (enemy.type === 'skeleton') spriteName = 'monster_3';
    else if (enemy.type === 'demon') spriteName = 'monster_4';
    else if (enemy.type === 'beast') spriteName = 'monster_5';
    
    // Use real sprites now that movement is working
    const sprite = this.spriteLoader.getSprite(spriteName);
    
    if (sprite && sprite.image && sprite.image.complete && sprite.image.naturalWidth > 0) {
      // Use real sprite with proper animation
      this.drawAnimatedSprite(ctx, spriteName, enemy.x, enemy.y, !enemy.facingRight, 12, 1, animationTime); // Smoother enemy animation
    } else {
      // Use fallback sprite with attack animation
      this.drawEnemyFallback(ctx, enemy, animationTime);
    }
  }

  drawAnimatedEnemy(ctx, enemy, animationTime, state, fps) {
    const frameCount = this.getEnemyFrameCount(state);
    const frame = Math.floor(animationTime * fps) % frameCount;
    
    ctx.save();
    
    if (!enemy.facingRight) {
      ctx.scale(-1, 1);
      ctx.translate(-enemy.x - enemy.width, enemy.y);
    } else {
      ctx.translate(enemy.x, enemy.y);
    }

    // Draw enemy with animation
    this.drawEnemyFrame(ctx, enemy, state, frame, animationTime);
    
    ctx.restore();
  }

  getEnemyFrameCount(state) {
    switch (state) {
      case 'idle': return 3;
      case 'walk': return 4;
      default: return 1;
    }
  }

  drawEnemyFrame(ctx, enemy, state, frame, animationTime) {
    // Use consistent colors to prevent flickering
    const enemyBaseColors = {
      'goblin': '#ff4444',
      'orc': '#ff8800',
      'skeleton': '#8800ff'
    };

    const baseColor = enemyBaseColors[enemy.type] || '#ff4444';
    const highlightColor = this.lightenColor(baseColor, 20);
    const shadowColor = this.darkenColor(baseColor, 20);

    // Draw enemy with smooth animation
    ctx.fillStyle = baseColor;
    ctx.fillRect(4, 4, 24, 24);
    
    // Add subtle animation effects
    if (state === 'walk') {
      // Walking animation - slight bounce
      const bounce = Math.sin(frame * 0.3) * 0.5;
      ctx.translate(0, bounce);
    }

    // Draw enemy details with consistent colors
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, 6, 20, 20);
    
    // Add eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(8, 8, 2, 2);
    ctx.fillRect(18, 8, 2, 2);
    
    // Add mouth
    ctx.fillRect(12, 16, 4, 2);
    
    // Add special features based on type
    if (enemy.type === 'orc') {
      // Orc tusks
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(6, 12, 2, 4);
      ctx.fillRect(20, 12, 2, 4);
    } else if (enemy.type === 'skeleton') {
      // Skeleton bones
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 4, 2, 8);
      ctx.fillRect(18, 4, 2, 8);
    }

    // Add highlights
    ctx.fillStyle = highlightColor;
    ctx.fillRect(5, 5, 22, 2);
    ctx.fillRect(5, 5, 2, 22);
  }

  // Helper functions for color manipulation
  lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  }

  // Fallback functions for when sprites aren't loaded
  drawPlayerFallback(ctx, player, animationTime) {
    ctx.save();
    
    // Flash effect when invulnerable
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 10) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }
    
    if (!player.facingRight) {
      ctx.scale(-1, 1);
      ctx.translate(-player.x - player.width, player.y);
    } else {
      ctx.translate(player.x, player.y);
    }

    // Add animation based on movement
    let animationOffset = 0;
    if (Math.abs(player.velocityX) > 10) {
      // Running animation - slight bounce
      animationOffset = Math.sin(animationTime * 10) * 2;
    }
    if (player.isAttacking) {
      // Attack animation - forward thrust
      animationOffset = Math.sin(animationTime * 20) * 4;
    }

    ctx.translate(0, animationOffset);

    // Draw a proper knight sprite
    ctx.fillStyle = '#4a90e2'; // Blue armor
    ctx.fillRect(8, 8, 48, 48);
    
    ctx.fillStyle = '#ffffff'; // White underlayer
    ctx.fillRect(12, 12, 40, 40);
    
    ctx.fillStyle = '#ff6b6b'; // Red details
    ctx.fillRect(16, 16, 32, 32);
    
    // Add helmet
    ctx.fillStyle = '#2c5aa0';
    ctx.fillRect(16, 8, 32, 16);
    
    // Add eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(20, 12, 4, 4);
    ctx.fillRect(32, 12, 4, 4);
    
    // Add sword
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(40, 20, 16, 4);
    ctx.fillRect(44, 16, 4, 12);
    
    // Add attack effect
    if (player.isAttacking) {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(50, 20, 30, 12); // Bigger attack effect
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(55, 25, 20, 2); // Red slash effect
    }
    
    ctx.restore();
  }

  drawEnemyFallback(ctx, enemy, animationTime) {
    ctx.save();
    
    if (!enemy.facingRight) {
      ctx.scale(-1, 1);
      ctx.translate(-enemy.x - enemy.width, enemy.y);
    } else {
      ctx.translate(enemy.x, enemy.y);
    }

    // Add animation based on movement and attack state
    let animationOffset = 0;
    let attackScale = 1;
    
    if (enemy.isAttacking) {
      // Attack animation - forward lunge
      attackScale = 1.2;
      animationOffset = Math.sin(animationTime * 15) * 3;
    } else if (Math.abs(enemy.velocityX) > 5) {
      // Walking animation - slight bounce
      animationOffset = Math.sin(animationTime * 8) * 1;
    }

    ctx.translate(0, animationOffset);
    ctx.scale(attackScale, attackScale);

    // Get enemy color based on type
    const colors = {
      'goblin': '#ff4444',
      'orc': '#ff8800',
      'skeleton': '#8800ff'
    };
    const baseColor = colors[enemy.type] || '#ff4444';

    // Draw enemy body
    ctx.fillStyle = baseColor;
    ctx.fillRect(4, 4, 24, 24);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, 6, 20, 20);
    
    // Add eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(8, 8, 2, 2);
    ctx.fillRect(18, 8, 2, 2);
    
    // Add mouth
    ctx.fillRect(12, 16, 4, 2);
    
    // Add special features based on type
    if (enemy.type === 'orc') {
      // Orc tusks
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(6, 12, 2, 4);
      ctx.fillRect(20, 12, 2, 4);
    } else if (enemy.type === 'skeleton') {
      // Skeleton bones
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 4, 2, 8);
      ctx.fillRect(18, 4, 2, 8);
    }
    
    // Add attack effect
    if (enemy.isAttacking) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(28, 10, 8, 4);
    }
    
    ctx.restore();
  }

  drawEnvironment(ctx) {
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 576);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 576);

    // Draw floor
    for (let x = 0; x < 32; x++) {
      this.drawSprite(ctx, 'floor', x * 32, 544, 0, false, 1);
    }
    
    // Draw side walls
    for (let y = 0; y < 17; y++) {
      this.drawSprite(ctx, 'wall', 0, y * 32, 0, false, 1);
      this.drawSprite(ctx, 'wall', 992, y * 32, 0, false, 1);
    }

    // Draw platforms
    const platforms = [
      { x: 200, y: 400, width: 3 },
      { x: 400, y: 350, width: 4 },
      { x: 600, y: 300, width: 3 },
      { x: 800, y: 250, width: 4 },
      { x: 150, y: 200, width: 2 },
      { x: 700, y: 150, width: 3 }
    ];

    platforms.forEach(platform => {
      for (let i = 0; i < platform.width; i++) {
        this.drawSprite(ctx, 'floor', platform.x + i * 32, platform.y, 0, false, 1);
      }
    });

    // Draw some decorative elements
    this.drawSprite(ctx, 'fire', 100, 500, Math.floor(Date.now() / 200) % 4, false, 1);
    this.drawSprite(ctx, 'fire', 300, 500, Math.floor(Date.now() / 200) % 4, false, 1);
    this.drawSprite(ctx, 'fire', 500, 500, Math.floor(Date.now() / 200) % 4, false, 1);
  }

  drawParticle(ctx, particle) {
    if (particle.life <= 0) return;

    ctx.save();
    ctx.globalAlpha = particle.life;
    
    if (particle.sprite) {
      this.drawSprite(ctx, particle.sprite, particle.x, particle.y, 0, false, particle.size / 32);
    } else {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

export default SpriteRenderer;
