'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAccount, useChainId, useDisconnect, useSwitchChain, usePublicClient } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { mainnet, bsc, polygon, arbitrum, optimism, base, sepolia } from 'viem/chains';
import { useAppKit } from '@reown/appkit/react';
import { useWeb3 } from './Web3Provider';
import { SUPPORTED_TOKENS } from './TokenSelector';
import { SUPPORTED_CHAINS } from './ChainSelector';
import useMultiNetworkBalances from '@/hooks/useMultiNetworkBalances';


export default function WalletConnect() {
  const { isWeb3Ready } = useWeb3();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  
  // State for token/chain selection
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [selectedChain, setSelectedChain] = useState('0x1');
  
  // Create public clients map for all supported networks
  const publicClients = useMemo(() => {
    const clients = {};
    
    try {
      // Chain configurations mapping hex IDs to viem chains
      const chainConfigs = {
        '0x1': mainnet,      // Ethereum
        '0x38': bsc,         // BNB Chain
        '0x89': polygon,     // Polygon
        '0xa4b1': arbitrum,  // Arbitrum
        '0xa': optimism,     // Optimism  
        '0x2105': base,      // Base
        '0xaa36a7': sepolia  // Sepolia testnet
      };

      // Create public clients for all supported chains
      Object.entries(chainConfigs).forEach(([chainHex, viemChain]) => {
        if (SUPPORTED_CHAINS[chainHex]) {
          try {
            clients[chainHex] = createPublicClient({
              chain: viemChain,
              transport: http()
            });
          } catch (err) {
            console.warn(`Failed to create public client for chain ${chainHex}:`, err);
          }
        }
      });
      
      // Also include the current connected client if available
      if (publicClient && chainId) {
        const currentChainHex = `0x${chainId.toString(16)}`;
        if (SUPPORTED_CHAINS[currentChainHex]) {
          clients[currentChainHex] = publicClient;
        }
      }
    } catch (err) {
      console.error('Error creating public clients:', err);
    }
    
    return clients;
  }, [publicClient, chainId]);
  
  // Use multi-network balances hook
  const {
    getFormattedBalance,
    isLoading: isBalanceLoading,
    getError: getBalanceError,
    isTokenAvailable,
    refreshBalance
  } = useMultiNetworkBalances({
    address,
    isConnected,
    publicClients
  });
  
  // Auto-update selected chain based on wallet connection
  useEffect(() => {
    if (chainId) {
      const chainHex = `0x${chainId.toString(16)}`;
      if (SUPPORTED_CHAINS[chainHex]) {
        setSelectedChain(chainHex);
      }
    }
  }, [chainId]);

  // Auto-update selected chain when token changes to match token's preferred chain
  useEffect(() => {
    const tokenData = SUPPORTED_TOKENS[selectedToken];
    if (tokenData && tokenData.chains.length > 0) {
      // If current chain doesn't support the selected token, switch to the first supported chain
      if (!tokenData.chains.includes(selectedChain)) {
        setSelectedChain(tokenData.chains[0]);
      }
    }
  }, [selectedToken, selectedChain]);
  
  // Get current balance and states from the hook
  const currentBalance = getFormattedBalance(selectedChain, selectedToken);
  const balanceLoading = isBalanceLoading(selectedChain, selectedToken);
  const balanceError = getBalanceError(selectedChain, selectedToken);
  const tokenAvailable = isTokenAvailable(selectedChain, selectedToken);
  
  // Check if selected network matches wallet network
  const currentChainHex = chainId ? `0x${chainId.toString(16)}` : null;
  const isNetworkMismatch = currentChainHex !== selectedChain;
  
  // Check if the selected token caused the network mismatch (token-driven mismatch)
  const tokenData = SUPPORTED_TOKENS[selectedToken];
  const isTokenDrivenMismatch = isNetworkMismatch && tokenData && !tokenData.chains.includes(currentChainHex);
  
  // Get the preferred chain name for the selected token
  const getPreferredChainName = () => {
    if (!tokenData || !tokenData.chains.length) return '';
    const preferredChainHex = tokenData.chains[0];
    const preferredChain = SUPPORTED_CHAINS[preferredChainHex];
    return preferredChain ? preferredChain.name : '';
  };
  
  // Get the chain ID as integer for switching
  const getPreferredChainId = () => {
    if (!tokenData || !tokenData.chains.length) return null;
    return parseInt(tokenData.chains[0]);
  };
  
  // Early return if Web3 isn't ready yet
  if (!isWeb3Ready) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100/50">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Initializing Web3...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Helper function to get network name from chainId
  const getNetworkName = (chainId) => {
    const networks = {
      // Supported networks for donations
      1: 'Ethereum Mainnet',
      56: 'BNB Smart Chain',
      137: 'Polygon PoS',
      42161: 'Arbitrum One',
      10: 'Optimism',
      8453: 'Base',
      11155111: 'Sepolia Testnet'
    };
    
    return networks[chainId] || `Unsupported Network (${chainId})`;
  };

  // Check if current network is supported for donations
  const isSupportedNetwork = (chainId) => {
    const supportedChains = [1, 56, 137, 42161, 10, 8453, 11155111];
    return supportedChains.includes(chainId);
  };

  // Handle manual network switch
  const handleSwitchToSupportedNetwork = async () => {
    try {
      // Switch to Ethereum Mainnet as default
      await switchChain({ chainId: 1 });
    } catch (error) {
      console.error('Failed to switch network:', error);
      // Could show an error toast here if you have a notification system
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100/50 hover:shadow-2xl transition-all duration-300">
      {!isConnected ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent mb-4">Connect Your Wallet</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            Connect your crypto wallet to start making donations
          </p>
          <button
            onClick={() => open()}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">Wallet Connected</h2>
            </div>
            <button
              onClick={() => disconnect()}
              className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Address</span>
                <span className="font-mono text-slate-800 font-semibold">{formatAddress(address)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Network</span>
                <div className="flex items-center gap-2">
                  {!isSupportedNetwork(chainId) && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                  <span className={`font-semibold ${!isSupportedNetwork(chainId) ? 'text-red-600' : 'text-slate-800'}`}>
                    {getNetworkName(chainId)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Token and Chain Selectors */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">View Token Balance</h4>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Token</label>
                  <select 
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {Object.entries(SUPPORTED_TOKENS).map(([symbol, token]) => (
                      <option key={symbol} value={symbol}>
                        {symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Chain
                    {isNetworkMismatch && (
                      <span className="ml-1 text-orange-500 text-xs">(Not connected)</span>
                    )}
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedChain}
                      onChange={(e) => setSelectedChain(e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:border-blue-500 focus:outline-none ${
                        isNetworkMismatch ? 'border-orange-300' : 'border-gray-300'
                      }`}
                    >
                      {Object.entries(SUPPORTED_CHAINS)
                        .filter(([chainHex]) => {
                          const tokenData = SUPPORTED_TOKENS[selectedToken];
                          return tokenData && tokenData.chains.includes(chainHex);
                        })
                        .map(([chainHex, chain]) => (
                        <option key={chainHex} value={chainHex}>
                          {chain.name} {chainHex === currentChainHex ? '(Connected)' : ''}
                        </option>
                      ))}
                    </select>
                    {isNetworkMismatch && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Network mismatch warning */}
              {isNetworkMismatch && (
                <div className="mb-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-yellow-800 text-sm">
                        <div className="font-medium mb-1">Network Switch Required</div>
                        <div className="mb-3">
                          {isTokenDrivenMismatch 
                            ? `${selectedToken} is only available on ${getPreferredChainName()}. Please switch your wallet network to continue.` 
                            : `You're viewing balance from ${SUPPORTED_CHAINS[selectedChain]?.name}. Switch your wallet network to interact with this chain.`
                          }
                        </div>
                        <button
                          onClick={() => switchChain({ 
                            chainId: isTokenDrivenMismatch ? getPreferredChainId() : parseInt(selectedChain) 
                          })}
                          disabled={isSwitchingChain}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          {isSwitchingChain ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Switching...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                              Switch to {isTokenDrivenMismatch ? getPreferredChainName() : SUPPORTED_CHAINS[selectedChain]?.name}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Balance</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">
                    {balanceLoading ? (
                      <div className="animate-pulse bg-gray-200 h-5 w-20 rounded"></div>
                    ) : currentBalance ? (
                      `${currentBalance} ${selectedToken}`
                    ) : (
                      <span className="text-red-500 text-sm">
                        {!tokenAvailable 
                          ? 'Not available on chain' 
                          : balanceError 
                            ? 'Error fetching balance'
                            : 'Unable to fetch'}
                      </span>
                    )}
                  </span>
                  {currentBalance && (
                    <button
                      onClick={() => refreshBalance(selectedChain, selectedToken)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Refresh balance"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {!isSupportedNetwork(chainId) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3 text-red-800">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm">
                      <div className="font-medium mb-1">Unsupported Network</div>
                      <div className="mb-3">Please switch to a supported network for donations</div>
                      <button
                        onClick={handleSwitchToSupportedNetwork}
                        disabled={isSwitchingChain}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        {isSwitchingChain ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Switching...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Switch to Ethereum
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}