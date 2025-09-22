import algosdk from 'algosdk';

export class AlgorandService {
  constructor() {
    // Algorand Testnet configuration
    this.algodToken = '';
    this.algodServer = 'https://testnet-api.algonode.cloud';
    this.algodPort = 443;
    this.indexerToken = '';
    this.indexerServer = 'https://testnet-idx.algonode.cloud';
    this.indexerPort = 443;
    
    this.algodClient = null;
    this.indexerClient = null;
    this.connected = false;
    this.account = null;
    
    this.initializeClients();
  }

  initializeClients() {
    try {
      this.algodClient = new algosdk.Algodv2(this.algodToken, this.algodServer, this.algodPort);
      this.indexerClient = new algosdk.Indexer(this.indexerToken, this.indexerServer, this.indexerPort);
    } catch (error) {
      console.error('Failed to initialize Algorand clients:', error);
    }
  }

  async connectWallet() {
    try {
      // Check if Algorand wallet is available
      if (typeof window !== 'undefined' && window.algorand) {
        const accounts = await window.algorand.enable();
        if (accounts && accounts.length > 0) {
          this.account = accounts[0];
          this.connected = true;
          return this.account;
        }
      }
      
      // For demo purposes, create a mock connection
      this.account = 'DEMO_WALLET_ADDRESS';
      this.connected = true;
      return this.account;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  disconnectWallet() {
    this.connected = false;
    this.account = null;
  }

  async getAccountInfo(address) {
    try {
      if (!this.algodClient) throw new Error('Algod client not initialized');
      
      const accountInfo = await this.algodClient.accountInformation(address).do();
      return accountInfo;
    } catch (error) {
      console.error('Failed to get account info:', error);
      return null;
    }
  }

  async getBalance(address) {
    try {
      const accountInfo = await this.getAccountInfo(address);
      return accountInfo ? accountInfo.amount / 1000000 : 0; // Convert from microAlgos
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  async createASA(name, symbol, totalSupply, decimals = 0) {
    try {
      if (!this.connected || !this.account) {
        throw new Error('Wallet not connected');
      }

      const params = await this.algodClient.getTransactionParams().do();
      
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
        this.account,
        undefined, // note
        totalSupply,
        decimals,
        false, // defaultFrozen
        this.account, // manager
        this.account, // reserve
        this.account, // freeze
        this.account, // clawback
        name,
        symbol,
        'https://chronicle-of-ledger.com/asset', // url
        params
      );

      const signedTxn = await this.signTransaction(txn);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return txId;
    } catch (error) {
      console.error('Failed to create ASA:', error);
      throw error;
    }
  }

  async mintNFT(name, description, imageUrl, metadata) {
    try {
      if (!this.connected || !this.account) {
        throw new Error('Wallet not connected');
      }

      const params = await this.algodClient.getTransactionParams().do();
      
      // Create NFT metadata
      const nftMetadata = {
        name: name,
        description: description,
        image: imageUrl,
        attributes: metadata,
        standard: 'arc3',
        ...metadata
      };

      const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
        this.account,
        undefined, // note
        1, // total supply for NFT
        0, // decimals
        false, // defaultFrozen
        this.account, // manager
        this.account, // reserve
        this.account, // freeze
        this.account, // clawback
        name,
        'LEDGER', // symbol
        `ipfs://${imageUrl}`, // url
        params
      );

      const signedTxn = await this.signTransaction(txn);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return txId;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }

  async transferASA(assetId, to, amount) {
    try {
      if (!this.connected || !this.account) {
        throw new Error('Wallet not connected');
      }

      const params = await this.algodClient.getTransactionParams().do();
      
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        this.account,
        to,
        undefined, // closeRemainderTo
        undefined, // revocationTarget
        amount,
        undefined, // note
        assetId,
        params
      );

      const signedTxn = await this.signTransaction(txn);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return txId;
    } catch (error) {
      console.error('Failed to transfer ASA:', error);
      throw error;
    }
  }

  async transferAlgo(to, amount) {
    try {
      if (!this.connected || !this.account) {
        throw new Error('Wallet not connected');
      }

      const params = await this.algodClient.getTransactionParams().do();
      
      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        this.account,
        to,
        amount * 1000000, // Convert to microAlgos
        undefined, // closeRemainderTo
        undefined, // note
        params
      );

      const signedTxn = await this.signTransaction(txn);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return txId;
    } catch (error) {
      console.error('Failed to transfer Algo:', error);
      throw error;
    }
  }

  async signTransaction(txn) {
    try {
      if (typeof window !== 'undefined' && window.algorand) {
        // Use wallet to sign transaction
        const signedTxn = await window.algorand.signTransaction(txn);
        return signedTxn;
      } else {
        // For demo purposes, return unsigned transaction
        console.warn('Wallet not available, returning unsigned transaction');
        return txn;
      }
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  }

  async waitForConfirmation(txId, timeout = 10000) {
    try {
      const status = await algosdk.waitForConfirmation(this.algodClient, txId, 4);
      return status;
    } catch (error) {
      console.error('Failed to wait for confirmation:', error);
      throw error;
    }
  }

  async getAssetInfo(assetId) {
    try {
      if (!this.algodClient) throw new Error('Algod client not initialized');
      
      const assetInfo = await this.algodClient.getAssetByID(assetId).do();
      return assetInfo;
    } catch (error) {
      console.error('Failed to get asset info:', error);
      return null;
    }
  }

  async getUserAssets(address) {
    try {
      if (!this.indexerClient) throw new Error('Indexer client not initialized');
      
      const assets = await this.indexerClient.lookupAccountAssets(address).do();
      return assets.assets || [];
    } catch (error) {
      console.error('Failed to get user assets:', error);
      return [];
    }
  }

  // Game-specific methods
  async mintAchievementNFT(achievementData) {
    const { type, score, level, timestamp } = achievementData;
    
    const metadata = {
      type: 'achievement',
      game: 'Chronicle of the Ledger',
      achievement_type: type,
      score: score,
      level: level,
      timestamp: timestamp,
      rarity: this.calculateRarity(score, level)
    };

    const name = `Ledger Achievement: ${type}`;
    const description = `Achievement earned in Chronicle of the Ledger - Score: ${score}, Level: ${level}`;
    const imageUrl = this.getAchievementImageUrl(type);

    return await this.mintNFT(name, description, imageUrl, metadata);
  }

  async mintRelicNFT(relicData) {
    const { name, type, power, rarity } = relicData;
    
    const metadata = {
      type: 'relic',
      game: 'Chronicle of the Ledger',
      relic_name: name,
      relic_type: type,
      power: power,
      rarity: rarity,
      timestamp: Date.now()
    };

    const description = `Relic from Chronicle of the Ledger - ${name} (${type})`;
    const imageUrl = this.getRelicImageUrl(type);

    return await this.mintNFT(name, description, imageUrl, metadata);
  }

  calculateRarity(score, level) {
    if (score >= 10000 && level >= 3) return 'legendary';
    if (score >= 5000 && level >= 2) return 'epic';
    if (score >= 1000 && level >= 1) return 'rare';
    return 'common';
  }

  getAchievementImageUrl(type) {
    // In a real implementation, these would be actual IPFS URLs
    return `https://chronicle-of-ledger.com/achievements/${type}.png`;
  }

  getRelicImageUrl(type) {
    // In a real implementation, these would be actual IPFS URLs
    return `https://chronicle-of-ledger.com/relics/${type}.png`;
  }

  isConnected() {
    return this.connected && this.account !== null;
  }

  getAccount() {
    return this.account;
  }
}
