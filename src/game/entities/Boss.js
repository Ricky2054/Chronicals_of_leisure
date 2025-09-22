export class Boss {
  constructor(type, x, y, spriteLoader, particleSystem) {
    this.type = type;
    this.spriteLoader = spriteLoader;
    this.particleSystem = particleSystem;
    
    // Position and movement
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 30;
    this.gravity = 800;
    this.onGround = false;
    
    // Stats
    this.health = this.getMaxHealth();
    this.maxHealth = this.getMaxHealth();
    this.damage = this.getDamage();
    this.attackCooldown = 0;
    this.attackRange = 80;
    
    // State
    this.isDead = false;
    this.isAttacking = false;
    this.facingRight = true;
    this.target = null;
    this.aggroRange = 300;
    this.attackCooldownTime = 3;
    this.phase = 1;
    this.phaseThreshold = 0.5; // Switch phase at 50% health
    
    // Special abilities
    this.specialCooldown = 0;
    this.specialCooldownTime = 10;
    
    // Animation
    this.animationTimer = 0;
    this.animationFrame = 0;
    this.animationSpeed = 0.15;
    
    this.initializeStats();
  }

  initializeStats() {
    switch (this.type) {
      case 'vulkran':
        this.health = 200;
        this.maxHealth = 200;
        this.damage = 40;
        this.speed = 40;
        this.aggroRange = 250;
        break;
      case 'aurios':
        this.health = 250;
        this.maxHealth = 250;
        this.damage = 35;
        this.speed = 50;
        this.aggroRange = 300;
        break;
      case 'fracturedPhantom':
        this.health = 300;
        this.maxHealth = 300;
        this.damage = 45;
        this.speed = 60;
        this.aggroRange = 350;
        break;
    }
  }

  getMaxHealth() {
    switch (this.type) {
      case 'vulkran': return 200;
      case 'aurios': return 250;
      case 'fracturedPhantom': return 300;
      default: return 200;
    }
  }

  getDamage() {
    switch (this.type) {
      case 'vulkran': return 40;
      case 'aurios': return 35;
      case 'fracturedPhantom': return 45;
      default: return 40;
    }
  }

  update(deltaTime, player) {
    if (this.isDead) return;
    
    this.target = player;
    this.updatePhase();
    this.updateAI(deltaTime);
    this.updatePhysics(deltaTime);
    this.updateAnimation(deltaTime);
    this.updateCooldowns(deltaTime);
  }

  updatePhase() {
    const healthPercentage = this.health / this.maxHealth;
    if (healthPercentage <= this.phaseThreshold && this.phase === 1) {
      this.phase = 2;
      this.triggerPhaseChange();
    }
  }

  triggerPhaseChange() {
    // Boss becomes more aggressive in phase 2
    this.speed *= 1.5;
    this.attackCooldownTime *= 0.7;
    this.specialCooldownTime *= 0.8;
    
    // Create phase change effect
    this.particleSystem.createBossPhaseEffect(this.x, this.y);
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
      
      // Use special ability
      if (this.specialCooldown <= 0) {
        this.useSpecialAbility();
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
      this.animationFrame = (this.animationFrame + 1) % 6; // 6-frame animation for bosses
    }
  }

  updateCooldowns(deltaTime) {
    this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);
    this.specialCooldown = Math.max(0, this.specialCooldown - deltaTime);
  }

  attack() {
    this.isAttacking = true;
    this.attackCooldown = this.attackCooldownTime;
    
    // Create attack effect based on boss type
    this.createBossAttackEffect();
    
    // Reset attacking state after a short time
    setTimeout(() => {
      this.isAttacking = false;
    }, 0.8);
  }

  createBossAttackEffect() {
    switch (this.type) {
      case 'vulkran':
        // Fire attack
        this.particleSystem.createFireEffect(this.x, this.y, this.facingRight);
        break;
      case 'aurios':
        // Coin attack
        this.particleSystem.createCoinEffect(this.x, this.y);
        break;
      case 'fracturedPhantom':
        // Glitch attack
        this.particleSystem.createGlitchEffect(this.x, this.y);
        break;
    }
  }

  useSpecialAbility() {
    this.specialCooldown = this.specialCooldownTime;
    
    switch (this.type) {
      case 'vulkran':
        this.lavaBurst();
        break;
      case 'aurios':
        this.goldenBarrage();
        break;
      case 'fracturedPhantom':
        this.voidRift();
        break;
    }
  }

  lavaBurst() {
    // Create multiple fire projectiles
    for (let i = 0; i < 5; i++) {
      const angle = (i - 2) * 0.5;
      this.particleSystem.createProjectile(
        this.x + this.width / 2,
        this.y + this.height / 2,
        Math.cos(angle) * 200,
        Math.sin(angle) * 200,
        'fire'
      );
    }
  }

  goldenBarrage() {
    // Create coin projectiles in all directions
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      this.particleSystem.createProjectile(
        this.x + this.width / 2,
        this.y + this.height / 2,
        Math.cos(angle) * 150,
        Math.sin(angle) * 150,
        'coin'
      );
    }
  }

  voidRift() {
    // Create void portals around the boss
    this.particleSystem.createVoidRift(this.x, this.y);
  }

  takeDamage(damage) {
    this.health = Math.max(0, this.health - damage);
    
    // Create damage effect
    this.particleSystem.createBossDamageEffect(this.x + this.width / 2, this.y);
    
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.particleSystem.createBossDeathEffect(this.x, this.y);
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
    
    // Apply phase-based effects
    if (this.phase === 2) {
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.filter = 'hue-rotate(180deg) saturate(1.5)';
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
    
    if (this.phase === 2) {
      ctx.restore();
    }
    
    // Render health bar
    this.renderHealthBar(ctx);
    
    // Render phase indicator
    this.renderPhaseIndicator(ctx);
  }

  getSprite() {
    const monsterSprites = this.spriteLoader.getSprites('monsters');
    const spriteKeys = Object.keys(monsterSprites);
    
    if (spriteKeys.length === 0) {
      return this.createPlaceholderSprite();
    }
    
    // Use different sprites for different boss types
    const spriteIndex = this.type === 'vulkran' ? 0 : 
                      this.type === 'aurios' ? 1 : 2;
    
    return monsterSprites[spriteKeys[spriteIndex % spriteKeys.length]];
  }

  createPlaceholderSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    
    // Create colored rectangle based on boss type
    let color = '#ff4444';
    if (this.type === 'aurios') color = '#ffd700';
    if (this.type === 'fracturedPhantom') color = '#4444ff';
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.type.toUpperCase(), this.width/2, this.height/2);
    
    return canvas;
  }

  renderHealthBar(ctx) {
    const barWidth = this.width * 1.5;
    const barHeight = 8;
    const barX = this.x - (barWidth - this.width) / 2;
    const barY = this.y - 20;
    
    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health
    const healthPercentage = this.health / this.maxHealth;
    const color = healthPercentage > 0.6 ? '#4ade80' : 
                 healthPercentage > 0.3 ? '#fbbf24' : '#f87171';
    ctx.fillStyle = color;
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
    
    // Border
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }

  renderPhaseIndicator(ctx) {
    if (this.phase === 2) {
      ctx.fillStyle = '#ff6b6b';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ENRAGED', this.x + this.width / 2, this.y - 30);
    }
  }
}
