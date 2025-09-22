import { useState, useEffect, useCallback } from 'react';
import BlockchainService from '../blockchain/BlockchainService';

export function useBlockchainGame() {
  const [blockchainService] = useState(() => new BlockchainService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStaked, setIsStaked] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // Initialize blockchain service
  useEffect(() => {
    const initialize = async () => {
      try {
        const success = await blockchainService.initialize();
        setIsInitialized(success);
        if (success) {
          console.log('🔗 Blockchain game initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize blockchain game:', error);
      }
    };

    initialize();
  }, [blockchainService]);

  // Check if player is staked
  const checkStakeStatus = useCallback(async () => {
    if (!isInitialized) return false;
    
    try {
      const contractState = await blockchainService.getContractState();
      const staked = contractState && contractState.playerStake > 0;
      setIsStaked(staked);
      setGameActive(staked);
      return staked;
    } catch (error) {
      console.error('Failed to check stake status:', error);
      return false;
    }
  }, [blockchainService, isInitialized]);

  // Stake for game
  const stakeForGame = useCallback(async (amount = 1) => {
    if (!isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const result = await blockchainService.stakeForGame(amount);
      if (result.success) {
        setIsStaked(true);
        setGameActive(true);
        console.log('🎮 Staked for blockchain game!');
      }
      return result;
    } catch (error) {
      console.error('Failed to stake for game:', error);
      throw error;
    }
  }, [blockchainService, isInitialized]);

  // Process win result
  const processWin = useCallback(async () => {
    if (!isInitialized || !isStaked) {
      throw new Error('Not staked for game');
    }

    try {
      const result = await blockchainService.processWin();
      if (result.success) {
        setIsStaked(false);
        setGameActive(false);
        setLastResult({ type: 'win', txId: result.txId });
        console.log('🎮 Win processed on blockchain!');
      }
      return result;
    } catch (error) {
      console.error('Failed to process win:', error);
      throw error;
    }
  }, [blockchainService, isInitialized, isStaked]);

  // Process loss result
  const processLoss = useCallback(async () => {
    if (!isInitialized || !isStaked) {
      throw new Error('Not staked for game');
    }

    try {
      const result = await blockchainService.processLoss();
      if (result.success) {
        setIsStaked(false);
        setGameActive(false);
        setLastResult({ type: 'loss', txId: result.txId });
        console.log('🎮 Loss processed on blockchain!');
      }
      return result;
    } catch (error) {
      console.error('Failed to process loss:', error);
      throw error;
    }
  }, [blockchainService, isInitialized, isStaked]);

  // Get current balance
  const getBalance = useCallback(async () => {
    if (!isInitialized) return 0;
    
    try {
      return await blockchainService.getBalance();
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }, [blockchainService, isInitialized]);

  // Get contract state
  const getContractState = useCallback(async () => {
    if (!isInitialized) return null;
    
    try {
      return await blockchainService.getContractState();
    } catch (error) {
      console.error('Failed to get contract state:', error);
      return null;
    }
  }, [blockchainService, isInitialized]);

  // Auto-process game result based on game state
  const autoProcessGameResult = useCallback(async (gameState) => {
    if (!isInitialized || !isStaked || !gameActive) {
      return;
    }

    try {
      // Check if game is over
      if (gameState.gameOver) {
        // Determine if player won or lost based on game state
        const playerWon = gameState.levelComplete || gameState.currentLevel > 3;
        
        if (playerWon) {
          console.log('🎮 Auto-processing WIN result...');
          await processWin();
        } else {
          console.log('🎮 Auto-processing LOSS result...');
          await processLoss();
        }
      }
    } catch (error) {
      console.error('Failed to auto-process game result:', error);
    }
  }, [isInitialized, isStaked, gameActive, processWin, processLoss]);

  return {
    // State
    isInitialized,
    isStaked,
    gameActive,
    lastResult,
    
    // Service
    blockchainService,
    
    // Methods
    checkStakeStatus,
    stakeForGame,
    processWin,
    processLoss,
    getBalance,
    getContractState,
    autoProcessGameResult
  };
}
