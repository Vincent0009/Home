'use client';

import { ethers } from 'ethers';

/**
 * Format an Ethereum address for display by shortening it
 * @param {string} address - The Ethereum address to format
 * @param {number} chars - Number of characters to show at the beginning and end
 * @returns {string} Formatted address
 */
export function formatAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Format Wei value to Ether with specified decimal places
 * @param {string|BigNumber|bigint} wei - The wei amount to convert
 * @param {number} decimals - Number of decimal places to display
 * @returns {string} Formatted ether amount
 */
export function formatEther(wei, decimals = 4) {
  if (!wei) return '0';

  // Use ethers.formatEther to convert to a string representation
  const etherValue = ethers.formatEther(wei);

  try {
    // Parse the string as a float and format it
    const num = parseFloat(etherValue);
    if (!isNaN(num) && isFinite(num)) {
      return num.toFixed(decimals);
    }

    // For very large numbers that can't be parsed as float,
    // manually truncate the decimal places
    const parts = etherValue.split('.');
    if (parts.length === 1) return parts[0];

    // Truncate the decimal part to the specified number of decimals
    const decimalPart = parts[1].substring(0, decimals);
    return `${parts[0]}.${decimalPart.padEnd(decimals, '0')}`;
  } catch (error) {
    // Fallback to just returning the string value
    console.warn("Error formatting ether value:", error);
    return etherValue;
  }
}

/**
 * Get network name from chain ID
 * @param {string|number} chainId - The chain ID
 * @returns {string} Network name
 */
export function getNetworkName(chainId) {
  if (!chainId) return 'Unknown Network';
  
  // Convert to hex string if it's a number
  const chainIdHex = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
  
  const networks = {
    '0x1': 'Ethereum Mainnet',
    '0x5': 'Goerli Testnet',
    '0x89': 'Polygon Mainnet',
    '0x13881': 'Mumbai Testnet',
    '0x38': 'Binance Smart Chain',
    '0x61': 'BSC Testnet',
  };
  
  return networks[chainIdHex] || `Chain ID: ${chainId}`;
}

/**
 * Get explorer URL for a specific network
 * @param {string|number} chainId - The chain ID
 * @returns {string} Block explorer base URL
 */
export function getExplorerUrl(chainId) {
  if (!chainId) return 'https://etherscan.io';
  
  // Convert to hex string if it's a number
  const chainIdHex = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
  
  const explorers = {
    '0x1': 'https://etherscan.io',
    '0x5': 'https://goerli.etherscan.io',
    '0x89': 'https://polygonscan.com',
    '0x13881': 'https://mumbai.polygonscan.com',
    '0x38': 'https://bscscan.com',
    '0x61': 'https://testnet.bscscan.com',
  };
  
  return explorers[chainIdHex] || 'https://etherscan.io';
}

/**
 * Create transaction explorer link
 * @param {string} txHash - Transaction hash
 * @param {string|number} chainId - Chain ID
 * @returns {string} Explorer URL for the transaction
 */
export function getTransactionLink(txHash, chainId) {
  if (!txHash) return '';
  const baseUrl = getExplorerUrl(chainId);
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Create address explorer link
 * @param {string} address - Ethereum address
 * @param {string|number} chainId - Chain ID
 * @returns {string} Explorer URL for the address
 */
export function getAddressLink(address, chainId) {
  if (!address) return '';
  const baseUrl = getExplorerUrl(chainId);
  return `${baseUrl}/address/${address}`;
}

/**
 * Convert USD amount to Wei based on ETH price
 * @param {number} usdAmount - Amount in USD
 * @param {number} ethPrice - Current ETH price in USD
 * @returns {BigNumber} Amount in Wei
 */
export function usdToWei(usdAmount, ethPrice) {
  if (!usdAmount || !ethPrice || ethPrice === 0) return ethers.parseEther('0');
  const ethAmount = usdAmount / ethPrice;
  return ethers.parseEther(ethAmount.toString());
}

/**
 * Convert Wei amount to USD based on ETH price
 * @param {string|BigNumber|bigint} weiAmount - Amount in Wei
 * @param {number} ethPrice - Current ETH price in USD
 * @returns {number} Amount in USD
 */
export function weiToUsd(weiAmount, ethPrice) {
  if (!weiAmount || !ethPrice) return 0;
  const ethAmount = parseFloat(ethers.formatEther(weiAmount));
  return ethAmount * ethPrice;
}

/**
 * Check if the wallet is connected to the correct network
 * @param {string|number} currentChainId - Current chain ID
 * @param {string|number} requiredChainId - Required chain ID
 * @returns {boolean} Whether the wallet is on the correct network
 */
export function isCorrectNetwork(currentChainId, requiredChainId) {
  if (!currentChainId || !requiredChainId) return false;
  
  // Convert to hex strings for comparison
  const currentHex = typeof currentChainId === 'number' ? `0x${currentChainId.toString(16)}` : currentChainId;
  const requiredHex = typeof requiredChainId === 'number' ? `0x${requiredChainId.toString(16)}` : requiredChainId;
  
  return currentHex.toLowerCase() === requiredHex.toLowerCase();
}

/**
 * Get required parameters for adding a network to MetaMask
 * @param {string|number} chainId - Chain ID
 * @returns {Object|null} Network parameters or null if not found
 */
export function getAddNetworkParams(chainId) {
  if (!chainId) return null;
  
  // Convert to hex string if it's a number
  const chainIdHex = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
  
  const networks = {
    '0x89': {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://polygon-rpc.com/'],
      blockExplorerUrls: ['https://polygonscan.com/']
    },
    '0x13881': {
      chainId: '0x13881',
      chainName: 'Mumbai Testnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com/']
    },
    '0x38': {
      chainId: '0x38',
      chainName: 'Binance Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com/']
    }
  };
  
  return networks[chainIdHex] || null;
}