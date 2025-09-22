import { Animation } from '../utils/Animation';

export class Player {
  constructor(spriteLoader, particleSystem, audioManager) {
    this.spriteLoader = spriteLoader;
    this.particleSystem = particleSystem;
    this.audioManager = audioManager;
    
    // Position and movement
    this.x = 100;
    this.y = 400;
    this.width = 32;
    this.height = 32;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 200;
    this.jumpPower = 400;
    this.gravity = 800;
    this.onGround = false;
    
    // Health and mana
    this.health = 100;
    this.maxHealth = 100;
    this.mana = 50;
    this.maxMana = 50;
    this.manaRegen = 10; // per second
    
    // Combat
    this.attackCooldown = 0;
    this.heavyAttackCooldown = 0;
    this.shieldCooldown = 0;
    this.dashCooldown = 0;
    this.invulnerable = 0;
    this.invulnerabilityTime = 1; // seconds
    
    // State
    this.facingRight = true;
    this.isAttacking = false;
    this.isShielding = false;
    this.isDashing = false;
    this.isDead = false;
    
    // Animations
    this.animations = {};
    this.currentAnimation = 'idle';
    this.animationFrame = 0;
    this.animationTimer = 0;
    
    // Event callbacks
    this.onHealthChange = null;
    this.onManaChange = null;
    this.onScoreChange = null;
    this.onDeath = null;
    
    this.initializeAnimations();
  }

  initializeAnimations() {
    // Load knight sprites
    const knightSprites = this.spriteLoader.getSprites('knight');
    
    this.animations = {
      idle: new Animation(knightSprites.idle || [], 0.2, true),
      run: new Animation(knightSprites.run || [], 0.1, true),
      attack: new Animation(knightSprites.attack || [], 0.15, false),
      heavyAttack: new Animation(knightSprites.attack || [], 0.2, false),
      jump: new Animation(knightSprites.jump || [], 0.2, false),
      fall: new Animation(knightSprites.jump || [], 0.2, false),
      shield: new Animation(knightSprites.shield || [], 0.1, true),
      death: new Animation(knightSprites.death || [], 0.3, false),
      roll: new Animation(knightSprites.roll || [], 0.1, false)
    };
  }

  update(deltaTime, inputManager) {
    if (this.isDead) return;
    
    // Update cooldowns
    this.updateCooldowns(deltaTime);
    
    // Handle input
    this.handleInput(deltaTime, inputManager);
    
    // Apply physics
    this.updatePhysics(deltaTime);
    
    // Update animations
    this.updateAnimations(deltaTime);
    
    // Regenerate mana
    if (this.mana < this.maxMana) {
      this.mana = Math.min(this.maxMana, this.mana + this.manaRegen * deltaTime);
      if (this.onManaChange) {
        this.onManaChange(this.mana, this.maxMana);
      }
    }
  }

  updateCooldowns(deltaTime) {
    this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);
    this.heavyAttackCooldown = Math.max(0, this.heavyAttackCooldown - deltaTime);
    this.shieldCooldown = Math.max(0, this.shieldCooldown - deltaTime);
    this.dashCooldown = Math.max(0, this.dashCooldown - deltaTime);
    this.invulnerable = Math.max(0, this.invulnerable - deltaTime);
  }

  handleInput(deltaTime, inputManager) {
    if (this.isAttacking || this.isDashing) return;
    
    // Movement
    let moveX = 0;
    if (inputManager.isKeyPressed('ArrowLeft') || inputManager.isKeyPressed('KeyA')) {
      moveX = -1;
      this.facingRight = false;
    }
    if (inputManager.isKeyPressed('ArrowRight') || inputManager.isKeyPressed('KeyD')) {
      moveX = 1;
      this.facingRight = true;
    }
    
    this.velocityX = moveX * this.speed;
    
    // Jumping
    if ((inputManager.isKeyPressed('Space') || inputManager.isKeyPressed('KeyW')) && this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
      this.setAnimation('jump');
      this.audioManager.playSound('jump');
    }
    
    // Attacks
    if (inputManager.isKeyPressed('KeyJ') && this.attackCooldown <= 0) {
      this.lightAttack();
    }
    
    if (inputManager.isKeyPressed('KeyK') && this.heavyAttackCooldown <= 0 && this.mana >= 10) {
      this.heavyAttack();
    }
    
    // Shield
    if (inputManager.isKeyPressed('KeyL') && this.shieldCooldown <= 0) {
      this.shield();
    }
    
    // Dash
    if (inputManager.isKeyPressed('Shift') && this.dashCooldown <= 0 && this.mana >= 5) {
      this.dash();
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
    
    // Update animation based on state
    if (this.onGround) {
      if (Math.abs(this.velocityX) > 0) {
        this.setAnimation('run');
      } else if (!this.isAttacking && !this.isShielding) {
        this.setAnimation('idle');
      }
    } else {
      if (this.velocityY < 0) {
        this.setAnimation('jump');
      } else {
        this.setAnimation('fall');
      }
    }
  }

  updateAnimations(deltaTime) {
    const animation = this.animations[this.currentAnimation];
    if (animation) {
      animation.update(deltaTime);
      
      // Handle animation end
      if (animation.isFinished()) {
        if (this.currentAnimation === 'attack' || this.currentAnimation === 'heavyAttack') {
          this.isAttacking = false;
        } else if (this.currentAnimation === 'roll') {
          this.isDashing = false;
        } else if (this.currentAnimation === 'death') {
          if (this.onDeath) {
            this.onDeath();
          }
        }
      }
    }
  }

  lightAttack() {
    this.isAttacking = true;
    this.attackCooldown = 0.5;
    this.setAnimation('attack');
    this.audioManager.playSound('attack');
    
    // Create attack effect
    this.particleSystem.createSlashEffect(
      this.x + (this.facingRight ? this.width : 0),
      this.y + this.height / 2,
      this.facingRight
    );
  }

  heavyAttack() {
    this.isAttacking = true;
    this.heavyAttackCooldown = 1.0;
    this.mana -= 10;
    this.setAnimation('heavyAttack');
    this.audioManager.playSound('heavyAttack');
    
    if (this.onManaChange) {
      this.onManaChange(this.mana, this.maxMana);
    }
    
    // Create heavy attack effect
    this.particleSystem.createHeavySlashEffect(
      this.x + (this.facingRight ? this.width : 0),
      this.y + this.height / 2,
      this.facingRight
    );
  }

  shield() {
    this.isShielding = true;
    this.shieldCooldown = 2.0;
    this.setAnimation('shield');
    this.audioManager.playSound('shield');
  }

  dash() {
    this.isDashing = true;
    this.dashCooldown = 1.5;
    this.mana -= 5;
    this.setAnimation('roll');
    this.audioManager.playSound('dash');
    
    // Dash movement
    const dashDistance = 100;
    this.x += this.facingRight ? dashDistance : -dashDistance;
    
    if (this.onManaChange) {
      this.onManaChange(this.mana, this.maxMana);
    }
    
    // Create dash effect
    this.particleSystem.createDashEffect(this.x, this.y);
  }

  takeDamage(damage) {
    if (this.invulnerable > 0 || this.isShielding) return;
    
    this.health = Math.max(0, this.health - damage);
    this.invulnerable = this.invulnerabilityTime;
    
    if (this.onHealthChange) {
      this.onHealthChange(this.health, this.maxHealth);
    }
    
    this.audioManager.playSound('hurt');
    
    // Create damage effect
    this.particleSystem.createDamageEffect(this.x + this.width / 2, this.y);
    
    if (this.health <= 0) {
      this.die();
    }
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    if (this.onHealthChange) {
      this.onHealthChange(this.health, this.maxHealth);
    }
  }

  die() {
    this.isDead = true;
    this.setAnimation('death');
    this.audioManager.playSound('death');
  }

  setAnimation(animationName) {
    if (this.currentAnimation !== animationName) {
      this.currentAnimation = animationName;
      const animation = this.animations[animationName];
      if (animation) {
        animation.reset();
      }
    }
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  getAttackBounds() {
    if (!this.isAttacking) return null;
    
    const attackWidth = this.currentAnimation === 'heavyAttack' ? 60 : 40;
    const attackX = this.facingRight ? this.x + this.width : this.x - attackWidth;
    
    return {
      x: attackX,
      y: this.y,
      width: attackWidth,
      height: this.height
    };
  }

  render(ctx) {
    if (this.isDead && this.currentAnimation === 'death' && this.animations.death && this.animations.death.isFinished()) {
      return;
    }
    
    const animation = this.animations[this.currentAnimation];
    if (!animation) {
      // Fallback: draw simple rectangle
      this.renderFallback(ctx);
      return;
    }
    
    const frame = animation.getCurrentFrame();
    if (!frame) {
      // Fallback: draw simple rectangle
      this.renderFallback(ctx);
      return;
    }
    
    // Apply invulnerability flash
    if (this.invulnerable > 0) {
      ctx.save();
      ctx.globalAlpha = 0.5;
    }
    
    // Flip sprite if facing left
    ctx.save();
    if (!this.facingRight) {
      ctx.scale(-1, 1);
      ctx.drawImage(frame, -(this.x + this.width), this.y, this.width, this.height);
    } else {
      ctx.drawImage(frame, this.x, this.y, this.width, this.height);
    }
    ctx.restore();
    
    if (this.invulnerable > 0) {
      ctx.restore();
    }
  }

  renderFallback(ctx) {
    // Draw simple player representation
    ctx.fillStyle = this.isAttacking ? '#ff6b6b' : '#4a90e2';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw head
    ctx.fillStyle = '#fdbcb4';
    ctx.fillRect(this.x + 8, this.y + 4, 8, 8);
    
    // Draw sword if attacking
    if (this.isAttacking) {
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(this.x + (this.facingRight ? this.width : -8), this.y + 8, 8, 2);
    }
    
    // Draw shield if shielding
    if (this.isShielding) {
      ctx.fillStyle = '#34495e';
      ctx.fillRect(this.x + (this.facingRight ? -6 : this.width), this.y + 8, 6, 12);
    }
  }

  getAttackDamage() {
    return this.currentAnimation === 'heavyAttack' ? 30 : 15;
  }

  addScore(score) {
    if (this.onScoreChange) {
      this.onScoreChange(score);
    }
  }

  addCoins(coins) {
    // This would be handled by the game engine
    console.log(`Earned ${coins} coins`);
  }

  reset() {
    this.health = this.maxHealth;
    this.mana = this.maxMana;
    this.x = 100;
    this.y = 400;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isDead = false;
    this.isAttacking = false;
    this.isShielding = false;
    this.isDashing = false;
    this.invulnerable = 0;
    this.setAnimation('idle');
    
    if (this.onHealthChange) {
      this.onHealthChange(this.health, this.maxHealth);
    }
    if (this.onManaChange) {
      this.onManaChange(this.mana, this.maxMana);
    }
  }
}
