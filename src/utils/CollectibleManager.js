class CollectibleManager {
  constructor() {
    this.collectibles = [];
    this.nextId = 1;
  }

  // Generate collectibles for a map
  generateCollectibles(mapData, mapWidth, mapHeight) {
    this.collectibles = [];
    this.nextId = 1;

    if (!mapData) return;

    // Generate coins (most common) - reduced for performance
    const coinCount = Math.floor(Math.random() * 8) + 5; // 5-13 coins (reduced from 10-25)
    for (let i = 0; i < coinCount; i++) {
      this.addCollectible({
        type: 'coin',
        x: Math.random() * (mapWidth - 100) + 50,
        y: Math.random() * (mapHeight - 100) + 50,
        value: Math.floor(Math.random() * 5) + 1, // 1-5 coins
        size: 20,
        color: '#FFD700',
        glowColor: '#FFFF00',
        collected: false
      });
    }

    // Generate health potions (less common) - reduced for performance
    const potionCount = Math.floor(Math.random() * 3) + 2; // 2-5 potions (reduced from 3-8)
    for (let i = 0; i < potionCount; i++) {
      this.addCollectible({
        type: 'health_potion',
        x: Math.random() * (mapWidth - 100) + 50,
        y: Math.random() * (mapHeight - 100) + 50,
        value: 25, // Heal 25 HP
        size: 25,
        color: '#FF0000',
        glowColor: '#FF6666',
        collected: false
      });
    }

    // Generate powerups (rare) - reduced for performance
    const powerupCount = Math.floor(Math.random() * 2) + 1; // 1-3 powerups (reduced from 1-4)
    const powerupTypes = ['speed_boost', 'damage_boost', 'defense_boost', 'jump_boost'];
    
    for (let i = 0; i < powerupCount; i++) {
      const powerupType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
      this.addCollectible({
        type: powerupType,
        x: Math.random() * (mapWidth - 100) + 50,
        y: Math.random() * (mapHeight - 100) + 50,
        value: 1, // Duration in seconds
        size: 30,
        color: this.getPowerupColor(powerupType),
        glowColor: this.getPowerupGlowColor(powerupType),
        collected: false,
        duration: 10 // 10 seconds duration
      });
    }

    // Generate rare items (very rare)
    if (Math.random() < 0.3) { // 30% chance
      this.addCollectible({
        type: 'rare_gem',
        x: Math.random() * (mapWidth - 100) + 50,
        y: Math.random() * (mapHeight - 100) + 50,
        value: 50, // Worth 50 coins
        size: 35,
        color: '#8A2BE2',
        glowColor: '#DDA0DD',
        collected: false
      });
    }
  }

  getPowerupColor(type) {
    switch (type) {
      case 'speed_boost': return '#00FF00';
      case 'damage_boost': return '#FF4500';
      case 'defense_boost': return '#4169E1';
      case 'jump_boost': return '#FF69B4';
      default: return '#FFFFFF';
    }
  }

  getPowerupGlowColor(type) {
    switch (type) {
      case 'speed_boost': return '#90EE90';
      case 'damage_boost': return '#FFA500';
      case 'defense_boost': return '#87CEEB';
      case 'jump_boost': return '#FFB6C1';
      default: return '#FFFFFF';
    }
  }

  addCollectible(collectible) {
    const newCollectible = {
      id: this.nextId++,
      ...collectible,
      animationTime: 0,
      bobOffset: Math.random() * Math.PI * 2, // Random starting position for bobbing
      rotation: 0
    };
    this.collectibles.push(newCollectible);
  }

  // Update collectibles (animation, etc.)
  updateCollectibles(deltaTime) {
    this.collectibles.forEach(collectible => {
      if (!collectible.collected) {
        collectible.animationTime += deltaTime;
        collectible.rotation += deltaTime * 2; // Rotate slowly
      }
    });
  }

  // Check for collisions with player
  checkCollisions(player) {
    const collectedItems = [];
    
    this.collectibles.forEach(collectible => {
      if (collectible.collected) return;

      const distance = Math.sqrt(
        (collectible.x - player.x) ** 2 + 
        (collectible.y - player.y) ** 2
      );

      if (distance < collectible.size + player.width / 2) {
        collectible.collected = true;
        collectedItems.push(collectible);
      }
    });

    return collectedItems;
  }

  // Get collectibles that are still active (not collected)
  getActiveCollectibles() {
    return this.collectibles.filter(c => !c.collected);
  }

  // Clear all collectibles
  clearCollectibles() {
    this.collectibles = [];
    this.nextId = 1;
  }

  // Get collectible by type
  getCollectiblesByType(type) {
    return this.collectibles.filter(c => c.type === type && !c.collected);
  }

  // Get collectible count by type
  getCollectibleCount(type) {
    return this.getCollectiblesByType(type).length;
  }
}

export default CollectibleManager;
