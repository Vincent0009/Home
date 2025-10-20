'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Cache duration: 2 minutes in milliseconds
const CACHE_DURATION = 2 * 60 * 1000;

// Singleton cache to persist across component instances
let priceCache = {
  data: null,
  timestamp: null
};

export default function useCachedTokenPrices(tokenData) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTimeoutRef = useRef(null);

  const fetchAllPrices = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Check if cache is valid and not forced
    if (!force && priceCache.data && priceCache.timestamp && (now - priceCache.timestamp) < CACHE_DURATION) {
      setPrices(priceCache.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get all unique coingecko IDs from token data
      const coingeckoIds = Object.values(tokenData)
        .map(token => token.coingeckoId)
        .filter(id => id) // Remove undefined/null
        .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

      if (coingeckoIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch all prices in a single API call
      const idsString = coingeckoIds.join(',');
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const priceData = await response.json();

      // Transform the data into a more usable format: token symbol -> price
      const transformedPrices = {};
      Object.entries(tokenData).forEach(([symbol, token]) => {
        if (token.type === 'stablecoin') {
          // Stablecoins are always $1.00
          transformedPrices[symbol] = 1.00;
        } else if (token.coingeckoId && priceData[token.coingeckoId]) {
          transformedPrices[symbol] = priceData[token.coingeckoId].usd;
        }
      });

      // Update cache
      priceCache = {
        data: transformedPrices,
        timestamp: now
      };

      setPrices(transformedPrices);
    } catch (err) {
      console.error('Failed to fetch token prices:', err);
      setError(err.message);
      
      // If we have cached data, use it even if it's stale
      if (priceCache.data) {
        setPrices(priceCache.data);
      }
    } finally {
      setLoading(false);
    }
  }, [tokenData]);

  // Initial fetch and setup
  useEffect(() => {
    if (!tokenData || Object.keys(tokenData).length === 0) return;

    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Fetch prices immediately
    fetchAllPrices();

    // Set up automatic refresh after cache expires
    const scheduleNextFetch = () => {
      fetchTimeoutRef.current = setTimeout(() => {
        fetchAllPrices(true); // Force fetch after cache expires
        scheduleNextFetch(); // Schedule the next one
      }, CACHE_DURATION);
    };

    scheduleNextFetch();

    // Cleanup function
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [fetchAllPrices, tokenData]);

  // Function to manually refresh prices
  const refreshPrices = () => {
    fetchAllPrices(true);
  };

  // Get price for specific token
  const getPrice = (tokenSymbol) => {
    return prices[tokenSymbol] || null;
  };

  // Check if cache is fresh
  const isCacheFresh = () => {
    if (!priceCache.timestamp) return false;
    return (Date.now() - priceCache.timestamp) < CACHE_DURATION;
  };

  return {
    prices,
    loading,
    error,
    refreshPrices,
    getPrice,
    isCacheFresh,
    cacheAge: priceCache.timestamp ? Math.floor((Date.now() - priceCache.timestamp) / 1000) : null
  };
}