'use client';

import { useMemo } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient, useBalance, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { ethers } from 'ethers';

/**
 * Wagmi-compatible wallet hook that replaces direct window.ethereum usage
 * This hook provides a unified interface for wallet operations using Wagmi hooks
 */
export default function useWallet() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { data: balance } = useBalance({ address });
  const { connect, connectors, isPending: isConnecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching, error: switchError } = useSwitchChain();

  // Create ethers provider from public client
  const provider = useMemo(() => {
    if (!publicClient) return null;
    
    try {
      // Create an ethers provider that works with the current public client
      return new ethers.BrowserProvider(publicClient.transport || walletClient?.transport);
    } catch (error) {
      console.warn('Failed to create ethers provider:', error);
      return null;
    }
  }, [publicClient, walletClient]);

  // Create ethers signer from wallet client
  const signer = useMemo(async () => {
    if (!walletClient || !provider) return null;
    
    try {
      return await provider.getSigner();
    } catch (error) {
      console.warn('Failed to get signer:', error);
      return null;
    }
  }, [walletClient, provider]);

  // Format balance for display
  const formattedBalance = useMemo(() => {
    if (!balance) return null;
    return ethers.formatEther(balance.value);
  }, [balance]);

  // Connect wallet function
  const connectWallet = async (connectorId = 'walletConnect') => {
    try {
      const targetConnector = connectors.find(c => 
        c.id === connectorId || 
        c.name.toLowerCase().includes('walletconnect') ||
        c.name.toLowerCase().includes('reown')
      ) || connectors[0];

      if (!targetConnector) {
        throw new Error('No suitable wallet connector found');
      }

      connect({ connector: targetConnector });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    try {
      disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  // Switch network function
  const switchNetwork = async (targetChainId) => {
    try {
      const numericChainId = typeof targetChainId === 'string' 
        ? parseInt(targetChainId, 16) 
        : targetChainId;
      
      switchChain({ chainId: numericChainId });
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  };

  // Combined error state
  const error = connectError || switchError;

  return {
    // Wallet state
    account: address,
    address,
    isConnected,
    connector,
    
    // Network state
    chainId,
    
    // Balance
    balance: formattedBalance,
    balanceData: balance,
    
    // Providers
    provider,
    signer,
    publicClient,
    walletClient,
    
    // Loading states
    isLoading: isConnecting,
    isConnecting,
    isSwitching,
    
    // Error state
    error,
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    
    // Raw Wagmi functions for advanced usage
    connect,
    disconnect,
    switchChain,
    
    // Available connectors
    connectors,
  };
}