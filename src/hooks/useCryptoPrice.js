'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch crypto prices');
  }
  return res.json();
};

/**
 * Custom hook to fetch and manage cryptocurrency prices
 * @param {string} currency - The cryptocurrency symbol (ETH, BTC, etc.)
 * @returns {Object} Price data and state
 */
export default function useCryptoPrice(currency = 'ETH') {
  const [price, setPrice] = useState(null);
  
  // Fetch exchange rates using SWR for caching and revalidation
  const { data, error, isLoading, mutate } = useSWR(
    '/api/crypto/exchange-rates',
    fetcher,
    { 
      refreshInterval: 120000, // Refresh every 2 minutes instead of 1
      revalidateOnFocus: false, // Disable revalidation on focus to prevent excessive calls
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // Dedupe requests for 30 seconds
      focusThrottleInterval: 60000 // Throttle focus revalidation
    }
  );

  // Update price when data or currency changes
  useEffect(() => {
    if (data && data.rates) {
      setPrice(data.rates[currency] || null);
    }
  }, [data, currency]);

  // Convert USD to crypto amount
  const usdToCrypto = (usdAmount) => {
    if (!price || price === 0 || !usdAmount) return 0;
    return usdAmount / price;
  };

  // Convert crypto to USD amount
  const cryptoToUsd = (cryptoAmount) => {
    if (!price || !cryptoAmount) return 0;
    return cryptoAmount * price;
  };

  return {
    price,
    error,
    isLoading,
    refresh: mutate,
    usdToCrypto,
    cryptoToUsd,
    lastUpdated: data?.rates?.timestamp || null,
    allPrices: data?.rates || {}
  };
}