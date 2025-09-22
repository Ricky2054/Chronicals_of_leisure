import { Enemy } from './Enemy';
import { Boss } from './Boss';

export class EnemyManager {
  constructor(spriteLoader, particleSystem) {
    this.spriteLoader = spriteLoader;
    this.particleSystem = particleSystem;
    this.enemies = [];
    this.bosses = [];
    this.spawnTimer = 0;
    this.spawnInterval = 3; // seconds
    this.maxEnemies = 5;
  }

  update(deltaTime, player) {
    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime, player);
      
      if (enemy.isDead) {
        this.enemies.splice(i, 1);
        this.particleSystem.createDeathEffect(enemy.x, enemy.y);
      }
    }
    
    // Update bosses
    for (let i = this.bosses.length - 1; i >= 0; i--) {
      const boss = this.bosses[i];
      boss.update(deltaTime, player);
      
      if (boss.isDead) {
        this.bosses.splice(i, 1);
        this.particleSystem.createBossDeathEffect(boss.x, boss.y);
      }
    }
    
    // Spawn new enemies
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval && this.enemies.length < this.maxEnemies) {
      this.spawnEnemy(player);
      this.spawnTimer = 0;
    }
  }

  spawnEnemy(player) {
    const enemyTypes = ['forkling', 'coinGolem', 'nullShade'];
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    // Spawn enemy at a distance from player
    const spawnDistance = 200;
    const angle = Math.random() * Math.PI * 2;
    const x = player.x + Math.cos(angle) * spawnDistance;
    const y = player.y + Math.sin(angle) * spawnDistance;
    
    const enemy = new Enemy(type, x, y, this.spriteLoader, this.particleSystem);
    this.enemies.push(enemy);
  }

  spawnBoss(level, x, y) {
    const bossTypes = ['vulkran', 'aurios', 'fracturedPhantom'];
    const type = bossTypes[level - 1] || 'vulkran';
    
    const boss = new Boss(type, x, y, this.spriteLoader, this.particleSystem);
    this.bosses.push(boss);
    return boss;
  }

  checkPlayerCollisions(player) {
    // Check enemy collisions
    for (const enemy of this.enemies) {
      if (this.checkCollision(player.getBounds(), enemy.getBounds())) {
        if (!enemy.isAttacking) continue;
        
        player.takeDamage(enemy.damage);
        this.particleSystem.createHitEffect(player.x + player.width / 2, player.y);
      }
    }
    
    // Check boss collisions
    for (const boss of this.bosses) {
      if (this.checkCollision(player.getBounds(), boss.getBounds())) {
        if (!boss.isAttacking) continue;
        
        player.takeDamage(boss.damage);
        this.particleSystem.createHitEffect(player.x + player.width / 2, player.y);
      }
    }
  }

  checkAttackCollisions(player) {
    const attackBounds = player.getAttackBounds();
    if (!attackBounds) return;
    
    let hitEnemy = false;
    
    // Check enemy attacks
    for (const enemy of this.enemies) {
      if (this.checkCollision(attackBounds, enemy.getBounds())) {
        enemy.takeDamage(player.getAttackDamage());
        this.particleSystem.createHitEffect(enemy.x + enemy.width / 2, enemy.y);
        hitEnemy = true;
      }
    }
    
    // Check boss attacks
    for (const boss of this.bosses) {
      if (this.checkCollision(attackBounds, boss.getBounds())) {
        boss.takeDamage(player.getAttackDamage());
        this.particleSystem.createHitEffect(boss.x + boss.width / 2, boss.y);
        hitEnemy = true;
      }
    }
    
    if (hitEnemy) {
      player.addScore(10);
    }
  }

  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  render(ctx) {
    // Render enemies
    for (const enemy of this.enemies) {
      enemy.render(ctx);
    }
    
    // Render bosses
    for (const boss of this.bosses) {
      boss.render(ctx);
    }
  }

  reset() {
    this.enemies = [];
    this.bosses = [];
    this.spawnTimer = 0;
  }

  getEnemyCount() {
    return this.enemies.length;
  }

  getBossCount() {
    return this.bosses.length;
  }
}
