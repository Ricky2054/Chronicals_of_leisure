import { useState, useCallback } from 'react';

export function useBlockchain(addDebugLog) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [coins, setCoins] = useState(0);
  const [relics, setRelics] = useState(0);

  const connectWallet = useCallback(async () => {
    try {
      addDebugLog('Attempting to connect wallet...', 'info');
      
      // Placeholder for actual Algorand wallet connection
      // In a real implementation, you would use algo-sdk or a wallet connector
      const mockAddress = "ALG_WALLET_ADDRESS_PLACEHOLDER";
      
      setAddress(mockAddress);
      setConnected(true);
      setCoins(100); // Mock initial coins
      setRelics(0);
      
      addDebugLog(`Wallet connected: ${mockAddress}`, 'info');
      return true;
    } catch (error) {
      addDebugLog(`Failed to connect wallet: ${error.message}`, 'error');
      return false;
    }
  }, [addDebugLog]);

  const mintNFT = useCallback(async (achievementName) => {
    if (!connected) {
      addDebugLog('Cannot mint NFT: Wallet not connected', 'warn');
      return false;
    }
    
    try {
      addDebugLog(`Minting NFT for achievement: ${achievementName}`, 'info');
      
      // Placeholder for actual NFT minting on Algorand
      // This would involve creating an ASA, signing transactions, etc.
      setRelics(prev => prev + 1);
      
      addDebugLog(`NFT "${achievementName}" minted successfully!`, 'info');
      return true;
    } catch (error) {
      addDebugLog(`Failed to mint NFT: ${error.message}`, 'error');
      return false;
    }
  }, [connected, addDebugLog]);

  const sendASA = useCallback(async (recipient, amount) => {
    if (!connected) {
      addDebugLog('Cannot send ASA: Wallet not connected', 'warn');
      return false;
    }
    
    try {
      addDebugLog(`Sending ${amount} ASA to ${recipient}`, 'info');
      
      // Placeholder for actual ASA transfer
      setCoins(prev => Math.max(0, prev - amount));
      
      addDebugLog(`${amount} ASA sent successfully!`, 'info');
      return true;
    } catch (error) {
      addDebugLog(`Failed to send ASA: ${error.message}`, 'error');
      return false;
    }
  }, [connected, addDebugLog]);

  return {
    connected,
    address,
    coins,
    relics,
    connectWallet,
    mintNFT,
    sendASA
  };
}