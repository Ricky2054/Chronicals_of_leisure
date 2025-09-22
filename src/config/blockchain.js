// Blockchain Configuration for Chronicle of the Ledger
export const BLOCKCHAIN_CONFIG = {
  // Your deployed smart contract details
  CONTRACT: {
    APP_ID: 745921443,
    CONTRACT_ADDRESS: '6B3ACCE056A53C7F249A77D81811125170A95BB15A7F7AF1B6716181127DAE4',
    NETWORK: 'testnet'
  },
  
  // Algorand network configuration
  NETWORK: {
    ALGOD_TOKEN: '',
    ALGOD_SERVER: 'https://testnet-api.algonode.cloud',
    ALGOD_PORT: 443,
    INDEXER_TOKEN: '',
    INDEXER_SERVER: 'https://testnet-idx.algonode.cloud',
    INDEXER_PORT: 443
  },
  
  // Game configuration
  GAME: {
    MIN_STAKE: 1.0, // ALGO
    MAX_STAKE: 10.0, // ALGO
    COMMISSION_RATE: 0.05, // 5%
    WIN_BONUS: 0.1 // 10% bonus on win
  },
  
  // Wallet configuration
  WALLETS: {
    PERA: {
      name: 'Pera Wallet',
      website: 'https://perawallet.app',
      mobile: 'Pera Wallet App'
    },
    MYALGO: {
      name: 'MyAlgo Wallet',
      website: 'https://wallet.myalgo.com',
      mobile: 'MyAlgo Wallet App'
    },
    LUTE: {
      name: 'Lute Wallet',
      website: 'https://lute.app',
      mobile: 'Lute Wallet App'
    }
  },
  
  // Explorer URLs
  EXPLORERS: {
    ALGOEXPLORER: 'https://algoexplorer.io',
    ALGOSCAN: 'https://algoscan.app'
  },
  
  // Demo wallet (for testing)
  DEMO: {
    ADDRESS: 'A2Z2ZTQFNJJ4P4SJU56YDAIREULQVFN3CWT7PLY3M4LBQEJH3LSPVS3GJU',
    MNEMONIC: 'trumpet noodle nature august silly admit famous borrow keep ignore scene sock long inch save uphold riot yard private brush uncover ladder decade abandon recall'
  }
};

// Contract function names
export const CONTRACT_FUNCTIONS = {
  STAKE: 'stake',
  WIN: 'win',
  LOSE: 'lose',
  TOGGLE_PAUSE: 'toggle_pause',
  WITHDRAW_COMMISSION: 'withdraw_commission'
};

// Contract state keys
export const CONTRACT_STATE = {
  GLOBAL: {
    GAME_STATE: 'GAME_STATE',
    TOTAL_STAKED: 'TOTAL_STAKED',
    COMMISSION_POOL: 'COMMISSION_POOL',
    PAUSED: 'PAUSED',
    ADMIN_ADDR: 'ADMIN_ADDR'
  },
  LOCAL: {
    PLAYER_STAKE: 'PLAYER_STAKE',
    PLAYER_WINS: 'PLAYER_WINS',
    PLAYER_LOSSES: 'PLAYER_LOSSES',
    PLAYER_OPTED_IN: 'PLAYER_OPTED_IN'
  }
};

// Game states
export const GAME_STATES = {
  IDLE: 0,
  STAKED: 1,
  PAUSED: 2
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  CONTRACT_NOT_FOUND: 'Contract not found',
  TRANSACTION_FAILED: 'Transaction failed',
  NETWORK_ERROR: 'Network error'
};

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  STAKE_SUCCESS: 'Stake successful',
  WIN_PROCESSED: 'Win processed successfully',
  LOSS_PROCESSED: 'Loss processed successfully',
  PAUSE_TOGGLED: 'Pause toggled successfully',
  COMMISSION_WITHDRAWN: 'Commission withdrawn successfully'
};

export default BLOCKCHAIN_CONFIG;
