// Test script for blockchain integration
import BlockchainService from '../services/BlockchainService';
import { BLOCKCHAIN_CONFIG } from '../config/blockchain';

export const testBlockchainIntegration = async () => {
  console.log('🧪 Testing Blockchain Integration');
  console.log('================================');
  
  try {
    // Test 1: Initialize service
    console.log('\n1️⃣ Testing service initialization...');
    const initialized = await BlockchainService.initialize();
    console.log(`✅ Service initialized: ${initialized}`);
    
    // Test 2: Connect wallet
    console.log('\n2️⃣ Testing wallet connection...');
    const connectResult = await BlockchainService.connectWallet();
    console.log(`✅ Wallet connection: ${connectResult.success ? 'Success' : 'Failed'}`);
    if (connectResult.success) {
      console.log(`   Address: ${connectResult.address}`);
    } else {
      console.log(`   Error: ${connectResult.message}`);
    }
    
    // Test 3: Get balance
    console.log('\n3️⃣ Testing balance retrieval...');
    const balanceResult = await BlockchainService.getBalance();
    console.log(`✅ Balance retrieval: ${balanceResult.success ? 'Success' : 'Failed'}`);
    if (balanceResult.success) {
      console.log(`   Balance: ${balanceResult.balance} ALGO`);
    } else {
      console.log(`   Error: ${balanceResult.message}`);
    }
    
    // Test 4: Get contract state
    console.log('\n4️⃣ Testing contract state retrieval...');
    const contractStateResult = await BlockchainService.getContractState();
    console.log(`✅ Contract state: ${contractStateResult.success ? 'Success' : 'Failed'}`);
    if (contractStateResult.success) {
      console.log(`   Game State: ${contractStateResult.state.GAME_STATE}`);
      console.log(`   Total Staked: ${contractStateResult.state.TOTAL_STAKED}`);
      console.log(`   Paused: ${contractStateResult.state.PAUSED}`);
    } else {
      console.log(`   Error: ${contractStateResult.message}`);
    }
    
    // Test 5: Get player state
    console.log('\n5️⃣ Testing player state retrieval...');
    const playerStateResult = await BlockchainService.getPlayerState();
    console.log(`✅ Player state: ${playerStateResult.success ? 'Success' : 'Failed'}`);
    if (playerStateResult.success) {
      console.log(`   Opted In: ${playerStateResult.optedIn}`);
      console.log(`   Player Stake: ${playerStateResult.state.PLAYER_STAKE || 0}`);
      console.log(`   Player Wins: ${playerStateResult.state.PLAYER_WINS || 0}`);
      console.log(`   Player Losses: ${playerStateResult.state.PLAYER_LOSSES || 0}`);
    } else {
      console.log(`   Error: ${playerStateResult.message}`);
    }
    
    // Test 6: Check connection status
    console.log('\n6️⃣ Testing connection status...');
    const status = BlockchainService.getConnectionStatus();
    console.log(`✅ Connection status: ${status.isConnected ? 'Connected' : 'Disconnected'}`);
    console.log(`   Account: ${status.account}`);
    console.log(`   App ID: ${status.appId}`);
    
    console.log('\n🎉 All tests completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

// Export for use in components
export default testBlockchainIntegration;
