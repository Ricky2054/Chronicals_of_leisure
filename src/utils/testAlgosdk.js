// Simple test to verify algosdk is working
export const testAlgosdk = async () => {
  try {
    console.log('🧪 Testing algosdk import...');
    
    // Test import
    const algosdk = await import('algosdk');
    const sdk = algosdk.default || algosdk;
    
    console.log('✅ Algosdk imported successfully');
    console.log('Available methods:', Object.keys(sdk).slice(0, 10)); // Show first 10 methods
    
    // Test basic functionality
    if (sdk.Algodv2 && sdk.mnemonicToSecretKey) {
      console.log('✅ Required methods available');
      
      // Test creating a client
      const client = new sdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
      console.log('✅ Algodv2 client created');
      
      // Test mnemonic function
      const testMnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon";
      const account = sdk.mnemonicToSecretKey(testMnemonic);
      console.log('✅ Mnemonic to secret key works:', account.addr);
      
      return {
        success: true,
        message: 'Algosdk is working correctly'
      };
    } else {
      throw new Error('Required methods not available');
    }
  } catch (error) {
    console.error('❌ Algosdk test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
