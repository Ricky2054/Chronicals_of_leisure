import BlockchainService from './BlockchainService';

class PointsConverter {
  constructor() {
    this.blockchainService = new BlockchainService();
    
    // Conversion rates (can be adjusted)
    this.conversionRates = {
      gameToLute: 1, // 1 game point = 1 Lute point
      luteToAlgo: 0.001, // 1 Lute point = 0.001 ALGO
      algoToLute: 1000, // 1 ALGO = 1000 Lute points
      luteToGame: 1 // 1 Lute point = 1 game point
    };
    
    // Minimum conversion amounts
    this.minimums = {
      gamePoints: 10,
      lutePoints: 10,
      algoAmount: 0.001
    };
    
    console.log('PointsConverter initialized with rates:', this.conversionRates);
  }

  // Initialize the converter
  async initialize() {
    try {
      console.log('Initializing PointsConverter...');
      await this.blockchainService.initialize();
      console.log('✅ PointsConverter initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize PointsConverter:', error);
      return false;
    }
  }

  // Convert Game Points to Lute Points
  async convertGameToLute(gamePoints) {
    try {
      console.log(`Converting ${gamePoints} game points to Lute points...`);
      
      if (gamePoints < this.minimums.gamePoints) {
        throw new Error(`Minimum ${this.minimums.gamePoints} game points required for conversion`);
      }
      
      const lutePoints = Math.floor(gamePoints * this.conversionRates.gameToLute);
      
      // In a real implementation, this would:
      // 1. Deduct game points from player's game account
      // 2. Add Lute points to player's Lute wallet
      // 3. Record the transaction on blockchain
      
      console.log(`✅ Converted ${gamePoints} game points to ${lutePoints} Lute points`);
      
      return {
        success: true,
        gamePointsDeducted: gamePoints,
        lutePointsAdded: lutePoints,
        conversionRate: this.conversionRates.gameToLute,
        message: `Successfully converted ${gamePoints} game points to ${lutePoints} Lute points`
      };
    } catch (error) {
      console.error('Game to Lute conversion failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convert Lute Points to Algorand Points (ALGO)
  async convertLuteToAlgo(lutePoints) {
    try {
      console.log(`Converting ${lutePoints} Lute points to ALGO...`);
      
      if (lutePoints < this.minimums.lutePoints) {
        throw new Error(`Minimum ${this.minimums.lutePoints} Lute points required for conversion`);
      }
      
      const algoAmount = lutePoints * this.conversionRates.luteToAlgo;
      
      if (algoAmount < this.minimums.algoAmount) {
        throw new Error(`Minimum ${this.minimums.algoAmount} ALGO required for conversion`);
      }
      
      // Create blockchain transaction to convert Lute points to ALGO
      const txn = this.blockchainService.algosdk.makePaymentTxnWithSuggestedParams(
        this.blockchainService.connectedAccount.addr, // from
        this.blockchainService.connectedAccount.addr, // to (self)
        Math.floor(algoAmount * 1000000), // amount in microALGO
        undefined, // note
        undefined, // closeRemainderTo
        await this.blockchainService.algodClient.getTransactionParams().do()
      );
      
      // Sign and send transaction
      const signedTxn = txn.signTxn(this.blockchainService.connectedAccount.sk);
      const txId = await this.blockchainService.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.blockchainService.waitForConfirmation(txId.txId);
      
      console.log(`✅ Converted ${lutePoints} Lute points to ${algoAmount} ALGO`);
      
      return {
        success: true,
        lutePointsDeducted: lutePoints,
        algoAmountAdded: algoAmount,
        conversionRate: this.conversionRates.luteToAlgo,
        txId: txId.txId,
        message: `Successfully converted ${lutePoints} Lute points to ${algoAmount} ALGO`
      };
    } catch (error) {
      console.error('Lute to ALGO conversion failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convert ALGO to Lute Points
  async convertAlgoToLute(algoAmount) {
    try {
      console.log(`Converting ${algoAmount} ALGO to Lute points...`);
      
      if (algoAmount < this.minimums.algoAmount) {
        throw new Error(`Minimum ${this.minimums.algoAmount} ALGO required for conversion`);
      }
      
      const lutePoints = Math.floor(algoAmount * this.conversionRates.algoToLute);
      
      // In a real implementation, this would:
      // 1. Deduct ALGO from player's wallet
      // 2. Add Lute points to player's Lute account
      // 3. Record the transaction on blockchain
      
      console.log(`✅ Converted ${algoAmount} ALGO to ${lutePoints} Lute points`);
      
      return {
        success: true,
        algoAmountDeducted: algoAmount,
        lutePointsAdded: lutePoints,
        conversionRate: this.conversionRates.algoToLute,
        message: `Successfully converted ${algoAmount} ALGO to ${lutePoints} Lute points`
      };
    } catch (error) {
      console.error('ALGO to Lute conversion failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convert Lute Points to Game Points
  async convertLuteToGame(lutePoints) {
    try {
      console.log(`Converting ${lutePoints} Lute points to game points...`);
      
      if (lutePoints < this.minimums.lutePoints) {
        throw new Error(`Minimum ${this.minimums.lutePoints} Lute points required for conversion`);
      }
      
      const gamePoints = Math.floor(lutePoints * this.conversionRates.luteToGame);
      
      // In a real implementation, this would:
      // 1. Deduct Lute points from player's Lute account
      // 2. Add game points to player's game account
      // 3. Record the transaction on blockchain
      
      console.log(`✅ Converted ${lutePoints} Lute points to ${gamePoints} game points`);
      
      return {
        success: true,
        lutePointsDeducted: lutePoints,
        gamePointsAdded: gamePoints,
        conversionRate: this.conversionRates.luteToGame,
        message: `Successfully converted ${lutePoints} Lute points to ${gamePoints} game points`
      };
    } catch (error) {
      console.error('Lute to Game conversion failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get current conversion rates
  getConversionRates() {
    return {
      ...this.conversionRates,
      minimums: this.minimums
    };
  }

  // Update conversion rates (admin function)
  updateConversionRates(newRates) {
    this.conversionRates = { ...this.conversionRates, ...newRates };
    console.log('Conversion rates updated:', this.conversionRates);
  }

  // Get player's current balances
  async getPlayerBalances() {
    try {
      const algoBalance = await this.blockchainService.getBalance();
      
      // In a real implementation, these would come from the game server
      const gamePoints = 0; // This would be fetched from game database
      const lutePoints = 0; // This would be fetched from Lute wallet
      
      return {
        gamePoints,
        lutePoints,
        algoBalance,
        success: true
      };
    } catch (error) {
      console.error('Failed to get player balances:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate conversion preview
  calculateConversion(fromType, toType, amount) {
    const rates = this.conversionRates;
    
    let result = 0;
    let rate = 0;
    
    switch (`${fromType}To${toType}`) {
      case 'gameToLute':
        result = amount * rates.gameToLute;
        rate = rates.gameToLute;
        break;
      case 'luteToAlgo':
        result = amount * rates.luteToAlgo;
        rate = rates.luteToAlgo;
        break;
      case 'algoToLute':
        result = amount * rates.algoToLute;
        rate = rates.algoToLute;
        break;
      case 'luteToGame':
        result = amount * rates.luteToGame;
        rate = rates.luteToGame;
        break;
      default:
        throw new Error(`Invalid conversion: ${fromType} to ${toType}`);
    }
    
    return {
      fromAmount: amount,
      toAmount: result,
      conversionRate: rate,
      fromType,
      toType
    };
  }

  // Convert Game Coins to Game Points (for in-game purchases)
  async convertCoinsToPoints(gameCoins) {
    try {
      console.log(`Converting ${gameCoins} game coins to game points...`);
      
      if (gameCoins < 1) {
        throw new Error('Minimum 1 game coin required for conversion');
      }
      
      // 1 game coin = 10 game points
      const gamePoints = gameCoins * 10;
      
      return {
        success: true,
        gameCoins: -gameCoins,
        gamePoints: gamePoints,
        message: `Converted ${gameCoins} coins to ${gamePoints} game points!`
      };
    } catch (error) {
      console.error('❌ Failed to convert coins to points:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convert Game Points to Game Coins (for in-game spending)
  async convertPointsToCoins(gamePoints) {
    try {
      console.log(`Converting ${gamePoints} game points to game coins...`);
      
      if (gamePoints < 10) {
        throw new Error('Minimum 10 game points required for conversion');
      }
      
      // 10 game points = 1 game coin
      const gameCoins = Math.floor(gamePoints / 10);
      const remainingPoints = gamePoints % 10;
      
      return {
        success: true,
        gamePoints: -gamePoints,
        gameCoins: gameCoins,
        remainingPoints: remainingPoints,
        message: `Converted ${gamePoints} points to ${gameCoins} coins (${remainingPoints} points remaining)`
      };
    } catch (error) {
      console.error('❌ Failed to convert points to coins:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get current balances (simulated)
  getBalances() {
    return {
      gamePoints: 1000, // This would come from the game state
      lutePoints: 500,  // This would come from the Lute wallet
      algoBalance: 5.0  // This would come from the Algorand wallet
    };
  }
}

export default PointsConverter;
