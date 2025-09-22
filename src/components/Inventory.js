import React, { useState } from 'react';

const Inventory = ({ items, onUseItem, onClose }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const getItemIcon = (type) => {
    switch (type) {
      case 'health_potion': return '🧪';
      case 'mana_potion': return '💙';
      case 'gold_coin': return '🪙';
      case 'sword': return '⚔️';
      case 'shield': return '🛡️';
      case 'armor': return '🦺';
      case 'key': return '🗝️';
      default: return '📦';
    }
  };

  const getItemName = (type) => {
    switch (type) {
      case 'health_potion': return 'Health Potion';
      case 'mana_potion': return 'Mana Potion';
      case 'gold_coin': return 'Gold Coin';
      case 'sword': return 'Iron Sword';
      case 'shield': return 'Wooden Shield';
      case 'armor': return 'Leather Armor';
      case 'key': return 'Dungeon Key';
      default: return 'Unknown Item';
    }
  };

  const getItemDescription = (type) => {
    switch (type) {
      case 'health_potion': return 'Restores 50 health points';
      case 'mana_potion': return 'Restores 25 mana points';
      case 'gold_coin': return 'Currency for trading';
      case 'sword': return 'Increases attack damage by 10';
      case 'shield': return 'Reduces incoming damage by 5';
      case 'armor': return 'Increases max health by 25';
      case 'key': return 'Opens locked doors';
      default: return 'A mysterious item';
    }
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
        width: '600px',
        maxHeight: '500px',
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
          <h2 style={{ margin: 0, color: '#00ffff' }}>🎒 INVENTORY</h2>
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

        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Items Grid */}
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>Items ({items.length}/20)</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {items.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    background: selectedItem === item ? '#4a4a4a' : '#2a2a2a',
                    border: selectedItem === item ? '2px solid #00ffff' : '1px solid #666',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                    {getItemIcon(item.type)}
                  </div>
                  <div style={{ fontSize: '10px' }}>
                    {getItemName(item.type)}
                  </div>
                  <div style={{ fontSize: '8px', color: '#888' }}>
                    x{item.quantity || 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div style={{ flex: 1 }}>
            {selectedItem ? (
              <div>
                <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>Item Details</h3>
                <div style={{
                  background: '#2a2a2a',
                  border: '1px solid #666',
                  borderRadius: '8px',
                  padding: '15px'
                }}>
                  <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '10px' }}>
                    {getItemIcon(selectedItem.type)}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {getItemName(selectedItem.type)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '10px' }}>
                    {getItemDescription(selectedItem.type)}
                  </div>
                  <div style={{ fontSize: '10px', color: '#888' }}>
                    Quantity: {selectedItem.quantity || 1}
                  </div>
                  
                  {(selectedItem.type === 'health_potion' || selectedItem.type === 'mana_potion') && (
                    <button
                      onClick={() => onUseItem(selectedItem)}
                      style={{
                        background: 'linear-gradient(45deg, #4a4a4a, #666)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        marginTop: '10px',
                        width: '100%'
                      }}
                    >
                      Use Item
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
                Select an item to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
