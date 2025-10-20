'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeWeb3, getWagmiConfig } from '@/lib/web3/modal';
import { WagmiProvider } from 'wagmi';

// Create a context for Web3 state
const Web3Context = createContext(null);

// Create a query client
const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  const [isWeb3Ready, setIsWeb3Ready] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Web3 libraries only
  useEffect(() => {
    const initializeProvider = async () => {
      try {
        // Initialize Web3 libraries (Wagmi/Reown)
        await initializeWeb3();
        setIsWeb3Ready(true);
        setError(null);
      } catch (err) {
        console.error('Error initializing Web3:', err);
        setError('Failed to initialize Web3 libraries');
      }
    };

    initializeProvider();
  }, []);

  // Note: Wallet connection is now handled by Wagmi hooks
  // This provider only manages Web3 library initialization

  // Context value - only provides Web3 readiness state
  const value = {
    isWeb3Ready,
    error,
  };

  // Get wagmi config (will be null until Web3 is initialized)
  const wagmiConfig = getWagmiConfig();

  // Render with or without WagmiProvider based on initialization state
  if (!isWeb3Ready || !wagmiConfig) {
    return (
      <Web3Context.Provider value={value}>
        <div className="web3-initializing">
          {children}
        </div>
      </Web3Context.Provider>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Custom hook to use the Web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}