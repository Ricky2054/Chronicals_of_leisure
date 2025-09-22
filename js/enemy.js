// Enemy class for Chronicle of the Ledger
class Enemy {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 800;
        this.onGround = false;
        
        // Stats based on type
        this.initializeStats();
        
        // State
        this.isDead = false;
        this.isAttacking = false;
        this.facingRight = true;
        this.target = null;
        this.attackCooldown = 0;
        this.attackCooldownTime = 2;
        
        // Animation
        this.animationTimer = 0;
        this.animationFrame = 0;
        
        debug.log(`${type} enemy created at (${x}, ${y})`, 'info');
    }

    initializeStats() {
        switch (this.type) {
            case 'forkling':
                this.health = 30;
                this.maxHealth = 30;
                this.damage = 15;
                this.speed = 80;
                this.aggroRange = 120;
                this.color = '#ff4444';
                break;
            case 'coinGolem':
                this.health = 60;
                this.maxHealth = 60;
                this.damage = 25;
                this.speed = 40;
                this.aggroRange = 100;
                this.color = '#ffd700';
                break;
            case 'nullShade':
                this.health = 40;
                this.maxHealth = 40;
                this.damage = 20;
                this.speed = 100;
                this.aggroRange = 180;
                this.color = '#4444ff';
                break;
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
            if (distance <= 40 && this.attackCooldown <= 0) {
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
        
        // Ground collision
        if (this.y >= 400) {
            this.y = 400;
            this.velocityY = 0;
            this.onGround = true;
        }
    }

    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 0.2) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }

    updateCooldowns(deltaTime) {
        this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);
    }

    attack() {
        this.isAttacking = true;
        this.attackCooldown = this.attackCooldownTime;
        
        debug.log(`${this.type} enemy attacked`, 'info');
        
        // Reset attacking state after a short time
        setTimeout(() => {
            this.isAttacking = false;
        }, 0.5);
    }

    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        
        debug.log(`${this.type} enemy took ${damage} damage. Health: ${this.health}`, 'warning');
        
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        debug.log(`${this.type} enemy died`, 'info');
        
        // Create death effect
        if (window.game) {
            window.game.createParticle('death', this.x, this.y);
        }
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
        
        // Draw enemy body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 6, this.y + 6, 4, 4);
        ctx.fillRect(this.x + 18, this.y + 6, 4, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 7, this.y + 7, 2, 2);
        ctx.fillRect(this.x + 19, this.y + 7, 2, 2);
        
        // Type-specific features
        if (this.type === 'forkling') {
            // Horns
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x + 8, this.y + 2, 2, 4);
            ctx.fillRect(this.x + 18, this.y + 2, 2, 4);
        } else if (this.type === 'coinGolem') {
            // Coin symbol
            ctx.fillStyle = '#ffa500';
            ctx.fillRect(this.x + 12, this.y + 12, 8, 8);
        } else if (this.type === 'nullShade') {
            // Glitch effect
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x + 4, this.y + 20, 24, 2);
        }
        
        // Render health bar
        this.renderHealthBar(ctx);
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
