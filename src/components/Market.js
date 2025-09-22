import React, { useState } from 'react';

const Market = ({ playerCoins, onBuyItem, onSellItem, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('consumables');

  const marketItems = {
    consumables: [
      { type: 'health_potion', name: 'Health Potion', price: 50, icon: '🧪', description: 'Restores 50 health' },
      { type: 'mana_potion', name: 'Mana Potion', price: 30, icon: '💙', description: 'Restores 25 mana' },
      { type: 'strength_potion', name: 'Strength Potion', price: 100, icon: '💪', description: 'Increases attack damage' }
    ],
    weapons: [
      { type: 'iron_sword', name: 'Iron Sword', price: 200, icon: '⚔️', description: '+15 attack damage' },
      { type: 'steel_sword', name: 'Steel Sword', price: 500, icon: '🗡️', description: '+25 attack damage' },
      { type: 'magic_staff', name: 'Magic Staff', price: 800, icon: '🪄', description: '+20 magic damage' }
    ],
    armor: [
      { type: 'leather_armor', name: 'Leather Armor', price: 150, icon: '🦺', description: '+25 max health' },
      { type: 'chain_mail', name: 'Chain Mail', price: 400, icon: '🛡️', description: '+50 max health' },
      { type: 'plate_armor', name: 'Plate Armor', price: 700, icon: '🛡️', description: '+75 max health' }
    ],
    accessories: [
      { type: 'health_ring', name: 'Health Ring', price: 300, icon: '💍', description: '+10 health regen' },
      { type: 'mana_ring', name: 'Mana Ring', price: 250, icon: '💍', description: '+5 mana regen' },
      { type: 'speed_boots', name: 'Speed Boots', price: 350, icon: '👢', description: '+20% movement speed' }
    ]
  };

  const playerItems = [
    { type: 'health_potion', name: 'Health Potion', price: 25, icon: '🧪', quantity: 3 },
    { type: 'mana_potion', name: 'Mana Potion', price: 15, icon: '💙', quantity: 2 },
    { type: 'gold_coin', name: 'Gold Coin', price: 1, icon: '🪙', quantity: 150 }
  ];

  const handleBuy = (item) => {
    if (playerCoins >= item.price) {
      onBuyItem(item);
    } else {
      alert('Not enough coins!');
    }
  };

  const handleSell = (item) => {
    onSellItem(item);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 40, 0.95))',
        border: '2px solid #4a4a4a',
        borderRadius: '15px',
        padding: '20px',
        width: '800px',
        maxHeight: '600px',
        color: 'white',
        fontFamily: 'Courier New, monospace',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, color: '#00ffff' }}>🏪 MARKET</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#ffd700' }}>🪙 {playerCoins}</span>
            <button
              onClick={onClose}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          borderBottom: '1px solid #666'
        }}>
          {Object.keys(marketItems).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                background: selectedCategory === category ? '#4a4a4a' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0',
                textTransform: 'capitalize'
              }}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Buy Items */}
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>🛒 Buy Items</h3>
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #666',
              borderRadius: '8px',
              padding: '10px'
            }}>
              {marketItems[selectedCategory].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    marginBottom: '5px',
                    background: '#2a2a2a'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: '10px', color: '#ccc' }}>{item.description}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#ffd700' }}>🪙 {item.price}</span>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={playerCoins < item.price}
                      style={{
                        background: playerCoins >= item.price ? '#4a4a4a' : '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '5px 10px',
                        cursor: playerCoins >= item.price ? 'pointer' : 'not-allowed',
                        fontSize: '12px'
                      }}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sell Items */}
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#ff6b6b', marginBottom: '10px' }}>💰 Sell Items</h3>
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #666',
              borderRadius: '8px',
              padding: '10px'
            }}>
              {playerItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    marginBottom: '5px',
                    background: '#2a2a2a'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: '10px', color: '#ccc' }}>x{item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#ffd700' }}>🪙 {item.price}</span>
                    <button
                      onClick={() => handleSell(item)}
                      style={{
                        background: '#4a4a4a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
