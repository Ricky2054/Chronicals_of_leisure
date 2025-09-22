// Particle system for Chronicle of the Ledger
class Particle {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.size = 3;
        this.color = '#ffffff';
        
        this.initializeParticle();
        
        debug.log(`Particle ${type} created at (${x}, ${y})`, 'info');
    }

    initializeParticle() {
        switch (this.type) {
            case 'slash':
                this.velocityX = (Math.random() - 0.5) * 200;
                this.velocityY = (Math.random() - 0.5) * 100;
                this.life = 0.3;
                this.maxLife = 0.3;
                this.size = 3 + Math.random() * 3;
                this.color = '#ffffff';
                break;
                
            case 'heavySlash':
                this.velocityX = (Math.random() - 0.5) * 300;
                this.velocityY = (Math.random() - 0.5) * 150;
                this.life = 0.5;
                this.maxLife = 0.5;
                this.size = 4 + Math.random() * 4;
                this.color = '#ffd700';
                break;
                
            case 'dash':
                this.velocityX = (Math.random() - 0.5) * 200;
                this.velocityY = (Math.random() - 0.5) * 200;
                this.life = 0.4;
                this.maxLife = 0.4;
                this.size = 2 + Math.random() * 2;
                this.color = '#00ffff';
                break;
                
            case 'damage':
                this.velocityX = (Math.random() - 0.5) * 80;
                this.velocityY = -50 - Math.random() * 50;
                this.life = 0.6;
                this.maxLife = 0.6;
                this.size = 2 + Math.random() * 2;
                this.color = '#ff4444';
                break;
                
            case 'hit':
                this.velocityX = (Math.random() - 0.5) * 60;
                this.velocityY = (Math.random() - 0.5) * 60;
                this.life = 0.2;
                this.maxLife = 0.2;
                this.size = 2 + Math.random() * 2;
                this.color = '#ffff00';
                break;
                
            case 'death':
                this.velocityX = (Math.random() - 0.5) * 150;
                this.velocityY = -100 - Math.random() * 100;
                this.life = 1.0;
                this.maxLife = 1.0;
                this.size = 3 + Math.random() * 3;
                this.color = '#666666';
                break;
                
            default:
                this.velocityX = (Math.random() - 0.5) * 100;
                this.velocityY = (Math.random() - 0.5) * 100;
                this.life = 0.5;
                this.maxLife = 0.5;
                this.size = 3;
                this.color = '#ffffff';
        }
    }

    update(deltaTime) {
        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Apply gravity to some particles
        if (this.type === 'damage' || this.type === 'death') {
            this.velocityY += 200 * deltaTime;
        }
        
        // Update life
        this.life -= deltaTime;
    }

    render(ctx) {
        const alpha = this.life / this.maxLife;
        const size = this.size * alpha;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        
        // Render different particle types
        switch (this.type) {
            case 'slash':
            case 'heavySlash':
            case 'hit':
                ctx.fillRect(this.x - size/2, this.y - size/2, size, size);
                break;
                
            case 'dash':
                ctx.fillStyle = '#00ffff';
                ctx.fillRect(this.x - size/2, this.y - size/2, size, size);
                break;
                
            case 'damage':
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(this.x - size/2, this.y - size/2, size, size);
                break;
                
            case 'death':
                ctx.fillStyle = '#666666';
                ctx.fillRect(this.x - size/2, this.y - size/2, size, size);
                break;
                
            default:
                ctx.fillRect(this.x - size/2, this.y - size/2, size, size);
        }
        
        ctx.restore();
    }
}
