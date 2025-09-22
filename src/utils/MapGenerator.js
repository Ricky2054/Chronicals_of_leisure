class MapGenerator {
  constructor() {
    this.tileSize = 32;
    this.mapWidth = 64; // 2048 pixels
    this.mapHeight = 48; // 1536 pixels
    this.tiles = [];
    this.enemySpawns = [];
    this.itemSpawns = [];
  }

  generateLabyrinth() {
    // Initialize empty map
    this.tiles = [];
    for (let y = 0; y < this.mapHeight; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.mapWidth; x++) {
        this.tiles[y][x] = 0; // 0 = air, 1 = wall, 2 = floor, 3 = platform
      }
    }

    // Create outer walls
    for (let x = 0; x < this.mapWidth; x++) {
      this.tiles[0][x] = 1; // Top wall
      this.tiles[this.mapHeight - 1][x] = 1; // Bottom wall
    }
    for (let y = 0; y < this.mapHeight; y++) {
      this.tiles[y][0] = 1; // Left wall
      this.tiles[y][this.mapWidth - 1] = 1; // Right wall
    }

    // Create main floor
    for (let x = 1; x < this.mapWidth - 1; x++) {
      this.tiles[this.mapHeight - 2][x] = 2; // Floor
    }

    // Create labyrinth rooms and corridors
    this.createRoom(5, 5, 8, 6); // Starting room
    this.createRoom(20, 8, 10, 8); // Room 1
    this.createRoom(35, 5, 12, 10); // Room 2
    this.createRoom(15, 20, 8, 6); // Room 3
    this.createRoom(30, 25, 10, 8); // Room 4
    this.createRoom(45, 15, 8, 12); // Room 5
    this.createRoom(8, 35, 15, 8); // Room 6
    this.createRoom(25, 35, 12, 6); // Room 7
    this.createRoom(40, 35, 10, 8); // Room 8

    // Connect rooms with corridors
    this.createCorridor(13, 8, 7, 0); // Connect start to room 1
    this.createCorridor(30, 8, 5, 0); // Connect room 1 to room 2
    this.createCorridor(19, 8, 0, 12); // Connect room 1 to room 3
    this.createCorridor(19, 20, 11, 0); // Connect room 3 to room 4
    this.createCorridor(40, 20, 0, 15); // Connect room 4 to room 5
    this.createCorridor(15, 26, 0, 9); // Connect room 3 to room 6
    this.createCorridor(23, 35, 2, 0); // Connect room 6 to room 7
    this.createCorridor(37, 35, 3, 0); // Connect room 7 to room 8

    // Add platforms and obstacles
    this.addPlatforms();
    this.addObstacles();

    // Generate enemy spawn points
    this.generateEnemySpawns();

    // Generate item spawn points
    this.generateItemSpawns();

    return {
      tiles: this.tiles,
      enemySpawns: this.enemySpawns,
      itemSpawns: this.itemSpawns,
      width: this.mapWidth,
      height: this.mapHeight
    };
  }

  createRoom(x, y, width, height) {
    // Create room walls
    for (let i = 0; i < width; i++) {
      this.tiles[y][x + i] = 1; // Top wall
      this.tiles[y + height - 1][x + i] = 1; // Bottom wall
    }
    for (let i = 0; i < height; i++) {
      this.tiles[y + i][x] = 1; // Left wall
      this.tiles[y + i][x + width - 1] = 1; // Right wall
    }

    // Fill room with floor
    for (let i = 1; i < width - 1; i++) {
      for (let j = 1; j < height - 1; j++) {
        this.tiles[y + j][x + i] = 2; // Floor
      }
    }
  }

  createCorridor(x, y, width, height) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (this.tiles[y + j] && this.tiles[y + j][x + i] !== undefined) {
          this.tiles[y + j][x + i] = 2; // Floor
        }
      }
    }
  }

  addPlatforms() {
    // Add floating platforms
    const platforms = [
      { x: 10, y: 15, width: 3, height: 1 },
      { x: 18, y: 12, width: 2, height: 1 },
      { x: 25, y: 18, width: 4, height: 1 },
      { x: 35, y: 20, width: 3, height: 1 },
      { x: 42, y: 25, width: 2, height: 1 },
      { x: 12, y: 30, width: 3, height: 1 },
      { x: 20, y: 28, width: 2, height: 1 },
      { x: 28, y: 32, width: 4, height: 1 },
      { x: 38, y: 30, width: 3, height: 1 },
      { x: 45, y: 28, width: 2, height: 1 }
    ];

    platforms.forEach(platform => {
      for (let i = 0; i < platform.width; i++) {
        if (this.tiles[platform.y] && this.tiles[platform.y][platform.x + i] !== undefined) {
          this.tiles[platform.y][platform.x + i] = 3; // Platform
        }
      }
    });
  }

  addObstacles() {
    // Add some obstacles
    const obstacles = [
      { x: 15, y: 10, width: 1, height: 2 },
      { x: 22, y: 15, width: 2, height: 1 },
      { x: 30, y: 12, width: 1, height: 3 },
      { x: 40, y: 18, width: 2, height: 1 },
      { x: 18, y: 25, width: 1, height: 2 },
      { x: 25, y: 30, width: 2, height: 1 },
      { x: 35, y: 28, width: 1, height: 2 },
      { x: 42, y: 32, width: 2, height: 1 }
    ];

    obstacles.forEach(obstacle => {
      for (let i = 0; i < obstacle.width; i++) {
        for (let j = 0; j < obstacle.height; j++) {
          if (this.tiles[obstacle.y + j] && this.tiles[obstacle.y + j][obstacle.x + i] !== undefined) {
            this.tiles[obstacle.y + j][obstacle.x + i] = 1; // Wall
          }
        }
      }
    });
  }

  generateEnemySpawns() {
    this.enemySpawns = [
      { x: 12, y: 8, type: 'goblin' },
      { x: 25, y: 10, type: 'orc' },
      { x: 40, y: 8, type: 'skeleton' },
      { x: 18, y: 22, type: 'goblin' },
      { x: 32, y: 27, type: 'orc' },
      { x: 47, y: 18, type: 'skeleton' },
      { x: 10, y: 37, type: 'goblin' },
      { x: 28, y: 37, type: 'orc' },
      { x: 42, y: 37, type: 'skeleton' },
      { x: 15, y: 15, type: 'goblin' },
      { x: 35, y: 20, type: 'orc' },
      { x: 45, y: 30, type: 'skeleton' }
    ];
  }

  generateItemSpawns() {
    this.itemSpawns = [
      { x: 8, y: 7, type: 'health_potion' },
      { x: 22, y: 9, type: 'mana_potion' },
      { x: 37, y: 7, type: 'gold_coin' },
      { x: 20, y: 23, type: 'health_potion' },
      { x: 34, y: 28, type: 'mana_potion' },
      { x: 49, y: 19, type: 'gold_coin' },
      { x: 12, y: 38, type: 'health_potion' },
      { x: 30, y: 38, type: 'mana_potion' },
      { x: 44, y: 38, type: 'gold_coin' }
    ];
  }
}

export default MapGenerator;
