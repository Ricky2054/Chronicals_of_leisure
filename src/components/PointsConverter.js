import React, { useState, useEffect, useCallback } from 'react';
import PointsConverterService from '../blockchain/PointsConverter';
import './PointsConverter.css';

const PointsConverter = ({ gamePoints, onPointsUpdate, onClose }) => {
  const [converter] = useState(() => new PointsConverterService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Conversion states
  const [fromType, setFromType] = useState('game');
  const [toType, setToType] = useState('lute');
  const [amount, setAmount] = useState('');
  const [preview, setPreview] = useState(null);
  
  // Coin conversion states
  const [coinAmount, setCoinAmount] = useState('');
  const [coinConversionType, setCoinConversionType] = useState('coinsToPoints');
  
  // Balances
  const [balances, setBalances] = useState({
    gamePoints: 0,
    lutePoints: 0,
    algoBalance: 0
  });
  
  // Conversion rates
  const [rates, setRates] = useState({});

  // Initialize converter
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const success = await converter.initialize();
        setIsInitialized(success);
        
        if (success) {
          const ratesData = converter.getConversionRates();
          setRates(ratesData);
          
          const balancesData = await converter.getPlayerBalances();
          if (balancesData.success) {
            setBalances(prev => ({
              ...prev,
              ...balancesData,
              gamePoints: gamePoints || 0
            }));
          }
        }
      } catch (error) {
        console.error('Points converter initialization error:', error);
        setError('Failed to initialize points converter');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [converter, gamePoints]);

  // Update preview when amount or types change
  useEffect(() => {
    if (amount && fromType && toType && isInitialized) {
      try {
        const previewData = converter.calculateConversion(fromType, toType, parseFloat(amount));
        setPreview(previewData);
      } catch (error) {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [amount, fromType, toType, converter, isInitialized]);

  // Handle conversion
  const handleConversion = useCallback(async () => {
    if (!amount || !preview) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      let result;
      const amountNum = parseFloat(amount);
      
      switch (`${fromType}To${toType}`) {
        case 'gameToLute':
          result = await converter.convertGameToLute(amountNum);
          break;
        case 'luteToAlgo':
          result = await converter.convertLuteToAlgo(amountNum);
          break;
        case 'algoToLute':
          result = await converter.convertAlgoToLute(amountNum);
          break;
        case 'luteToGame':
          result = await converter.convertLuteToGame(amountNum);
          break;
        default:
          throw new Error('Invalid conversion type');
      }
      
      if (result.success) {
        setSuccess(result.message);
        
        // Update balances
        const newBalances = await converter.getPlayerBalances();
        if (newBalances.success) {
          setBalances(prev => ({
            ...prev,
            ...newBalances,
            gamePoints: gamePoints || 0
          }));
        }
        
        // Update game points if needed
        if (onPointsUpdate) {
          onPointsUpdate(result.gamePointsAdded || -result.gamePointsDeducted || 0);
        }
        
        // Clear form
        setAmount('');
        setPreview(null);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setError('Conversion failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [amount, preview, fromType, toType, converter, onPointsUpdate, gamePoints]);

  // Handle coin conversion
  const handleCoinConversion = useCallback(async () => {
    if (!coinAmount) {
      setError('Please enter an amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      let result;
      if (coinConversionType === 'coinsToPoints') {
        result = await converter.convertCoinsToPoints(parseInt(coinAmount));
      } else {
        result = await converter.convertPointsToCoins(parseInt(coinAmount));
      }

      if (result.success) {
        setSuccess(result.message || 'Coin conversion successful!');
        
        // Update balances
        const newBalances = await converter.getPlayerBalances();
        if (newBalances.success) {
          setBalances(prev => ({
            ...prev,
            ...newBalances,
            gamePoints: gamePoints || 0
          }));
        }
        
        // Notify parent component
        if (onPointsUpdate) {
          onPointsUpdate(result.gamePoints || 0);
        }
        
        // Clear form
        setCoinAmount('');
      } else {
        setError(result.error || 'Coin conversion failed');
      }
    } catch (error) {
      console.error('Coin conversion error:', error);
      setError('Coin conversion failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [coinAmount, coinConversionType, converter, gamePoints, onPointsUpdate]);

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Get type display names
  const getTypeName = (type) => {
    switch (type) {
      case 'game': return 'Game Points';
      case 'lute': return 'Lute Points';
      case 'algo': return 'ALGO';
      default: return type;
    }
  };

  // Get type symbols
  const getTypeSymbol = (type) => {
    switch (type) {
      case 'game': return '🎮';
      case 'lute': return '🟡';
      case 'algo': return '🔗';
      default: return '💰';
    }
  };

  if (!isInitialized) {
    return (
      <div className="points-converter-overlay">
        <div className="points-converter">
          <div className="loading">
            <div className="spinner"></div>
            <span>Initializing Points Converter...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="points-converter-overlay">
      <div className="points-converter">
        <div className="converter-header">
          <h3>🔄 Points Converter</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <span>Processing conversion...</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>❌ {error}</span>
            <button onClick={clearMessages} className="close-btn">×</button>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span>✅ {success}</span>
            <button onClick={clearMessages} className="close-btn">×</button>
          </div>
        )}

        {/* Current Balances */}
        <div className="balances-section">
          <h4>Current Balances</h4>
          <div className="balance-grid">
            <div className="balance-item">
              <span className="balance-label">🎮 Game Points:</span>
              <span className="balance-value">{balances.gamePoints}</span>
            </div>
            <div className="balance-item">
              <span className="balance-label">🟡 Lute Points:</span>
              <span className="balance-value">{balances.lutePoints}</span>
            </div>
            <div className="balance-item">
              <span className="balance-label">🔗 ALGO:</span>
              <span className="balance-value">{balances.algoBalance.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Conversion Form */}
        <div className="conversion-section">
          <h4>Convert Points</h4>
          
          <div className="conversion-form">
            <div className="conversion-row">
              <div className="conversion-input">
                <label>From:</label>
                <select 
                  value={fromType} 
                  onChange={(e) => setFromType(e.target.value)}
                  className="type-select"
                >
                  <option value="game">🎮 Game Points</option>
                  <option value="lute">🟡 Lute Points</option>
                  <option value="algo">🔗 ALGO</option>
                </select>
              </div>
              
              <div className="conversion-arrow">→</div>
              
              <div className="conversion-input">
                <label>To:</label>
                <select 
                  value={toType} 
                  onChange={(e) => setToType(e.target.value)}
                  className="type-select"
                >
                  <option value="game">🎮 Game Points</option>
                  <option value="lute">🟡 Lute Points</option>
                  <option value="algo">🔗 ALGO</option>
                </select>
              </div>
            </div>
            
            <div className="amount-input">
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.001"
                className="amount-field"
              />
            </div>
            
            {preview && (
              <div className="conversion-preview">
                <div className="preview-row">
                  <span className="preview-label">You will receive:</span>
                  <span className="preview-value">
                    {getTypeSymbol(toType)} {preview.toAmount.toFixed(6)} {getTypeName(toType)}
                  </span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Conversion Rate:</span>
                  <span className="preview-value">1 {getTypeName(fromType)} = {preview.conversionRate} {getTypeName(toType)}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleConversion}
              disabled={!amount || !preview || loading}
              className="convert-btn"
            >
              Convert Points
            </button>
          </div>
        </div>

        {/* Coin Conversion Section */}
        <div className="coin-conversion-section">
          <h4>💰 Coin Exchange</h4>
          
          <div className="coin-conversion-form">
            <div className="coin-conversion-row">
              <div className="coin-conversion-input">
                <label>Conversion Type:</label>
                <select 
                  value={coinConversionType} 
                  onChange={(e) => setCoinConversionType(e.target.value)}
                  className="type-select"
                >
                  <option value="coinsToPoints">💰 Coins → 🎮 Points</option>
                  <option value="pointsToCoins">🎮 Points → 💰 Coins</option>
                </select>
              </div>
            </div>
            
            <div className="amount-input">
              <label>Amount:</label>
              <input
                type="number"
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
                placeholder={coinConversionType === 'coinsToPoints' ? 'Enter coins' : 'Enter points'}
                min="1"
                step="1"
                className="amount-field"
              />
            </div>
            
            <div className="coin-preview">
              {coinAmount && (
                <div className="preview-row">
                  <span className="preview-label">You will receive:</span>
                  <span className="preview-value">
                    {coinConversionType === 'coinsToPoints' 
                      ? `🎮 ${parseInt(coinAmount) * 10} Game Points`
                      : `💰 ${Math.floor(parseInt(coinAmount) / 10)} Coins (${parseInt(coinAmount) % 10} points remaining)`
                    }
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleCoinConversion}
              disabled={!coinAmount || loading}
              className="convert-btn coin-convert-btn"
            >
              {coinConversionType === 'coinsToPoints' ? 'Convert Coins to Points' : 'Convert Points to Coins'}
            </button>
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="rates-section">
          <h4>Current Rates</h4>
          <div className="rates-grid">
            <div className="rate-item">
              <span>🎮 → 🟡</span>
              <span>1:1</span>
            </div>
            <div className="rate-item">
              <span>🟡 → 🔗</span>
              <span>1000:1</span>
            </div>
            <div className="rate-item">
              <span>🔗 → 🟡</span>
              <span>1:1000</span>
            </div>
            <div className="rate-item">
              <span>🟡 → 🎮</span>
              <span>1:1</span>
            </div>
            <div className="rate-item">
              <span>💰 → 🎮</span>
              <span>1:10</span>
            </div>
            <div className="rate-item">
              <span>🎮 → 💰</span>
              <span>10:1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsConverter;
