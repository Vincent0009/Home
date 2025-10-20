/**
 * Addresses of deployed smart contracts on different networks
 * Update these addresses after deploying contracts to each network
 */
export const contractAddresses = {
  // Mainnets - chosen chains for donation support
  '0x1': { // Ethereum Mainnet
    donation: '0x60137b908258644672c383EA3c89094c162B10a8', // Deploy and replace with actual address
  },
  '0x38': { // BNB Smart Chain
    donation: '0x60137b908258644672c383EA3c89094c162B10a8', // Deploy and replace with actual address
  },
  '0x89': { // Polygon PoS
    donation: '0x60137b908258644672c383EA3c89094c162B10a8', // Deploy and replace with actual address
  },
  '0xa4b1': { // Arbitrum One
    donation: '0x60137b908258644672c383EA3c89094c162B10a8', // Deploy and replace with actual address
  },
  '0xa': { // Optimism
    donation: '0x60137b908258644672c383EA3c89094c162B10a8', // Deploy and replace with actual address
  },
  '0x2105': { // Base
    donation: '0x7f80E45806342C5c92E0992e8cACc4489B0182be', // Deploy and replace with actual address
  },
  
  // Testnets - for development
  '0xaa36a7': { // Sepolia Testnet
    donation: '0x60137b908258644672c383EA3c89094c162B10a8', // Already deployed
  },
};

/**
 * Get contract address for a specific network
 * @param {string} contractName - Name of the contract
 * @param {string} chainId - Chain ID of the network
 * @returns {string} Contract address
 */
export function getContractAddress(contractName, chainId) {
  if (!chainId) return null;
  
  // Convert to hex string if it's a number
  const chainIdHex = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
  
  const networkAddresses = contractAddresses[chainIdHex];
  if (!networkAddresses) return null;
  
  return networkAddresses[contractName] || null;
}