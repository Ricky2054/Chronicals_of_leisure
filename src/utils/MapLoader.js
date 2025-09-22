class MapLoader {
  constructor() {
    this.availableMaps = this.getAvailableMaps();
    this.currentMap = null;
  }

  getAvailableMaps() {
    return [
      // Simple working maps
      {
        id: 'giant_sword_dungeon',
        name: 'Dungeon of the Giant Sword',
        path: '/maps001/maps001/January 2025/Low Res Dungeon of the giant sword [40x80].jpg',
        size: { width: 40, height: 80 },
        type: 'dungeon',
        theme: 'dark'
      },
      {
        id: 'neudorf_village_drought',
        name: 'Village of Neudorf (Drought)',
        path: '/maps001/maps001/January 2025/Low Res The village of Neudorf (drought, inside) [55x70].jpg',
        size: { width: 55, height: 70 },
        type: 'village',
        theme: 'desert'
      },
      {
        id: 'neudorf_village',
        name: 'Village of Neudorf',
        path: '/maps001/maps001/January 2025/Low Res The village of Neudorf (inside) [55x70].jpg',
        size: { width: 55, height: 70 },
        type: 'village',
        theme: 'medieval'
      },
      {
        id: 'underground_death_river',
        name: 'Underground Death River',
        path: '/maps001/maps001/January 2025/Low Res Underground death river [40x75] (no big skulls).jpg',
        size: { width: 40, height: 75 },
        type: 'underground',
        theme: 'dark'
      },
      {
        id: 'jungle_encounter',
        name: 'Jungle Encounter',
        path: '/maps001/maps001/3 Jungle Encounter 40x40 Top Tress, statues.jpg',
        size: { width: 40, height: 40 },
        type: 'jungle',
        theme: 'nature'
      },
      {
        id: 'lava_castle',
        name: 'Lava Castle',
        path: '/maps001/maps001/Lava castle 80x80 - Lava 0 social.jpg',
        size: { width: 80, height: 80 },
        type: 'castle',
        theme: 'lava'
      },
      
      // December 2024 Maps
      // {
      //   id: 'bridge_encounter',
      //   name: 'Bridge Encounter',
      //   path: '/bridge_map.jpg', // File doesn't exist
      //   size: { width: 25, height: 70 },
      //   type: 'encounter',
      //   theme: 'nature'
      // },
      {
        id: 'bridge_encounter_poison',
        name: 'Bridge Encounter (Poison)',
        path: '/maps001/maps001/December 2024/Social Bridge Encounter [25x70] (poison phase).jpg',
        size: { width: 25, height: 70 },
        type: 'encounter',
        theme: 'poison'
      },
      {
        id: 'burned_village',
        name: 'Burned Village',
        path: '/maps001/maps001/December 2024/Social Burned Village [35x45].jpg',
        size: { width: 35, height: 45 },
        type: 'village',
        theme: 'destroyed'
      },
      {
        id: 'cliffside_castle',
        name: 'Cliffside Castle Ruin',
        path: '/maps001/maps001/December 2024/Social Cliffside castle ruin [50x80].jpg',
        size: { width: 50, height: 80 },
        type: 'castle',
        theme: 'ruins'
      },
      // {
      //   id: 'fey_arena',
      //   name: 'Fey Arena',
      //   path: '/arena_map.jpg', // File doesn't exist
      //   size: { width: 45, height: 45 },
      //   type: 'arena',
      //   theme: 'magical'
      // },
      {
        id: 'night_light_lake',
        name: 'Night Light Lake',
        path: '/maps001/maps001/December 2024/Social Night Light Lake Encounter [30x35].jpg',
        size: { width: 30, height: 35 },
        type: 'encounter',
        theme: 'mystical'
      },
      {
        id: 'owl_throne_room',
        name: 'Owl Throne Room',
        path: '/maps001/maps001/December 2024/Social Owl Throne Room [43x35].jpg',
        size: { width: 43, height: 35 },
        type: 'throne_room',
        theme: 'royal'
      },
      {
        id: 'rune_crypt',
        name: 'Rune Crypt',
        path: '/maps001/maps001/December 2024/Social Rune Crypt [32x45].jpg',
        size: { width: 32, height: 45 },
        type: 'crypt',
        theme: 'ancient'
      },
      {
        id: 'mountain_stairs_snow',
        name: 'Mountain Stairs (Snow)',
        path: '/maps001/maps001/December 2024/Social Stair up the mountain [30x50] (snow falling).jpg',
        size: { width: 30, height: 50 },
        type: 'mountain',
        theme: 'winter'
      },
      {
        id: 'mountain_stairs_spring',
        name: 'Mountain Stairs (Spring)',
        path: '/maps001/maps001/December 2024/Social Stair up the mountain 2 [30x50] (spring).jpg',
        size: { width: 30, height: 50 },
        type: 'mountain',
        theme: 'spring'
      }
    ];
  }

  async loadMap(mapId) {
    const mapData = this.availableMaps.find(map => map.id === mapId);
    if (!mapData) {
      console.error(`Map with id ${mapId} not found`);
      return this.createFallbackMap(mapId);
    }

    try {
      console.log('Loading map image:', mapData.path);
      
      // Load the map image
      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      return new Promise((resolve, reject) => {
        image.onload = () => {
          console.log('Map image loaded successfully:', image.width, 'x', image.height);
          
          // Create a canvas to analyze the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          
          // Convert image to tile data
          const tileData = this.imageToTileData(ctx, image.width, image.height);
          console.log('Tile data generated:', tileData.length, 'x', tileData[0]?.length);
          
          this.currentMap = {
            ...mapData,
            image: image,
            tiles: tileData,
            width: mapData.size.width,
            height: mapData.size.height,
            tileSize: Math.floor(image.width / mapData.size.width)
          };
          
          console.log(`Loaded map: ${mapData.name}`, this.currentMap);
          resolve(this.currentMap);
        };
        
        image.onerror = (error) => {
          console.error(`Failed to load map image: ${mapData.path}`, error);
          console.log('Creating fallback map...');
          resolve(this.createFallbackMap(mapId));
        };
        
        const fullPath = process.env.PUBLIC_URL + mapData.path;
        console.log('Loading image from:', fullPath);
        console.log('Map data:', mapData);
        image.src = fullPath;
      });
    } catch (error) {
      console.error('Error loading map:', error);
      return this.createFallbackMap(mapId);
    }
  }

  createFallbackMap(mapId) {
    console.log('Creating fallback map for:', mapId);
    
    // Create a simple procedural map
    const width = 30;
    const height = 20;
    const tiles = [];
    
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        // Create walls around edges
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          tiles[y][x] = 1; // Wall
        } else if (Math.random() < 0.1) {
          tiles[y][x] = 1; // Random walls
        } else {
          tiles[y][x] = 2; // Floor
        }
      }
    }
    
    this.currentMap = {
      id: mapId,
      name: `Fallback ${mapId}`,
      tiles: tiles,
      width: width,
      height: height,
      tileSize: 32,
      type: 'fallback',
      theme: 'default'
    };
    
    console.log('Created fallback map:', this.currentMap);
    return this.currentMap;
  }

  imageToTileData(ctx, width, height) {
    const tileSize = 16; // Smaller tile size for more detail
    const tilesX = Math.floor(width / tileSize);
    const tilesY = Math.floor(height / tileSize);
    
    const tiles = [];
    
    for (let y = 0; y < tilesY; y++) {
      tiles[y] = [];
      for (let x = 0; x < tilesX; x++) {
        // Sample multiple pixels in the tile for better detection
        const pixelX = x * tileSize + tileSize / 2;
        const pixelY = y * tileSize + tileSize / 2;
        
        const imageData = ctx.getImageData(pixelX, pixelY, 1, 1);
        const [r, g, b, a] = imageData.data;
        
        // Convert pixel color to tile type
        const tileType = this.colorToTileType(r, g, b, a);
        tiles[y][x] = tileType;
      }
    }
    
    return tiles;
  }

  colorToTileType(r, g, b, a) {
    // Convert pixel colors to tile types
    if (a < 128) return 0; // Transparent = air
    
    // Very dark colors = walls
    if (r < 50 && g < 50 && b < 50) return 1;
    
    // Dark colors = walls
    if (r < 100 && g < 100 && b < 100) return 1;
    
    // Brown colors = platforms/wood
    if (r > 100 && g < 100 && b < 50) return 3;
    
    // Green colors = grass/nature
    if (g > r && g > b && g > 100) return 4;
    
    // Blue colors = water
    if (b > r && b > g && b > 100) return 5;
    
    // Red colors = lava/fire
    if (r > g && r > b && r > 100) return 6;
    
    // Default = floor
    return 2;
  }

  getCurrentMap() {
    return this.currentMap;
  }

  getAllMaps() {
    return this.availableMaps;
  }

  getMapsByType(type) {
    return this.availableMaps.filter(map => map.type === type);
  }

  getMapsByTheme(theme) {
    return this.availableMaps.filter(map => map.theme === theme);
  }
}

export default MapLoader;
