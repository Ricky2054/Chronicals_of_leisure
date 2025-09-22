class ProjectileManager {
  constructor() {
    this.projectiles = [];
    this.nextId = 1;
  }

  createProjectile(type, x, y, targetX, targetY, damage = 10, speed = 200, owner = 'enemy') {
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const projectile = {
      id: this.nextId++,
      type,
      x,
      y,
      width: 8,
      height: 8,
      velocityX: (dx / distance) * speed,
      velocityY: (dy / distance) * speed,
      damage,
      owner,
      lifetime: 3.0, // 3 seconds max lifetime
      age: 0,
      // Visual properties
      color: this.getProjectileColor(type),
      size: this.getProjectileSize(type),
      glowColor: this.getProjectileGlow(type)
    };

    this.projectiles.push(projectile);
    return projectile;
  }

  getProjectileColor(type) {
    const colors = {
      'fireball': '#FF4500',
      'ice_shard': '#00BFFF',
      'poison_bolt': '#9ACD32',
      'lightning': '#FFD700',
      'dark_energy': '#8A2BE2',
      'bone': '#F5F5DC',
      'player_energy': '#00FF00',
      'default': '#FF0000'
    };
    return colors[type] || colors.default;
  }

  getProjectileSize(type) {
    const sizes = {
      'fireball': 20,
      'ice_shard': 16,
      'poison_bolt': 14,
      'lightning': 18,
      'dark_energy': 22,
      'bone': 16,
      'player_energy': 18,
      'default': 16
    };
    return sizes[type] || sizes.default;
  }

  getProjectileGlow(type) {
    const glows = {
      'fireball': 'rgba(255, 69, 0, 0.8)',
      'ice_shard': 'rgba(0, 191, 255, 0.8)',
      'poison_bolt': 'rgba(154, 205, 50, 0.8)',
      'lightning': 'rgba(255, 215, 0, 0.8)',
      'dark_energy': 'rgba(138, 43, 226, 0.8)',
      'bone': 'rgba(245, 245, 220, 0.8)',
      'player_energy': 'rgba(0, 255, 0, 0.8)',
      'default': 'rgba(255, 0, 0, 0.8)'
    };
    return glows[type] || glows.default;
  }

  updateProjectiles(deltaTime) {
    this.projectiles = this.projectiles.filter(projectile => {
      projectile.x += projectile.velocityX * deltaTime;
      projectile.y += projectile.velocityY * deltaTime;
      projectile.age += deltaTime;

      // Remove projectiles that are too old
      return projectile.age < projectile.lifetime;
    });
  }

  checkCollisions(player, enemies, boss = null) {
    const hitTargets = [];

    this.projectiles = this.projectiles.filter(projectile => {
      // Check collision with player
      if (projectile.owner === 'enemy' && this.checkRectCollision(projectile, player)) {
        hitTargets.push({
          type: 'player',
          target: player,
          projectile: projectile
        });
        return false; // Remove projectile
      }

      // Check collision with enemies (for player projectiles)
      if (projectile.owner === 'player') {
        for (const enemy of enemies) {
          if (!enemy.isDead && this.checkRectCollision(projectile, enemy)) {
            hitTargets.push({
              type: 'enemy',
              target: enemy,
              projectile: projectile
            });
            return false; // Remove projectile
          }
        }
        
        // Check collision with boss (for player projectiles)
        if (boss && !boss.isDead && this.checkRectCollision(projectile, boss)) {
          hitTargets.push({
            type: 'boss',
            target: boss,
            projectile: projectile
          });
          return false; // Remove projectile
        }
      }

      return true; // Keep projectile
    });

    return hitTargets;
  }

  checkRectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  drawProjectiles(ctx) {
    this.projectiles.forEach(projectile => {
      ctx.save();
      
      // Add glow effect
      ctx.shadowColor = projectile.glowColor;
      ctx.shadowBlur = 20;
      
      // Draw projectile based on type
      switch (projectile.type) {
        case 'fireball':
          this.drawFireball(ctx, projectile);
          break;
        case 'ice_shard':
          this.drawIceShard(ctx, projectile);
          break;
        case 'poison_bolt':
          this.drawPoisonBolt(ctx, projectile);
          break;
        case 'lightning':
          this.drawLightning(ctx, projectile);
          break;
        case 'dark_energy':
          this.drawDarkEnergy(ctx, projectile);
          break;
        case 'bone':
          this.drawBone(ctx, projectile);
          break;
        default:
          this.drawDefaultProjectile(ctx, projectile);
      }
      
      ctx.restore();
    });
  }

  drawFireball(ctx, projectile) {
    const size = projectile.size;
    const centerX = projectile.x + size / 2;
    const centerY = projectile.y + size / 2;
    
    // Outer flame
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner flame
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size / 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Core
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size / 6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawIceShard(ctx, projectile) {
    const size = projectile.size;
    ctx.fillStyle = '#00BFFF';
    ctx.beginPath();
    ctx.moveTo(projectile.x + size / 2, projectile.y);
    ctx.lineTo(projectile.x + size, projectile.y + size);
    ctx.lineTo(projectile.x, projectile.y + size);
    ctx.closePath();
    ctx.fill();
    
    // Ice highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(projectile.x + size / 2, projectile.y + 2);
    ctx.lineTo(projectile.x + size - 2, projectile.y + size - 2);
    ctx.lineTo(projectile.x + 2, projectile.y + size - 2);
    ctx.closePath();
    ctx.fill();
  }

  drawPoisonBolt(ctx, projectile) {
    const size = projectile.size;
    ctx.fillStyle = '#9ACD32';
    ctx.beginPath();
    ctx.arc(projectile.x + size / 2, projectile.y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Poison bubbles
    ctx.fillStyle = '#ADFF2F';
    ctx.beginPath();
    ctx.arc(projectile.x + size / 3, projectile.y + size / 3, size / 6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawLightning(ctx, projectile) {
    const size = projectile.size;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(projectile.x, projectile.y);
    ctx.lineTo(projectile.x + size, projectile.y + size);
    ctx.stroke();
    
    // Lightning branches
    ctx.beginPath();
    ctx.moveTo(projectile.x + size / 2, projectile.y);
    ctx.lineTo(projectile.x + size / 3, projectile.y + size / 2);
    ctx.moveTo(projectile.x + size / 2, projectile.y);
    ctx.lineTo(projectile.x + 2 * size / 3, projectile.y + size / 2);
    ctx.stroke();
  }

  drawDarkEnergy(ctx, projectile) {
    const size = projectile.size;
    const centerX = projectile.x + size / 2;
    const centerY = projectile.y + size / 2;
    
    // Dark aura
    ctx.fillStyle = '#8A2BE2';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Dark core
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBone(ctx, projectile) {
    const size = projectile.size;
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(projectile.x, projectile.y + size / 4, size, size / 2);
    
    // Bone ends
    ctx.beginPath();
    ctx.arc(projectile.x + size / 4, projectile.y + size / 2, size / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(projectile.x + 3 * size / 4, projectile.y + size / 2, size / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDefaultProjectile(ctx, projectile) {
    const size = projectile.size;
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(projectile.x + size / 2, projectile.y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  getActiveProjectiles() {
    return this.projectiles;
  }

  clearProjectiles() {
    this.projectiles = [];
  }
}

export default ProjectileManager;
