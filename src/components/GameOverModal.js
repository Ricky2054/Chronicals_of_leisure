import React from 'react';

const GameOverModal = ({ 
  finalScore, 
  onRestart, 
  onMintAchievement, 
  canMint 
}) => {
  return (
    <div className="game-over">
      <h2>Game Over</h2>
      <p>You have fallen in battle...</p>
      <div className="score">Final Score: {finalScore.toLocaleString()}</div>
      <div>
        <button onClick={onRestart}>Restart</button>
        {canMint && (
          <button onClick={onMintAchievement}>Mint Achievement</button>
        )}
      </div>
    </div>
  );
};

export default GameOverModal;
