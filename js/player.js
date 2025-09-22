// Player class for Chronicle of the Ledger
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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
        this.manaRegen = 10;
        
        // Combat
        this.attackCooldown = 0;
        this.heavyAttackCooldown = 0;
        this.shieldCooldown = 0;
        this.dashCooldown = 0;
        this.invulnerable = 0;
        this.invulnerabilityTime = 1;
        
        // State
        this.facingRight = true;
        this.isAttacking = false;
        this.isShielding = false;
        this.isDashing = false;
        this.isDead = false;
        
        // Animation
        this.animationTimer = 0;
        this.animationFrame = 0;
        this.currentAnimation = 'idle';
        
        debug.log('Player created', 'info');
    }

    update(deltaTime, keys) {
        if (this.isDead) return;
        
        this.updateCooldowns(deltaTime);
        this.handleInput(deltaTime, keys);
        this.updatePhysics(deltaTime);
        this.updateAnimation(deltaTime);
        
        // Regenerate mana
        if (this.mana < this.maxMana) {
            this.mana = Math.min(this.maxMana, this.mana + this.manaRegen * deltaTime);
        }
    }

    updateCooldowns(deltaTime) {
        this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);
        this.heavyAttackCooldown = Math.max(0, this.heavyAttackCooldown - deltaTime);
        this.shieldCooldown = Math.max(0, this.shieldCooldown - deltaTime);
        this.dashCooldown = Math.max(0, this.dashCooldown - deltaTime);
        this.invulnerable = Math.max(0, this.invulnerable - deltaTime);
    }

    handleInput(deltaTime, keys) {
        if (this.isAttacking || this.isDashing) return;
        
        // Movement
        let moveX = 0;
        if (keys['KeyA'] || keys['ArrowLeft']) {
            moveX = -1;
            this.facingRight = false;
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
            moveX = 1;
            this.facingRight = true;
        }
        
        this.velocityX = moveX * this.speed;
        
        // Jumping
        if ((keys['Space'] || keys['KeyW']) && this.onGround) {
            this.velocityY = -this.jumpPower;
            this.onGround = false;
            this.setAnimation('jump');
            debug.log('Player jumped', 'info');
        }
        
        // Attacks
        if (keys['KeyJ'] && this.attackCooldown <= 0) {
            this.lightAttack();
        }
        
        if (keys['KeyK'] && this.heavyAttackCooldown <= 0 && this.mana >= 10) {
            this.heavyAttack();
        }
        
        // Shield
        if (keys['KeyL'] && this.shieldCooldown <= 0) {
            this.shield();
        }
        
        // Dash
        if (keys['Shift'] && this.dashCooldown <= 0 && this.mana >= 5) {
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
        
        // Ground collision (simple)
        if (this.y >= 400) {
            this.y = 400;
            this.velocityY = 0;
            this.onGround = true;
        }
        
        // Keep player in bounds
        this.x = Math.max(0, Math.min(this.x, 2000 - this.width));
        
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

    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 0.2) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }

    lightAttack() {
        this.isAttacking = true;
        this.attackCooldown = 0.5;
        this.setAnimation('attack');
        
        // Create attack effect
        if (window.game) {
            window.game.createParticle('slash', this.x + (this.facingRight ? this.width : 0), this.y + this.height / 2);
        }
        
        debug.log('Light attack performed', 'info');
    }

    heavyAttack() {
        this.isAttacking = true;
        this.heavyAttackCooldown = 1.0;
        this.mana -= 10;
        this.setAnimation('heavyAttack');
        
        // Create heavy attack effect
        if (window.game) {
            window.game.createParticle('heavySlash', this.x + (this.facingRight ? this.width : 0), this.y + this.height / 2);
        }
        
        debug.log('Heavy attack performed', 'info');
    }

    shield() {
        this.isShielding = true;
        this.shieldCooldown = 2.0;
        this.setAnimation('shield');
        debug.log('Shield activated', 'info');
    }

    dash() {
        this.isDashing = true;
        this.dashCooldown = 1.5;
        this.mana -= 5;
        this.setAnimation('roll');
        
        // Dash movement
        const dashDistance = 100;
        this.x += this.facingRight ? dashDistance : -dashDistance;
        
        // Create dash effect
        if (window.game) {
            window.game.createParticle('dash', this.x, this.y);
        }
        
        debug.log('Dash performed', 'info');
    }

    takeDamage(damage) {
        if (this.invulnerable > 0 || this.isShielding) return;
        
        this.health = Math.max(0, this.health - damage);
        this.invulnerable = this.invulnerabilityTime;
        
        debug.log(`Player took ${damage} damage. Health: ${this.health}`, 'warning');
        
        if (this.health <= 0) {
            this.die();
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        debug.log(`Player healed ${amount}. Health: ${this.health}`, 'info');
    }

    die() {
        this.isDead = true;
        this.setAnimation('death');
        debug.log('Player died!', 'error');
        
        if (window.game) {
            window.game.gameOver();
        }
    }

    setAnimation(animationName) {
        if (this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;
            this.animationFrame = 0;
            this.animationTimer = 0;
        }
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

    getAttackDamage() {
        return this.currentAnimation === 'heavyAttack' ? 30 : 15;
    }

    render(ctx) {
        if (this.isDead && this.currentAnimation === 'death') {
            return;
        }
        
        // Apply invulnerability flash
        if (this.invulnerable > 0) {
            ctx.save();
            ctx.globalAlpha = 0.5;
        }
        
        // Draw player based on animation
        this.drawPlayer(ctx);
        
        if (this.invulnerable > 0) {
            ctx.restore();
        }
    }

    drawPlayer(ctx) {
        // Base player color
        let color = '#4a90e2';
        if (this.isAttacking) color = '#ff6b6b';
        if (this.isShielding) color = '#95a5a6';
        if (this.isDashing) color = '#00ffff';
        
        // Draw player body
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw head
        ctx.fillStyle = '#fdbcb4';
        ctx.fillRect(this.x + 8, this.y + 4, 8, 8);
        
        // Draw sword if attacking
        if (this.isAttacking) {
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(this.x + (this.facingRight ? this.width : -8), this.y + 8, 8, 2);
        }
        
        // Draw shield
        if (this.isShielding) {
            ctx.fillStyle = '#34495e';
            ctx.fillRect(this.x + (this.facingRight ? -6 : this.width), this.y + 8, 6, 12);
        }
        
        // Animation effect
        if (this.currentAnimation === 'run') {
            const offset = Math.sin(this.animationFrame * 0.5) * 2;
            ctx.translate(0, offset);
        }
    }
}
