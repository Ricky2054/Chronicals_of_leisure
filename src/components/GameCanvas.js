import React, { forwardRef, useEffect, useRef, useState } from 'react';
import SpriteLoader from '../utils/SpriteLoader';
import SpriteRenderer from '../utils/SpriteRenderer';
import Camera from '../utils/Camera';
import MapGenerator from '../utils/MapGenerator';

// Helper function for attack hitbox
function getAttackHitbox(player) {
  const attackWidth = 100; // Attack range
  const attackHeight = 80; // Attack height
  return {
    x: player.x + player.width / 2 - attackWidth / 2, // Center around player
    y: player.y + player.height / 2 - attackHeight / 2, // Center around player
    width: attackWidth,
    height: attackHeight
  };
}

// Helper function to draw collectibles
function drawCollectibles(ctx, collectibleManager, animationTime) {
  if (!collectibleManager) return;
  
  const collectibles = collectibleManager.getActiveCollectibles();
  if (collectibles.length === 0) return; // Early exit if no collectibles
  
  collectibles.forEach(collectible => {
    if (collectible.collected) return;
    
    // Calculate bobbing animation
    const bobAmount = Math.sin(animationTime * 3 + collectible.bobOffset) * 3;
    const x = collectible.x;
    const y = collectible.y + bobAmount;
    
    // Save context
    ctx.save();
    
    // Apply rotation
    ctx.translate(x + collectible.size / 2, y + collectible.size / 2);
    ctx.rotate(collectible.rotation);
    ctx.translate(-collectible.size / 2, -collectible.size / 2);
    
    // Draw glow effect - reduced shadow blur for performance
    ctx.shadowColor = collectible.glowColor;
    ctx.shadowBlur = 8; // Reduced from 15 for better performance
    
    // Draw collectible based on type
    switch (collectible.type) {
      case 'coin':
        // Draw coin
        ctx.fillStyle = collectible.color;
        ctx.beginPath();
        ctx.arc(collectible.size / 2, collectible.size / 2, collectible.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw coin symbol
        ctx.fillStyle = '#FFA500';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', collectible.size / 2, collectible.size / 2);
        break;
        
      case 'rare_gem':
        // Draw gem
        ctx.fillStyle = collectible.color;
        ctx.beginPath();
        ctx.moveTo(collectible.size / 2, 0);
        ctx.lineTo(collectible.size, collectible.size / 3);
        ctx.lineTo(collectible.size, 2 * collectible.size / 3);
        ctx.lineTo(collectible.size / 2, collectible.size);
        ctx.lineTo(0, 2 * collectible.size / 3);
        ctx.lineTo(0, collectible.size / 3);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'health_potion':
        // Draw potion bottle
        ctx.fillStyle = collectible.color;
        ctx.fillRect(collectible.size / 4, collectible.size / 4, collectible.size / 2, collectible.size / 2);
        
        // Draw potion symbol
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', collectible.size / 2, collectible.size / 2);
        break;
        
      case 'speed_boost':
        // Draw speed boost
        ctx.fillStyle = collectible.color;
        ctx.beginPath();
        ctx.arc(collectible.size / 2, collectible.size / 2, collectible.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', collectible.size / 2, collectible.size / 2);
        break;
        
      case 'damage_boost':
        // Draw damage boost
        ctx.fillStyle = collectible.color;
        ctx.beginPath();
        ctx.arc(collectible.size / 2, collectible.size / 2, collectible.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚔', collectible.size / 2, collectible.size / 2);
        break;
        
      case 'defense_boost':
        // Draw defense boost
        ctx.fillStyle = collectible.color;
        ctx.beginPath();
        ctx.arc(collectible.size / 2, collectible.size / 2, collectible.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🛡', collectible.size / 2, collectible.size / 2);
        break;
        
      case 'jump_boost':
        // Draw jump boost
        ctx.fillStyle = collectible.color;
        ctx.beginPath();
        ctx.arc(collectible.size / 2, collectible.size / 2, collectible.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⬆', collectible.size / 2, collectible.size / 2);
        break;
        
      default:
        // Default collectible
        ctx.fillStyle = collectible.color;
        ctx.beginPath();
        ctx.arc(collectible.size / 2, collectible.size / 2, collectible.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Restore context
    ctx.restore();
  });
}

const GameCanvas = forwardRef(({ player, enemies, particles, gameState, mapData, keys, collectibleManager, projectileManager, bossManager }, ref) => {
  const canvasRef = useRef(null);
  const [spriteLoader] = useState(() => new SpriteLoader());
  const [spriteRenderer] = useState(() => new SpriteRenderer(spriteLoader));
  const [camera] = useState(() => new Camera(1024, 576));
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    if (ref) {
      ref.current = canvasRef.current;
    }
  }, [ref]);

  // Load sprites on component mount
  useEffect(() => {
    spriteLoader.loadAllSprites().then((success) => {
      setSpritesLoaded(success);
      console.log('Sprites loaded:', success);
    }).catch((error) => {
      console.error('Failed to load sprites:', error);
      setSpritesLoaded(false);
    });
  }, [spriteLoader]);

  // Animation timer - use real time for smooth animations
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      setAnimationTime(prev => prev + deltaTime);
      lastTime = currentTime;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  // Optimized rendering loop - only render when needed
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let lastRenderTime = 0;
    const targetFPS = 30; // Reduced from 60fps to 30fps for better performance
    const frameInterval = 1000 / targetFPS;

    const render = (currentTime) => {
      // Throttle rendering to target FPS
      if (currentTime - lastRenderTime < frameInterval) {
        animationId = requestAnimationFrame(render);
        return;
      }
      
      lastRenderTime = currentTime;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply camera transform
      ctx.save();
      camera.transform(ctx);
      
      // Draw map (if exists) - only redraw if map changed
      if (mapData) {
        if (mapData.image && mapData.image.complete) {
          ctx.drawImage(mapData.image, 0, 0);
        } else if (mapData.tiles) {
          // Draw tile-based map
          for (let row = 0; row < mapData.tiles.length; row++) {
            for (let col = 0; col < mapData.tiles[row].length; col++) {
              const tileType = mapData.tiles[row][col];
              if (tileType > 0) {
                ctx.fillStyle = tileType === 1 ? '#8B4513' : '#228B22';
                ctx.fillRect(col * 32, row * 32, 32, 32);
              }
            }
          }
        }
      }
      
      // Draw collectibles - only if collectibleManager exists
      if (collectibleManager) {
        drawCollectibles(ctx, collectibleManager, animationTime);
      }
      
      // Draw enemies - only alive enemies
      if (enemies && spritesLoaded) {
        enemies.forEach(enemy => {
          if (!enemy.isDead) {
            spriteRenderer.drawEnemy(ctx, enemy, animationTime);
          }
        });
      }
      
      // Draw active boss
      if (bossManager && spritesLoaded) {
        const activeBoss = bossManager.getActiveBoss();
        if (activeBoss && !activeBoss.isDead) {
          bossManager.drawBoss(ctx, activeBoss, animationTime);
        }
      }
      
      // Draw projectiles
      if (projectileManager) {
        projectileManager.drawProjectiles(ctx);
      }
      
      // Draw player - only if player exists and sprites loaded
      if (player && spritesLoaded) {
        spriteRenderer.drawPlayer(ctx, player, animationTime);
      }
      
      // Draw particles - only if particles exist
      if (particles && particles.length > 0) {
        particles.forEach(particle => {
          ctx.fillStyle = particle.color || '#ffff00';
          ctx.fillRect(particle.x, particle.y, particle.size || 4, particle.size || 4);
        });
      }
      
      // Draw attack hitbox when attacking (for debugging) - only when J is pressed
      if (keys && keys['KeyJ'] && player && player.attackCooldown <= 0) {
        const attackHitbox = getAttackHitbox(player);
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(attackHitbox.x, attackHitbox.y, attackHitbox.width, attackHitbox.height);
      }
      
      ctx.restore();
      
      // Continue rendering
      animationId = requestAnimationFrame(render);
    };
    
    animationId = requestAnimationFrame(render);
    
    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [player, enemies, particles, mapData, collectibleManager, animationTime, spritesLoaded, keys, camera, spriteRenderer]);

  // Update camera to follow player and fit map (only when mapData changes)
  useEffect(() => {
    if (mapData) {
      // Set world bounds based on map data
      if (mapData.image) {
        // Image-based map - calculate scaled dimensions
        const canvas = canvasRef.current;
        if (canvas) {
          const scaleX = canvas.width / mapData.image.width;
          const scaleY = canvas.height / mapData.image.height;
          const scale = Math.max(scaleX, scaleY);
          
          const scaledWidth = mapData.image.width * scale;
          const scaledHeight = mapData.image.height * scale;
          
          camera.setWorldBounds(scaledWidth, scaledHeight);
          camera.fitMapToScreen(scaledWidth, scaledHeight);
        } else {
          camera.setWorldBounds(mapData.image.width, mapData.image.height);
          camera.fitMapToScreen(mapData.image.width, mapData.image.height);
        }
      } else {
        // Tile-based map
        const worldWidth = mapData.width * 32;
        const worldHeight = mapData.height * 32;
        camera.setWorldBounds(worldWidth, worldHeight);
        camera.fitMapToScreen(worldWidth, worldHeight);
      }
    }
  }, [camera, mapData]);

  // Set camera target when player changes
  useEffect(() => {
    if (player) {
      camera.setTarget(player);
    }
  }, [player, camera]);

  // Zoom controls disabled - zoom is locked at perfect level
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const handleWheel = (e) => {
  //     e.preventDefault();
  //     const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
  //     camera.adjustZoom(zoomDelta);
  //   };

  //   const handleKeyDown = (e) => {
  //     if (e.code === 'Equal' || e.code === 'NumpadAdd') {
  //       e.preventDefault();
  //       camera.adjustZoom(0.1);
  //     } else if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
  //       e.preventDefault();
  //       camera.adjustZoom(-0.1);
  //     } else if (e.code === 'Digit0' || e.code === 'Numpad0') {
  //       e.preventDefault();
  //       // Reset zoom to fit map
  //       if (mapData) {
  //         if (mapData.image) {
  //           camera.fitMapToScreen(mapData.image.width, mapData.image.height);
  //         } else {
  //           const worldWidth = mapData.width * 32;
  //           const worldHeight = mapData.height * 32;
  //           camera.fitMapToScreen(worldWidth, worldHeight);
  //         }
  //       }
  //     }
  //   };

  //   canvas.addEventListener('wheel', handleWheel, { passive: false });
  //   window.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     canvas.removeEventListener('wheel', handleWheel);
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [camera, mapData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !spritesLoaded || !mapData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update camera
    camera.update();

    // Clear canvas - map will fill everything
    ctx.clearRect(0, 0, 1024, 576);

    // Apply camera transformation
    camera.transform(ctx);

    // Draw map
    drawMap(ctx, mapData);

    // Draw player
    if (player) {
      ctx.save();
      
      // Flash effect when invulnerable
      if (player.invulnerable > 0 && Math.floor(player.invulnerable * 10) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }

      // Use real sprite renderer
      spriteRenderer.drawPlayer(ctx, player, animationTime);

      // Draw attack hitbox when attacking (for debugging)
      if (keys['KeyJ'] && player.attackCooldown <= 0) {
        const attackHitbox = getAttackHitbox(player);
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(attackHitbox.x, attackHitbox.y, attackHitbox.width, attackHitbox.height);
      }

      ctx.restore();
    }

    // Draw enemies
    enemies.forEach(enemy => {
      if (enemy.isDead) return;

      // Use real sprite renderer
      spriteRenderer.drawEnemy(ctx, enemy, animationTime);

      // Health bar
      ctx.fillStyle = 'red';
      ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);
      ctx.fillStyle = 'green';
      ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * (enemy.health / enemy.maxHealth), 5);
    });

    // Draw particles
    particles.forEach(particle => {
      spriteRenderer.drawParticle(ctx, particle);
    });

    // Restore camera transformation
    camera.restore(ctx);

    // Draw minimap
    drawMinimap(ctx, player, mapData);

    // Zoom info disabled - zoom is locked
    // drawZoomInfo(ctx);

  }, [player, enemies, particles, gameState, spritesLoaded, animationTime, spriteRenderer, camera, mapData]);

  const drawMap = (ctx, mapData) => {
    if (mapData.image) {
      // Draw image-based map scaled to fill the camera view completely
      const canvas = ctx.canvas;
      const scaleX = canvas.width / mapData.image.width;
      const scaleY = canvas.height / mapData.image.height;
      const scale = Math.max(scaleX, scaleY); // Use larger scale to fill screen
      
      const scaledWidth = mapData.image.width * scale;
      const scaledHeight = mapData.image.height * scale;
      
      // Center the scaled image
      const offsetX = (canvas.width - scaledWidth) / 2;
      const offsetY = (canvas.height - scaledHeight) / 2;
      
      ctx.drawImage(mapData.image, offsetX, offsetY, scaledWidth, scaledHeight);
    } else {
      // Draw tile-based map
      const tileSize = 32;
      
      for (let y = 0; y < mapData.height; y++) {
        for (let x = 0; x < mapData.width; x++) {
          const tile = mapData.tiles[y][x];
          const worldX = x * tileSize;
          const worldY = y * tileSize;
          
          // Draw background first
          ctx.fillStyle = '#1a1a2e';
          ctx.fillRect(worldX, worldY, tileSize, tileSize);
          
          switch (tile) {
            case 1: // Wall - Stone bricks
              drawWallTile(ctx, worldX, worldY, tileSize, x, y);
              break;
            case 2: // Floor - Stone floor
              drawFloorTile(ctx, worldX, worldY, tileSize, x, y);
              break;
            case 3: // Platform - Wooden platform
              drawPlatformTile(ctx, worldX, worldY, tileSize, x, y);
              break;
          }
        }
      }
      
      // Add decorative elements
      drawMapDecorations(ctx, mapData, tileSize);
    }
  };

  const drawWallTile = (ctx, x, y, size, tileX, tileY) => {
    // Stone brick pattern
    const brickColors = ['#555', '#666', '#777'];
    const color = brickColors[(tileX + tileY) % brickColors.length];
    
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    
    // Brick lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);
    
    // Add brick texture
    if ((tileX + tileY) % 2 === 0) {
      ctx.fillStyle = '#444';
      ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
    }
    
    // Remove moss/vines that cause green lines
  };

  const drawFloorTile = (ctx, x, y, size, tileX, tileY) => {
    // Stone floor pattern
    const floorColors = ['#444', '#555', '#666'];
    const color = floorColors[(tileX + tileY) % floorColors.length];
    
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    
    // Add stone texture
    ctx.fillStyle = '#333';
    for (let i = 0; i < 3; i++) {
      const offsetX = (tileX + i) % 3 * 8;
      const offsetY = (tileY + i) % 3 * 8;
      ctx.fillRect(x + offsetX, y + offsetY, 4, 4);
    }
    
    // Add cracks occasionally
    if (Math.random() < 0.05) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 4);
      ctx.lineTo(x + size - 4, y + size - 4);
      ctx.stroke();
    }
  };

  const drawPlatformTile = (ctx, x, y, size, tileX, tileY) => {
    // Wooden platform
    const woodColors = ['#8b4513', '#a0522d', '#cd853f'];
    const color = woodColors[tileX % woodColors.length];
    
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    
    // Wood grain
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + i * 8);
      ctx.lineTo(x + size, y + i * 8);
      ctx.stroke();
    }
    
    // Add nails
    ctx.fillStyle = '#666';
    ctx.fillRect(x + 4, y + 4, 2, 2);
    ctx.fillRect(x + size - 6, y + 4, 2, 2);
    ctx.fillRect(x + 4, y + size - 6, 2, 2);
    ctx.fillRect(x + size - 6, y + size - 6, 2, 2);
  };

  const drawMapDecorations = (ctx, mapData, tileSize) => {
    // Add torches, chests, and other decorations
    const decorations = [
      { x: 5, y: 5, type: 'torch' },
      { x: 15, y: 8, type: 'chest' },
      { x: 25, y: 5, type: 'torch' },
      { x: 35, y: 8, type: 'chest' },
      { x: 45, y: 5, type: 'torch' },
      { x: 8, y: 20, type: 'chest' },
      { x: 18, y: 25, type: 'torch' },
      { x: 28, y: 20, type: 'chest' },
      { x: 38, y: 25, type: 'torch' },
      { x: 48, y: 20, type: 'chest' }
    ];

    decorations.forEach(decoration => {
      const worldX = decoration.x * tileSize;
      const worldY = decoration.y * tileSize;
      
      switch (decoration.type) {
        case 'torch':
          drawTorch(ctx, worldX, worldY, tileSize);
          break;
        case 'chest':
          drawChest(ctx, worldX, worldY, tileSize);
          break;
      }
    });
  };

  const drawTorch = (ctx, x, y, size) => {
    // Torch base
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x + 12, y + 20, 8, 12);
    
    // Torch flame
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(x + 14, y + 8, 4, 12);
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(x + 15, y + 10, 2, 8);
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(x + 15, y + 12, 2, 4);
  };

  const drawChest = (ctx, x, y, size) => {
    // Chest body
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x + 4, y + 16, 24, 16);
    
    // Chest lid
    ctx.fillStyle = '#a0522d';
    ctx.fillRect(x + 4, y + 12, 24, 8);
    
    // Chest lock
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 14, y + 20, 4, 4);
    
    // Chest straps
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 6, y + 18, 20, 12);
  };

  // Detailed sprite drawing functions
  const drawDetailedPlayer = (ctx, player, animationTime) => {
    ctx.save();
    
    if (!player.facingRight) {
      ctx.scale(-1, 1);
      ctx.translate(-player.x - player.width, player.y);
    } else {
      ctx.translate(player.x, player.y);
    }

    // Draw a detailed knight sprite
    ctx.fillStyle = '#4a90e2'; // Blue armor
    ctx.fillRect(8, 8, 48, 48);
    
    ctx.fillStyle = '#ffffff'; // White underlayer
    ctx.fillRect(12, 12, 40, 40);
    
    ctx.fillStyle = '#ff6b6b'; // Red details
    ctx.fillRect(16, 16, 32, 32);
    
    // Add helmet
    ctx.fillStyle = '#2c5aa0';
    ctx.fillRect(16, 8, 32, 16);
    
    // Add eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(20, 12, 4, 4);
    ctx.fillRect(32, 12, 4, 4);
    
    // Add sword
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(40, 20, 16, 4);
    ctx.fillRect(44, 16, 4, 12);
    
    // Add animation effects
    if (Math.abs(player.velocityX) > 10) {
      // Running animation
      const bounce = Math.sin(animationTime * 20) * 2;
      ctx.translate(0, bounce);
    }
    
    if (player.isAttacking) {
      // Attack animation
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(50, 20, 20, 8);
    }
    
    ctx.restore();
  };

  const drawDetailedEnemy = (ctx, enemy, animationTime) => {
    ctx.save();
    
    if (!enemy.facingRight) {
      ctx.scale(-1, 1);
      ctx.translate(-enemy.x - enemy.width, enemy.y);
    } else {
      ctx.translate(enemy.x, enemy.y);
    }

    // Get enemy color based on type
    const colors = {
      'goblin': '#ff4444',
      'orc': '#ff8800',
      'skeleton': '#8800ff'
    };
    const baseColor = colors[enemy.type] || '#ff4444';

    // Draw enemy body
    ctx.fillStyle = baseColor;
    ctx.fillRect(4, 4, 24, 24);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, 6, 20, 20);
    
    // Add eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(8, 8, 2, 2);
    ctx.fillRect(18, 8, 2, 2);
    
    // Add mouth
    ctx.fillRect(12, 16, 4, 2);
    
    // Add special features based on type
    if (enemy.type === 'orc') {
      // Orc tusks
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(6, 12, 2, 4);
      ctx.fillRect(20, 12, 2, 4);
    } else if (enemy.type === 'skeleton') {
      // Skeleton bones
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 4, 2, 8);
      ctx.fillRect(18, 4, 2, 8);
    }
    
    // Add animation effects
    if (enemy.velocityX !== 0) {
      // Walking animation
      const bounce = Math.sin(animationTime * 15) * 1;
      ctx.translate(0, bounce);
    }
    
    ctx.restore();
  };

  const drawMinimap = (ctx, player, mapData) => {
    if (!player) return;
    
    const minimapSize = 150;
    const minimapX = 1024 - minimapSize - 10;
    const minimapY = 10;
    
    // Calculate map dimensions
    let mapWidth, mapHeight;
    if (mapData.image) {
      mapWidth = mapData.image.width;
      mapHeight = mapData.image.height;
    } else {
      mapWidth = mapData.width * 32;
      mapHeight = mapData.height * 32;
    }
    
    const scale = minimapSize / Math.max(mapWidth, mapHeight);
    
    // Minimap background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 2;
    ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
    
    // Draw map
    if (mapData.image) {
      // Draw scaled image for minimap
      ctx.drawImage(
        mapData.image,
        minimapX, minimapY,
        mapWidth * scale, mapHeight * scale
      );
    } else {
      // Draw tile-based minimap
      for (let y = 0; y < mapData.height; y++) {
        for (let x = 0; x < mapData.width; x++) {
          const tile = mapData.tiles[y][x];
          if (tile > 0) {
            ctx.fillStyle = tile === 1 ? '#444' : '#666';
            ctx.fillRect(
              minimapX + x * scale * 32,
              minimapY + y * scale * 32,
              Math.max(1, scale * 32),
              Math.max(1, scale * 32)
            );
          }
        }
      }
    }
    
    // Draw player position
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(
      minimapX + player.x * scale,
      minimapY + player.y * scale,
      Math.max(2, scale * 2),
      Math.max(2, scale * 2)
    );
    
    // Draw camera view rectangle
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 1;
    const viewWidth = (1024 / camera.zoom) * scale;
    const viewHeight = (576 / camera.zoom) * scale;
    ctx.strokeRect(
      minimapX + camera.x * scale,
      minimapY + camera.y * scale,
      viewWidth,
      viewHeight
    );
  };

  const drawZoomInfo = (ctx) => {
    // Draw zoom level and controls info
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 80);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText(`Zoom: ${(camera.zoom * 100).toFixed(0)}%`, 20, 30);
    ctx.fillText('Controls:', 20, 50);
    ctx.fillText('Mouse Wheel: Zoom', 20, 65);
    ctx.fillText('+/-: Zoom In/Out', 20, 80);
    ctx.fillText('0: Reset Zoom', 20, 95);
  };

  return (
    <canvas
      ref={canvasRef}
      width={1024}
      height={576}
      style={{
        border: '2px solid #4a4a4a',
        background: '#000',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
        display: 'block'
      }}
    />
  );
});


GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;