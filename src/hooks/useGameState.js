import { useState, useCallback } from 'react';

export function useGameState() {
  const [gameState, setGameState] = useState({
    health: 100,
    mana: 50,
    score: 0,
    level: 1,
    currentLevel: 1, // Current level (1, 2, or 3)
    phase: 'enemies', // 'enemies' or 'boss'
    enemiesDefeated: 0,
    totalEnemies: 0,
    bossDefeated: false,
    house: 'Forks',
    coins: 0,
    relics: 0,
    gameOver: false,
    levelComplete: false
  });

  const updateGameState = useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  return [gameState, updateGameState];
}