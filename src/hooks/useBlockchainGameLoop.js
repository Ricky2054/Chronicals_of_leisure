import { useEffect, useRef, useCallback } from 'react';
import SoundManager from '../utils/SoundManager';
import CollectibleManager from '../utils/CollectibleManager';
import BlockchainService from '../services/BlockchainService';

export function useBlockchainGameLoop({
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
  const blockchainServiceRef = useRef(null);
  const isStakedRef = useRef(false);
  const gameStartedRef = useRef(false);

  // Initialize managers
  useEffect(() => {
    soundManagerRef.current = soundManager || new SoundManager();
    collectibleManagerRef.current = new CollectibleManager();
    blockchainServiceRef.current = BlockchainService;
    
    // Initialize blockchain service
    const initBlockchain = async () => {
      try {
        await blockchainServiceRef.current.initialize();
        addDebugLog('🔗 Blockchain service initialized', 'info');
      } catch (error) {
        addDebugLog('❌ Blockchain initialization failed: ' + error.message, 'error');
      }
    };
    
    initBlockchain();
    
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
  }, [soundManager, addDebugLog]);

  // Blockchain-integrated game start
  const startBlockchainGame = useCallback(async () => {
    try {
      addDebugLog('🎮 Starting blockchain-integrated game...', 'info');
      
      // Check if wallet is connected
      const status = blockchainServiceRef.current.getConnectionStatus();
      if (!status.isConnected) {
        addDebugLog('⚠️ Wallet not connected. Connecting automatically...', 'warn');
        const connectResult = await blockchainServiceRef.current.connectWallet();
        if (!connectResult.success) {
          addDebugLog('❌ Failed to connect wallet: ' + connectResult.message, 'error');
          return false;
        }
      }
      
      // Check balance
      const balanceResult = await blockchainServiceRef.current.getBalance();
      if (!balanceResult.success || balanceResult.balance < 1.1) {
        addDebugLog('❌ Insufficient balance. Need at least 1.1 ALGO to stake.', 'error');
        return false;
      }
      
      // Stake for game
      addDebugLog('🎯 Staking 1 ALGO for game participation...', 'info');
      const stakeResult = await blockchainServiceRef.current.stakeForGame(1.0);
      if (!stakeResult.success) {
        addDebugLog('❌ Failed to stake: ' + stakeResult.message, 'error');
        return false;
      }
      
      isStakedRef.current = true;
      gameStartedRef.current = true;
      addDebugLog('✅ Game staked successfully! Transaction: ' + stakeResult.txId, 'success');
      
      // Initialize game state
      setGameState(prev => ({
        ...prev,
        currentLevel: 1,
        phase: 'enemies',
        enemiesDefeated: 0,
        totalEnemies: 0,
        bossDefeated: false,
        levelComplete: false,
        gameOver: false,
        blockchainConnected: true,
        isStaked: true
      }));
      
      return true;
    } catch (error) {
      addDebugLog('❌ Failed to start blockchain game: ' + error.message, 'error');
      return false;
    }
  }, [setGameState, addDebugLog]);

  // Process game results on blockchain
  const processGameResult = useCallback(async (result) => {
    if (!isStakedRef.current || !blockchainServiceRef.current) {
      addDebugLog('⚠️ Not staked or blockchain not available', 'warn');
      return;
    }
    
    try {
      addDebugLog(`🎮 Processing game result: ${result}`, 'info');
      
      let blockchainResult;
      if (result === 'win') {
        blockchainResult = await blockchainServiceRef.current.processWin();
        if (blockchainResult.success) {
          addDebugLog('🏆 Win processed on blockchain! Transaction: ' + blockchainResult.txId, 'success');
          // Add bonus points for blockchain win
          setGameState(prev => ({
            ...prev,
            score: prev.score + 1000, // Bonus for blockchain win
            blockchainWins: (prev.blockchainWins || 0) + 1
          }));
        } else {
          addDebugLog('❌ Failed to process win: ' + blockchainResult.message, 'error');
        }
      } else if (result === 'lose') {
        blockchainResult = await blockchainServiceRef.current.processLose();
        if (blockchainResult.success) {
          addDebugLog('💔 Loss processed on blockchain. Transaction: ' + blockchainResult.txId, 'info');
          setGameState(prev => ({
            ...prev,
            blockchainLosses: (prev.blockchainLosses || 0) + 1
          }));
        } else {
          addDebugLog('❌ Failed to process loss: ' + blockchainResult.message, 'error');
        }
      }
      
      // Reset stake status
      isStakedRef.current = false;
      setGameState(prev => ({ ...prev, isStaked: false }));
      
    } catch (error) {
      addDebugLog('❌ Failed to process game result: ' + error.message, 'error');
    }
  }, [setGameState, addDebugLog]);

  // Enhanced game loop with blockchain integration
  const gameLoop = useCallback((currentTime) => {
    if (!gameStartedRef.current) return;
    
    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;
    frameCountRef.current++;

    // Update game state
    if (player && !gameState.gameOver) {
      // Player movement
      const speed = player.speed + (player.speedBoost > 0 ? 100 : 0);
      
      if (keys.ArrowLeft || keys.a || keys.A) {
        setPlayer(prev => ({
          ...prev,
          x: Math.max(0, prev.x - speed * deltaTime),
          facingRight: false
        }));
      }
      if (keys.ArrowRight || keys.d || keys.D) {
        setPlayer(prev => ({
          ...prev,
          x: Math.min(1024 - prev.width, prev.x + speed * deltaTime),
          facingRight: true
        }));
      }
      if ((keys.ArrowUp || keys.w || keys.W || keys[' ']) && player.onGround) {
        setPlayer(prev => ({
          ...prev,
          velocityY: -(player.jumpPower + (player.jumpBoost > 0 ? 100 : 0))
        }));
      }

      // Gravity
      setPlayer(prev => ({
        ...prev,
        velocityY: prev.velocityY + (player.gravity * deltaTime),
        y: prev.y + prev.velocityY * deltaTime
      }));

      // Ground collision
      if (player.y >= 400) {
        setPlayer(prev => ({
          ...prev,
          y: 400,
          velocityY: 0,
          onGround: true
        }));
      } else {
        setPlayer(prev => ({ ...prev, onGround: false }));
      }

      // Attack
      if ((keys.Enter || keys[' ']) && player.attackCooldown <= 0) {
        setPlayer(prev => ({ ...prev, isAttacking: true, attackCooldown: 0.5 }));
        
        // Check for enemy hits
        setEnemies(prev => prev.map(enemy => {
          if (!enemy.isDead && 
              Math.abs(enemy.x - player.x) < 80 && 
              Math.abs(enemy.y - player.y) < 60) {
            const newHealth = enemy.health - (player.attackDamage + (player.damageBoost > 0 ? 10 : 0));
            if (newHealth <= 0) {
              addDebugLog(`⚔️ Enemy ${enemy.type} defeated!`, 'info');
              setGameState(prevState => ({
                ...prevState,
                enemiesDefeated: prevState.enemiesDefeated + 1,
                score: prevState.score + 100
              }));
              return { ...enemy, isDead: true, health: 0 };
            }
            return { ...enemy, health: newHealth };
          }
          return enemy;
        }));
      }

      // Update attack cooldown
      if (player.attackCooldown > 0) {
        setPlayer(prev => ({
          ...prev,
          attackCooldown: prev.attackCooldown - deltaTime,
          isAttacking: prev.attackCooldown > 0.3
        }));
      }

      // Update powerup effects
      if (player.speedBoost > 0) {
        setPlayer(prev => ({ ...prev, speedBoost: prev.speedBoost - deltaTime }));
      }
      if (player.damageBoost > 0) {
        setPlayer(prev => ({ ...prev, damageBoost: prev.damageBoost - deltaTime }));
      }
      if (player.jumpBoost > 0) {
        setPlayer(prev => ({ ...prev, jumpBoost: prev.jumpBoost - deltaTime }));
      }
    }

    // Check for level completion
    if (gameState.enemiesDefeated >= gameState.totalEnemies && gameState.totalEnemies > 0) {
      if (!gameState.levelComplete) {
        setGameState(prev => ({ ...prev, levelComplete: true }));
        addDebugLog(`🎉 Level ${gameState.currentLevel} completed!`, 'success');
        
        // Process win on blockchain
        if (isStakedRef.current) {
          processGameResult('win');
        }
      }
    }

    // Check for game over
    if (player && player.health <= 0 && !gameState.gameOver) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      addDebugLog('💀 Game Over!', 'error');
      
      // Process loss on blockchain
      if (isStakedRef.current) {
        processGameResult('lose');
      }
    }

    requestAnimationFrame(gameLoop);
  }, [player, gameState, keys, setPlayer, setEnemies, setGameState, addDebugLog, processGameResult]);

  // Start game loop
  useEffect(() => {
    if (gameStartedRef.current) {
      requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  return {
    collectibleManager: collectibleManagerRef.current,
    startBlockchainGame,
    processGameResult,
    isStaked: isStakedRef.current,
    gameStarted: gameStartedRef.current
  };
}

