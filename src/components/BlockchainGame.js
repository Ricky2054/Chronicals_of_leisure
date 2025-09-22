import React, { useState, useEffect, useCallback } from 'react';
import BlockchainService from '../blockchain/BlockchainService';
import { testAlgosdk } from '../utils/testAlgosdk';
import { testGameFunctionality } from '../utils/testGameFunctionality';
import { testIntegration } from '../utils/testIntegration';
import './BlockchainGame.css';

const BlockchainGame = ({ 
  onGameResult, 
  gameState, 
  blockchainService: externalService,
  isInitialized: externalInitialized,
  isStaked: externalStaked,
  gameActive: externalGameActive
}) => {
  const [blockchainService] = useState(() => externalService || new BlockchainService());
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [contractState, setContractState] = useState(null);
  const [isStaked, setIsStaked] = useState(externalStaked || false);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastTransaction, setLastTransaction] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize blockchain service
  useEffect(() => {
    const initializeBlockchain = async () => {
      try {
        setLoading(true);
        setIsInitializing(true);
        
        // Use external initialization if available
        if (externalInitialized && externalService) {
          const status = externalService.getConnectionStatus();
          setConnectionStatus(status);
          
          setWalletConnected(true);
          setWalletAddress(externalService.connectedAccount.addr);
          setBalance(externalService.accountInfo.amount / 1000000);
          setIsStaked(externalStaked || false);
          
          // Get contract state if not in fallback mode
          if (!status.fallbackMode) {
            try {
              const state = await externalService.getContractState();
              setContractState(state);
            } catch (contractError) {
              console.warn('Contract state fetch failed:', contractError);
            }
          }
          
          setSuccess('✅ Blockchain connected successfully!');
        } else {
          // Initialize locally
          const success = await blockchainService.initialize();
          if (success) {
            const status = blockchainService.getConnectionStatus();
            setConnectionStatus(status);
            
            setWalletConnected(true);
            setWalletAddress(blockchainService.connectedAccount.addr);
            setBalance(blockchainService.accountInfo.amount / 1000000);
            
            // Get contract state if not in fallback mode
            if (!status.fallbackMode) {
              try {
                const state = await blockchainService.getContractState();
                setContractState(state);
              } catch (contractError) {
                console.warn('Contract state fetch failed:', contractError);
              }
            }
            
            setSuccess('✅ Blockchain connected successfully!');
          } else {
            setError('❌ Failed to connect to blockchain');
          }
        }
      } catch (error) {
        console.error('Blockchain initialization error:', error);
        setError('Failed to initialize blockchain: ' + error.message);
      } finally {
        setLoading(false);
        setIsInitializing(false);
      }
    };

    initializeBlockchain();
  }, [blockchainService, externalInitialized, externalService, externalStaked]);

  // Update balance periodically
  useEffect(() => {
    const updateBalance = async () => {
      if (walletConnected) {
        const newBalance = await blockchainService.getBalance();
        setBalance(newBalance);
      }
    };

    const interval = setInterval(updateBalance, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [walletConnected, blockchainService]);

  // Handle stake for game
  const handleStake = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const result = await blockchainService.stakeForGame(1);
      
      if (result.success) {
        setIsStaked(true);
        setStakeAmount(1);
        setLastTransaction(result.txId);
        setSuccess(result.message);
        
        // Update contract state
        const state = await blockchainService.getContractState();
        setContractState(state);
        
        // Update balance
        const newBalance = await blockchainService.getBalance();
        setBalance(newBalance);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Stake error:', error);
      setError('Stake failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [blockchainService]);

  // Handle win processing
  const handleWin = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const result = await blockchainService.processWin();
      
      if (result.success) {
        setIsStaked(false);
        setStakeAmount(0);
        setLastTransaction(result.txId);
        setSuccess(result.message);
        
        // Update contract state
        const state = await blockchainService.getContractState();
        setContractState(state);
        
        // Update balance
        const newBalance = await blockchainService.getBalance();
        setBalance(newBalance);
        
        // Notify parent component
        if (onGameResult) {
          onGameResult('win', result.txId);
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Win processing error:', error);
      setError('Win processing failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [blockchainService, onGameResult]);

  // Handle loss processing
  const handleLoss = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const result = await blockchainService.processLoss();
      
      if (result.success) {
        setIsStaked(false);
        setStakeAmount(0);
        setLastTransaction(result.txId);
        setSuccess(result.message);
        
        // Update contract state
        const state = await blockchainService.getContractState();
        setContractState(state);
        
        // Update balance
        const newBalance = await blockchainService.getBalance();
        setBalance(newBalance);
        
        // Notify parent component
        if (onGameResult) {
          onGameResult('loss', result.txId);
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Loss processing error:', error);
      setError('Loss processing failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [blockchainService, onGameResult]);

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Manual reconnect with real credentials
  const handleReconnect = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      console.log('Manually reconnecting with real credentials...');
      
      // First test algosdk
      console.log('Testing algosdk...');
      const testResult = await testAlgosdk();
      if (!testResult.success) {
        setError(`❌ Algosdk test failed: ${testResult.error}`);
        return;
      }
      console.log('✅ Algosdk test passed');
      
      // Then try to initialize blockchain service
      const success = await blockchainService.initialize();
      
      if (success) {
        const status = blockchainService.getConnectionStatus();
        setConnectionStatus(status);
        
        setWalletConnected(true);
        setWalletAddress(blockchainService.connectedAccount.addr);
        setBalance(blockchainService.accountInfo.amount / 1000000);
        
        // Get contract state if not in fallback mode
        if (!status.fallbackMode) {
          try {
            const state = await blockchainService.getContractState();
            setContractState(state);
          } catch (contractError) {
            console.warn('Contract state fetch failed:', contractError);
          }
        }
        
        setSuccess('✅ Reconnected successfully!');
      } else {
        setError('❌ Failed to reconnect wallet');
      }
    } catch (error) {
      console.error('Reconnect error:', error);
      setError('❌ Reconnect failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [blockchainService]);

  return (
    <div className="blockchain-game">
      <div className="blockchain-header">
        <h3>🔗 Blockchain Game</h3>
        <div className="connection-status">
          {isInitializing ? (
            <span className="loading">🔄 Initializing...</span>
          ) : walletConnected ? (
            <span className="connected">🟢 Connected</span>
          ) : (
            <span className="disconnected">🔴 Disconnected</span>
          )}
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>Processing blockchain transaction...</span>
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

      {walletConnected && (
        <div className="wallet-info">
          <div className="info-row">
            <span className="label">Address:</span>
            <span className="value">{walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}</span>
          </div>
          <div className="info-row">
            <span className="label">Balance:</span>
            <span className="value">{balance.toFixed(6)} ALGO</span>
          </div>
          {connectionStatus && (
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`value status-indicator ${connectionStatus.overallStatus}`}>
                {connectionStatus.overallStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>
          )}
          <div className="info-row">
            <span className="label">Staked:</span>
            <span className="value">{isStaked ? `${stakeAmount} ALGO` : 'Not staked'}</span>
          </div>
        </div>
      )}

      {contractState && (
        <div className="contract-info">
          <h4>Contract State</h4>
          <div className="info-row">
            <span className="label">Game State:</span>
            <span className="value">{contractState.gameState === 0 ? 'Idle' : 'Active'}</span>
          </div>
          <div className="info-row">
            <span className="label">Total Staked:</span>
            <span className="value">{(contractState.totalStaked / 1000000).toFixed(6)} ALGO</span>
          </div>
          <div className="info-row">
            <span className="label">Commission Pool:</span>
            <span className="value">{(contractState.commissionPool / 1000000).toFixed(6)} ALGO</span>
          </div>
          <div className="info-row">
            <span className="label">Paused:</span>
            <span className="value">{contractState.paused ? 'Yes' : 'No'}</span>
          </div>
          <div className="info-row">
            <span className="label">Your Wins:</span>
            <span className="value">{contractState.playerWins}</span>
          </div>
          <div className="info-row">
            <span className="label">Your Losses:</span>
            <span className="value">{contractState.playerLosses}</span>
          </div>
        </div>
      )}

      <div className="game-controls">
        {!isStaked ? (
          <button 
            onClick={handleStake} 
            disabled={loading || !walletConnected || balance < 1}
            className="stake-btn"
          >
            Stake 1 ALGO to Play
          </button>
        ) : (
          <div className="staked-controls">
            <div className="staked-status">
              ✅ Staked for game! You can now play.
            </div>
            <div className="result-buttons">
              <button 
                onClick={handleWin} 
                disabled={loading}
                className="win-btn"
              >
                Process Win
              </button>
              <button 
                onClick={handleLoss} 
                disabled={loading}
                className="loss-btn"
              >
                Process Loss
              </button>
            </div>
          </div>
        )}
      </div>

      {lastTransaction && (
        <div className="transaction-info">
          <h4>Last Transaction</h4>
          <div className="info-row">
            <span className="label">TX ID:</span>
            <a 
              href={blockchainService.getExplorerUrl(lastTransaction)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="tx-link"
            >
              {lastTransaction.slice(0, 8)}...{lastTransaction.slice(-8)}
            </a>
          </div>
        </div>
      )}

      <div className="explorer-links">
        {walletAddress && walletAddress.startsWith('LUTE_WALLET_ADDRESS_') && (
          <a 
            href={blockchainService.getAccountExplorerUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="explorer-link"
          >
            View Account on Explorer
          </a>
        )}
        {(!walletConnected || !walletAddress.startsWith('LUTE_WALLET_ADDRESS_')) && (
          <div className="reconnect-buttons">
            <button 
              onClick={handleReconnect} 
              disabled={loading}
              className="reconnect-btn"
            >
              🔄 Connect Wallet
            </button>
            <button 
              onClick={async () => {
                setLoading(true);
                const result = await testAlgosdk();
                if (result.success) {
                  setSuccess('✅ Algosdk test passed: ' + result.message);
                } else {
                  setError('❌ Algosdk test failed: ' + result.error);
                }
                setLoading(false);
              }}
              disabled={loading}
              className="test-btn"
            >
              🧪 Test Algosdk
            </button>
            <button 
              onClick={() => {
                const result = testGameFunctionality();
                if (result.success) {
                  setSuccess('✅ ' + result.message);
                } else {
                  setError('❌ Game functionality test failed');
                }
              }}
              className="test-btn"
            >
              🎮 Test Game
            </button>
            <button 
              onClick={async () => {
                setLoading(true);
                const result = await testIntegration();
                if (result.success) {
                  setSuccess('✅ ' + result.message);
                } else {
                  setError('⚠️ ' + result.message);
                }
                setLoading(false);
              }}
              disabled={loading}
              className="test-btn"
            >
              🔧 Test Integration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainGame;