import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';
import BlockchainPanel from './components/BlockchainPanel';
import BlockchainIntegration from './components/BlockchainIntegration';
import BlockchainGame from './components/BlockchainGame';
import ControlsPanel from './components/ControlsPanel';
import SoundSettings from './components/SoundSettings';
import PlayerStats from './components/PlayerStats';
import CollectibleCounter from './components/CollectibleCounter';
import CollectibleDebug from './components/CollectibleDebug';
import Inventory from './components/Inventory';
import Market from './components/Market';
import MapSelector from './components/MapSelector';
import PointsConverter from './components/PointsConverter';
import GameOverScreen from './components/GameOverScreen';
import HomePage from './components/HomePage';
import ConversationSystem from './components/ConversationSystem';
import LevelTransition from './components/LevelTransition';
import LevelObjective from './components/LevelObjective';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { useInput } from './hooks/useInput';
import { useBlockchain } from './hooks/useBlockchain';
import { useBlockchainGame } from './hooks/useBlockchainGame';
import { useDebug } from './hooks/useDebug';
import MapLoader from './utils/MapLoader';
import SoundManager from './utils/SoundManager';
import ProjectileManager from './utils/ProjectileManager';
import BossManager from './utils/BossManager';
import ConversationManager from './utils/ConversationManager';

function App() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useGameState();
  const [debugLogs, addDebugLog] = useDebug();
  const { connected, address, connectWallet, mintNFT, sendASA } = useBlockchain(addDebugLog);
  const { 
    isInitialized: blockchainInitialized, 
    isStaked, 
    gameActive, 
    autoProcessGameResult,
    blockchainService 
  } = useBlockchainGame();
  
  // Game objects
  const [player, setPlayer] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [particles, setParticles] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [showPointsConverter, setShowPointsConverter] = useState(false);
  const [mapLoader] = useState(() => new MapLoader());
  const [currentMapId, setCurrentMapId] = useState('giant_sword_dungeon');
  const [soundManager] = useState(() => new SoundManager());
  const [projectileManager] = useState(() => new ProjectileManager());
  const [bossManager] = useState(() => new BossManager());
  const [conversationManager] = useState(() => new ConversationManager());
  
  // Game state
  const [showHomePage, setShowHomePage] = useState(true);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [transitionLevel, setTransitionLevel] = useState(1);
  
  // Input handling
  const keys = useInput();
  
  // Generate enemies for different levels
  const generateEnemiesForLevel = useCallback((level) => {
    const baseEnemies = [
      { type: 'goblin', health: 120, maxHealth: 120, attackDamage: 15, speed: 80, attackRange: 60, projectileRange: 0 },
      { type: 'orc', health: 200, maxHealth: 200, attackDamage: 25, speed: 60, attackRange: 80, projectileRange: 0 },
      { type: 'skeleton', health: 150, maxHealth: 150, attackDamage: 20, speed: 70, attackRange: 70, projectileRange: 200 }
    ];

    let enemies = [];
    const positions = [
      { x: 450, y: 350 },
      { x: 550, y: 450 },
      { x: 520, y: 420 },
      { x: 400, y: 300 },
      { x: 600, y: 400 },
      { x: 480, y: 500 }
    ];

    // Level 1: 3 enemies (including 1 skeleton for projectiles)
    if (level === 1) {
      enemies = [
        { ...baseEnemies[0], id: 1, x: positions[0].x, y: positions[0].y, width: 24, height: 24, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false },
        { ...baseEnemies[2], id: 2, x: positions[1].x, y: positions[1].y, width: 28, height: 28, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false }, // Skeleton for projectiles
        { ...baseEnemies[0], id: 3, x: positions[2].x, y: positions[2].y, width: 24, height: 24, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false }
      ];
    }
    // Level 2: 4 enemies (stronger)
    else if (level === 2) {
      enemies = [
        { ...baseEnemies[1], id: 1, x: positions[0].x, y: positions[0].y, width: 32, height: 32, health: 250, maxHealth: 250, attackDamage: 30, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false },
        { ...baseEnemies[2], id: 2, x: positions[1].x, y: positions[1].y, width: 28, height: 28, health: 180, maxHealth: 180, attackDamage: 25, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false },
        { ...baseEnemies[0], id: 3, x: positions[2].x, y: positions[2].y, width: 24, height: 24, health: 150, maxHealth: 150, attackDamage: 20, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false },
        { ...baseEnemies[1], id: 4, x: positions[3].x, y: positions[3].y, width: 32, height: 32, health: 250, maxHealth: 250, attackDamage: 30, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false }
      ];
    }
    // Level 3: 5 enemies (strongest)
    else if (level === 3) {
      enemies = [
        { ...baseEnemies[2], id: 1, x: positions[0].x, y: positions[0].y, width: 28, height: 28, health: 200, maxHealth: 200, attackDamage: 30, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false },
        { ...baseEnemies[1], id: 2, x: positions[1].x, y: positions[1].y, width: 32, height: 32, health: 300, maxHealth: 300, attackDamage: 35, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false },
        { ...baseEnemies[2], id: 3, x: positions[2].x, y: positions[2].y, width: 28, height: 28, health: 200, maxHealth: 200, attackDamage: 30, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false },
        { ...baseEnemies[0], id: 4, x: positions[3].x, y: positions[3].y, width: 24, height: 24, health: 180, maxHealth: 180, attackDamage: 25, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false },
        { ...baseEnemies[1], id: 5, x: positions[4].x, y: positions[4].y, width: 32, height: 32, health: 300, maxHealth: 300, attackDamage: 35, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false }
      ];
    }

    return enemies;
  }, []);

  // Level transition handler
  const handleLevelTransition = useCallback((level) => {
    setTransitionLevel(level);
    setShowLevelTransition(true);
  }, []);

  // Game loop
  const { collectibleManager } = useGameLoop({
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
    onLevelTransition: handleLevelTransition
  });

  // Game handlers
  const handleStartGame = useCallback(() => {
    console.log('🎮 Starting game...');
    setShowHomePage(false);
    
    // Show intro conversation first
    const introConversation = conversationManager.getIntroConversation();
    setCurrentConversation(introConversation);
    setShowConversation(true);
    
    addDebugLog('Showing intro conversation...', 'info');
  }, [conversationManager, addDebugLog]);

  const initializeGame = useCallback(() => {
    console.log('🎮 Initializing game after conversation...');
    
    // Initialize game state for Level 1
    setGameState(prev => ({
      ...prev,
      currentLevel: 1,
      phase: 'enemies',
      enemiesDefeated: 0,
      totalEnemies: 0,
      bossDefeated: false,
      levelComplete: false,
      gameOver: false
    }));
    
    // Initialize game
    const newPlayer = {
      x: 500,
      y: 400,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      speed: 400,
      health: 100,
      maxHealth: 100,
      attackDamage: 15,
      attackCooldown: 0,
      isAttacking: false,
      onGround: false,
      facingRight: true,
      isDodging: false,
      dodgeCooldown: 0,
      invulnerable: 0,
      points: 0,
      attackHit: false,
      // Powerup effects
      speedBoost: 0,
      damageBoost: 0,
      defenseBoost: 0,
      jumpBoost: 0
    };
    
    setPlayer(newPlayer);
    
    // Initialize enemies for Level 1
    const newEnemies = generateEnemiesForLevel(1);
    
    setEnemies(newEnemies);
    
    // Update game state with total enemies
    setGameState(prev => ({ ...prev, totalEnemies: newEnemies.length }));
    
    // Initialize bosses
    bossManager.createBosses();
    
    addDebugLog('Game initialized! Level 1 - Defeat all enemies to face the boss!', 'info');
  }, [setPlayer, setEnemies, setGameState, bossManager, generateEnemiesForLevel, addDebugLog]);

  const handleRestart = useCallback(() => {
    console.log('🔄 Restarting game...');
    setGameState(prev => ({ ...prev, gameOver: false }));
    
    // Reset player state
    const newPlayer = {
      x: 500,
      y: 400,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      speed: 400,
      health: 100,
      maxHealth: 100,
      attackDamage: 15,
      attackCooldown: 0,
      isAttacking: false,
      onGround: false,
      facingRight: true,
      isDodging: false,
      dodgeCooldown: 0,
      invulnerable: 0,
      points: 0,
      attackHit: false,
      // Powerup effects
      speedBoost: 0,
      damageBoost: 0,
      defenseBoost: 0,
      jumpBoost: 0
    };
    
    setPlayer(newPlayer);
    
    // Reset enemies
    const newEnemies = [
      { id: 1, type: 'goblin', x: 450, y: 350, width: 24, height: 24, health: 120, maxHealth: 120, attackDamage: 15, speed: 80, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 60, projectileRange: 0 },
      { id: 2, type: 'orc', x: 550, y: 450, width: 32, height: 32, health: 200, maxHealth: 200, attackDamage: 25, speed: 60, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 80, projectileRange: 0 },
      { id: 3, type: 'goblin', x: 520, y: 420, width: 24, height: 24, health: 120, maxHealth: 120, attackDamage: 15, speed: 80, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 60, projectileRange: 0 }
    ];
    
    setEnemies(newEnemies);
    setParticles([]);
    
    // Reset bosses
    bossManager.createBosses();
    
    // Clear projectiles
    projectileManager.clearProjectiles();
    
    addDebugLog('Game restarted!', 'info');
  }, [setGameState, setPlayer, setEnemies, setParticles, bossManager, projectileManager, addDebugLog]);

  const handleCloseConversation = useCallback(() => {
    setShowConversation(false);
    setCurrentConversation(null);
    
    // Initialize the game after conversation ends
    initializeGame();
  }, [initializeGame]);

  const handleLevelTransitionComplete = useCallback(() => {
    setShowLevelTransition(false);
  }, []);

  // Initialize game
  useEffect(() => {
    if (canvasRef.current) {
      addDebugLog('Game initializing...', 'info');
      
      // Load pre-made map
      const loadMap = async () => {
        try {
          console.log('Loading map:', currentMapId);
          const loadedMap = await mapLoader.loadMap(currentMapId);
          console.log('Loaded map result:', loadedMap);
          
          if (loadedMap && loadedMap.tiles) {
            setMapData(loadedMap);
            addDebugLog(`Loaded map: ${loadedMap.name}`, 'info');
            console.log('Map data set:', loadedMap);
          } else {
            addDebugLog('Failed to load map, using fallback', 'warn');
            // Fallback to simple map
            setMapData({
              tiles: Array(20).fill().map(() => Array(30).fill(2)),
              width: 30,
              height: 20,
              tileSize: 32,
              name: 'Fallback Map'
            });
          }
        } catch (error) {
          console.error('Error loading map:', error);
          addDebugLog('Error loading map, using fallback', 'error');
          setMapData({
            tiles: Array(20).fill().map(() => Array(30).fill(2)),
            width: 30,
            height: 20,
            tileSize: 32,
            name: 'Fallback Map'
          });
        }
      };
      
      loadMap();
      
      // Initialize player at starting position
      const newPlayer = {
        x: 500, // Starting position - center of the giant sword dungeon map
        y: 400, // Starting position - center of the giant sword dungeon map
        width: 64,
        height: 64,
        velocityX: 0,
        velocityY: 0,
        speed: 400, // Balanced speed for enjoyable gameplay
        jumpPower: 400,
        gravity: 800,
        onGround: false,
        health: 100,
        maxHealth: 100,
        mana: 50,
        maxMana: 50,
        facingRight: true,
        isAttacking: false,
        attackCooldown: 0,
        invulnerable: 0,
        attackDamage: 15, // Reduced damage for balanced combat
        isDodging: false,
        dodgeCooldown: 0,
        points: 0, // Add points system
        attackHit: false, // Track if attack has hit this frame
        // Powerup effects
        speedBoost: 0, // Speed boost duration
        damageBoost: 0, // Damage boost duration
        defenseBoost: 0, // Defense boost duration
        jumpBoost: 0 // Jump boost duration
      };
      
      setPlayer(newPlayer);
      
      // Initialize enemies - create some enemies for the map at predefined positions
      const newEnemies = [
        { x: 450, y: 350, width: 32, height: 32, type: 'goblin', health: 120, maxHealth: 120, speed: 150, attackDamage: 15, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 80, projectileRange: 0 },
        { x: 550, y: 450, width: 32, height: 32, type: 'orc', health: 200, maxHealth: 200, speed: 100, attackDamage: 25, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 90, projectileRange: 0 },
        { x: 1200, y: 500, width: 32, height: 32, type: 'skeleton', health: 150, maxHealth: 150, speed: 120, attackDamage: 20, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 70, projectileRange: 300 },
        { x: 300, y: 600, width: 32, height: 32, type: 'goblin', health: 120, maxHealth: 120, speed: 150, attackDamage: 15, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 80, projectileRange: 0 },
        { x: 1000, y: 150, width: 32, height: 32, type: 'orc', health: 200, maxHealth: 200, speed: 100, attackDamage: 25, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 90, projectileRange: 0 },
        { x: 1500, y: 400, width: 32, height: 32, type: 'skeleton', health: 150, maxHealth: 150, speed: 120, attackDamage: 20, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 70, projectileRange: 300 },
        { x: 600, y: 700, width: 32, height: 32, type: 'goblin', health: 120, maxHealth: 120, speed: 150, attackDamage: 15, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 80, projectileRange: 0 },
        { x: 1400, y: 200, width: 32, height: 32, type: 'orc', health: 200, maxHealth: 200, speed: 100, attackDamage: 25, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 90, projectileRange: 0 },
        { x: 520, y: 420, width: 32, height: 32, type: 'goblin', health: 120, maxHealth: 120, speed: 150, attackDamage: 15, isDead: false, facingRight: true, attackCooldown: 0, isAttacking: false, attackRange: 80, projectileRange: 0 }
      ];
      
      setEnemies(newEnemies);
      
      // Initialize inventory with starting items
      setInventory([
        { type: 'health_potion', quantity: 3 },
        { type: 'mana_potion', quantity: 2 },
        { type: 'gold_coin', quantity: 100 }
      ]);
      
      addDebugLog('Game initialized successfully!', 'info');
    }
  }, [addDebugLog]);

  // Auto-process blockchain game results when game state changes
  useEffect(() => {
    if (blockchainInitialized && isStaked && gameActive) {
      autoProcessGameResult(gameState);
    }
  }, [gameState.gameOver, gameState.levelComplete, blockchainInitialized, isStaked, gameActive, autoProcessGameResult]);

  const restartGame = useCallback(() => {
    addDebugLog('Restarting game...', 'info');
    setGameState(prev => ({
      ...prev,
      health: 100,
      mana: 50,
      score: 0,
      level: 1,
      gameOver: false
    }));
    
    // Reset player
    setPlayer(prev => prev ? { ...prev, health: 100, mana: 50, x: 150, y: 350 } : null);
    
    // Reset enemies
    setEnemies([
      { x: 300, y: 400, width: 32, height: 32, type: 'forkling', health: 50, maxHealth: 50, speed: 80, attackDamage: 10, isDead: false, facingRight: true },
      { x: 500, y: 400, width: 32, height: 32, type: 'spoonling', health: 75, maxHealth: 75, speed: 60, attackDamage: 15, isDead: false, facingRight: true }
    ]);
    
    setParticles([]);
  }, [setGameState, addDebugLog]);

  const mintAchievement = useCallback(async () => {
    if (connected) {
      await mintNFT('Game Completion');
    } else {
      addDebugLog('Please connect wallet first', 'warn');
    }
  }, [connected, mintNFT, addDebugLog]);

  const useItem = useCallback((item) => {
    if (item.type === 'health_potion' && player) {
      const newHealth = Math.min(player.maxHealth, player.health + 50);
      setPlayer(prev => ({ ...prev, health: newHealth }));
      setGameState(prev => ({ ...prev, health: newHealth }));
      
      // Remove item from inventory
      setInventory(prev => {
        const newInventory = [...prev];
        const itemIndex = newInventory.findIndex(i => i.type === item.type);
        if (itemIndex !== -1) {
          newInventory[itemIndex].quantity--;
          if (newInventory[itemIndex].quantity <= 0) {
            newInventory.splice(itemIndex, 1);
          }
        }
        return newInventory;
      });
      
      addDebugLog('Used health potion!', 'info');
    } else if (item.type === 'mana_potion' && player) {
      const newMana = Math.min(player.maxMana, player.mana + 25);
      setPlayer(prev => ({ ...prev, mana: newMana }));
      setGameState(prev => ({ ...prev, mana: newMana }));
      
      // Remove item from inventory
      setInventory(prev => {
        const newInventory = [...prev];
        const itemIndex = newInventory.findIndex(i => i.type === item.type);
        if (itemIndex !== -1) {
          newInventory[itemIndex].quantity--;
          if (newInventory[itemIndex].quantity <= 0) {
            newInventory.splice(itemIndex, 1);
          }
        }
        return newInventory;
      });
      
      addDebugLog('Used mana potion!', 'info');
    }
  }, [player, setPlayer, setGameState, addDebugLog]);

  const buyItem = useCallback((item) => {
    if (gameState.coins >= item.price) {
      setGameState(prev => ({ ...prev, coins: prev.coins - item.price }));
      
      // Add item to inventory
      setInventory(prev => {
        const newInventory = [...prev];
        const existingItem = newInventory.find(i => i.type === item.type);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          newInventory.push({ type: item.type, quantity: 1 });
        }
        return newInventory;
      });
      
      addDebugLog(`Bought ${item.name}!`, 'info');
    }
  }, [gameState.coins, setGameState, addDebugLog]);

  const sellItem = useCallback((item) => {
    setGameState(prev => ({ ...prev, coins: prev.coins + item.price }));
    
    // Remove item from inventory
    setInventory(prev => {
      const newInventory = [...prev];
      const itemIndex = newInventory.findIndex(i => i.type === item.type);
      if (itemIndex !== -1) {
        newInventory[itemIndex].quantity--;
        if (newInventory[itemIndex].quantity <= 0) {
          newInventory.splice(itemIndex, 1);
        }
      }
      return newInventory;
    });
    
    addDebugLog(`Sold ${item.name}!`, 'info');
  }, [setGameState, addDebugLog]);

  const changeMap = useCallback(async (newMapId) => {
    setCurrentMapId(newMapId);
    const loadedMap = await mapLoader.loadMap(newMapId);
    if (loadedMap) {
      setMapData(loadedMap);
      addDebugLog(`Changed to map: ${loadedMap.name}`, 'info');
      
      // Reset player position for new map
      setPlayer(prev => prev ? { ...prev, x: 100, y: 100 } : null);
      
      // Create new enemies for the new map
      const newEnemies = [
        { x: 300, y: 300, width: 32, height: 32, type: 'goblin', health: 30, maxHealth: 30, speed: 100, attackDamage: 8, isDead: false, facingRight: true },
        { x: 500, y: 400, width: 32, height: 32, type: 'orc', health: 60, maxHealth: 60, speed: 60, attackDamage: 15, isDead: false, facingRight: true },
        { x: 700, y: 200, width: 32, height: 32, type: 'skeleton', health: 40, maxHealth: 40, speed: 80, attackDamage: 12, isDead: false, facingRight: true },
        { x: 400, y: 500, width: 32, height: 32, type: 'goblin', health: 30, maxHealth: 30, speed: 100, attackDamage: 8, isDead: false, facingRight: true },
        { x: 600, y: 350, width: 32, height: 32, type: 'orc', health: 60, maxHealth: 60, speed: 60, attackDamage: 15, isDead: false, facingRight: true }
      ];
      setEnemies(newEnemies);
    }
  }, [mapLoader, addDebugLog]);


  return (
    <div style={{ position: 'relative', width: '1024px', height: '576px' }}>
        <GameCanvas
          ref={canvasRef}
          player={player}
          enemies={enemies}
          particles={particles}
          gameState={gameState}
          mapData={mapData}
          keys={keys}
          collectibleManager={collectibleManager}
          projectileManager={projectileManager}
          bossManager={bossManager}
        />
      
      <GameUI gameState={gameState} />
      
      <PlayerStats player={player} gameState={gameState} />
      
      <LevelObjective gameState={gameState} enemies={enemies} />
      
      <CollectibleCounter collectibleManager={collectibleManager} />
      
      <CollectibleDebug collectibleManager={collectibleManager} mapData={mapData} />
      
      <BlockchainPanel 
        connected={connected}
        address={address}
        coins={gameState.coins}
        relics={gameState.relics}
        onConnectWallet={connectWallet}
      />
      
      <ControlsPanel />
      
      <SoundSettings soundManager={soundManager} />
      
      {/* Quick access buttons */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 100
      }}>
        <button
          onClick={() => setShowMapSelector(true)}
          style={{
            background: 'linear-gradient(45deg, #4a4a4a, #666)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🗺️ Maps
        </button>
        <button
          onClick={() => setShowInventory(true)}
          style={{
            background: 'linear-gradient(45deg, #4a4a4a, #666)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🎒 Inventory
        </button>
        <button
          onClick={() => setShowMarket(true)}
          style={{
            background: 'linear-gradient(45deg, #4a4a4a, #666)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🏪 Market
        </button>
        <button
          onClick={() => setShowPointsConverter(true)}
          style={{
            background: 'linear-gradient(45deg, #4a4a4a, #666)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🔄 Convert Points
        </button>
      </div>
      
      {showInventory && (
        <Inventory 
          items={inventory}
          onUseItem={useItem}
          onClose={() => setShowInventory(false)}
        />
      )}
      
      {showMarket && (
        <Market 
          playerCoins={gameState.coins}
          onBuyItem={buyItem}
          onSellItem={sellItem}
          onClose={() => setShowMarket(false)}
        />
      )}
      
      {showMapSelector && (
        <MapSelector 
          mapLoader={mapLoader}
          currentMapId={currentMapId}
          onMapChange={changeMap}
          onClose={() => setShowMapSelector(false)}
        />
      )}
      
      {showPointsConverter && (
        <PointsConverter 
          gamePoints={gameState.score || 0}
          onPointsUpdate={(pointsChange) => {
            setGameState(prev => ({ ...prev, score: (prev.score || 0) + pointsChange }));
          }}
          onClose={() => setShowPointsConverter(false)}
        />
      )}
      
      {showHomePage && (
        <HomePage onStartGame={handleStartGame} />
      )}
      
      {showConversation && (
        <ConversationSystem
          isActive={showConversation}
          conversation={currentConversation}
          onClose={handleCloseConversation}
          playerSprite="⚔️"
        />
      )}
      
      {showLevelTransition && (
        <LevelTransition
          isActive={showLevelTransition}
          level={transitionLevel}
          onComplete={handleLevelTransitionComplete}
        />
      )}
      
      {gameState.gameOver && (
        <GameOverScreen 
          gameState={gameState}
          player={player}
          onRestart={handleRestart}
        />
      )}
      
      {/* Blockchain Integration */}
      <BlockchainIntegration 
        gameState={gameState}
        onGameResult={(result) => console.log('Game result:', result)}
      />
      
      {/* Blockchain Game Integration */}
      <BlockchainGame 
        onGameResult={(result, txId) => {
          addDebugLog(`🎮 Blockchain game result: ${result}`, 'info');
          if (txId) {
            addDebugLog(`Transaction ID: ${txId}`, 'info');
          }
          setGameState(prev => ({ ...prev, blockchainGameActive: false }));
        }}
        gameState={gameState}
        blockchainService={blockchainService}
        isInitialized={blockchainInitialized}
        isStaked={isStaked}
        gameActive={gameActive}
      />
    </div>
  );
}

export default App;