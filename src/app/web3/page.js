'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Optimized design system with CSS custom properties for better performance
const DESIGN_VARS = {
  '--primary-gradient': 'linear-gradient(to right, rgb(37, 99, 235), rgb(79, 70, 229))',
  '--secondary-gradient': 'linear-gradient(to right, rgb(31, 41, 55), rgb(29, 78, 216))',
  '--primary-color': 'rgb(37, 99, 235)',
  '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Loading skeleton component
const ComponentSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xl border border-blue-100/50 p-8 animate-pulse">
    <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-6"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
      <div className="h-12 bg-gray-200 rounded-lg w-full mt-6"></div>
    </div>
  </div>
);

// Dynamically import Web3 components with no SSR to avoid AppKit initialization issues
// Added a minimum delay of 500ms before showing the actual component
const Web3Components = dynamic(() => 
  new Promise(resolve => {
    const startTime = Date.now();
    // First import the actual component
    import('@/components/web3/Web3Components')
      .then(module => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        // Ensure a minimum display time of 800ms for the skeleton
        setTimeout(() => {
          resolve(module);
        }, remainingTime);
      });
  }),
  {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <ComponentSkeleton />
      </div>
      <div className="md:col-span-2">
        <ComponentSkeleton />
      </div>
    </div>
  )
  }
);

export default function Web3Page() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trigger animations with a single, coordinated approach
    const timer = setTimeout(() => {
      setIsVisible(true);

      // Optional: Add a slight additional delay before removing loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Inject CSS custom properties for better performance */}
      <style jsx>{`
        :root {
          ${Object.entries(DESIGN_VARS).map(([key, value]) => `${key}: ${value};`).join('\n')}
        }
      `}</style>

      <div className="min-h-screen relative">
        {/* Background decorative elements - moved outside of hero section to match skills page */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div
              className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"
              style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)' }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse"
              style={{
                willChange: 'transform',
                transform: 'translate3d(0, 0, 0)',
                animationDelay: '1s'
              }}
            />
          </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-20 text-center relative z-10">
            <h1
              className={`text-4xl md:text-6xl font-light mb-6 bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ willChange: 'transform' }}
            >
              Web3 <span className="font-bold">Donation</span>
            </h1>
            <p
              className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ willChange: 'transform, opacity' }}
            >
              Interactive Web3 demonstration featuring wallet connectivity, multi-chain network switching, and smart contract interactions. This donation interface exemplifies full-stack blockchain development skills and cross-chain compatibility implementation.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 relative z-10 max-w-7xl">
          <div className={`flex flex-col space-y-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Features highlight */}
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 text-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Multiple Tokens</h3>
                  <p className="text-sm text-slate-600">ETH, BNB, MATIC, USDT, USDC supported</p>
                </div>
                <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 text-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Multi-Chain</h3>
                  <p className="text-sm text-slate-600">Ethereum, BSC, Polygon, Arbitrum, Base</p>
                </div>
                <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 text-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Secure</h3>
                  <p className="text-sm text-slate-600">Verified smart contracts with security audits</p>
                </div>
              </div>
            </div>

            {/* Web3 Components Section */}
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              {!isLoading && (
                <Suspense fallback={<ComponentSkeleton />}>
                  <Web3Components />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}