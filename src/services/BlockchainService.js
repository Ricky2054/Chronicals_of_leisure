import algosdk from 'algosdk';

class BlockchainService {
  constructor() {
    // Your deployed smart contract details
    this.APP_ID = 745921443;
    this.CONTRACT_ADDRESS = '6B3ACCE056A53C7F249A77D81811125170A95BB15A7F7AF1B6716181127DAE4';
    
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
    this.privateKey = null;
    
    this.initializeClients();
  }

  initializeClients() {
    try {
      this.algodClient = new algosdk.Algodv2(this.algodToken, this.algodServer, this.algodPort);
      this.indexerClient = new algosdk.Indexer(this.indexerToken, this.indexerServer, this.indexerPort);
      console.log('✅ Algorand clients initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Algorand clients:', error);
    }
  }

  async initialize() {
    try {
      // Check if we have stored credentials
      const storedAccount = localStorage.getItem('algorand_account');
      const storedPrivateKey = localStorage.getItem('algorand_private_key');
      
      if (storedAccount && storedPrivateKey) {
        this.account = storedAccount;
        this.privateKey = storedPrivateKey;
        this.connected = true;
        console.log('✅ Restored wallet connection');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
      return false;
    }
  }

  async connectWallet() {
    try {
      // Check for Pera Wallet
      if (typeof window !== 'undefined' && window.algorand) {
        const accounts = await window.algorand.enable();
        if (accounts && accounts.length > 0) {
          this.account = accounts[0];
          this.connected = true;
          
          // Store for future use
          localStorage.setItem('algorand_account', this.account);
          
          return {
            success: true,
            address: this.account,
            message: 'Pera Wallet connected successfully!'
          };
        }
      }
      
      // Check for MyAlgo Wallet
      if (typeof window !== 'undefined' && window.myAlgo) {
        const accounts = await window.myAlgo.connect();
        if (accounts && accounts.length > 0) {
          this.account = accounts[0].address;
          this.privateKey = accounts[0].sk;
          this.connected = true;
          
          // Store for future use
          localStorage.setItem('algorand_account', this.account);
          localStorage.setItem('algorand_private_key', this.privateKey);
          
          return {
            success: true,
            address: this.account,
            message: 'MyAlgo Wallet connected successfully!'
          };
        }
      }
      
      // Fallback: Use your Lute wallet credentials for demo
      console.log('🔧 Using demo wallet connection (Lute wallet)');
      this.account = 'A2Z2ZTQFNJJ4P4SJU56YDAIREULQVFN3CWT7PLY3M4LBQEJH3LSPVS3GJU';
      this.privateKey = 'trumpet noodle nature august silly admit famous borrow keep ignore scene sock long inch save uphold riot yard private brush uncover ladder decade abandon recall';
      this.connected = true;
      
      return {
        success: true,
        address: this.account,
        message: 'Demo wallet connected (Lute)'
      };
      
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      return {
        success: false,
        message: 'Failed to connect wallet. Please install Pera Wallet or MyAlgo Wallet.'
      };
    }
  }

  async disconnectWallet() {
    try {
      this.connected = false;
      this.account = null;
      this.privateKey = null;
      
      // Clear stored credentials
      localStorage.removeItem('algorand_account');
      localStorage.removeItem('algorand_private_key');
      
      return {
        success: true,
        message: 'Wallet disconnected successfully!'
      };
    } catch (error) {
      console.error('❌ Failed to disconnect wallet:', error);
      return {
        success: false,
        message: 'Failed to disconnect wallet'
      };
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.connected,
      account: this.account,
      appId: this.APP_ID
    };
  }

  async getBalance() {
    try {
      if (!this.connected || !this.account) {
        return { success: false, message: 'Wallet not connected' };
      }

      const accountInfo = await this.algodClient.accountInformation(this.account).do();
      const balance = accountInfo.amount / 1000000; // Convert from microAlgos
      
      return {
        success: true,
        balance: balance
      };
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      return {
        success: false,
        message: 'Failed to get balance'
      };
    }
  }

  async getContractState() {
    try {
      if (!this.algodClient) {
        return { success: false, message: 'Client not initialized' };
      }

      const appInfo = await this.algodClient.getApplicationByID(this.APP_ID).do();
      const globalState = {};
      
      for (const state of appInfo.params['global-state']) {
        const key = Buffer.from(state.key, 'base64').toString('utf-8');
        if (state.value.type === 2) { // uint
          globalState[key] = state.value.uint;
        } else { // bytes
          globalState[key] = state.value.bytes;
        }
      }
      
      return {
        success: true,
        state: globalState
      };
    } catch (error) {
      console.error('❌ Failed to get contract state:', error);
      return {
        success: false,
        message: 'Failed to get contract state'
      };
    }
  }

  async getPlayerState() {
    try {
      if (!this.connected || !this.account) {
        return { success: false, message: 'Wallet not connected' };
      }

      const accountInfo = await this.algodClient.accountInformation(this.account).do();
      
      // Find local state for our app
      for (const app of accountInfo['apps-local-state']) {
        if (app.id === this.APP_ID) {
          const localState = {};
          for (const state of app['key-value']) {
            const key = Buffer.from(state.key, 'base64').toString('utf-8');
            if (state.value.type === 2) { // uint
              localState[key] = state.value.uint;
            } else { // bytes
              localState[key] = state.value.bytes;
            }
          }
          return {
            success: true,
            state: localState,
            optedIn: true
          };
        }
      }
      
      return {
        success: true,
        state: {},
        optedIn: false
      };
    } catch (error) {
      console.error('❌ Failed to get player state:', error);
      return {
        success: false,
        message: 'Failed to get player state'
      };
    }
  }

  async optInToContract() {
    try {
      if (!this.connected || !this.account) {
        return { success: false, message: 'Wallet not connected' };
      }

      const params = await this.algodClient.getTransactionParams().do();
      
      const optInTxn = algosdk.makeApplicationOptInTxn(
        this.account,
        params,
        this.APP_ID
      );

      const signedTxn = await this.signTransaction(optInTxn);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return {
        success: true,
        txId: txId,
        message: 'Successfully opted into contract!'
      };
    } catch (error) {
      console.error('❌ Failed to opt in:', error);
      return {
        success: false,
        message: 'Failed to opt into contract'
      };
    }
  }

  async stakeForGame(amount = 1.0) {
    try {
      if (!this.connected || !this.account) {
        return { success: false, message: 'Wallet not connected' };
      }

      // Check if player is opted in
      const playerState = await this.getPlayerState();
      if (!playerState.success || !playerState.optedIn) {
        // Opt in first
        const optInResult = await this.optInToContract();
        if (!optInResult.success) {
          return optInResult;
        }
      }

      const params = await this.algodClient.getTransactionParams().do();
      const stakeAmount = Math.floor(amount * 1000000); // Convert to microAlgos
      
      // Create payment transaction to contract
      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParams(
        this.account,
        this.CONTRACT_ADDRESS,
        stakeAmount,
        undefined, // closeRemainderTo
        undefined, // note
        params
      );

      // Create application call transaction for stake
      const appCallTxn = algosdk.makeApplicationCallTxn(
        this.account,
        params,
        this.APP_ID,
        algosdk.OnApplicationComplete.NoOpOC,
        undefined, // foreignApps
        undefined, // foreignAssets
        [new Uint8Array(Buffer.from('stake'))], // appArgs
        undefined, // accounts
        undefined, // note
        undefined, // lease
        undefined, // rekeyTo
        undefined, // boxes
        undefined, // boxMbrTxn
        undefined  // appOnComplete
      );

      // Group transactions
      const groupId = algosdk.computeGroupID([paymentTxn, appCallTxn]);
      paymentTxn.group = groupId;
      appCallTxn.group = groupId;

      // Sign transactions
      const signedPaymentTxn = await this.signTransaction(paymentTxn);
      const signedAppCallTxn = await this.signTransaction(appCallTxn);

      // Send grouped transaction
      const signedGroup = [signedPaymentTxn, signedAppCallTxn];
      const txId = await this.algodClient.sendRawTransaction(signedGroup).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return {
        success: true,
        txId: txId,
        amount: amount,
        message: `Successfully staked ${amount} ALGO!`
      };
    } catch (error) {
      console.error('❌ Failed to stake:', error);
      return {
        success: false,
        message: 'Failed to stake for game'
      };
    }
  }

  async processWin() {
    try {
      if (!this.connected || !this.account) {
        return { success: false, message: 'Wallet not connected' };
      }

      const params = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxn(
        this.account,
        params,
        this.APP_ID,
        algosdk.OnApplicationComplete.NoOpOC,
        undefined, // foreignApps
        undefined, // foreignAssets
        [new Uint8Array(Buffer.from('win'))], // appArgs
        undefined, // accounts
        undefined, // note
        undefined, // lease
        undefined, // rekeyTo
        undefined, // boxes
        undefined, // boxMbrTxn
        undefined  // appOnComplete
      );

      const signedTxn = await this.signTransaction(appCallTxn);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return {
        success: true,
        txId: txId,
        message: 'Win processed successfully!'
      };
    } catch (error) {
      console.error('❌ Failed to process win:', error);
      return {
        success: false,
        message: 'Failed to process win'
      };
    }
  }

  async processLose() {
    try {
      if (!this.connected || !this.account) {
        return { success: false, message: 'Wallet not connected' };
      }

      const params = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxn(
        this.account,
        params,
        this.APP_ID,
        algosdk.OnApplicationComplete.NoOpOC,
        undefined, // foreignApps
        undefined, // foreignAssets
        [new Uint8Array(Buffer.from('lose'))], // appArgs
        undefined, // accounts
        undefined, // note
        undefined, // lease
        undefined, // rekeyTo
        undefined, // boxes
        undefined, // boxMbrTxn
        undefined  // appOnComplete
      );

      const signedTxn = await this.signTransaction(appCallTxn);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return {
        success: true,
        txId: txId,
        message: 'Loss processed successfully!'
      };
    } catch (error) {
      console.error('❌ Failed to process loss:', error);
      return {
        success: false,
        message: 'Failed to process loss'
      };
    }
  }

  async togglePause() {
    try {
      if (!this.connected || !this.account) {
        return { success: false, message: 'Wallet not connected' };
      }

      const params = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxn(
        this.account,
        params,
        this.APP_ID,
        algosdk.OnApplicationComplete.NoOpOC,
        undefined, // foreignApps
        undefined, // foreignAssets
        [new Uint8Array(Buffer.from('toggle_pause'))], // appArgs
        undefined, // accounts
        undefined, // note
        undefined, // lease
        undefined, // rekeyTo
        undefined, // boxes
        undefined, // boxMbrTxn
        undefined  // appOnComplete
      );

      const signedTxn = await this.signTransaction(appCallTxn);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return {
        success: true,
        txId: txId,
        message: 'Pause toggled successfully!'
      };
    } catch (error) {
      console.error('❌ Failed to toggle pause:', error);
      return {
        success: false,
        message: 'Failed to toggle pause'
      };
    }
  }

  async withdrawCommission() {
    try {
      if (!this.connected || !this.account) {
        return { success: false, message: 'Wallet not connected' };
      }

      const params = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxn(
        this.account,
        params,
        this.APP_ID,
        algosdk.OnApplicationComplete.NoOpOC,
        undefined, // foreignApps
        undefined, // foreignAssets
        [new Uint8Array(Buffer.from('withdraw_commission'))], // appArgs
        undefined, // accounts
        undefined, // note
        undefined, // lease
        undefined, // rekeyTo
        undefined, // boxes
        undefined, // boxMbrTxn
        undefined  // appOnComplete
      );

      const signedTxn = await this.signTransaction(appCallTxn);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return {
        success: true,
        txId: txId,
        message: 'Commission withdrawn successfully!'
      };
    } catch (error) {
      console.error('❌ Failed to withdraw commission:', error);
      return {
        success: false,
        message: 'Failed to withdraw commission'
      };
    }
  }

  async signTransaction(txn) {
    try {
      if (typeof window !== 'undefined' && window.algorand) {
        // Use Pera Wallet to sign
        const signedTxn = await window.algorand.signTransaction(txn);
        return signedTxn;
      } else if (this.privateKey) {
        // Use private key to sign (for MyAlgo or demo)
        if (typeof this.privateKey === 'string' && this.privateKey.split(' ').length === 25) {
          // It's a mnemonic
          const privateKey = algosdk.mnemonicToSecretKey(this.privateKey).sk;
          return txn.signTxn(privateKey);
        } else {
          // It's already a private key
          return txn.signTxn(this.privateKey);
        }
      } else {
        throw new Error('No signing method available');
      }
    } catch (error) {
      console.error('❌ Failed to sign transaction:', error);
      throw error;
    }
  }

  async waitForConfirmation(txId, timeout = 10000) {
    try {
      const status = await algosdk.waitForConfirmation(this.algodClient, txId, 4);
      return status;
    } catch (error) {
      console.error('❌ Failed to wait for confirmation:', error);
      throw error;
    }
  }

  // Utility methods
  formatAddress(address) {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  formatAmount(amount) {
    return (amount / 1000000).toFixed(6);
  }

  getExplorerUrl(txId) {
    return `https://algoexplorer.io/tx/${txId}`;
  }

  getContractUrl() {
    return `https://algoexplorer.io/application/${this.APP_ID}`;
  }
}

// Create singleton instance
const blockchainService = new BlockchainService();
export default blockchainService;
