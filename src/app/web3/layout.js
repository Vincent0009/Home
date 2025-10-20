'use client';

import { Web3Provider } from '@/components/web3/Web3Provider';

export default function Web3Layout({ children }) {
  return (
    <Web3Provider>
      <div className="web3-layout">
        <div className="mx-auto">
          {children}
        </div>
      </div>
    </Web3Provider>
  );
}