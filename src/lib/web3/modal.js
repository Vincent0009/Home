'use client';

// Configuration that can be safely loaded server-side
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

const metadata = {
  name: 'Web3 App',
  description: 'Web3 App with Reown AppKit',
  url: 'https://yourwebsite.com',
  icons: ['https://yourwebsite.com/favicon.ico']
};

// State to track initialization
let wagmiAdapter = null;
let initializationPromise = null;

// Function to initialize Web3 components lazily
export const initializeWeb3 = async () => {
  // Return existing promise if already initializing
  if (initializationPromise) {
    return initializationPromise;
  }
  
  // Return existing adapter if already initialized
  if (wagmiAdapter) {
    return wagmiAdapter;
  }

  // Only initialize on client side
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Create initialization promise
  initializationPromise = (async () => {
    try {
      // Dynamic imports to prevent server-side loading delays
      const [
        { createAppKit },
        { WagmiAdapter },
        { mainnet, polygon, optimism, arbitrum, base, sepolia, bsc },
        { cookieStorage, createStorage }
      ] = await Promise.all([
        import('@reown/appkit/react'),
        import('@reown/appkit-adapter-wagmi'),
        import('wagmi/chains'),
        import('wagmi')
      ]);

      // Define networks - chosen chains for donation support
      // ETH, BNB, Polygon PoS, Arbitrum One, Optimism, Base, and Sepolia (testnet)
      const networks = [mainnet, bsc, polygon, arbitrum, optimism, base, sepolia];

      // Create Wagmi Adapter
      wagmiAdapter = new WagmiAdapter({
        projectId,
        networks,
        storage: createStorage({ storage: cookieStorage }),
        ssr: true
      });

      // Create AppKit modal
      createAppKit({
        adapters: [wagmiAdapter],
        projectId,
        networks,
        metadata,
        themeMode: 'light',
        themeVariables: {
          '--w3m-accent': '#3b82f6', // blue-600
        }
      });

      return wagmiAdapter;
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      initializationPromise = null; // Reset to allow retry
      throw error;
    }
  })();

  return initializationPromise;
};

// Getter functions that trigger initialization when needed
export const getWagmiAdapter = () => {
  if (!wagmiAdapter && typeof window !== 'undefined') {
    initializeWeb3();
  }
  return wagmiAdapter;
};

export const getWagmiConfig = () => {
  const adapter = getWagmiAdapter();
  return adapter?.wagmiConfig || null;
};

// Auto-initialize on client side with a small delay to not block initial render
if (typeof window !== 'undefined') {
  // Use requestIdleCallback if available, otherwise setTimeout
  const scheduleInit = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
  scheduleInit(() => initializeWeb3());
}