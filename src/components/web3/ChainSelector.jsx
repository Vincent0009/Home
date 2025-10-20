'use client';

import { useSwitchChain } from 'wagmi';
import { SUPPORTED_TOKENS } from './TokenSelector';

// Optimized chain icons using actual SVG logos from public/web3/
const ChainIcon = ({ chainId, className = "w-6 h-6" }) => {
  const icons = {
    '0x1': ( // Ethereum
      <svg className={className} viewBox="0 0 784.37 1277.39">
        <polygon points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" fill="#343434"/>
        <polygon points="392.07,0 0,650.54 392.07,882.29 392.07,472.33" fill="#8C8C8C"/>
        <polygon points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" fill="#3C3C3B"/>
        <polygon points="392.07,1277.38 392.07,956.52 0,724.89" fill="#8C8C8C"/>
        <polygon points="392.07,882.29 784.13,650.54 392.07,472.33" fill="#141414"/>
        <polygon points="0,650.54 392.07,882.29 392.07,472.33" fill="#393939"/>
      </svg>
    ),
    
    '0x38': ( // BNB Smart Chain
      <svg className={className} viewBox="0 0 2496 2496">
        <path d="M1248,0c689.3,0,1248,558.7,1248,1248s-558.7,1248-1248,1248S0,1937.3,0,1248S558.7,0,1248,0L1248,0z" fill="#F0B90B"/>
        <path d="M685.9,1248l0.9,330l280.4,165v193.2l-444.5-260.7v-524L685.9,1248L685.9,1248z M685.9,918v192.3l-163.3-96.6V821.4l163.3-96.6l164.1,96.6L685.9,918L685.9,918z M1084.3,821.4l163.3-96.6l164.1,96.6L1247.6,918L1084.3,821.4L1084.3,821.4z" fill="#FFFFFF"/>
        <path d="M803.9,1509.6v-193.2l163.3,96.6v192.3L803.9,1509.6L803.9,1509.6z M1084.3,1812.2l163.3,96.6l164.1-96.6v192.3l-164.1,96.6l-163.3-96.6V1812.2L1084.3,1812.2z M1645.9,821.4l163.3-96.6l164.1,96.6v192.3l-164.1,96.6V918L1645.9,821.4L1645.9,821.4L1645.9,821.4z M1809.2,1578l0.9-330l163.3-96.6v524l-444.5,260.7v-193.2L1809.2,1578L1809.2,1578L1809.2,1578z" fill="#FFFFFF"/>
        <polygon points="1692.1,1509.6 1528.8,1605.3 1528.8,1413 1692.1,1316.4 1692.1,1509.6" fill="#FFFFFF"/>
        <path d="M1692.1,986.4l0.9,193.2l-281.2,165v330.8l-163.3,95.7l-163.3-95.7v-330.8l-281.2-165V986.4L968,889.8l279.5,165.8l281.2-165.8l164.1,96.6H1692.1L1692.1,986.4z M803.9,656.5l443.7-261.6l444.5,261.6l-163.3,96.6l-281.2-165.8L967.2,753.1L803.9,656.5L803.9,656.5z" fill="#FFFFFF"/>
      </svg>
    ),
    
    '0x89': ( // Polygon
      <svg className={className} viewBox="0 0 178 161">
        <path d="M66.8,54.7l-16.7-9.7L0,74.1v58l50.1,29l50.1-29V41.9L128,25.8l27.8,16.1v32.2L128,90.2l-16.7-9.7v25.8l16.7,9.7l50.1-29V29L128,0L77.9,29v90.2l-27.8,16.1l-27.8-16.1V86.9l27.8-16.1l16.7,9.7V54.7z" fill="#6C00F6"/>
      </svg>
    ),
    
    '0xa4b1': ( // Arbitrum
      <svg className={className} viewBox="0 0 2500 2500">
        <path d="M226,760v980c0,63,33,120,88,152l849,490c54,31,121,31,175,0l849-490c54-31,88-89,88-152V760c0-63-33-120-88-152l-849-490c-54-31-121-31-175,0L314,608c-54,31-87,89-87,152H226z" fill="#213147"/>
        <path d="M1435,1440l-121,332c-3,9-3,19,0,29l208,571l241-139l-289-793C1467,1422,1442,1422,1435,1440z" fill="#12AAFF"/>
        <path d="M1678,882c-7-18-32-18-39,0l-121,332c-3,9-3,19,0,29l341,935l241-139L1678,883V882z" fill="#12AAFF"/>
        <path d="M1250,155c6,0,12,2,17,5l918,530c11,6,17,18,17,30v1060c0,12-7,24-17,30l-918,530c-5,3-11,5-17,5s-12-2-17-5l-918-530c-11-6-17-18-17-30V719c0-12,7-24,17-30l918-530c5-3,11-5,17-5l0,0V155z M1250,0c-33,0-65,8-95,25L237,555c-59,34-95,96-95,164v1060c0,68,36,130,95,164l918,530c29,17,62,25,95,25s65-8,95-25l918-530c59-34,95-96,95-164V719c0-68-36-130-95-164L1344,25c-29-17-62-25-95-25l0,0H1250z" fill="#9DCCED"/>
        <polygon points="642,2179 727,1947 897,2088 738,2234" fill="#213147"/>
        <path d="M1172,644H939c-17,0-33,11-39,27L401,2039l241,139l550-1507c5-14-5-28-19-28L1172,644z" fill="#FFFFFF"/>
        <path d="M1580,644h-233c-17,0-33,11-39,27L738,2233l241,139l620-1701c5-14-5-28-19-28V644z" fill="#FFFFFF"/>
      </svg>
    ),
    
    '0xa': ( // Optimism
      <svg className={className} viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="250" fill="#FF0420"/>
        <path d="M177.1,316.4c-14.9,0-27.1-3.5-36.6-10.5c-9.4-7.1-14.1-17.3-14.1-30.4c0-2.8,0.3-6.1,0.9-10.1c1.6-9,3.9-19.8,6.9-32.5c8.5-34.4,30.5-51.6,65.9-51.6c9.6,0,18.3,1.6,25.9,4.9c7.6,3.1,13.6,7.9,18,14.3c4.4,6.3,6.6,13.8,6.6,22.5c0,2.6-0.3,5.9-0.9,9.9c-1.9,11.1-4.1,22-6.8,32.5c-4.4,17.1-11.9,30-22.7,38.5C209.5,312.3,195.1,316.4,177.1,316.4z M179.8,289.4c7,0,12.9-2.1,17.8-6.2c5-4.1,8.6-10.4,10.7-19c2.9-11.8,5.1-22,6.6-30.8c0.5-2.6,0.8-5.3,0.8-8.1c0-11.4-5.9-17.1-17.8-17.1c-7,0-13,2.1-18,6.2c-4.9,4.1-8.4,10.4-10.5,19c-2.3,8.4-4.5,18.6-6.8,30.8c-0.5,2.5-0.8,5.1-0.8,7.9C161.7,283.7,167.8,289.4,179.8,289.4z" fill="#FFFFFF"/>
        <path d="M259.3,314.6c-1.4,0-2.4-0.4-3.2-1.3c-0.6-1-0.8-2.1-0.6-3.4l25.9-122c0.2-1.4,0.9-2.5,2.1-3.4c1.1-0.9,2.3-1.3,3.6-1.3H337c13.9,0,25,2.9,33.4,8.6c8.5,5.8,12.8,14.1,12.8,25c0,3.1-0.4,6.4-1.1,9.8c-3.1,14.4-9.4,25-19,31.9c-9.4,6.9-22.3,10.3-38.7,10.3h-25.3l-8.6,41.1c-0.3,1.4-0.9,2.5-2.1,3.4c-1.1,0.9-2.3,1.3-3.6,1.3H259.3z M325.7,242.9c5.3,0,9.8-1.4,13.7-4.3c4-2.9,6.6-7,7.9-12.4c0.4-2.1,0.6-4,0.6-5.6c0-3.6-1.1-6.4-3.2-8.3c-2.1-2-5.8-3-10.9-3h-22.5l-7.1,33.6H325.7z" fill="#FFFFFF"/>
      </svg>
    ),
    
    '0x2105': ( // Base (using Coinbase logo)
      <svg className={className} viewBox="0 0 800 600">
        <path d="M399.8,69.1L399.8,69.1c127.3,0,230.5,103.2,230.5,230.5l0,0c0,127.3-103.2,230.5-230.5,230.5l0,0c-127.3,0-230.5-103.2-230.5-230.5l0,0C169.3,172.3,272.5,69.1,399.8,69.1z" fill="#0052FF"/>
        <path d="M399.9,380.6c-44.8,0-81-36.3-81-81s36.3-81,81-81c40.1,0,73.4,29.2,79.8,67.5h81.6c-6.9-83.2-76.5-148.6-161.5-148.6c-89.5,0-162.1,72.6-162.1,162.1s72.6,162.1,162.1,162.1c85,0,154.6-65.4,161.5-148.6h-81.7C473.2,351.4,440,380.6,399.9,380.6z" fill="#FFFFFF"/>
      </svg>
    ),
    
    '0xaa36a7': ( // Sepolia (Ethereum Testnet)
      <svg className={className} viewBox="0 0 319.6 533.3">
        <path d="M159.6,402.5L319.6,302L159.6,533.3V402.5z M183.4,415.6v41.8l51.3-74L183.4,415.6z" fill="#5A9DED"/>
        <path d="M175.9,193.8l118.2,66.9l-11.7,20.6l-118.2-66.9L175.9,193.8z" fill="#D895D3"/>
        <path d="M159.6,0l159.6,274.6L159.6,375.3V0z M183.1,87.9v244.7l104.2-65.7L183.1,87.9z" fill="#FF9C92"/>
        <path d="M160.1,402.5L0,302l160.1,231.3V402.5z M136.3,415.6v41.8l-51.3-74L136.3,415.6z" fill="#53D3E0"/>
        <path d="M138.7,196L20.5,262.9l11.7,20.6l118.2-66.9L138.7,196z" fill="#A6E275"/>
        <path d="M159.6,0L0,274.6l159.6,100.6V0z M136,87.9v244.7L31.8,266.9L136,87.9z" fill="#FFE94D"/>
      </svg>
    )
  };
  
  return icons[chainId] || (
    <div className={`${className} bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600`}>
      {chainId.slice(-2)}
    </div>
  );
};

// Chain configurations matching your updated networks
const SUPPORTED_CHAINS = {
  '0x1': {
    name: 'Ethereum',
    symbol: 'ETH',
    color: 'text-blue-600',
    explorer: 'https://etherscan.io'
  },
  '0x38': {
    name: 'BNB Chain',
    symbol: 'BNB',
    color: 'text-yellow-600',
    explorer: 'https://bscscan.com'
  },
  '0x89': {
    name: 'Polygon',
    symbol: 'MATIC',
    color: 'text-purple-600',
    explorer: 'https://polygonscan.com'
  },
  '0xa4b1': {
    name: 'Arbitrum',
    symbol: 'ETH',
    color: 'text-blue-500',
    explorer: 'https://arbiscan.io'
  },
  '0xa': {
    name: 'Optimism',
    symbol: 'ETH',
    color: 'text-red-500',
    explorer: 'https://optimistic.etherscan.io'
  },
  '0x2105': {
    name: 'Base',
    symbol: 'ETH',
    color: 'text-blue-600',
    explorer: 'https://basescan.org'
  },
  '0xaa36a7': {
    name: 'Sepolia',
    symbol: 'ETH',
    color: 'text-orange-500',
    explorer: 'https://sepolia.etherscan.io',
    testnet: true
  }
};

export default function ChainSelector({ selectedToken, selectedChain, onChainSelect, currentWalletChain }) {
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  
  // Handle chain switch with better error handling
  const handleChainSwitch = async (chainId) => {
    try {
      await switchChain({ chainId: parseInt(chainId) });
    } catch (err) {
      console.error('Failed to switch network:', err);
      // Could add toast notification here if you have one
    }
  };

  // Get chains that support the selected token
  const getAvailableChains = () => {
    if (!selectedToken || !SUPPORTED_TOKENS[selectedToken]) {
      return Object.entries(SUPPORTED_CHAINS);
    }
    
    const tokenData = SUPPORTED_TOKENS[selectedToken];
    return Object.entries(SUPPORTED_CHAINS).filter(([chainId]) => 
      tokenData.chains.includes(chainId)
    );
  };

  const availableChains = getAvailableChains();
  
  // Separate mainnets and testnets
  const mainnets = availableChains.filter(([_, chain]) => !chain.testnet);
  const testnets = availableChains.filter(([_, chain]) => chain.testnet);

  const ChainButton = ({ chainId, chain }) => {
    const isSelected = selectedChain === chainId;
    const isWalletConnected = currentWalletChain === parseInt(chainId);
    
    return (
      <button
        onClick={() => onChainSelect(chainId)}
        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-lg'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }`}
      >
        {/* Wallet connection indicator */}
        {isWalletConnected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
        
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-8 h-8 ${chain.color}`}>
            <ChainIcon chainId={chainId} className="w-8 h-8" />
          </div>
          <div>
            <div className="font-bold text-slate-800">{chain.name}</div>
            <div className="text-xs text-slate-500">{chain.symbol}</div>
          </div>
        </div>
        
        {chain.testnet && (
          <div className="absolute top-2 right-2">
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
              Testnet
            </span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
          Select Network
        </h3>
      </div>

      {!selectedToken ? (
        <div className="text-center py-8 text-slate-500">
          <div className="mb-2 text-4xl">🎯</div>
          <p className="font-medium">Select a token first</p>
          <p className="text-sm">Choose your donation token to see available networks</p>
        </div>
      ) : (
        <>
          {/* Mainnets */}
          {mainnets.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Mainnet Networks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mainnets.map(([chainId, chain]) => (
                  <ChainButton key={chainId} chainId={chainId} chain={chain} />
                ))}
              </div>
            </div>
          )}

          {/* Testnets */}
          {testnets.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Test Networks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {testnets.map(([chainId, chain]) => (
                  <ChainButton key={chainId} chainId={chainId} chain={chain} />
                ))}
              </div>
            </div>
          )}

          {/* Selected chain info */}
          {selectedChain && SUPPORTED_CHAINS[selectedChain] && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Selected Network</span>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 ${SUPPORTED_CHAINS[selectedChain].color}`}>
                    <ChainIcon chainId={selectedChain} className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-800">
                    {SUPPORTED_CHAINS[selectedChain].name}
                  </span>
                  {currentWalletChain === parseInt(selectedChain) ? (
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                      Connected
                    </span>
                  ) : (
                    <button
                      onClick={() => handleChainSwitch(selectedChain)}
                      disabled={isSwitchingChain}
                      className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {isSwitchingChain ? (
                        <>
                          <div className="w-3 h-3 border border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                          Switching...
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Switch
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Network switch warning with action button */}
          {selectedChain && currentWalletChain && currentWalletChain !== parseInt(selectedChain) && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <div className="text-yellow-800 text-sm">
                    <div className="font-medium mb-1">Network Switch Required</div>
                    <div className="mb-3">
                      Your wallet is connected to {SUPPORTED_CHAINS[`0x${currentWalletChain.toString(16)}`]?.name || 'Unknown Network'}. 
                      Switch to {SUPPORTED_CHAINS[selectedChain]?.name} to proceed with donations.
                    </div>
                    <button
                      onClick={() => handleChainSwitch(selectedChain)}
                      disabled={isSwitchingChain}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      {isSwitchingChain ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Switching to {SUPPORTED_CHAINS[selectedChain]?.name}...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Switch to {SUPPORTED_CHAINS[selectedChain]?.name}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Export chain data for other components
export { SUPPORTED_CHAINS };