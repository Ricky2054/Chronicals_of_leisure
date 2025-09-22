import { useEffect, useRef, useCallback } from 'react';
import SoundManager from '../utils/SoundManager';
import CollectibleManager from '../utils/CollectibleManager';

export function useGameLoop({
  gameState,
  setGameState,
  player,
  setPlayer,
  enemies,
  setEnemies,
  particles,
  setParticles,
  keys,
  canvasRef,
  addDebugLog,
  soundManager,
  mapData,
  projectileManager,
  bossManager,
  generateEnemiesForLevel,
  onLevelTransition
}) {
  const lastTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const soundManagerRef = useRef(null);
  const collectibleManagerRef = useRef(null);

  // Initialize managers
  useEffect(() => {
    soundManagerRef.current = soundManager || new SoundManager();
    collectibleManagerRef.current = new CollectibleManager();
    
    // Resume audio context on first user interaction
    const resumeAudio = () => {
      if (soundManagerRef.current) {
        soundManagerRef.current.resumeAudioContext();
        document.removeEventListener('click', resumeAudio);
        document.removeEventListener('keydown', resumeAudio);
      }
    };
    
    document.addEventListener('click', resumeAudio);
    document.addEventListener('keydown', resumeAudio);
    
    return () => {
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
    };
  }, [soundManager]);

  // Generate collectibles when map changes
  useEffect(() => {
    if (collectibleManagerRef.current && mapData) {
      let mapWidth, mapHeight;
      
      if (mapData.image) {
        // Image-based map
        mapWidth = mapData.image.width;
        mapHeight = mapData.image.height;
      } else if (mapData.tiles) {
        // Tile-based map
        mapWidth = mapData.tiles[0].length * 32;
        mapHeight = mapData.tiles.length * 32;
      }
      
      if (mapWidth && mapHeight) {
        collectibleManagerRef.current.generateCollectibles(mapData, mapWidth, mapHeight);
        console.log(`🎁 Generated collectibles for map: ${mapWidth}x${mapHeight}`);
      }
    }
  }, [mapData]);

  const updatePlayer = useCallback((deltaTime) => {
    if (!player) return;

    const newPlayer = { ...player };

    // Apply powerup effects to stats
    const baseAcceleration = 3000;
    const acceleration = baseAcceleration * (newPlayer.speedBoost > 0 ? 1.5 : 1); // 50% speed boost
    const friction = 0.8; // friction coefficient - less friction for smoother movement
    
    const baseJumpPower = newPlayer.jumpPower || 400;
    const jumpPower = baseJumpPower * (newPlayer.jumpBoost > 0 ? 1.3 : 1); // 30% jump boost
    
    const baseAttackDamage = 15;
    const attackDamage = baseAttackDamage * (newPlayer.damageBoost > 0 ? 1.5 : 1); // 50% damage boost
    
    // Update player attack damage if powerup is active
    if (newPlayer.damageBoost > 0) {
      newPlayer.attackDamage = attackDamage;
    } else {
      newPlayer.attackDamage = baseAttackDamage;
    }

    // Get pressed keys for debugging
    const pressedKeys = Object.keys(keys).filter(key => keys[key]);
    
    // Reduced debug logging for performance
    if (Math.random() < 0.01 && pressedKeys.length > 0) { // Only log 1% of the time
      console.log('🔑 Keys currently pressed:', pressedKeys);
    }
    
    // Reduced debug logging for performance
    if (Math.random() < 0.005 && pressedKeys.length > 0) { // Only log 0.5% of the time
      console.log('👤 Player state:', {
        x: newPlayer.x,
        y: newPlayer.y,
        isAttacking: newPlayer.isAttacking,
        attackCooldown: newPlayer.attackCooldown,
        health: newPlayer.health,
        velocityX: newPlayer.velocityX,
        velocityY: newPlayer.velocityY
      });
    }
    

    // Reset onGround at start of frame
    newPlayer.onGround = false;

    // Movement with acceleration - Full 2D movement
    
    // Horizontal movement
    if (keys['KeyA'] || keys['ArrowLeft']) {
      newPlayer.velocityX -= acceleration * deltaTime;
      newPlayer.facingRight = false;
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
      newPlayer.velocityX += acceleration * deltaTime;
      newPlayer.facingRight = true;
    }
    
    // Vertical movement (up/down)
    if (keys['KeyW'] || keys['ArrowUp']) {
      newPlayer.velocityY -= acceleration * deltaTime;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
      newPlayer.velocityY += acceleration * deltaTime;
    }
    
    // Apply friction when not moving horizontally
    if (!keys['KeyA'] && !keys['ArrowLeft'] && !keys['KeyD'] && !keys['ArrowRight']) {
      newPlayer.velocityX *= friction;
    }
    
    // Apply friction when not moving vertically
    if (!keys['KeyW'] && !keys['ArrowUp'] && !keys['KeyS'] && !keys['ArrowDown']) {
      newPlayer.velocityY *= friction;
    }
    
    // Limit max speed
    const maxSpeed = newPlayer.speed;
    newPlayer.velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, newPlayer.velocityX));
    newPlayer.velocityY = Math.max(-maxSpeed, Math.min(maxSpeed, newPlayer.velocityY));
    
    // Minimal velocity debug logging
    if ((keys['KeyA'] || keys['KeyD'] || keys['ArrowLeft'] || keys['ArrowRight'] || keys['KeyW'] || keys['KeyS'] || keys['ArrowUp'] || keys['ArrowDown']) && frameCountRef.current % 120 === 0) {
      console.log('⚡ Velocity after calculation:', {
        velocityX: newPlayer.velocityX,
        velocityY: newPlayer.velocityY,
        maxSpeed: maxSpeed
      });
    }

    // Jumping with better physics (Space key only)
    if (keys['Space'] && newPlayer.onGround) {
      newPlayer.velocityY = -jumpPower; // Use powerup-modified jump power
      newPlayer.onGround = false;
      
      // Play jump sound
      if (soundManagerRef.current) {
        soundManagerRef.current.playSound('jump');
      }
    }
    
    // Dodge system (Shift key)
    if (keys['ShiftLeft'] || keys['ShiftRight']) {
      if (newPlayer.dodgeCooldown <= 0) {
        newPlayer.isDodging = true;
        newPlayer.dodgeCooldown = 2.0; // 2 second dodge cooldown
        newPlayer.invulnerable = 0.5; // 0.5 seconds of invulnerability
        newPlayer.velocityX *= 2; // Boost movement speed during dodge
        newPlayer.velocityY *= 2;
        console.log('Player dodged!');
      }
    }
    
    // Update dodge cooldown
    if (newPlayer.dodgeCooldown > 0) {
      newPlayer.dodgeCooldown = Math.max(0, newPlayer.dodgeCooldown - deltaTime);
    }
    
    // Reset dodge state
    if (newPlayer.isDodging && newPlayer.dodgeCooldown <= 1.5) {
      newPlayer.isDodging = false;
    }

    // Attack cooldown management - DEBUG
    if (keys['KeyJ'] && newPlayer.attackCooldown <= 0) {
      console.log('🔴 J KEY PRESSED - Setting attack cooldown');
      newPlayer.attackCooldown = 0.5; // Cooldown between attacks
      addDebugLog('Player attacked!', 'info');
      
      // Play attack sound
      if (soundManagerRef.current) {
        soundManagerRef.current.playSound('attack');
      }
    }
    
    // Debug player state
    if (Math.random() < 0.01) { // Log occasionally
      console.log('🔴 Player state:', {
        x: newPlayer.x.toFixed(1),
        y: newPlayer.y.toFixed(1),
        health: newPlayer.health,
        points: newPlayer.points,
        attackCooldown: newPlayer.attackCooldown.toFixed(2)
      });
    }

    // Physics - No gravity for free 2D movement
    const oldX = newPlayer.x;
    const oldY = newPlayer.y;
    newPlayer.x += newPlayer.velocityX * deltaTime;
    newPlayer.y += newPlayer.velocityY * deltaTime;
    
    // Debug logging for position changes
    if (Math.abs(newPlayer.x - oldX) > 0.1 || Math.abs(newPlayer.y - oldY) > 0.1) {
      console.log('🏃 Player moved:', { 
        oldX, oldY, 
        newX: newPlayer.x, newY: newPlayer.y,
        deltaX: newPlayer.x - oldX, deltaY: newPlayer.y - oldY,
        velocityX: newPlayer.velocityX, velocityY: newPlayer.velocityY
      });
    }
    
    // Minimal position debug logging
    if ((keys['KeyA'] || keys['KeyD'] || keys['ArrowLeft'] || keys['ArrowRight'] || keys['KeyW'] || keys['KeyS'] || keys['ArrowUp'] || keys['ArrowDown']) && frameCountRef.current % 120 === 0) {
      console.log('📍 Position update:', {
        oldX, oldY,
        newX: newPlayer.x, newY: newPlayer.y,
        deltaX: newPlayer.x - oldX, deltaY: newPlayer.y - oldY,
        velocityX: newPlayer.velocityX, velocityY: newPlayer.velocityY,
        deltaTime: deltaTime
      });
    }
    
    // Test movement removed - system is working properly now
    // newPlayer.velocityY += newPlayer.gravity * deltaTime; // Disabled for free 2D movement

    // Map collision detection - ENABLED to prevent leaving map
    const tileSize = 32;
    const mapWidth = 64;
    const mapHeight = 48;
    const worldWidth = mapWidth * tileSize;
    const worldHeight = mapHeight * tileSize;
    
    // Keep player within map bounds - prevent leaving the map
    if (newPlayer.x < 0) {
      newPlayer.x = 0;
      newPlayer.velocityX = 0;
    }
    if (newPlayer.x + newPlayer.width > worldWidth) {
      newPlayer.x = worldWidth - newPlayer.width;
      newPlayer.velocityX = 0;
    }
    if (newPlayer.y < 0) {
      newPlayer.y = 0;
      newPlayer.velocityY = 0;
    }
    if (newPlayer.y + newPlayer.height > worldHeight) {
      newPlayer.y = worldHeight - newPlayer.height;
      newPlayer.velocityY = 0;
    }

    // Update cooldowns
    if (newPlayer.attackCooldown > 0) {
      newPlayer.attackCooldown = Math.max(0, newPlayer.attackCooldown - deltaTime);
    }
    
    // Attack state removed - attacks are instant
    if (newPlayer.invulnerable > 0) {
      newPlayer.invulnerable = Math.max(0, newPlayer.invulnerable - deltaTime);
    }

    // Update powerup effects
    if (newPlayer.speedBoost > 0) {
      newPlayer.speedBoost = Math.max(0, newPlayer.speedBoost - deltaTime);
    }
    if (newPlayer.damageBoost > 0) {
      newPlayer.damageBoost = Math.max(0, newPlayer.damageBoost - deltaTime);
    }
    if (newPlayer.defenseBoost > 0) {
      newPlayer.defenseBoost = Math.max(0, newPlayer.defenseBoost - deltaTime);
    }
    if (newPlayer.jumpBoost > 0) {
      newPlayer.jumpBoost = Math.max(0, newPlayer.jumpBoost - deltaTime);
    }

    // Ensure health never goes below 0
    newPlayer.health = Math.max(0, newPlayer.health);
    
    // Check for game over if health is 0
    if (newPlayer.health <= 0 && !gameState.gameOver) {
      console.log('💀 PLAYER HEALTH REACHED ZERO! Triggering game over...');
      
      // Play death sound
      if (soundManagerRef.current) {
        soundManagerRef.current.playComplexSound('explosion');
      }
      
      setGameState(prev => ({
        ...prev,
        gameOver: true
      }));
    }

    setPlayer(newPlayer);
  }, [player, keys, addDebugLog, setPlayer, gameState.gameOver, setGameState]);

  // Check collectible collisions
  const checkCollectibleCollisions = useCallback((player) => {
    if (!collectibleManagerRef.current || !player) return;

    // Only check collisions every few frames for performance
    if (frameCountRef.current % 3 !== 0) return;

    const collectedItems = collectibleManagerRef.current.checkCollisions(player);
    
    collectedItems.forEach(item => {
      console.log(`🎁 Collected ${item.type}! Value: ${item.value}`);
      
      // Play collection sound
      if (soundManagerRef.current) {
        if (item.type === 'coin' || item.type === 'rare_gem') {
          soundManagerRef.current.playSound('coin');
        } else {
          soundManagerRef.current.playSound('levelUp');
        }
      }

      // Apply item effects
      switch (item.type) {
        case 'coin':
          setGameState(prev => ({
            ...prev,
            coins: prev.coins + item.value
          }));
          break;
          
        case 'rare_gem':
          setGameState(prev => ({
            ...prev,
            coins: prev.coins + item.value
          }));
          break;
          
        case 'health_potion':
          setPlayer(prev => ({
            ...prev,
            health: Math.min(prev.maxHealth, prev.health + item.value)
          }));
          break;
          
        case 'speed_boost':
          setPlayer(prev => ({
            ...prev,
            speedBoost: prev.speedBoost + item.duration
          }));
          break;
          
        case 'damage_boost':
          setPlayer(prev => ({
            ...prev,
            damageBoost: prev.damageBoost + item.duration
          }));
          break;
          
        case 'defense_boost':
          setPlayer(prev => ({
            ...prev,
            defenseBoost: prev.defenseBoost + item.duration
          }));
          break;
          
        case 'jump_boost':
          setPlayer(prev => ({
            ...prev,
            jumpBoost: prev.jumpBoost + item.duration
          }));
          break;
      }
    });
  }, [setPlayer, setGameState]);

  const updateEnemies = useCallback((deltaTime) => {
    if (!player) return;

    // Track enemies that are attacking to deal damage
    const attackingEnemies = [];

    setEnemies(prevEnemies => 
      prevEnemies.map(enemy => {
        if (enemy.isDead) return enemy;

        const newEnemy = { ...enemy };

        // Calculate distance to player
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Debug logging for first enemy (reduced frequency)
        if (enemy === prevEnemies[0] && Math.random() < 0.01) {
          console.log('Enemy update:', {
            type: enemy.type,
            x: enemy.x.toFixed(1),
            y: enemy.y.toFixed(1),
            distance: distance.toFixed(1),
            attackRange: enemy.attackRange,
            attackCooldown: enemy.attackCooldown.toFixed(2)
          });
        }

        // Reset velocity
        newEnemy.velocityX = 0;
        newEnemy.velocityY = 0;

        if (distance < 800) { // Even larger detection range for more aggressive enemies
          // Face the player
          newEnemy.facingRight = dx > 0;
          
          // Debug logging for enemy detection (less frequent)
          if (Math.random() < 0.01) { // Log very occasionally to reduce spam
            console.log(`🔴 Enemy ${enemy.type} detected player! Distance: ${distance.toFixed(1)}, Position: (${enemy.x.toFixed(1)}, ${enemy.y.toFixed(1)})`);
          }
          
          // Move towards player if not in attack range
          if (distance > enemy.attackRange) {
          // Move towards player
            if (Math.abs(dx) > 20) {
            if (dx > 0) {
              newEnemy.velocityX = enemy.speed;
            } else {
              newEnemy.velocityX = -enemy.speed;
            }
          }

          // Jump if player is above
          if (dy < -50 && Math.abs(dx) < 100) {
              newEnemy.velocityY = -200;
            }
          } else if (distance < enemy.attackRange) {
            // Attack if close enough
            if (enemy.attackCooldown <= 0) {
              console.log(`🔴 Enemy ${enemy.type} ATTACKING! Distance: ${distance.toFixed(1)}, Cooldown: ${enemy.attackCooldown}`);
              console.log(`🔴 Enemy attack range: ${enemy.attackRange}, Attack damage: ${enemy.attackDamage}`);
              
              // Track this enemy for damage dealing
              attackingEnemies.push({
                type: enemy.type,
                damage: enemy.attackDamage
              });
              
              // Play enemy attack sound
              if (soundManagerRef.current) {
                soundManagerRef.current.playSound('attack', { frequency: 120 });
              }
              
              newEnemy.attackCooldown = 1.0; // Faster attack cooldown for more aggressive enemies
            } else {
              // In attack range but on cooldown - stay close
              if (Math.random() < 0.1) { // Log occasionally
                console.log(`🔴 Enemy ${enemy.type} in range but cooldown: ${enemy.attackCooldown.toFixed(2)}`);
              }
            }
            newEnemy.velocityX = 0; // Stop moving when in attack range
            newEnemy.velocityY = 0;
          } else if (distance < enemy.projectileRange && enemy.projectileRange > 0 && enemy.attackCooldown <= 0) {
            // Projectile attack for ranged enemies
            newEnemy.isAttacking = true;
            newEnemy.attackCooldown = 3.0; // 3 second cooldown for projectiles
            newEnemy.velocityX = 0;
            newEnemy.velocityY = 0;
            
            // Create projectile
            if (projectileManager) {
              const projectileType = enemy.type === 'skeleton' ? 'bone' : 'fireball';
              projectileManager.createProjectile(
                projectileType,
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2,
                player.x + player.width / 2,
                player.y + player.height / 2,
                enemy.attackDamage,
                200,
                'enemy'
              );
              console.log(`🔥 Enemy ${enemy.type} fired ${projectileType} projectile at player!`);
            }
          }
        } else {
          // Idle behavior - random movement
          if (Math.random() < 0.01) {
            newEnemy.velocityX = (Math.random() - 0.5) * enemy.speed * 0.3;
            newEnemy.facingRight = newEnemy.velocityX > 0;
          }
        }

        // Update attack cooldown
        if (enemy.attackCooldown > 0) {
          newEnemy.attackCooldown = Math.max(0, enemy.attackCooldown - deltaTime);
          if (Math.random() < 0.05) { // Log occasionally
            console.log(`🔴 Enemy ${enemy.type} cooldown: ${enemy.attackCooldown.toFixed(2)} -> ${newEnemy.attackCooldown.toFixed(2)}`);
          }
        }
        
        // No need for isAttacking state - attacks are instant

        // Apply physics - No gravity for free 2D movement
        const oldX = newEnemy.x;
        const oldY = newEnemy.y;
        newEnemy.x += newEnemy.velocityX * deltaTime;
        newEnemy.y += newEnemy.velocityY * deltaTime;
        
        // Keep enemies within map bounds
        const enemyTileSize = 32;
        const enemyMapWidth = 64;
        const enemyMapHeight = 48;
        const enemyWorldWidth = enemyMapWidth * enemyTileSize;
        const enemyWorldHeight = enemyMapHeight * enemyTileSize;
        
        if (newEnemy.x < 0) {
          newEnemy.x = 0;
          newEnemy.velocityX = 0;
        }
        if (newEnemy.x + newEnemy.width > enemyWorldWidth) {
          newEnemy.x = enemyWorldWidth - newEnemy.width;
          newEnemy.velocityX = 0;
        }
        if (newEnemy.y < 0) {
          newEnemy.y = 0;
          newEnemy.velocityY = 0;
        }
        if (newEnemy.y + newEnemy.height > enemyWorldHeight) {
          newEnemy.y = enemyWorldHeight - newEnemy.height;
          newEnemy.velocityY = 0;
        }
        
        // Debug logging for enemy position changes
        if (Math.abs(newEnemy.x - oldX) > 0.1 || Math.abs(newEnemy.y - oldY) > 0.1) {
          console.log('Enemy moved:', { 
            type: enemy.type,
            oldX, oldY, 
            newX: newEnemy.x, newY: newEnemy.y,
            deltaX: newEnemy.x - oldX, deltaY: newEnemy.y - oldY,
            velocityX: newEnemy.velocityX, velocityY: newEnemy.velocityY
          });
        }
        // newEnemy.velocityY += 800 * deltaTime; // Gravity disabled for free 2D movement

        // Ground collision - DISABLED FOR TESTING
        // if (newEnemy.y + newEnemy.height >= 1472) { // Map height - 2 tiles
        //   newEnemy.y = 1472 - newEnemy.height;
        //   newEnemy.velocityY = 0;
        // }

        // Keep in bounds - DISABLED FOR TESTING
        // if (newEnemy.x < 0) {
        //   newEnemy.x = 0;
        //   newEnemy.velocityX = 0;
        // }
        // if (newEnemy.x + newEnemy.width > 2048) { // Map width
        //   newEnemy.x = 2048 - newEnemy.width;
        //   newEnemy.velocityX = 0;
        // }

        return newEnemy;
      })
    );

    // Deal damage to player from attacking enemies
    if (attackingEnemies.length > 0) {
      console.log(`🔴 ${attackingEnemies.length} enemies attacking player!`);
      attackingEnemies.forEach(attacker => {
        console.log(`🔴 Processing attack from ${attacker.type} for ${attacker.damage} damage`);
        setPlayer(prev => {
          const newPlayer = { ...prev };
          
          // Apply defense boost (50% damage reduction)
          const actualDamage = newPlayer.defenseBoost > 0 ? attacker.damage * 0.5 : attacker.damage;
          newPlayer.health = Math.max(0, newPlayer.health - actualDamage);
          
          console.log(`🔴 ${attacker.type} dealt ${actualDamage} damage (${attacker.damage} base${newPlayer.defenseBoost > 0 ? ', reduced by defense' : ''})! Health: ${prev.health} -> ${newPlayer.health}`);
          
          // Check for game over
          if (newPlayer.health <= 0) {
            console.log('💀 PLAYER DIED! Triggering game over...');
            
            // Play death sound
            if (soundManagerRef.current) {
              soundManagerRef.current.playComplexSound('explosion');
            }
            
            setGameState(prev => ({
              ...prev,
              gameOver: true
            }));
          }
          
          // Play player damage sound
          if (soundManagerRef.current) {
            soundManagerRef.current.playSound('playerDamage');
          }
          
          return newPlayer;
        });
      });
    } else {
        // Debug: Log when no enemies are attacking (reduced frequency)
        if (Math.random() < 0.001) {
          console.log(`🔴 No enemies attacking this frame. Total enemies: ${enemies.length}, Alive: ${enemies.filter(e => !e.isDead).length}`);
        }
    }
  }, [player, setEnemies, setPlayer]);

  const checkCollisions = useCallback(() => {
    if (!player) return;

    // Check if all enemies are defeated and spawn boss
    const aliveEnemies = enemies.filter(enemy => !enemy.isDead);
    if (aliveEnemies.length === 0 && gameState.phase === 'enemies' && gameState.currentLevel <= 3) {
      console.log(`🎯 All enemies defeated! Spawning boss for Level ${gameState.currentLevel}`);
      setGameState(prev => ({ 
        ...prev, 
        phase: 'boss',
        enemiesDefeated: prev.totalEnemies
      }));
      
      // Spawn boss for current level
      if (bossManager) {
        const boss = bossManager.spawnBossForLevel(gameState.currentLevel);
        if (boss) {
          console.log(`🐉 Boss spawned: ${boss.name}`);
        }
      }
    }

    // Check if boss is defeated
    if (gameState.phase === 'boss' && bossManager) {
      const activeBoss = bossManager.getActiveBoss();
      if (activeBoss && activeBoss.isDead) {
        console.log(`🏆 Boss defeated! Level ${gameState.currentLevel} complete!`);
        
        if (gameState.currentLevel < 3) {
          // Move to next level
          setGameState(prev => ({
            ...prev,
            currentLevel: prev.currentLevel + 1,
            phase: 'enemies',
            enemiesDefeated: 0,
            totalEnemies: 0,
            bossDefeated: false
          }));
          
          // Generate enemies for next level
          if (generateEnemiesForLevel) {
            const newEnemies = generateEnemiesForLevel(gameState.currentLevel + 1);
            setEnemies(newEnemies);
            setGameState(prev => ({ ...prev, totalEnemies: newEnemies.length }));
            addDebugLog(`Level ${gameState.currentLevel + 1} starting with ${newEnemies.length} enemies!`, 'info');
            
            // Trigger level transition
            if (onLevelTransition) {
              onLevelTransition(gameState.currentLevel + 1);
            }
          } else {
            setEnemies([]);
            addDebugLog(`Level ${gameState.currentLevel + 1} starting!`, 'info');
          }
        } else {
          // Game completed!
          setGameState(prev => ({
            ...prev,
            levelComplete: true,
            gameOver: true
          }));
          addDebugLog('Game Completed! All levels finished!', 'success');
        }
      }
    }

    // Player-enemy collisions (including enemy attacks)
    enemies.forEach(enemy => {
      if (enemy.isDead || player.invulnerable > 0) return;

      // Check if enemy is attacking and in range
      if (enemy.isAttacking && enemy.attackCooldown <= 0) {
        const distance = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
        
        if (distance <= enemy.attackRange) {
          console.log(`🔴 Enemy ${enemy.type} ATTACK HIT! Damage: ${enemy.attackDamage}`);
          
          const newPlayer = { ...player };
          newPlayer.health = Math.max(0, newPlayer.health - enemy.attackDamage);
          newPlayer.invulnerable = 1;
          setPlayer(newPlayer);
          
          // Update game state health to match player health
          setGameState(prev => ({ ...prev, health: newPlayer.health }));
          
          console.log(`🔴 Player hit! Health: ${newPlayer.health}/${player.maxHealth}`);
          
          // Play damage sound
          if (soundManagerRef.current) {
            soundManagerRef.current.playSound('playerDamage');
          }
          
          if (newPlayer.health <= 0) {
            setGameState(prev => ({ ...prev, gameOver: true }));
            console.log('🔴 Game Over!');
          }
        }
      }
      
      // Also check basic collision for close contact damage
      if (checkRectCollision(player, enemy)) {
        const newPlayer = { ...player };
        newPlayer.health = Math.max(0, newPlayer.health - enemy.attackDamage);
        newPlayer.invulnerable = 1;
        setPlayer(newPlayer);
        
        // Update game state health to match player health
        setGameState(prev => ({ ...prev, health: newPlayer.health }));
        
        console.log(`🔴 Player collision damage! Health: ${newPlayer.health}/${player.maxHealth}`);
        
        if (newPlayer.health <= 0) {
          setGameState(prev => ({ ...prev, gameOver: true }));
          console.log('🔴 Game Over!');
        }
      }
    });

    // Boss attack vs player collision detection
    if (gameState.phase === 'boss' && bossManager && player.invulnerable <= 0) {
      const activeBoss = bossManager.getActiveBoss();
      if (activeBoss && !activeBoss.isDead) {
        const distance = Math.sqrt((activeBoss.x - player.x) ** 2 + (activeBoss.y - player.y) ** 2);
        
        // Boss attack logic
        if (distance <= activeBoss.attackRange && activeBoss.attackCooldown <= 0) {
          console.log(`🐉 Boss ${activeBoss.name} ATTACK HIT! Distance: ${distance.toFixed(1)}, Damage: ${activeBoss.attackDamage}`);
          
          const newPlayer = { ...player };
          newPlayer.health = Math.max(0, newPlayer.health - activeBoss.attackDamage);
          newPlayer.invulnerable = 1;
          setPlayer(newPlayer);
          
          // Update game state health
          setGameState(prev => ({ ...prev, health: newPlayer.health }));
          
          console.log(`🐉 Player hit by boss! Health: ${newPlayer.health}/${player.maxHealth}`);
          
          // Play damage sound
          if (soundManagerRef.current) {
            soundManagerRef.current.playSound('playerDamage');
          }
          
          if (newPlayer.health <= 0) {
            setGameState(prev => ({ ...prev, gameOver: true }));
            console.log('🐉 Game Over from boss attack!');
          }
          
          // Reset boss attack cooldown
          activeBoss.attackCooldown = 2.0; // 2 second cooldown for boss attacks
        }
      }
    }

    // Player projectile attack during boss fights
    if (keys['KeyX'] && player.attackCooldown <= 0 && gameState.phase === 'boss' && projectileManager) {
      const activeBoss = bossManager.getActiveBoss();
      if (activeBoss && !activeBoss.isDead) {
        console.log(`🗡️ Player firing projectile at boss!`);
        
        // Create player projectile
        projectileManager.createProjectile(
          'player_energy',
          player.x + player.width / 2,
          player.y + player.height / 2,
          activeBoss.x + activeBoss.width / 2,
          activeBoss.y + activeBoss.height / 2,
          player.attackDamage * 0.8, // 80% of melee damage
          200,
          'player'
        );
        
        // Set attack cooldown for projectile
        setPlayer(prev => ({ ...prev, attackCooldown: 1.5 })); // 1.5 second cooldown for projectiles
        
        // Play attack sound
        if (soundManagerRef.current) {
          soundManagerRef.current.playSound('attack');
        }
      }
    }

    // Player attack vs enemies - ENHANCED
    if (keys['KeyJ'] && player.attackCooldown <= 0) {
      console.log('🔴 Player attacking!');
      const attackHitbox = getAttackHitbox(player);
      console.log('🔴 Attack hitbox:', attackHitbox);
      console.log('🔴 Player position:', { x: player.x, y: player.y });
      
      let hitCount = 0;
      setEnemies(prevEnemies => 
        prevEnemies.map(enemy => {
          if (enemy.isDead) return enemy;
          
          const distance = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
          console.log(`🔴 Checking enemy ${enemy.type} at distance ${distance.toFixed(1)}`);
          
          if (distance > 120) { // Increased range for better hit detection
            console.log(`🔴 Enemy ${enemy.type} too far (${distance.toFixed(1)} > 120)`);
            return enemy;
          }
          
          console.log(`🔴 Enemy ${enemy.type} in range! Checking collision...`);
          console.log(`🔴 Enemy position: (${enemy.x}, ${enemy.y})`);

          if (checkRectCollision(attackHitbox, enemy)) {
            hitCount++;
            console.log(`✅ COLLISION DETECTED! Hit enemy ${enemy.type}`);
            const newEnemy = { ...enemy };
            newEnemy.health -= player.attackDamage;
            console.log(`✅ DAMAGE DEALT! ${enemy.type} health: ${enemy.health} -> ${newEnemy.health}`);
            
            // Play hit sound
            if (soundManagerRef.current) {
              soundManagerRef.current.playSound('hit');
            }
            
            if (newEnemy.health <= 0) {
              newEnemy.isDead = true;
              const points = newEnemy.type === 'goblin' ? 10 : newEnemy.type === 'orc' ? 20 : 15;
              console.log(`🔴 ENEMY KILLED! ${newEnemy.type} - Awarding ${points} points`);
              console.log(`🔴 Enemy health before kill: ${enemy.health}, after damage: ${newEnemy.health}`);
              
              // Play enemy death sound
              if (soundManagerRef.current) {
                soundManagerRef.current.playSound('enemyDeath');
              }
              
              // Play coin sound for points
              if (soundManagerRef.current) {
                setTimeout(() => {
                  soundManagerRef.current.playSound('coin');
                }, 100);
              }
              
              setPlayer(prev => {
                const newPoints = prev.points + points;
                console.log(`🔴 POINTS UPDATE: ${prev.points} + ${points} = ${newPoints}`);
                console.log(`🔴 Player state before points:`, { health: prev.health, points: prev.points });
                console.log(`🔴 Player state after points:`, { health: prev.health, points: newPoints });
                return { ...prev, points: newPoints };
              });
            } else {
              console.log(`🔴 Enemy ${enemy.type} still alive: ${enemy.health} -> ${newEnemy.health}`);
            }
            
            return newEnemy;
          } else {
            console.log(`❌ No collision with ${enemy.type}`);
          }
          
          return enemy;
        })
      );
      
      if (hitCount > 0) {
        console.log(`🔴 Attack hit ${hitCount} enemies!`);
      } else {
        console.log(`🔴 Attack missed - no enemies in range`);
      }
    }

    // Player attack vs boss
    if (keys['KeyJ'] && player.attackCooldown <= 0 && gameState.phase === 'boss' && bossManager) {
      const activeBoss = bossManager.getActiveBoss();
      if (activeBoss && !activeBoss.isDead) {
        const attackHitbox = getAttackHitbox(player);
        const distance = Math.sqrt((activeBoss.x - player.x) ** 2 + (activeBoss.y - player.y) ** 2);
        
        if (distance <= 120 && checkRectCollision(attackHitbox, activeBoss)) {
          console.log(`🗡️ Player hit boss ${activeBoss.name}!`);
          activeBoss.health -= player.attackDamage;
          
          // Play hit sound
          if (soundManagerRef.current) {
            soundManagerRef.current.playSound('hit');
          }
          
          if (activeBoss.health <= 0) {
            activeBoss.isDead = true;
            bossManager.defeatBoss();
            
            // Award points and rewards for boss defeat
            const bossPoints = activeBoss.level * 100; // 100, 200, 300 points
            const bossRewards = {
              1: { health: 50, attackDamage: 5, message: "Dragon Lord defeated! +50 Health, +5 Attack!" },
              2: { health: 75, attackDamage: 8, message: "Lich King defeated! +75 Health, +8 Attack!" },
              3: { health: 100, attackDamage: 10, message: "Demon Prince defeated! +100 Health, +10 Attack!" }
            };
            
            const reward = bossRewards[activeBoss.level];
            if (reward) {
              setPlayer(prev => ({
                ...prev,
                points: prev.points + bossPoints,
                health: Math.min(prev.maxHealth, prev.health + reward.health),
                attackDamage: prev.attackDamage + reward.attackDamage
              }));
              
              addDebugLog(reward.message, 'success');
              console.log(`🏆 ${reward.message} +${bossPoints} points!`);
            }
            
            // Play boss death sound
            if (soundManagerRef.current) {
              soundManagerRef.current.playComplexSound('explosion');
            }
          } else {
            console.log(`🗡️ Boss ${activeBoss.name} health: ${activeBoss.health}/${activeBoss.maxHealth}`);
          }
        }
      }
    }
    
    // Enemy attacks are now handled directly in updateEnemies
  }, [player, enemies, setPlayer, setEnemies, setParticles, setGameState, gameState.score, addDebugLog]);

  const updateParticles = useCallback((deltaTime) => {
    setParticles(prev => 
      prev
        .map(particle => ({
          ...particle,
          x: particle.x + (particle.velocityX || 0) * deltaTime,
          y: particle.y + (particle.velocityY || 0) * deltaTime,
          life: particle.life - deltaTime * 2
        }))
        .filter(particle => particle.life > 0)
    );
  }, [setParticles]);

  const gameLoop = useCallback((currentTime) => {
    if (!canvasRef.current || !player) {
      return;
    }

    // Use performance.now() for more reliable timing
    const now = performance.now();

    // Fix FPS calculation - handle first frame
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = now;
      console.log('🕐 First frame, setting lastTime to:', now);
    }

    const rawDeltaTime = (now - lastTimeRef.current) / 1000;
    const deltaTime = Math.min(rawDeltaTime, 0.1); // Cap at 100ms
    
    // Use fixed timestep for consistent movement
    const fixedDeltaTime = 1/60; // 60 FPS fixed timestep
    
    lastTimeRef.current = now;
    frameCountRef.current++;

    // Debug logging every 60 frames (1 second at 60fps)
    if (frameCountRef.current % 60 === 0) {
      const fps = deltaTime > 0 ? Math.round(1 / deltaTime) : 0;
      addDebugLog(`Game loop running, FPS: ${fps}`, 'info');
      console.log('🔄 Game loop running, player position:', player ? { x: player.x, y: player.y } : 'No player');
      console.log('⏱️ Timing debug:', { now, lastTime: lastTimeRef.current, rawDeltaTime, deltaTime, fixedDeltaTime, fps });
      console.log('🎮 Player state in game loop:', {
        isAttacking: player?.isAttacking,
        attackCooldown: player?.attackCooldown,
        health: player?.health
      });
    }
    // Only update game logic if not game over
    if (!gameState.gameOver) {
      updatePlayer(fixedDeltaTime);
      updateEnemies(fixedDeltaTime);
      
      // Update bosses
      if (bossManager) {
        const bosses = bossManager.getBosses();
        bosses.forEach(boss => {
          if (!boss.isDead) {
            bossManager.updateBoss(boss, player, fixedDeltaTime, projectileManager);
          }
        });
      }
      
      // Update projectiles
      if (projectileManager) {
        projectileManager.updateProjectiles(fixedDeltaTime);
        
        // Check projectile collisions
        const activeBoss = bossManager ? bossManager.getActiveBoss() : null;
        const projectileHits = projectileManager.checkCollisions(player, enemies, activeBoss);
        projectileHits.forEach(hit => {
          if (hit.type === 'player') {
            // Player hit by enemy projectile
            setPlayer(prev => {
              const newPlayer = { ...prev };
              newPlayer.health = Math.max(0, newPlayer.health - hit.projectile.damage);
              console.log(`🔴 Player hit by projectile! Health: ${prev.health} -> ${newPlayer.health}`);
              return newPlayer;
            });
            
            // Play hit sound
            if (soundManagerRef.current) {
              soundManagerRef.current.playSound('playerDamage');
            }
          } else if (hit.type === 'enemy') {
            // Enemy hit by player projectile
            setEnemies(prev => prev.map(enemy => {
              if (enemy === hit.target) {
                const newEnemy = { ...enemy };
                newEnemy.health -= hit.projectile.damage;
                console.log(`🔴 Enemy hit by projectile! Health: ${enemy.health} -> ${newEnemy.health}`);
                
                if (newEnemy.health <= 0) {
                  newEnemy.isDead = true;
                  const points = newEnemy.type === 'goblin' ? 10 : newEnemy.type === 'orc' ? 20 : 15;
                  setPlayer(prev => ({ ...prev, points: prev.points + points }));
                  console.log(`🔴 Enemy killed by projectile! +${points} points`);
                }
                
                return newEnemy;
              }
              return enemy;
            }));
            
            // Play hit sound
            if (soundManagerRef.current) {
              soundManagerRef.current.playSound('hit');
            }
          } else if (hit.type === 'boss') {
            // Boss hit by player projectile
            const boss = hit.target;
            boss.health -= hit.projectile.damage;
            console.log(`🗡️ Boss hit by player projectile! Health: ${boss.health}/${boss.maxHealth}`);
            
            // Play hit sound
            if (soundManagerRef.current) {
              soundManagerRef.current.playSound('hit');
            }
            
            if (boss.health <= 0) {
              boss.isDead = true;
              bossManager.defeatBoss();
              
              // Award points and rewards for boss defeat
              const bossPoints = boss.level * 100; // 100, 200, 300 points
              const bossRewards = {
                1: { health: 50, attackDamage: 5, message: "Dragon Lord defeated! +50 Health, +5 Attack!" },
                2: { health: 75, attackDamage: 8, message: "Lich King defeated! +75 Health, +8 Attack!" },
                3: { health: 100, attackDamage: 10, message: "Demon Prince defeated! +100 Health, +10 Attack!" }
              };
              
              const reward = bossRewards[boss.level];
              if (reward) {
                setPlayer(prev => ({
                  ...prev,
                  points: prev.points + bossPoints,
                  health: Math.min(prev.maxHealth, prev.health + reward.health),
                  attackDamage: prev.attackDamage + reward.attackDamage
                }));
                
                setGameState(prev => ({
                  ...prev,
                  points: prev.points + bossPoints,
                  health: Math.min(prev.maxHealth, prev.health + reward.health)
                }));
                
                console.log(`🏆 ${reward.message} Points: +${bossPoints}`);
              }
            }
          }
        });
      }
      
      // Boss attack vs player collision detection
      if (gameState.phase === 'boss' && bossManager && player.invulnerable <= 0) {
        const activeBoss = bossManager.getActiveBoss();
        if (activeBoss && !activeBoss.isDead) {
          const distance = Math.sqrt((activeBoss.x - player.x) ** 2 + (activeBoss.y - player.y) ** 2);
          
          // Boss attack logic
          if (distance <= activeBoss.attackRange && activeBoss.attackCooldown <= 0) {
            console.log(`🐉 Boss ${activeBoss.name} ATTACKING! Distance: ${distance.toFixed(1)}, Damage: ${activeBoss.attackDamage}`);
            
            const newPlayer = { ...player };
            newPlayer.health = Math.max(0, newPlayer.health - activeBoss.attackDamage);
            newPlayer.invulnerable = 1;
            setPlayer(newPlayer);
            
            // Update game state health
            setGameState(prev => ({ ...prev, health: newPlayer.health }));
            
            console.log(`🐉 Player hit by boss! Health: ${newPlayer.health}/${player.maxHealth}`);
            
            // Play damage sound
            if (soundManagerRef.current) {
              soundManagerRef.current.playSound('playerDamage');
            }
            
            if (newPlayer.health <= 0) {
              setGameState(prev => ({ ...prev, gameOver: true }));
              console.log('🐉 Game Over from boss attack!');
            }
            
            // Reset boss attack cooldown
            activeBoss.attackCooldown = 2.0; // 2 second cooldown for boss attacks
          }
          
          // Update boss attack cooldown
          if (activeBoss.attackCooldown > 0) {
            activeBoss.attackCooldown = Math.max(0, activeBoss.attackCooldown - fixedDeltaTime);
          }
        }
      }
      
      checkCollisions(); // ENABLED for combat system
      checkCollectibleCollisions(player); // Check for collectible collisions
      
    // Update collectibles (animations, etc.) - only every few frames for performance
    if (collectibleManagerRef.current && frameCountRef.current % 2 === 0) {
      collectibleManagerRef.current.updateCollectibles(fixedDeltaTime);
    }
      
      updateParticles(fixedDeltaTime);
    }

    // Continue game loop
    if (!gameState.gameOver) {
      requestAnimationFrame(gameLoop);
    }
  }, [canvasRef, updatePlayer, updateEnemies, updateParticles, gameState.gameOver, addDebugLog]);

  useEffect(() => {
    console.log('🔄 useEffect triggered - canvas:', !!canvasRef.current, 'player:', !!player);
    if (canvasRef.current && player) {
      addDebugLog('Starting game loop...', 'info');
      console.log('🚀 Starting game loop...');
      lastTimeRef.current = 0; // Reset time reference
      frameCountRef.current = 0; // Reset frame count
      console.log('🎯 Calling requestAnimationFrame...');
      requestAnimationFrame(gameLoop);
    } else {
      console.log('❌ Game loop not starting - canvas:', !!canvasRef.current, 'player:', !!player);
    }
  }, [gameLoop, player, addDebugLog]);

  // Return collectible manager for rendering
  return {
    collectibleManager: collectibleManagerRef.current
  };
}

// Helper functions
function checkRectCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

function getAttackHitbox(player) {
  const attackWidth = 100; // Increased attack range
  const attackHeight = 80; // Increased attack height
  return {
    x: player.x + player.width / 2 - attackWidth / 2, // Center around player
    y: player.y + player.height / 2 - attackHeight / 2, // Center around player
    width: attackWidth,
    height: attackHeight
  };
}
