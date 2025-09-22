// Blockchain manager for Chronicle of the Ledger
class BlockchainManager {
    constructor() {
        this.connected = false;
        this.address = null;
        this.balance = 0;
        this.network = 'testnet';
        
        debug.log('BlockchainManager initialized', 'info');
    }

    async connectWallet() {
        try {
            debug.log('Attempting to connect wallet...', 'info');
            
            // Check if Algorand wallet is available
            if (typeof window !== 'undefined' && window.algorand) {
                const accounts = await window.algorand.enable();
                if (accounts && accounts.length > 0) {
                    this.connected = true;
                    this.address = accounts[0];
                    this.updateUI();
                    debug.log(`Wallet connected: ${this.address}`, 'info');
                    return;
                }
            }
            
            // Simulate connection for demo
            this.connected = true;
            this.address = 'DEMO_WALLET_ADDRESS';
            this.balance = 1000;
            this.updateUI();
            debug.log('Demo wallet connected', 'info');
            
        } catch (error) {
            debug.error(`Failed to connect wallet: ${error.message}`);
        }
    }

    disconnectWallet() {
        this.connected = false;
        this.address = null;
        this.balance = 0;
        this.updateUI();
        debug.log('Wallet disconnected', 'info');
    }

    updateUI() {
        const statusElement = document.getElementById('chainStatus');
        const connectButton = document.getElementById('connectWallet');
        
        if (statusElement) {
            statusElement.textContent = this.connected ? 'Connected' : 'Disconnected';
            statusElement.className = this.connected ? 'connected' : 'disconnected';
        }
        
        if (connectButton) {
            connectButton.textContent = this.connected ? 'Disconnect' : 'Connect Wallet';
            connectButton.onclick = this.connected ? () => this.disconnectWallet() : () => this.connectWallet();
        }
    }

    async mintAchievement(achievementData) {
        if (!this.connected) {
            debug.warning('Cannot mint achievement: wallet not connected');
            return { success: false, error: 'Wallet not connected' };
        }

        try {
            debug.log(`Minting achievement: ${achievementData.type}`, 'info');
            
            // In a real implementation, this would mint an NFT on Algorand
            const mockTxId = 'DEMO_TX_' + Date.now();
            
            debug.log(`Achievement minted successfully: ${mockTxId}`, 'info');
            return { success: true, txId: mockTxId };
            
        } catch (error) {
            debug.error(`Failed to mint achievement: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async earnCoins(amount) {
        if (!this.connected) {
            debug.log(`Would earn ${amount} coins (wallet not connected)`, 'info');
            return;
        }

        try {
            this.balance += amount;
            debug.log(`Earned ${amount} coins. New balance: ${this.balance}`, 'info');
        } catch (error) {
            debug.error(`Failed to earn coins: ${error.message}`);
        }
    }

    async spendCoins(amount) {
        if (!this.connected) {
            debug.log(`Would spend ${amount} coins (wallet not connected)`, 'info');
            return true;
        }

        if (this.balance < amount) {
            debug.warning(`Insufficient coins. Required: ${amount}, Available: ${this.balance}`);
            return false;
        }

        try {
            this.balance -= amount;
            debug.log(`Spent ${amount} coins. New balance: ${this.balance}`, 'info');
            return true;
        } catch (error) {
            debug.error(`Failed to spend coins: ${error.message}`);
            return false;
        }
    }

    isConnected() {
        return this.connected;
    }

    getAddress() {
        return this.address;
    }

    getBalance() {
        return this.balance;
    }
}
