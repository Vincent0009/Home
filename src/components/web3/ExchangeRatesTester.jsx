'use client';

import { useState, useEffect } from 'react';
import useCryptoPrice from '@/hooks/useCryptoPrice';

export default function ExchangeRatesTester() {
  const [isLoading, setIsLoading] = useState(false);
  const [directApiResult, setDirectApiResult] = useState(null);
  const [error, setError] = useState('');
  const { allPrices, price: ethPrice, refresh, isLoading: hookLoading } = useCryptoPrice('ETH');
  
  // Test direct API call
  const testDirectApiCall = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/crypto/exchange-rates');
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setDirectApiResult(data);
    } catch (err) {
      console.error('API test error:', err);
      setError(err.message || 'Failed to fetch exchange rates');
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="exchange-rates-tester p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Exchange Rates API Tester</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Hook-based Test (useCryptoPrice)</h3>
        <div className="p-4 bg-gray-100 rounded-md">
          <div className="mb-2">
            <span className="font-semibold">Status:</span> {hookLoading ? 'Loading...' : 'Ready'}
          </div>
          <div className="mb-2">
            <span className="font-semibold">ETH Price:</span> ${ethPrice ? ethPrice.toFixed(2) : 'N/A'}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Last Updated:</span> {formatTimestamp(allPrices?.timestamp)}
          </div>
          
          <h4 className="font-semibold mb-2">All Prices:</h4>
          {allPrices && Object.entries(allPrices).map(([key, value]) => {
            if (key === 'timestamp') return null;
            return (
              <div key={key} className="flex justify-between py-1 border-b border-gray-200">
                <span>{key}:</span>
                <span>${value ? value.toFixed(2) : 'N/A'}</span>
              </div>
            );
          })}
          
          <button
            onClick={refresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Prices
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Direct API Test</h3>
        <div className="p-4 bg-gray-100 rounded-md">
          <button
            onClick={testDirectApiCall}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mb-4"
            disabled={isLoading}
          >
            {isLoading ? 'Testing...' : 'Test API Directly'}
          </button>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {directApiResult && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">API Response:</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto">
                {JSON.stringify(directApiResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}