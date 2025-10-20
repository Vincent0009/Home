'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_TOKENS } from '@/components/web3/TokenSelector';
import { SUPPORTED_CHAINS } from '@/components/web3/ChainSelector';

// ERC20 ABI for token operations (viem format)
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }]
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }]
  }
];

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PREFETCH_ALL_TOKENS = true; // Changed from PREFETCH_NATIVE_TOKENS

/**
 * Custom hook for managing multi-network token balances with smart caching
 * @param {Object} params - Hook parameters
 * @param {string} params.address - Wallet address
 * @param {boolean} params.isConnected - Wallet connection status
 * @param {Object} params.publicClients - Map of chain hex to public clients
 */
export default function useMultiNetworkBalances({ address, isConnected, publicClients }) {
  // Balance cache structure: { chainHex: { tokenSymbol: { balance, decimals, symbol, timestamp } } }
  const [balanceCache, setBalanceCache] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [errors, setErrors] = useState({});
  
  // Use ref to prevent infinite re-renders
  const lastFetchRef = useRef({}); // Track last fetch time per token/chain
  
  // Helper function to create cache key
  const getCacheKey = (chainHex, tokenSymbol) => `${chainHex}_${tokenSymbol}`;
  
  // Helper function to check if cache is valid
  const isCacheValid = useCallback((chainHex, tokenSymbol) => {
    const cached = balanceCache[chainHex]?.[tokenSymbol];
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  }, [balanceCache]);
  
  // Helper function to set loading state
  const setLoadingState = useCallback((chainHex, tokenSymbol, loading) => {
    setLoadingStates(prev => ({
      ...prev,
      [getCacheKey(chainHex, tokenSymbol)]: loading
    }));
  }, []);
  
  // Helper function to set error
  const setError = useCallback((chainHex, tokenSymbol, error) => {
    setErrors(prev => ({
      ...prev,
      [getCacheKey(chainHex, tokenSymbol)]: error
    }));
  }, []);
  
  // Function to fetch balance for a specific token on a specific chain
  const fetchTokenBalance = useCallback(async (chainHex, tokenSymbol, force = false) => {
    if (!address || !isConnected || !publicClients[chainHex]) {
      return null;
    }
    
    // Check cache first (unless forced)
    if (!force && isCacheValid(chainHex, tokenSymbol)) {
      return balanceCache[chainHex]?.[tokenSymbol];
    }
    
    // Prevent duplicate requests
    const cacheKey = getCacheKey(chainHex, tokenSymbol);
    const now = Date.now();
    if (!force && lastFetchRef.current[cacheKey] && now - lastFetchRef.current[cacheKey] < 1000) {
      return null;
    }
    lastFetchRef.current[cacheKey] = now;
    
    const tokenData = SUPPORTED_TOKENS[tokenSymbol];
    if (!tokenData) {
      console.warn(`Token data not found for ${tokenSymbol}`);
      return null;
    }
    
    setLoadingState(chainHex, tokenSymbol, true);
    setError(chainHex, tokenSymbol, null);
    
    try {
      const publicClient = publicClients[chainHex];
      let balanceData = null;
      
      if (tokenData.type === 'native') {
        // For native tokens, get balance directly
        const balance = await publicClient.getBalance({ address });
        balanceData = {
          value: balance, // This is already a BigInt from viem
          decimals: 18,
          symbol: tokenSymbol,
          timestamp: now
        };
      } else if (tokenData.addresses?.[chainHex] && (tokenData.type === 'stablecoin' || tokenData.type === 'wrapped' || tokenData.type === 'governance')) {
        // For ERC20 tokens (stablecoins, wrapped tokens, and governance tokens)
        const tokenAddress = tokenData.addresses[chainHex];
        if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
          console.warn(`Invalid token address for ${tokenSymbol} on chain ${chainHex}`);
          return null;
        }
        
        // Verify the contract exists
        const contractCode = await publicClient.getCode({ address: tokenAddress });
        if (contractCode === '0x') {
          console.warn(`No contract found at address ${tokenAddress} for ${tokenSymbol} on chain ${chainHex}`);
          return null;
        }
        
        // Use viem's readContract for better compatibility with viem public clients
        const [balance, decimals, symbol] = await Promise.allSettled([
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address]
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'decimals'
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'symbol'
          })
        ]).then(results => [
          results[0].status === 'fulfilled' ? results[0].value : null,
          results[1].status === 'fulfilled' ? results[1].value : 18n,
          results[2].status === 'fulfilled' ? results[2].value : tokenSymbol
        ]);
        
        if (balance === null) {
          throw new Error(`Failed to get balance for ${tokenSymbol}`);
        }
        
        balanceData = {
          value: balance,
          decimals: Number(decimals), // Convert BigInt to number for decimals
          symbol: symbol,
          timestamp: now
        };
      } else {
        // Token not available on this chain
        return null;
      }
      
      // Update cache
      setBalanceCache(prev => ({
        ...prev,
        [chainHex]: {
          ...prev[chainHex],
          [tokenSymbol]: balanceData
        }
      }));
      
      return balanceData;
      
    } catch (err) {
      console.error(`Balance fetch error for ${tokenSymbol} on ${chainHex}:`, err);
      const errorMsg = err.message || 'Failed to fetch balance';
      setError(chainHex, tokenSymbol, errorMsg);
      return null;
    } finally {
      setLoadingState(chainHex, tokenSymbol, false);
    }
  }, [address, isConnected, publicClients, balanceCache, isCacheValid, setLoadingState, setError]);
  
  // Function to prefetch ALL token balances for all supported chains
  const prefetchAllTokens = useCallback(async () => {
    if (!PREFETCH_ALL_TOKENS || !address || !isConnected) {
      return;
    }
    
    // Get all tokens (native, stablecoin, governance)
    const allTokens = Object.entries(SUPPORTED_TOKENS);
    const supportedChains = Object.keys(SUPPORTED_CHAINS);
    
    // Create prefetch promises
    const prefetchPromises = [];
    
    console.log('Starting comprehensive token balance prefetch...');
    
    for (const chainHex of supportedChains) {
      if (publicClients[chainHex]) {
        for (const [tokenSymbol, tokenData] of allTokens) {
          // Check if token is supported on this chain
          const isTokenSupported = tokenData.chains.includes(chainHex);
          
          // Additional check for ERC20 tokens - ensure they have a valid address
          const hasValidAddress = tokenData.type === 'native' || 
                                  (tokenData.addresses?.[chainHex] && 
                                   tokenData.addresses[chainHex] !== '0x0000000000000000000000000000000000000000');
          
          if (isTokenSupported && hasValidAddress) {
            prefetchPromises.push(
              fetchTokenBalance(chainHex, tokenSymbol).catch(error => {
                console.warn(`Prefetch failed for ${tokenSymbol} on ${chainHex}:`, error);
                return null;
              })
            );
          }
        }
      }
    }
    
    console.log(`Prefetching ${prefetchPromises.length} token balances...`);
    
    // Execute prefetch requests (don't wait for all to complete)
    Promise.allSettled(prefetchPromises).then((results) => {
      const successful = results.filter(result => result.status === 'fulfilled' && result.value !== null).length;
      console.log(`Token prefetch completed: ${successful}/${results.length} successful`);
    });
    
  }, [address, isConnected, publicClients, fetchTokenBalance]);
  
  // Prefetch all tokens when wallet connects
  useEffect(() => {
    if (address && isConnected && Object.keys(publicClients).length > 0) {
      // Small delay to ensure public clients are fully ready
      const timer = setTimeout(prefetchAllTokens, 1000);
      return () => clearTimeout(timer);
    }
  }, [address, isConnected, publicClients, prefetchAllTokens]);
  
  // Function to get balance for a specific token/chain combination
  const getBalance = useCallback((chainHex, tokenSymbol) => {
    const cached = balanceCache[chainHex]?.[tokenSymbol];
    if (cached && isCacheValid(chainHex, tokenSymbol)) {
      return cached;
    }
    
    // If not in cache or expired, trigger fetch
    fetchTokenBalance(chainHex, tokenSymbol);
    return cached || null;
  }, [balanceCache, isCacheValid, fetchTokenBalance]);
  
  // Function to force refresh a specific balance
  const refreshBalance = useCallback((chainHex, tokenSymbol) => {
    return fetchTokenBalance(chainHex, tokenSymbol, true);
  }, [fetchTokenBalance]);
  
  // Function to get loading state
  const isLoading = useCallback((chainHex, tokenSymbol) => {
    return loadingStates[getCacheKey(chainHex, tokenSymbol)] || false;
  }, [loadingStates]);
  
  // Function to get error state
  const getError = useCallback((chainHex, tokenSymbol) => {
    return errors[getCacheKey(chainHex, tokenSymbol)] || null;
  }, [errors]);
  
  // Function to check if token is available on chain
  const isTokenAvailable = useCallback((chainHex, tokenSymbol) => {
    const tokenData = SUPPORTED_TOKENS[tokenSymbol];
    if (!tokenData) return false;
    
    if (tokenData.type === 'native') {
      return tokenData.chains.includes(chainHex);
    } else {
      // For ERC20 tokens (stablecoins, wrapped, governance), check if address exists
      return tokenData.addresses?.[chainHex] && 
             tokenData.addresses[chainHex] !== '0x0000000000000000000000000000000000000000';
    }
  }, []);
  
  // Function to get formatted balance
  const getFormattedBalance = useCallback((chainHex, tokenSymbol, decimals = 6) => {
    const balance = getBalance(chainHex, tokenSymbol);
    if (!balance) return null;
    
    try {
      const formatted = ethers.formatUnits(balance.value, balance.decimals);
      return parseFloat(formatted).toFixed(decimals);
    } catch (err) {
      console.error('Error formatting balance:', err);
      return null;
    }
  }, [getBalance]);
  
  // Clean up expired cache entries periodically
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      setBalanceCache(prev => {
        const cleaned = { ...prev };
        
        Object.keys(cleaned).forEach(chainHex => {
          Object.keys(cleaned[chainHex]).forEach(tokenSymbol => {
            if (now - cleaned[chainHex][tokenSymbol].timestamp > CACHE_DURATION) {
              delete cleaned[chainHex][tokenSymbol];
            }
          });
          
          // Remove empty chain objects
          if (Object.keys(cleaned[chainHex]).length === 0) {
            delete cleaned[chainHex];
          }
        });
        
        return cleaned;
      });
    };
    
    const interval = setInterval(cleanup, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);
  
  return {
    getBalance,
    getFormattedBalance,
    refreshBalance,
    isLoading,
    getError,
    isTokenAvailable,
    balanceCache, // For debugging
  };
}