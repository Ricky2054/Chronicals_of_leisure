import { AlgorandService } from './AlgorandService';

export class GameBlockchain {
  constructor() {
    this.algorandService = new AlgorandService();
    this.ledgerCoinAssetId = null;
    this.relicAssetIds = new Map();
    this.achievementAssetIds = new Map();
    
    this.initializeAssets();
  }

  async initializeAssets() {
    try {
      // Create Ledger Coin ASA if it doesn't exist
      if (!this.ledgerCoinAssetId) {
        console.log('Creating Ledger Coin ASA...');
        // In a real implementation, you would create the ASA here
        // For demo purposes, we'll use a mock asset ID
        this.ledgerCoinAssetId = 'DEMO_LEDGER_COIN_ASSET_ID';
      }
    } catch (error) {
      console.error('Failed to initialize blockchain assets:', error);
    }
  }

  async connectWallet() {
    try {
      const account = await this.algorandService.connectWallet();
      await this.initializeAssets();
      return account;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  disconnectWallet() {
    this.algorandService.disconnectWallet();
  }

  isConnected() {
    return this.algorandService.isConnected();
  }

  getAccount() {
    return this.algorandService.getAccount();
  }

  async getBalance() {
    if (!this.isConnected()) return 0;
    
    try {
      const account = this.getAccount();
      return await this.algorandService.getBalance(account);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  async getLedgerCoins() {
    if (!this.isConnected() || !this.ledgerCoinAssetId) return 0;
    
    try {
      const account = this.getAccount();
      const assets = await this.algorandService.getUserAssets(account);
      const ledgerCoinAsset = assets.find(asset => asset['asset-id'] === this.ledgerCoinAssetId);
      return ledgerCoinAsset ? ledgerCoinAsset.amount : 0;
    } catch (error) {
      console.error('Failed to get Ledger Coins:', error);
      return 0;
    }
  }

  async earnLedgerCoins(amount) {
    if (!this.isConnected()) {
      console.log(`Would earn ${amount} Ledger Coins (wallet not connected)`);
      return;
    }

    try {
      // In a real implementation, this would be handled by a smart contract
      // For demo purposes, we'll just log the transaction
      console.log(`Earned ${amount} Ledger Coins`);
      
      // You could implement a faucet or reward system here
      // await this.algorandService.transferASA(this.ledgerCoinAssetId, this.getAccount(), amount);
    } catch (error) {
      console.error('Failed to earn Ledger Coins:', error);
    }
  }

  async spendLedgerCoins(amount) {
    if (!this.isConnected()) {
      console.log(`Would spend ${amount} Ledger Coins (wallet not connected)`);
      return true; // Allow spending in demo mode
    }

    try {
      const currentBalance = await this.getLedgerCoins();
      if (currentBalance < amount) {
        throw new Error('Insufficient Ledger Coins');
      }

      // In a real implementation, this would transfer coins to a game contract
      console.log(`Spent ${amount} Ledger Coins`);
      return true;
    } catch (error) {
      console.error('Failed to spend Ledger Coins:', error);
      return false;
    }
  }

  async mintAchievement(achievementData) {
    if (!this.isConnected()) {
      console.log('Would mint achievement NFT (wallet not connected)');
      return { success: true, txId: 'DEMO_TX_ID' };
    }

    try {
      const txId = await this.algorandService.mintAchievementNFT(achievementData);
      this.achievementAssetIds.set(achievementData.type, txId);
      
      return { success: true, txId };
    } catch (error) {
      console.error('Failed to mint achievement:', error);
      return { success: false, error: error.message };
    }
  }

  async mintRelic(relicData) {
    if (!this.isConnected()) {
      console.log('Would mint relic NFT (wallet not connected)');
      return { success: true, txId: 'DEMO_TX_ID' };
    }

    try {
      const txId = await this.algorandService.mintRelicNFT(relicData);
      this.relicAssetIds.set(relicData.name, txId);
      
      return { success: true, txId };
    } catch (error) {
      console.error('Failed to mint relic:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserRelics() {
    if (!this.isConnected()) return [];

    try {
      const account = this.getAccount();
      const assets = await this.algorandService.getUserAssets(account);
      
      // Filter for relic assets
      const relics = assets.filter(asset => {
        // In a real implementation, you would check asset metadata
        return this.relicAssetIds.has(asset['asset-id']);
      });

      return relics;
    } catch (error) {
      console.error('Failed to get user relics:', error);
      return [];
    }
  }

  async getUserAchievements() {
    if (!this.isConnected()) return [];

    try {
      const account = this.getAccount();
      const assets = await this.algorandService.getUserAssets(account);
      
      // Filter for achievement assets
      const achievements = assets.filter(asset => {
        // In a real implementation, you would check asset metadata
        return this.achievementAssetIds.has(asset['asset-id']);
      });

      return achievements;
    } catch (error) {
      console.error('Failed to get user achievements:', error);
      return [];
    }
  }

  // Game-specific achievement types
  async mintBossDefeatAchievement(bossName, level, score) {
    const achievementData = {
      type: `boss_defeat_${bossName.toLowerCase()}`,
      score: score,
      level: level,
      timestamp: Date.now(),
      bossName: bossName
    };

    return await this.mintAchievement(achievementData);
  }

  async mintScoreAchievement(score) {
    const achievementData = {
      type: `score_${this.getScoreTier(score)}`,
      score: score,
      level: 1,
      timestamp: Date.now()
    };

    return await this.mintAchievement(achievementData);
  }

  async mintLevelCompletionAchievement(level, score) {
    const achievementData = {
      type: `level_completion_${level}`,
      score: score,
      level: level,
      timestamp: Date.now()
    };

    return await this.mintAchievement(achievementData);
  }

  getScoreTier(score) {
    if (score >= 10000) return 'legendary';
    if (score >= 5000) return 'epic';
    if (score >= 1000) return 'rare';
    return 'common';
  }

  // Relic types based on the game design
  async mintShardOfFinality(level, score) {
    const relicData = {
      name: 'Shard of Finality',
      type: 'finality',
      power: Math.floor(score / 1000),
      rarity: this.getScoreTier(score)
    };

    return await this.mintRelic(relicData);
  }

  async mintKeyOfParticipation(level, score) {
    const relicData = {
      name: 'Key of Participation',
      type: 'participation',
      power: Math.floor(score / 1000),
      rarity: this.getScoreTier(score)
    };

    return await this.mintRelic(relicData);
  }

  async mintCrownOfConsensus(level, score) {
    const relicData = {
      name: 'Crown of Consensus',
      type: 'consensus',
      power: Math.floor(score / 1000),
      rarity: this.getScoreTier(score)
    };

    return await this.mintRelic(relicData);
  }

  // Utility methods
  async getTransactionHistory() {
    if (!this.isConnected()) return [];

    try {
      const account = this.getAccount();
      // In a real implementation, you would query the indexer for transaction history
      return [];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  async getNetworkStatus() {
    try {
      if (!this.algorandService.algodClient) {
        return { status: 'disconnected', message: 'Client not initialized' };
      }

      const status = await this.algorandService.algodClient.status().do();
      return { 
        status: 'connected', 
        message: 'Connected to Algorand Testnet',
        lastRound: status['last-round']
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
