'use client';

import { Suspense, lazy } from 'react';
import { Web3Provider } from './Web3Provider';
import WalletConnect from './WalletConnect';

// Lazy load heavy components
const ModernDonationForm = lazy(() => import('./ModernDonationForm'));

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

export default function Web3Components() {
  return (
    <Web3Provider>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <WalletConnect />
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<ComponentSkeleton />}>
            <ModernDonationForm />
          </Suspense>
        </div>
      </div>
    </Web3Provider>
  );
}