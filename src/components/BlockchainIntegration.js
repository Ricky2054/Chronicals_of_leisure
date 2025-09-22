import React, { useState, useEffect } from 'react';
import BlockchainService from '../services/BlockchainService';

const BlockchainIntegration = ({ gameState, onGameResult }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isStaked, setIsStaked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [contractState, setContractState] = useState(null);
  const [playerState, setPlayerState] = useState(null);

  useEffect(() => {
    initializeBlockchain();
  }, []);

  const initializeBlockchain = async () => {
    try {
      const initialized = await BlockchainService.initialize();
      if (initialized) {
        const status = BlockchainService.getConnectionStatus();
        setIsConnected(status.isConnected);
        setAccount(status.account);
        
        if (status.isConnected) {
          await updateAllStates();
        }
      }
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
      setError('Failed to initialize blockchain connection');
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await BlockchainService.connectWallet();
      if (result.success) {
        setIsConnected(true);
        setAccount(result.address);
        await updateAllStates();
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setLoading(true);
    
    try {
      const result = await BlockchainService.disconnectWallet();
      if (result.success) {
        setIsConnected(false);
        setAccount(null);
        setBalance(0);
        setIsStaked(false);
        setContractState(null);
        setPlayerState(null);
        setSuccess(result.message);
      }
    } catch (error) {
      setError('Failed to disconnect wallet');
    } finally {
      setLoading(false);
    }
  };

  const updateAllStates = async () => {
    await Promise.all([
      updateBalance(),
      updateContractState(),
      updatePlayerState()
    ]);
  };

  const updateBalance = async () => {
    try {
      const result = await BlockchainService.getBalance();
      if (result.success) {
        setBalance(result.balance);
      }
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const updateContractState = async () => {
    try {
      const result = await BlockchainService.getContractState();
      if (result.success) {
        setContractState(result.state);
      }
    } catch (error) {
      console.error('Failed to update contract state:', error);
    }
  };

  const updatePlayerState = async () => {
    try {
      const result = await BlockchainService.getPlayerState();
      if (result.success) {
        setPlayerState(result.state);
        setIsStaked(result.state.PLAYER_STAKE > 0);
      }
    } catch (error) {
      console.error('Failed to update player state:', error);
    }
  };

  const stakeForGame = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await BlockchainService.stakeForGame(1.0);
      if (result.success) {
        setIsStaked(true);
        setSuccess(`Staked ${result.amount} ALGO successfully! Transaction: ${result.txId}`);
        await updateAllStates();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to stake for game');
    } finally {
      setLoading(false);
    }
  };

  const processGameResult = async (result) => {
    if (!isStaked) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let blockchainResult;
      if (result === 'win') {
        blockchainResult = await BlockchainService.processWin();
        if (blockchainResult.success) {
          setSuccess(`You won! Transaction: ${blockchainResult.txId}`);
        } else {
          setError(blockchainResult.message);
        }
      } else if (result === 'lose') {
        blockchainResult = await BlockchainService.processLose();
        if (blockchainResult.success) {
          setError(`You lost! Transaction: ${blockchainResult.txId}`);
        } else {
          setError(blockchainResult.message);
        }
      }
      
      setIsStaked(false);
      await updateAllStates();
    } catch (error) {
      setError('Failed to process game result');
    } finally {
      setLoading(false);
    }
  };

  const togglePause = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await BlockchainService.togglePause();
      if (result.success) {
        setSuccess(result.message);
        await updateContractState();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to toggle pause');
    } finally {
      setLoading(false);
    }
  };

  const withdrawCommission = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await BlockchainService.withdrawCommission();
      if (result.success) {
        setSuccess(result.message);
        await updateContractState();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to withdraw commission');
    } finally {
      setLoading(false);
    }
  };

  // Listen for game state changes
  useEffect(() => {
    if (gameState && gameState.gameOver && isStaked) {
      // Determine if player won or lost based on game state
      const result = gameState.levelComplete ? 'win' : 'lose';
      processGameResult(result);
    }
  }, [gameState, isStaked]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const formatAddress = (addr) => {
    if (!addr) return 'N/A';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatAmount = (amount) => {
    return (amount / 1000000).toFixed(6);
  };

  return (
    <>
      <style>
        {`
          .blockchain-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 15px;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
            max-height: 80vh;
            overflow-y: auto;
          }
          
          .blockchain-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #00ff00;
            padding-bottom: 5px;
          }
          
          .blockchain-status {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
          }
          
          .status-connected {
            background-color: #00ff00;
            box-shadow: 0 0 10px #00ff00;
          }
          
          .status-disconnected {
            background-color: #ff0000;
            box-shadow: 0 0 10px #ff0000;
          }
          
          .blockchain-info {
            margin-bottom: 10px;
            font-size: 12px;
            line-height: 1.4;
          }
          
          .blockchain-button {
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            background: linear-gradient(45deg, #00ff00, #00cc00);
            border: none;
            border-radius: 5px;
            color: #000;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 12px;
          }
          
          .blockchain-button:hover {
            background: linear-gradient(45deg, #00cc00, #00ff00);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);
          }
          
          .blockchain-button:disabled {
            background: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          
          .blockchain-button.admin {
            background: linear-gradient(45deg, #ff6600, #ff8800);
          }
          
          .blockchain-button.admin:hover {
            background: linear-gradient(45deg, #ff8800, #ff6600);
            box-shadow: 0 5px 15px rgba(255, 102, 0, 0.4);
          }
          
          .blockchain-message {
            margin-top: 10px;
            padding: 8px;
            border-radius: 5px;
            font-size: 11px;
            text-align: center;
            word-break: break-all;
          }
          
          .message-success {
            background: rgba(0, 255, 0, 0.2);
            border: 1px solid #00ff00;
            color: #00ff00;
          }
          
          .message-error {
            background: rgba(255, 0, 0, 0.2);
            border: 1px solid #ff0000;
            color: #ff0000;
          }
          
          .stake-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px 0;
            padding: 5px;
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff00;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
          }
          
          .stake-indicator.active {
            background: rgba(255, 255, 0, 0.2);
            border-color: #ffff00;
            color: #ffff00;
          }
          
          .contract-info {
            margin: 10px 0;
            padding: 8px;
            background: rgba(0, 255, 0, 0.05);
            border: 1px solid #00ff00;
            border-radius: 5px;
            font-size: 11px;
          }
          
          .contract-info h4 {
            margin: 0 0 5px 0;
            color: #ffff00;
            font-size: 12px;
          }
          
          .contract-info div {
            margin: 2px 0;
          }
          
          .admin-section {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #00ff00;
          }
          
          .admin-section h4 {
            margin: 0 0 10px 0;
            color: #ff6600;
            font-size: 12px;
            text-align: center;
          }
        `}
      </style>
      
      <div className="blockchain-panel">
        <div className="blockchain-title">🔗 Chronicle of the Ledger</div>
        
        <div className="blockchain-status">
          <div className={`status-dot ${isConnected ? 'status-connected' : 'status-disconnected'}`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        
        {isConnected && (
          <>
            <div className="blockchain-info">
              <div>Account: {formatAddress(account)}</div>
              <div>Balance: {balance.toFixed(3)} ALGO</div>
              <div>Network: Algorand Testnet</div>
              <div>Contract: {BlockchainService.APP_ID}</div>
            </div>
            
            {contractState && (
              <div className="contract-info">
                <h4>📊 Contract State</h4>
                <div>Game State: {contractState.GAME_STATE === 1 ? 'Active' : 'Idle'}</div>
                <div>Total Staked: {formatAmount(contractState.TOTAL_STAKED || 0)} ALGO</div>
                <div>Commission: {formatAmount(contractState.COMMISSION_POOL || 0)} ALGO</div>
                <div>Paused: {contractState.PAUSED === 1 ? 'Yes' : 'No'}</div>
              </div>
            )}
            
            {playerState && (
              <div className="contract-info">
                <h4>👤 Player State</h4>
                <div>Stake: {formatAmount(playerState.PLAYER_STAKE || 0)} ALGO</div>
                <div>Wins: {playerState.PLAYER_WINS || 0}</div>
                <div>Losses: {playerState.PLAYER_LOSSES || 0}</div>
                <div>Opted In: {playerState.PLAYER_OPTED_IN === 1 ? 'Yes' : 'No'}</div>
              </div>
            )}
            
            <div className={`stake-indicator ${isStaked ? 'active' : ''}`}>
              {isStaked ? '🎯 STAKED FOR GAME' : '⭕ NOT STAKED'}
            </div>
            
            {!isStaked ? (
              <button 
                className="blockchain-button" 
                onClick={stakeForGame}
                disabled={loading || balance < 1.1}
              >
                {loading ? 'Processing...' : 'Stake 1 ALGO'}
              </button>
            ) : (
              <div className="blockchain-info">
                <div>✅ Staked: {formatAmount(playerState?.PLAYER_STAKE || 0)} ALGO</div>
                <div>🎮 Game Active</div>
              </div>
            )}
            
            <div className="admin-section">
              <h4>🔧 Admin Functions</h4>
              <button 
                className="blockchain-button admin" 
                onClick={togglePause}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Toggle Pause'}
              </button>
              <button 
                className="blockchain-button admin" 
                onClick={withdrawCommission}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Withdraw Commission'}
              </button>
            </div>
          </>
        )}
        
        {!isConnected && (
          <button 
            className="blockchain-button" 
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
        
        {isConnected && (
          <button 
            className="blockchain-button" 
            onClick={disconnectWallet}
            disabled={loading}
          >
            Disconnect
          </button>
        )}
        
        {error && (
          <div className="blockchain-message message-error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="blockchain-message message-success">
            {success}
          </div>
        )}
        
        <div className="blockchain-info" style={{ marginTop: '10px', fontSize: '10px' }}>
          <div>💡 Install Wallets:</div>
          <div>📱 Mobile: Pera Wallet App</div>
          <div>🌐 Web: perawallet.app</div>
          <div>🔗 Contract: <a href={BlockchainService.getContractUrl()} target="_blank" rel="noopener noreferrer" style={{color: '#00ff00'}}>View on Explorer</a></div>
        </div>
      </div>
    </>
  );
};

export default BlockchainIntegration;