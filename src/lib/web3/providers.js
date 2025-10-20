'use client';

import { ethers } from 'ethers';

/**
 * Get a provider for a specific network
 * @param {string|number} chainId - Chain ID of the network
 * @returns {ethers.JsonRpcProvider} Ethers provider instance
 */
export function getNetworkProvider(chainId) {
  // Convert chainId to hex if it's a number
  const chainIdHex = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
  
  // Get Infura API key from environment variables
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || process.env.INFURA_API_KEY;
  
  if (!infuraKey) {
    console.warn('No Infura API key found in environment variables. Using public RPC endpoints.');
}

  // Define RPC URLs for chosen networks
  const rpcUrls = {
    // Mainnets - chosen chains for donation support
    '0x1': process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || `https://mainnet.infura.io/v3/${infuraKey}`, // Ethereum
    '0x38': process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/', // BNB Chain
    '0x89': process.env.NEXT_PUBLIC_POLYGON_RPC_URL || `https://polygon-mainnet.infura.io/v3/${infuraKey}`, // Polygon PoS
    '0xa4b1': process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || `https://arbitrum-mainnet.infura.io/v3/${infuraKey}`, // Arbitrum One
    '0xa': process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || `https://optimism-mainnet.infura.io/v3/${infuraKey}`, // Optimism
    '0x2105': process.env.NEXT_PUBLIC_BASE_RPC_URL || `https://mainnet.base.org`, // Base
    
    // Testnets - for development
    '0xaa36a7': process.env.SEPOLIA_RPC_URL || `https://sepolia.infura.io/v3/${infuraKey}`, // Sepolia
  };
  
  // Get RPC URL for the specified network, or default to Ethereum mainnet
  const rpcUrl = rpcUrls[chainIdHex] || rpcUrls['0x1'];
  
  // Check if we have a valid RPC URL
  if (!rpcUrl || rpcUrl.includes('undefined')) {
    throw new Error(`Invalid RPC URL for chain ID ${chainId}. Check your environment variables.`);
  }
  
  return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Get a Web3 provider from the browser (MetaMask, etc.)
 * @returns {ethers.BrowserProvider|null} Browser provider or null if not available
 */
export function getBrowserProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
}

/**
 * Get supported networks configuration
 * @returns {Array} Array of supported networks with their details
 */
export function getSupportedNetworks() {
  // Get Infura API key from environment variables
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';
  
  return [
    // Mainnets - chosen chains for donation support
    {
      id: '0x1',
      name: 'Ethereum Mainnet',
      currency: 'ETH',
      explorerUrl: 'https://etherscan.io',
      rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || `https://mainnet.infura.io/v3/${infuraKey}`
    },
    {
      id: '0x38',
      name: 'BNB Smart Chain',
      currency: 'BNB',
      explorerUrl: 'https://bscscan.com',
      rpcUrl: process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/'
    },
    {
      id: '0x89',
      name: 'Polygon PoS',
      currency: 'MATIC',
      explorerUrl: 'https://polygonscan.com',
      rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || `https://polygon-mainnet.infura.io/v3/${infuraKey}`
    },
    {
      id: '0xa4b1', // Decimal: 42161
      name: 'Arbitrum One',
      currency: 'ETH',
      explorerUrl: 'https://arbiscan.io',
      rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || `https://arbitrum-mainnet.infura.io/v3/${infuraKey}`
    },
    {
      id: '0xa', // Decimal: 10
      name: 'Optimism',
      currency: 'ETH',
      explorerUrl: 'https://optimistic.etherscan.io',
      rpcUrl: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || `https://optimism-mainnet.infura.io/v3/${infuraKey}`
    },
    {
      id: '0x2105', // Decimal: 8453
      name: 'Base',
      currency: 'ETH',
      explorerUrl: 'https://basescan.org',
      rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'
    },
    
    // Testnets - for development
    {
      id: '0xaa36a7', // Decimal: 11155111
      name: 'Sepolia Testnet',
      currency: 'ETH',
      explorerUrl: 'https://sepolia.etherscan.io',
      rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || `https://sepolia.infura.io/v3/${infuraKey}`,
      isTestnet: true
    }
  ];
    }

/**
 * Switch the network in the user's wallet
 * @param {string} chainId - Chain ID to switch to (in hex format)
 * @returns {Promise} Promise that resolves when the network is switched
 */
export async function switchNetwork(chainId) {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Ethereum provider found');
  }
  
  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      const networks = getSupportedNetworks();
      const network = networks.find(net => net.id === chainId);
      
      if (!network) {
        throw new Error(`Unsupported network: ${chainId}`);
}
      
      // Add the network to MetaMask
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: network.id,
            chainName: network.name,
            nativeCurrency: {
              name: network.currency,
              symbol: network.currency,
              decimals: 18
            },
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.explorerUrl]
          }
        ]
      });
    } else {
      throw error;
    }
  }
}