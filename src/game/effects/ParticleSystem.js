export class ParticleSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.particles = [];
    this.maxParticles = 200;
  }

  createSlashEffect(x, y, facingRight) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + (facingRight ? Math.random() * 20 : -Math.random() * 20),
        y: y + (Math.random() - 0.5) * 20,
        velocityX: (facingRight ? 1 : -1) * (100 + Math.random() * 100),
        velocityY: (Math.random() - 0.5) * 100,
        life: 0.3,
        maxLife: 0.3,
        size: 3 + Math.random() * 3,
        color: '#FFFFFF',
        type: 'slash'
      });
    }
  }

  createHeavySlashEffect(x, y, facingRight) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: x + (facingRight ? Math.random() * 30 : -Math.random() * 30),
        y: y + (Math.random() - 0.5) * 30,
        velocityX: (facingRight ? 1 : -1) * (150 + Math.random() * 150),
        velocityY: (Math.random() - 0.5) * 150,
        life: 0.5,
        maxLife: 0.5,
        size: 4 + Math.random() * 4,
        color: '#FFD700',
        type: 'heavySlash'
      });
    }
  }

  createDashEffect(x, y) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        velocityX: (Math.random() - 0.5) * 200,
        velocityY: (Math.random() - 0.5) * 200,
        life: 0.4,
        maxLife: 0.4,
        size: 2 + Math.random() * 2,
        color: '#00FFFF',
        type: 'dash'
      });
    }
  }

  createDamageEffect(x, y) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        velocityX: (Math.random() - 0.5) * 80,
        velocityY: -50 - Math.random() * 50,
        life: 0.6,
        maxLife: 0.6,
        size: 2 + Math.random() * 2,
        color: '#FF4444',
        type: 'damage'
      });
    }
  }

  createDeathEffect(x, y) {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        velocityX: (Math.random() - 0.5) * 150,
        velocityY: -100 - Math.random() * 100,
        life: 1.0,
        maxLife: 1.0,
        size: 3 + Math.random() * 3,
        color: '#666666',
        type: 'death'
      });
    }
  }

  createHitEffect(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        velocityX: (Math.random() - 0.5) * 60,
        velocityY: (Math.random() - 0.5) * 60,
        life: 0.2,
        maxLife: 0.2,
        size: 2 + Math.random() * 2,
        color: '#FFFF00',
        type: 'hit'
      });
    }
  }

  createEnemyAttackEffect(x, y, facingRight) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (facingRight ? Math.random() * 15 : -Math.random() * 15),
        y: y + (Math.random() - 0.5) * 15,
        velocityX: (facingRight ? 1 : -1) * (80 + Math.random() * 80),
        velocityY: (Math.random() - 0.5) * 80,
        life: 0.3,
        maxLife: 0.3,
        size: 2 + Math.random() * 2,
        color: '#FF6666',
        type: 'enemyAttack'
      });
    }
  }

  createBossDeathEffect(x, y) {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        velocityX: (Math.random() - 0.5) * 200,
        velocityY: -150 - Math.random() * 150,
        life: 2.0,
        maxLife: 2.0,
        size: 4 + Math.random() * 4,
        color: '#FFD700',
        type: 'bossDeath'
      });
    }
  }

  createBossDamageEffect(x, y) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 15,
        y: y + (Math.random() - 0.5) * 15,
        velocityX: (Math.random() - 0.5) * 100,
        velocityY: -80 - Math.random() * 80,
        life: 0.8,
        maxLife: 0.8,
        size: 3 + Math.random() * 3,
        color: '#FF4444',
        type: 'bossDamage'
      });
    }
  }

  createBossPhaseEffect(x, y) {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        velocityX: (Math.random() - 0.5) * 100,
        velocityY: (Math.random() - 0.5) * 100,
        life: 1.5,
        maxLife: 1.5,
        size: 5 + Math.random() * 5,
        color: '#FF6B6B',
        type: 'bossPhase'
      });
    }
  }

  createFireEffect(x, y, facingRight) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: x + (facingRight ? Math.random() * 25 : -Math.random() * 25),
        y: y + (Math.random() - 0.5) * 25,
        velocityX: (facingRight ? 1 : -1) * (120 + Math.random() * 120),
        velocityY: (Math.random() - 0.5) * 80,
        life: 0.8,
        maxLife: 0.8,
        size: 3 + Math.random() * 3,
        color: '#FF4444',
        type: 'fire'
      });
    }
  }

  createCoinEffect(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        velocityX: (Math.random() - 0.5) * 100,
        velocityY: -60 - Math.random() * 60,
        life: 1.0,
        maxLife: 1.0,
        size: 4 + Math.random() * 2,
        color: '#FFD700',
        type: 'coin'
      });
    }
  }

  createGlitchEffect(x, y) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        velocityX: (Math.random() - 0.5) * 120,
        velocityY: (Math.random() - 0.5) * 120,
        life: 0.6,
        maxLife: 0.6,
        size: 2 + Math.random() * 3,
        color: '#4444FF',
        type: 'glitch'
      });
    }
  }

  createProjectile(x, y, velocityX, velocityY, type) {
    this.particles.push({
      x: x,
      y: y,
      velocityX: velocityX,
      velocityY: velocityY,
      life: 2.0,
      maxLife: 2.0,
      size: 4,
      color: type === 'fire' ? '#FF4444' : '#FFD700',
      type: 'projectile'
    });
  }

  createVoidRift(x, y) {
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 80,
        y: y + (Math.random() - 0.5) * 80,
        velocityX: (Math.random() - 0.5) * 50,
        velocityY: (Math.random() - 0.5) * 50,
        life: 3.0,
        maxLife: 3.0,
        size: 6 + Math.random() * 4,
        color: '#4444FF',
        type: 'voidRift'
      });
    }
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update position
      particle.x += particle.velocityX * deltaTime;
      particle.y += particle.velocityY * deltaTime;
      
      // Apply gravity to some particles
      if (particle.type === 'damage' || particle.type === 'death' || particle.type === 'bossDeath') {
        particle.velocityY += 200 * deltaTime;
      }
      
      // Update life
      particle.life -= deltaTime;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
    
    // Limit particle count
    if (this.particles.length > this.maxParticles) {
      this.particles = this.particles.slice(-this.maxParticles);
    }
  }

  render() {
    for (const particle of this.particles) {
      const alpha = particle.life / particle.maxLife;
      const size = particle.size * alpha;
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;
      
      // Render different particle types
      switch (particle.type) {
        case 'slash':
        case 'heavySlash':
        case 'enemyAttack':
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        case 'dash':
          this.ctx.fillStyle = '#00FFFF';
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        case 'damage':
        case 'bossDamage':
          this.ctx.fillStyle = '#FF4444';
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        case 'death':
        case 'bossDeath':
          this.ctx.fillStyle = '#666666';
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        case 'hit':
          this.ctx.fillStyle = '#FFFF00';
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        case 'fire':
          this.ctx.fillStyle = '#FF4444';
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        case 'coin':
          this.ctx.fillStyle = '#FFD700';
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        case 'glitch':
        case 'voidRift':
          this.ctx.fillStyle = '#4444FF';
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        case 'projectile':
          this.ctx.fillStyle = particle.color;
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        case 'bossPhase':
          this.ctx.fillStyle = '#FF6B6B';
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
          break;
          
        default:
          this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
      }
      
      this.ctx.restore();
    }
  }

  clear() {
    this.particles = [];
  }
}
