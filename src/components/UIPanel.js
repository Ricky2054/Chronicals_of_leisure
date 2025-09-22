import React from 'react';

const UIPanel = ({ 
  health, 
  maxHealth, 
  mana, 
  maxMana, 
  score, 
  level, 
  house 
}) => {
  const healthPercentage = (health / maxHealth) * 100;
  const manaPercentage = (mana / maxMana) * 100;

  const getHouseClass = (houseName) => {
    switch (houseName.toLowerCase()) {
      case 'forks': return 'house-forks';
      case 'greed': return 'house-greed';
      case 'silence': return 'house-silence';
      default: return '';
    }
  };

  return (
    <div className="ui-panel">
      <div>Health: {health}/{maxHealth}</div>
      <div className="health-bar">
        <div 
          className="health-fill" 
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      
      <div>Mana: {mana}/{maxMana}</div>
      <div className="mana-bar">
        <div 
          className="mana-fill" 
          style={{ width: `${manaPercentage}%` }}
        />
      </div>
      
      <div className="score">Score: {score.toLocaleString()}</div>
      <div>Level: {level}</div>
      <div>House: <span className={getHouseClass(house)}>{house}</span></div>
    </div>
  );
};

export default UIPanel;
