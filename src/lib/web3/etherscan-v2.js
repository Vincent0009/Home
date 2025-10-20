/**
 * Etherscan API v2 utilities
 * Updated to use v2 endpoints with chainId parameter
 */

// Etherscan v2 unified endpoint - all networks use the same URL with chainId parameter
const ETHERSCAN_V2_BASE_URL = 'https://api.etherscan.io/v2/api';

// Supported chain IDs for Etherscan v2
const SUPPORTED_CHAINS = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet', 
  56: 'BNB Smart Chain',
  137: 'Polygon',
  42161: 'Arbitrum One',
  10: 'Optimism',
  8453: 'Base'
};

/**
 * Get API key for Etherscan v2 API
 * With v2, all networks use the same Etherscan API key
 * SERVER-SIDE ONLY! Do not use in client-side components
 * @param {number} chainId - Chain ID (for validation only)
 * @returns {string|undefined} Etherscan API key
 */
function getApiKey(chainId) {
  // Validate that the chain is supported
  if (!SUPPORTED_CHAINS[chainId]) {
    return undefined;
  }
  
  // v2 API uses single Etherscan API key for all networks
  return process.env.ETHERSCAN_API_KEY;
}

/**
 * Make an Etherscan v2 API call
 * @param {number} chainId - Chain ID (1, 56, 137, etc.)
 * @param {string} module - API module (account, contract, etc.)
 * @param {string} action - API action (balance, txlist, etc.)
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} API response
 */
export async function callEtherscanV2API(chainId, module, action, params = {}) {
  // Check if chain is supported
  if (!SUPPORTED_CHAINS[chainId]) {
    throw new Error(`Unsupported chain ID: ${chainId}. Supported chains: ${Object.keys(SUPPORTED_CHAINS).join(', ')}`);
  }
  
  const apiKey = getApiKey(chainId);
  if (!apiKey) {
    throw new Error(`API key not configured for chain ID: ${chainId}`);
  }

  // Build query parameters
  const queryParams = new URLSearchParams({
    chainid: chainId.toString(), // Required for v2
    module,
    action,
    apikey: apiKey,
    ...params
  });

  const url = `${ETHERSCAN_V2_BASE_URL}?${queryParams}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== '1' && data.message !== 'OK') {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('Etherscan v2 API call failed:', error);
    throw error;
  }
}

/**
 * Get account balance using Etherscan v2 API
 * @param {string} address - Ethereum address
 * @param {number} chainId - Chain ID
 * @returns {Promise<string>} Balance in wei
 */
export async function getAccountBalance(address, chainId) {
  const response = await callEtherscanV2API(chainId, 'account', 'balance', {
    address,
    tag: 'latest'
  });
  
  return response.result;
}

/**
 * Get transaction list for an address using Etherscan v2 API
 * @param {string} address - Ethereum address
 * @param {number} chainId - Chain ID
 * @param {number} startblock - Starting block number (optional)
 * @param {number} endblock - Ending block number (optional)
 * @param {number} page - Page number (optional)
 * @param {number} offset - Number of transactions per page (optional)
 * @returns {Promise<Array>} Array of transactions
 */
export async function getTransactionList(address, chainId, options = {}) {
  const params = {
    address,
    startblock: options.startblock || 0,
    endblock: options.endblock || 99999999,
    page: options.page || 1,
    offset: options.offset || 10,
    sort: options.sort || 'desc'
  };
  
  const response = await callEtherscanV2API(chainId, 'account', 'txlist', params);
  return response.result;
}

/**
 * Get contract ABI using Etherscan v2 API
 * @param {string} address - Contract address
 * @param {number} chainId - Chain ID
 * @returns {Promise<Array>} Contract ABI
 */
export async function getContractABI(address, chainId) {
  const response = await callEtherscanV2API(chainId, 'contract', 'getabi', {
    address
  });
  
  return JSON.parse(response.result);
}

/**
 * Verify contract source code using Etherscan v2 API
 * Note: This would typically be done server-side due to API key security
 * @param {string} contractAddress - Contract address
 * @param {string} sourceCode - Contract source code
 * @param {string} contractName - Contract name
 * @param {string} compilerVersion - Solidity compiler version
 * @param {number} chainId - Chain ID
 * @param {Object} options - Additional verification options
 * @returns {Promise<Object>} Verification response
 */
export async function verifyContract(contractAddress, sourceCode, contractName, compilerVersion, chainId, options = {}) {
  const params = {
    contractaddress: contractAddress,
    sourceCode,
    codeformat: 'solidity-single-file',
    contractname: contractName,
    compilerversion: compilerVersion,
    optimizationUsed: options.optimizationUsed || 0,
    runs: options.runs || 200,
    ...options
  };
  
  const response = await callEtherscanV2API(chainId, 'contract', 'verifysourcecode', params);
  return response;
}

/**
 * Get verification status using Etherscan v2 API
 * @param {string} guid - Verification GUID returned from verify call
 * @param {number} chainId - Chain ID
 * @returns {Promise<Object>} Verification status
 */
export async function getVerificationStatus(guid, chainId) {
  const response = await callEtherscanV2API(chainId, 'contract', 'checkverifystatus', {
    guid
  });
  
  return response;
}

/**
 * Get supported chains for Etherscan v2
 * @returns {Array<number>} Array of supported chain IDs
 */
export function getSupportedChains() {
  return Object.keys(SUPPORTED_CHAINS).map(Number);
}

/**
 * Check if a chain is supported by Etherscan v2
 * @param {number} chainId - Chain ID to check
 * @returns {boolean} True if supported
 */
export function isChainSupported(chainId) {
  return chainId in SUPPORTED_CHAINS;
}

/**
 * Get chain name for a chain ID
 * @param {number} chainId - Chain ID
 * @returns {string|undefined} Chain name
 */
export function getChainName(chainId) {
  return SUPPORTED_CHAINS[chainId];
}