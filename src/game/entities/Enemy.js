export class Enemy {
  constructor(type, x, y, spriteLoader, particleSystem) {
    this.type = type;
    this.spriteLoader = spriteLoader;
    this.particleSystem = particleSystem;
    
    // Position and movement
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 50;
    this.gravity = 800;
    this.onGround = false;
    
    // Stats
    this.health = this.getMaxHealth();
    this.maxHealth = this.getMaxHealth();
    this.damage = this.getDamage();
    this.attackCooldown = 0;
    this.attackRange = 40;
    
    // State
    this.isDead = false;
    this.isAttacking = false;
    this.facingRight = true;
    this.target = null;
    this.aggroRange = 150;
    this.attackCooldownTime = 2;
    
    // Animation
    this.animationTimer = 0;
    this.animationFrame = 0;
    this.animationSpeed = 0.2;
    
    this.initializeStats();
  }

  initializeStats() {
    switch (this.type) {
      case 'forkling':
        this.health = 30;
        this.maxHealth = 30;
        this.damage = 15;
        this.speed = 80;
        this.aggroRange = 120;
        break;
      case 'coinGolem':
        this.health = 60;
        this.maxHealth = 60;
        this.damage = 25;
        this.speed = 40;
        this.aggroRange = 100;
        break;
      case 'nullShade':
        this.health = 40;
        this.maxHealth = 40;
        this.damage = 20;
        this.speed = 100;
        this.aggroRange = 180;
        break;
    }
  }

  getMaxHealth() {
    switch (this.type) {
      case 'forkling': return 30;
      case 'coinGolem': return 60;
      case 'nullShade': return 40;
      default: return 30;
    }
  }

  getDamage() {
    switch (this.type) {
      case 'forkling': return 15;
      case 'coinGolem': return 25;
      case 'nullShade': return 20;
      default: return 15;
    }
  }

  update(deltaTime, player) {
    if (this.isDead) return;
    
    this.target = player;
    this.updateAI(deltaTime);
    this.updatePhysics(deltaTime);
    this.updateAnimation(deltaTime);
    this.updateCooldowns(deltaTime);
  }

  updateAI(deltaTime) {
    if (!this.target) return;
    
    const distance = this.getDistanceToTarget();
    
    if (distance <= this.aggroRange) {
      // Move towards player
      const direction = this.target.x > this.x ? 1 : -1;
      this.velocityX = direction * this.speed;
      this.facingRight = direction > 0;
      
      // Attack if in range
      if (distance <= this.attackRange && this.attackCooldown <= 0) {
        this.attack();
      }
    } else {
      // Idle behavior
      this.velocityX = 0;
    }
  }

  updatePhysics(deltaTime) {
    // Apply gravity
    if (!this.onGround) {
      this.velocityY += this.gravity * deltaTime;
    }
    
    // Update position
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
  }

  updateAnimation(deltaTime) {
    this.animationTimer += deltaTime;
    if (this.animationTimer >= this.animationSpeed) {
      this.animationTimer = 0;
      this.animationFrame = (this.animationFrame + 1) % 4; // Simple 4-frame animation
    }
  }

  updateCooldowns(deltaTime) {
    this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);
  }

  attack() {
    this.isAttacking = true;
    this.attackCooldown = this.attackCooldownTime;
    
    // Create attack effect
    this.particleSystem.createEnemyAttackEffect(this.x, this.y, this.facingRight);
    
    // Reset attacking state after a short time
    setTimeout(() => {
      this.isAttacking = false;
    }, 0.5);
  }

  takeDamage(damage) {
    this.health = Math.max(0, this.health - damage);
    
    // Create damage effect
    this.particleSystem.createDamageEffect(this.x + this.width / 2, this.y);
    
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.particleSystem.createDeathEffect(this.x, this.y);
  }

  getDistanceToTarget() {
    if (!this.target) return Infinity;
    
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  render(ctx) {
    if (this.isDead) return;
    
    // Get sprite based on type
    const sprite = this.getSprite();
    if (!sprite) return;
    
    // Apply damage flash
    if (this.health < this.maxHealth * 0.5) {
      ctx.save();
      ctx.globalAlpha = 0.7;
    }
    
    // Flip sprite if facing left
    ctx.save();
    if (!this.facingRight) {
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, -(this.x + this.width), this.y, this.width, this.height);
    } else {
      ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
    }
    ctx.restore();
    
    if (this.health < this.maxHealth * 0.5) {
      ctx.restore();
    }
    
    // Render health bar
    this.renderHealthBar(ctx);
  }

  getSprite() {
    const monsterSprites = this.spriteLoader.getSprites('monsters');
    const spriteKeys = Object.keys(monsterSprites);
    
    if (spriteKeys.length === 0) {
      // Create placeholder sprite
      return this.createPlaceholderSprite();
    }
    
    // Use different sprites for different enemy types
    const spriteIndex = this.type === 'forkling' ? 0 : 
                      this.type === 'coinGolem' ? 1 : 2;
    
    return monsterSprites[spriteKeys[spriteIndex % spriteKeys.length]];
  }

  createPlaceholderSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    
    // Create colored rectangle based on enemy type
    let color = '#ff4444';
    if (this.type === 'coinGolem') color = '#ffd700';
    if (this.type === 'nullShade') color = '#4444ff';
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.type.charAt(0).toUpperCase(), this.width/2, this.height/2);
    
    return canvas;
  }

  renderHealthBar(ctx) {
    if (this.health >= this.maxHealth) return;
    
    const barWidth = this.width;
    const barHeight = 4;
    const barX = this.x;
    const barY = this.y - 8;
    
    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health
    const healthPercentage = this.health / this.maxHealth;
    ctx.fillStyle = healthPercentage > 0.5 ? '#4ade80' : '#f87171';
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
  }
}
