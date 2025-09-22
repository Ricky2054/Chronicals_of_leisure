class BossManager {
  constructor() {
    this.bosses = [];
    this.currentBossIndex = 0;
    this.bossDefeated = false;
    this.activeBoss = null;
  }

  createBosses() {
    this.bosses = [
      {
        id: 'dragon_lord',
        name: 'Dragon Lord',
        type: 'dragon',
        level: 1,
        x: 500,
        y: 200,
        width: 100,
        height: 100,
        health: 500,
        maxHealth: 500,
        attackDamage: 40,
        speed: 150,
        attackRange: 120,
        projectileRange: 300,
        attackCooldown: 0,
        projectileCooldown: 0,
        isDead: false,
        facingRight: true,
        isAttacking: false,
        // Boss-specific properties
        phase: 1, // 1, 2, 3 for different phases
        specialAttackCooldown: 0,
        summonCooldown: 0,
        // Visual properties
        color: '#8B0000',
        glowColor: '#FF4500',
        scale: 1.5,
        spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0056-900920138.png'
      },
      {
        id: 'lich_king',
        name: 'Lich King',
        type: 'lich',
        level: 2,
        x: 500,
        y: 200,
        width: 110,
        height: 110,
        health: 600,
        maxHealth: 600,
        attackDamage: 45,
        speed: 90,
        attackRange: 130,
        projectileRange: 280,
        attackCooldown: 0,
        projectileCooldown: 0,
        isDead: false,
        facingRight: true,
        isAttacking: false,
        // Boss-specific properties
        phase: 1,
        specialAttackCooldown: 0,
        summonCooldown: 0,
        // Visual properties
        color: '#4B0082',
        glowColor: '#8A2BE2',
        scale: 1.7,
        spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0064-4100537310.png'
      },
      {
        id: 'demon_prince',
        name: 'Demon Prince',
        type: 'demon',
        level: 3,
        x: 500,
        y: 200,
        width: 120,
        height: 120,
        health: 700,
        maxHealth: 700,
        attackDamage: 50,
        speed: 110,
        attackRange: 140,
        projectileRange: 320,
        attackCooldown: 0,
        projectileCooldown: 0,
        isDead: false,
        facingRight: true,
        isAttacking: false,
        // Boss-specific properties
        phase: 1,
        specialAttackCooldown: 0,
        summonCooldown: 0,
        // Visual properties
        color: '#DC143C',
        glowColor: '#FF0000',
        scale: 1.8,
        spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0063-4100537309.png'
      }
    ];
  }

  spawnBossForLevel(level) {
    const boss = this.bosses.find(b => b.level === level);
    if (boss) {
      this.activeBoss = { ...boss };
      this.activeBoss.isDead = false;
      this.activeBoss.health = this.activeBoss.maxHealth;
      console.log(`🐉 Spawning ${this.activeBoss.name} for Level ${level}`);
      return this.activeBoss;
    }
    return null;
  }

  getActiveBoss() {
    return this.activeBoss;
  }

  defeatBoss() {
    if (this.activeBoss) {
      this.activeBoss.isDead = true;
      console.log(`💀 ${this.activeBoss.name} defeated!`);
      this.activeBoss = null;
    }
  }

  getCurrentBoss() {
    if (this.currentBossIndex < this.bosses.length) {
      return this.bosses[this.currentBossIndex];
    }
    return null;
  }

  getBossProjectileType(boss) {
    const projectileTypes = {
      'dragon': 'fireball',
      'lich': 'dark_energy',
      'demon': 'lightning'
    };
    return projectileTypes[boss.type] || 'fireball';
  }

  updateBoss(boss, player, deltaTime, projectileManager) {
    if (boss.isDead) return;

    const distance = Math.sqrt((player.x - boss.x) ** 2 + (player.y - boss.y) ** 2);
    
    // Update cooldowns
    boss.attackCooldown = Math.max(0, boss.attackCooldown - deltaTime);
    boss.projectileCooldown = Math.max(0, boss.projectileCooldown - deltaTime);
    boss.specialAttackCooldown = Math.max(0, boss.specialAttackCooldown - deltaTime);
    boss.summonCooldown = Math.max(0, boss.summonCooldown - deltaTime);

    // Phase transitions based on health
    const healthPercentage = boss.health / boss.maxHealth;
    if (healthPercentage > 0.66) {
      boss.phase = 1;
    } else if (healthPercentage > 0.33) {
      boss.phase = 2;
    } else {
      boss.phase = 3;
    }

    // AI behavior based on phase
    if (boss.phase === 1) {
      this.updatePhase1(boss, player, distance, deltaTime, projectileManager);
    } else if (boss.phase === 2) {
      this.updatePhase2(boss, player, distance, deltaTime, projectileManager);
    } else {
      this.updatePhase3(boss, player, distance, deltaTime, projectileManager);
    }

    // Face the player
    boss.facingRight = player.x > boss.x;
  }

  updatePhase1(boss, player, distance, deltaTime, projectileManager) {
    // Phase 1: Basic attacks and movement
    if (distance > boss.attackRange) {
      // Move towards player
      const dx = player.x - boss.x;
      const dy = player.y - boss.y;
      const moveDistance = boss.speed * deltaTime;
      
      const oldX = boss.x;
      const oldY = boss.y;
      
      boss.x += (dx / distance) * moveDistance;
      boss.y += (dy / distance) * moveDistance;
      
      // Debug boss movement
      if (Math.random() < 0.01) {
        console.log(`🐉 Boss ${boss.name} moving: (${oldX.toFixed(1)}, ${oldY.toFixed(1)}) -> (${boss.x.toFixed(1)}, ${boss.y.toFixed(1)})`);
        console.log(`🐉 Distance to player: ${distance.toFixed(1)}, Attack range: ${boss.attackRange}, Speed: ${boss.speed}`);
      }
    }

    // Basic melee attack
    if (distance <= boss.attackRange && boss.attackCooldown <= 0) {
      boss.isAttacking = true;
      console.log(`🐉 Boss ${boss.name} melee attack! Distance: ${distance.toFixed(1)}`);
      boss.attackCooldown = 2.0; // 2 second cooldown
    } else {
      boss.isAttacking = false;
    }

    // Basic projectile attack
    if (distance < boss.projectileRange && boss.projectileCooldown <= 0) {
      const projectileType = this.getBossProjectileType(boss);
      projectileManager.createProjectile(
        projectileType,
        boss.x + boss.width / 2,
        boss.y + boss.height / 2,
        player.x + player.width / 2,
        player.y + player.height / 2,
        boss.attackDamage,
        150,
        'enemy'
      );
      boss.projectileCooldown = 2.0;
    }
  }

  updatePhase2(boss, player, distance, deltaTime, projectileManager) {
    // Phase 2: Faster attacks and special abilities
    if (distance > boss.attackRange) {
      const dx = player.x - boss.x;
      const dy = player.y - boss.y;
      const moveDistance = boss.speed * 1.2 * deltaTime; // 20% faster
      
      boss.x += (dx / distance) * moveDistance;
      boss.y += (dy / distance) * moveDistance;
    }

    // Faster melee attack
    if (distance <= boss.attackRange && boss.attackCooldown <= 0) {
      boss.isAttacking = true;
      console.log(`🐉 Boss ${boss.name} phase 2 melee attack! Distance: ${distance.toFixed(1)}`);
      boss.attackCooldown = 1.5; // Faster cooldown in phase 2
    } else {
      boss.isAttacking = false;
    }

    // Faster projectile attacks
    if (distance < boss.projectileRange && boss.projectileCooldown <= 0) {
      const projectileType = this.getBossProjectileType(boss);
      projectileManager.createProjectile(
        projectileType,
        boss.x + boss.width / 2,
        boss.y + boss.height / 2,
        player.x + player.width / 2,
        player.y + player.height / 2,
        boss.attackDamage * 1.2,
        200,
        'enemy'
      );
      boss.projectileCooldown = 1.5;
    }

    // Special attack
    if (boss.specialAttackCooldown <= 0) {
      this.performSpecialAttack(boss, player, projectileManager);
      boss.specialAttackCooldown = 8.0;
    }
  }

  updatePhase3(boss, player, distance, deltaTime, projectileManager) {
    // Phase 3: Desperate attacks and maximum aggression
    if (distance > boss.attackRange) {
      const dx = player.x - boss.x;
      const dy = player.y - boss.y;
      const moveDistance = boss.speed * 1.5 * deltaTime; // 50% faster
      
      boss.x += (dx / distance) * moveDistance;
      boss.y += (dy / distance) * moveDistance;
    }

    // Desperate melee attack
    if (distance <= boss.attackRange && boss.attackCooldown <= 0) {
      boss.isAttacking = true;
      console.log(`🐉 Boss ${boss.name} phase 3 desperate melee attack! Distance: ${distance.toFixed(1)}`);
      boss.attackCooldown = 1.0; // Very fast cooldown in phase 3
    } else {
      boss.isAttacking = false;
    }

    // Rapid fire projectiles
    if (distance < boss.projectileRange && boss.projectileCooldown <= 0) {
      const projectileType = this.getBossProjectileType(boss);
      
      // Triple shot
      for (let i = -1; i <= 1; i++) {
        const angle = Math.atan2(player.y - boss.y, player.x - boss.x) + (i * 0.3);
        const targetX = boss.x + Math.cos(angle) * 200;
        const targetY = boss.y + Math.sin(angle) * 200;
        
        projectileManager.createProjectile(
          projectileType,
          boss.x + boss.width / 2,
          boss.y + boss.height / 2,
          targetX,
          targetY,
          boss.attackDamage * 1.5,
          250,
          'enemy'
        );
      }
      boss.projectileCooldown = 1.0;
    }

    // Frequent special attacks
    if (boss.specialAttackCooldown <= 0) {
      this.performSpecialAttack(boss, player, projectileManager);
      boss.specialAttackCooldown = 5.0;
    }
  }

  performSpecialAttack(boss, player, projectileManager) {
    const projectileType = this.getBossProjectileType(boss);
    
    switch (boss.type) {
      case 'dragon':
        // Dragon breath - wide spread
        for (let i = 0; i < 5; i++) {
          const angle = Math.atan2(player.y - boss.y, player.x - boss.x) + ((i - 2) * 0.4);
          const targetX = boss.x + Math.cos(angle) * 300;
          const targetY = boss.y + Math.sin(angle) * 300;
          
          projectileManager.createProjectile(
            'fireball',
            boss.x + boss.width / 2,
            boss.y + boss.height / 2,
            targetX,
            targetY,
            boss.attackDamage * 1.8,
            180,
            'enemy'
          );
        }
        break;
        
      case 'lich':
        // Dark energy burst
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const targetX = boss.x + Math.cos(angle) * 200;
          const targetY = boss.y + Math.sin(angle) * 200;
          
          projectileManager.createProjectile(
            'dark_energy',
            boss.x + boss.width / 2,
            boss.y + boss.height / 2,
            targetX,
            targetY,
            boss.attackDamage * 1.6,
            160,
            'enemy'
          );
        }
        break;
        
      case 'demon':
        // Lightning storm
        for (let i = 0; i < 6; i++) {
          const angle = Math.atan2(player.y - boss.y, player.x - boss.x) + ((i - 2.5) * 0.2);
          const targetX = boss.x + Math.cos(angle) * 250;
          const targetY = boss.y + Math.sin(angle) * 250;
          
          projectileManager.createProjectile(
            'lightning',
            boss.x + boss.width / 2,
            boss.y + boss.height / 2,
            targetX,
            targetY,
            boss.attackDamage * 1.7,
            220,
            'enemy'
          );
        }
        break;
    }
  }

  drawBoss(ctx, boss, animationTime) {
    if (boss.isDead) return;

    ctx.save();
    
    // Apply boss scale
    ctx.translate(boss.x + boss.width / 2, boss.y + boss.height / 2);
    ctx.scale(boss.scale, boss.scale);
    ctx.translate(-boss.width / 2, -boss.height / 2);
    
    // Add glow effect
    ctx.shadowColor = boss.glowColor;
    ctx.shadowBlur = 25;
    
    // Try to draw sprite first, fallback to custom drawing
    if (boss.spritePath) {
      this.drawBossSprite(ctx, boss, animationTime);
    } else {
      // Draw boss based on type
      switch (boss.type) {
        case 'dragon':
          this.drawDragon(ctx, boss, animationTime);
          break;
        case 'lich':
          this.drawLich(ctx, boss, animationTime);
          break;
        case 'demon':
          this.drawDemon(ctx, boss, animationTime);
          break;
        default:
          this.drawDefaultBoss(ctx, boss, animationTime);
      }
    }
    
    // Draw health bar
    this.drawBossHealthBar(ctx, boss);
    
    ctx.restore();
  }

  drawBossSprite(ctx, boss, animationTime) {
    // Create image element if not exists
    if (!boss.spriteImage) {
      boss.spriteImage = new Image();
      boss.spriteImage.src = boss.spritePath;
      boss.spriteImage.onerror = () => {
        console.log(`Failed to load boss sprite: ${boss.spritePath}`);
        boss.spriteImage = null;
      };
    }

    if (boss.spriteImage && boss.spriteImage.complete && boss.spriteImage.naturalWidth > 0) {
      // Draw sprite
      ctx.imageRendering = 'pixelated';
      ctx.drawImage(boss.spriteImage, 0, 0, boss.width, boss.height);
    } else {
      // Fallback to custom drawing
      this.drawDefaultBoss(ctx, boss, animationTime);
    }
  }

  drawDragon(ctx, boss, animationTime) {
    const width = boss.width;
    const height = boss.height;
    
    // Dragon body
    ctx.fillStyle = boss.color;
    ctx.fillRect(20, 30, 60, 50);
    
    // Dragon head
    ctx.fillRect(10, 20, 40, 30);
    
    // Dragon wings
    ctx.fillStyle = '#654321';
    ctx.fillRect(5, 25, 25, 15);
    ctx.fillRect(70, 25, 25, 15);
    
    // Dragon tail
    ctx.fillStyle = boss.color;
    ctx.fillRect(75, 40, 20, 10);
    
    // Dragon eyes
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(15, 25, 4, 4);
    ctx.fillRect(25, 25, 4, 4);
    
    // Fire breath effect when attacking
    if (boss.isAttacking) {
      ctx.fillStyle = '#FF4500';
      ctx.fillRect(0, 30, 15, 8);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(2, 32, 8, 4);
    }
  }

  drawLich(ctx, boss, animationTime) {
    const width = boss.width;
    const height = boss.height;
    
    // Lich robe
    ctx.fillStyle = boss.color;
    ctx.fillRect(20, 40, 60, 50);
    
    // Lich skull
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(30, 20, 40, 30);
    
    // Eye sockets
    ctx.fillStyle = '#8A2BE2';
    ctx.fillRect(35, 25, 6, 6);
    ctx.fillRect(55, 25, 6, 6);
    
    // Crown
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(25, 15, 50, 10);
    
    // Staff
    ctx.fillStyle = '#654321';
    ctx.fillRect(5, 30, 8, 40);
    ctx.fillStyle = '#8A2BE2';
    ctx.fillRect(3, 25, 12, 8);
    
    // Dark energy aura
    if (boss.isAttacking) {
      ctx.strokeStyle = '#8A2BE2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(50, 50, 30, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawDemon(ctx, boss, animationTime) {
    const width = boss.width;
    const height = boss.height;
    
    // Demon body
    ctx.fillStyle = boss.color;
    ctx.fillRect(25, 35, 50, 45);
    
    // Demon head
    ctx.fillRect(30, 20, 40, 25);
    
    // Demon horns
    ctx.fillStyle = '#000000';
    ctx.fillRect(35, 15, 6, 10);
    ctx.fillRect(55, 15, 6, 10);
    
    // Demon eyes
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(35, 25, 4, 4);
    ctx.fillRect(55, 25, 4, 4);
    
    // Demon wings
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(10, 30, 20, 25);
    ctx.fillRect(70, 30, 20, 25);
    
    // Demon tail
    ctx.fillStyle = boss.color;
    ctx.fillRect(60, 60, 15, 8);
    
    // Lightning effect when attacking
    if (boss.isAttacking) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 20);
      ctx.lineTo(30, 40);
      ctx.moveTo(50, 20);
      ctx.lineTo(70, 40);
      ctx.stroke();
    }
  }

  drawDefaultBoss(ctx, boss, animationTime) {
    const width = boss.width;
    const height = boss.height;
    
    // Default boss shape
    ctx.fillStyle = boss.color;
    ctx.fillRect(10, 10, width - 20, height - 20);
    
    // Boss eyes
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(20, 20, 8, 8);
    ctx.fillRect(width - 28, 20, 8, 8);
  }

  drawBossHealthBar(ctx, boss) {
    const barWidth = 100;
    const barHeight = 8;
    const barX = -barWidth / 2;
    const barY = -20;
    
    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health
    const healthPercentage = boss.health / boss.maxHealth;
    const healthColor = healthPercentage > 0.5 ? '#4CAF50' : 
                       healthPercentage > 0.25 ? '#FF9800' : '#F44336';
    
    ctx.fillStyle = healthColor;
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
    
    // Border
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Boss name
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(boss.name, 0, barY - 5);
  }

  getBosses() {
    return this.bosses;
  }

  isAllBossesDefeated() {
    return this.bosses.every(boss => boss.isDead);
  }

  getNextBoss() {
    this.currentBossIndex++;
    return this.getCurrentBoss();
  }
}

export default BossManager;
