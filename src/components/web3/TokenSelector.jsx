'use client';

// No need for React import in Next.js
import useCachedTokenPrices from '@/hooks/useCachedTokenPrices';

// Optimized token icons using actual SVG logos from public/web3/
const TokenIcon = ({ symbol, className = "w-6 h-6" }) => {
  const icons = {
    ETH: (
      <svg className={className} viewBox="0 0 784.37 1277.39">
        <polygon points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" fill="#343434"/>
        <polygon points="392.07,0 0,650.54 392.07,882.29 392.07,472.33" fill="#8C8C8C"/>
        <polygon points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" fill="#3C3C3B"/>
        <polygon points="392.07,1277.38 392.07,956.52 0,724.89" fill="#8C8C8C"/>
        <polygon points="392.07,882.29 784.13,650.54 392.07,472.33" fill="#141414"/>
        <polygon points="0,650.54 392.07,882.29 392.07,472.33" fill="#393939"/>
      </svg>
    ),
    
    BNB: (
      <svg className={className} viewBox="0 0 2496 2496">
        <path d="M1248,0c689.3,0,1248,558.7,1248,1248s-558.7,1248-1248,1248S0,1937.3,0,1248S558.7,0,1248,0L1248,0z" fill="#F0B90B"/>
        <path d="M685.9,1248l0.9,330l280.4,165v193.2l-444.5-260.7v-524L685.9,1248L685.9,1248z M685.9,918v192.3l-163.3-96.6V821.4l163.3-96.6l164.1,96.6L685.9,918L685.9,918z M1084.3,821.4l163.3-96.6l164.1,96.6L1247.6,918L1084.3,821.4L1084.3,821.4z" fill="#FFFFFF"/>
        <path d="M803.9,1509.6v-193.2l163.3,96.6v192.3L803.9,1509.6L803.9,1509.6z M1084.3,1812.2l163.3,96.6l164.1-96.6v192.3l-164.1,96.6l-163.3-96.6V1812.2L1084.3,1812.2z M1645.9,821.4l163.3-96.6l164.1,96.6v192.3l-164.1,96.6V918L1645.9,821.4L1645.9,821.4L1645.9,821.4z M1809.2,1578l0.9-330l163.3-96.6v524l-444.5,260.7v-193.2L1809.2,1578L1809.2,1578L1809.2,1578z" fill="#FFFFFF"/>
        <polygon points="1692.1,1509.6 1528.8,1605.3 1528.8,1413 1692.1,1316.4 1692.1,1509.6" fill="#FFFFFF"/>
        <path d="M1692.1,986.4l0.9,193.2l-281.2,165v330.8l-163.3,95.7l-163.3-95.7v-330.8l-281.2-165V986.4L968,889.8l279.5,165.8l281.2-165.8l164.1,96.6H1692.1L1692.1,986.4z M803.9,656.5l443.7-261.6l444.5,261.6l-163.3,96.6l-281.2-165.8L967.2,753.1L803.9,656.5L803.9,656.5z" fill="#FFFFFF"/>
      </svg>
    ),
    
    MATIC: (
      <svg className={className} viewBox="0 0 178 161">
        <path d="M66.8,54.7l-16.7-9.7L0,74.1v58l50.1,29l50.1-29V41.9L128,25.8l27.8,16.1v32.2L128,90.2l-16.7-9.7v25.8l16.7,9.7l50.1-29V29L128,0L77.9,29v90.2l-27.8,16.1l-27.8-16.1V86.9l27.8-16.1l16.7,9.7V54.7z" fill="#6C00F6"/>
      </svg>
    ),
    
    USDT: (
      <svg className={className} viewBox="0 0 339.43 295.27">
        <path d="M62.15,1.45l-61.89,130a2.52,2.52,0,0,0,.54,2.94L167.95,294.56a2.55,2.55,0,0,0,3.53,0L338.63,134.4a2.52,2.52,0,0,0,.54-2.94l-61.89-130A2.5,2.5,0,0,0,275,0H64.45a2.5,2.5,0,0,0-2.3,1.45h0Z" fill="#50AF95"/>
        <path d="M191.19,144.8v0c-1.2.09-7.4,0.46-21.23,0.46-11,0-18.81-.33-21.55-0.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25,74.24-18.15v28.91c2.78,0.2,10.74.67,21.74,0.67,13.2,0,19.81-.55,21-0.66v-28.9c42.42,1.89,74.08,9.29,74.08,18.13s-31.65,16.24-74.08,18.12h0Zm0-39.25V79.68h59.2V40.23H89.21V79.68H148.4v25.86c-48.11,2.21-84.29,11.74-84.29,23.16s36.18,20.94,84.29,23.16v82.9h42.78V151.83c48-2.21,84.12-11.73,84.12-23.14s-36.09-20.93-84.12-23.15h0Zm0,0h0Z" fill="#FFFFFF"/>
      </svg>
    ),
    
    USDC: (
      <svg className={className} viewBox="0 0 2000 2000">
        <path d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z" fill="#2775CA"/>
        <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#FFFFFF"/>
        <path d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z" fill="#FFFFFF"/>
      </svg>
    ),
    
    ARB: (
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
    
    OP: (
      <svg className={className} viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="250" fill="#FF0420"/>
        <path d="M177.1,316.4c-14.9,0-27.1-3.5-36.6-10.5c-9.4-7.1-14.1-17.3-14.1-30.4c0-2.8,0.3-6.1,0.9-10.1c1.6-9,3.9-19.8,6.9-32.5c8.5-34.4,30.5-51.6,65.9-51.6c9.6,0,18.3,1.6,25.9,4.9c7.6,3.1,13.6,7.9,18,14.3c4.4,6.3,6.6,13.8,6.6,22.5c0,2.6-0.3,5.9-0.9,9.9c-1.9,11.1-4.1,22-6.8,32.5c-4.4,17.1-11.9,30-22.7,38.5C209.5,312.3,195.1,316.4,177.1,316.4z M179.8,289.4c7,0,12.9-2.1,17.8-6.2c5-4.1,8.6-10.4,10.7-19c2.9-11.8,5.1-22,6.6-30.8c0.5-2.6,0.8-5.3,0.8-8.1c0-11.4-5.9-17.1-17.8-17.1c-7,0-13,2.1-18,6.2c-4.9,4.1-8.4,10.4-10.5,19c-2.3,8.4-4.5,18.6-6.8,30.8c-0.5,2.5-0.8,5.1-0.8,7.9C161.7,283.7,167.8,289.4,179.8,289.4z" fill="#FFFFFF"/>
        <path d="M259.3,314.6c-1.4,0-2.4-0.4-3.2-1.3c-0.6-1-0.8-2.1-0.6-3.4l25.9-122c0.2-1.4,0.9-2.5,2.1-3.4c1.1-0.9,2.3-1.3,3.6-1.3H337c13.9,0,25,2.9,33.4,8.6c8.5,5.8,12.8,14.1,12.8,25c0,3.1-0.4,6.4-1.1,9.8c-3.1,14.4-9.4,25-19,31.9c-9.4,6.9-22.3,10.3-38.7,10.3h-25.3l-8.6,41.1c-0.3,1.4-0.9,2.5-2.1,3.4c-1.1,0.9-2.3,1.3-3.6,1.3H259.3z M325.7,242.9c5.3,0,9.8-1.4,13.7-4.3c4-2.9,6.6-7,7.9-12.4c0.4-2.1,0.6-4,0.6-5.6c0-3.6-1.1-6.4-3.2-8.3c-2.1-2-5.8-3-10.9-3h-22.5l-7.1,33.6H325.7z" fill="#FFFFFF"/>
      </svg>
    ),
    
  };
  
  return icons[symbol] || (
    <div className={`${className} bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600`}>
      {symbol}
    </div>
  );
};

// Define supported tokens with their network availability
const SUPPORTED_TOKENS = {
  // Native tokens
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'native',
    chains: ['0x1', '0x38', '0x89', '0xaa36a7', '0xa4b1', '0xa', '0x2105'], // Ethereum, BNB Chain, Polygon, Sepolia, Arbitrum, Optimism, Base
    coingeckoId: 'ethereum'
  },
  BNB: {
    name: 'BNB',
    symbol: 'BNB',
    type: 'native',
    chains: ['0x38'], // BNB Chain only
    coingeckoId: 'binancecoin'
  },
  MATIC: {
    name: 'Polygon',
    symbol: 'MATIC',
    type: 'native',
    chains: ['0x89'], // Polygon only
    coingeckoId: 'polygon-ecosystem-token'
  },
  
  // Stablecoins
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    type: 'stablecoin',
    chains: ['0x1', '0x38', '0x89', '0xa4b1', '0xa', '0x2105'], // Most chains
    coingeckoId: 'tether',
    addresses: {
      '0x1': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      '0x38': '0x55d398326f99059fF775485246999027B3197955',
      '0x89': '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      '0xa4b1': '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      '0xa': '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      '0x2105': '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2'
    }
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    type: 'stablecoin',
    chains: ['0x1', '0x38', '0x89', '0xa4b1', '0xa', '0x2105'], // Most chains
    coingeckoId: 'usd-coin',
    addresses: {
      '0x1': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      '0x38': '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      '0x89': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      '0xa4b1': '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      '0xa': '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      '0x2105': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    }
  },

  // Layer 2 Governance Tokens
  ARB: {
    name: 'Arbitrum',
    symbol: 'ARB',
    type: 'governance',
    chains: ['0xa4b1'], // Arbitrum One only
    coingeckoId: 'arbitrum',
    addresses: {
      '0xa4b1': '0x912CE59144191C1204E64559FE8253a0e49E6548'
    }
  },
  OP: {
    name: 'Optimism',
    symbol: 'OP',
    type: 'governance',
    chains: ['0xa'], // Optimism only
    coingeckoId: 'optimism',
    addresses: {
      '0xa': '0x4200000000000000000000000000000000000042'
    }
  },

};

export default function TokenSelector({ selectedToken, onTokenSelect }) {
  // Use cached price hook
  const { loading: priceLoading, getPrice } = useCachedTokenPrices(SUPPORTED_TOKENS);
  const tokenPrice = getPrice(selectedToken);

  // Show ALL tokens regardless of current chain
  const availableTokens = Object.entries(SUPPORTED_TOKENS);

  // Group tokens by type
  const tokensByType = availableTokens.reduce((acc, [symbol, token]) => {
    if (!acc[token.type]) acc[token.type] = [];
    acc[token.type].push([symbol, token]);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
          Select Token
        </h3>
      </div>

      {/* Native Tokens */}
      {tokensByType.native && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Native Tokens
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tokensByType.native.map(([symbol, token]) => (
              <button
                key={symbol}
                onClick={() => onTokenSelect(symbol)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 ${
                  selectedToken === symbol
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <TokenIcon symbol={symbol} className="w-8 h-8" />
                  <span className="font-bold text-slate-800">{symbol}</span>
                </div>
                <div className="text-xs text-slate-500">{token.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stablecoins */}
      {tokensByType.stablecoin && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Stablecoins
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tokensByType.stablecoin.map(([symbol, token]) => (
              <button
                key={symbol}
                onClick={() => onTokenSelect(symbol)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 ${
                  selectedToken === symbol
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <TokenIcon symbol={symbol} className="w-8 h-8" />
                  <span className="font-bold text-slate-800">{symbol}</span>
                </div>
                <div className="text-xs text-slate-500">{token.name}</div>
                <div className="text-xs text-green-600 font-medium">≈ $1.00</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Governance Tokens */}
      {tokensByType.governance && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Governance Tokens
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tokensByType.governance.map(([symbol, token]) => (
              <button
                key={symbol}
                onClick={() => onTokenSelect(symbol)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 ${
                  selectedToken === symbol
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <TokenIcon symbol={symbol} className="w-8 h-8" />
                  <span className="font-bold text-slate-800">{symbol}</span>
                </div>
                <div className="text-xs text-slate-500">{token.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected token info */}
      {selectedToken && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Current Price</span>
            <div className="flex items-center gap-3">
              <TokenIcon symbol={selectedToken} className="w-6 h-6" />
              <span className="font-bold text-slate-800">{selectedToken}</span>
            </div>
          </div>
          <div className="text-right">
            {priceLoading ? (
              <div className="animate-pulse bg-gray-200 h-6 w-20 rounded ml-auto"></div>
            ) : tokenPrice ? (
              <span className="text-lg font-bold text-blue-600">${tokenPrice.toFixed(tokenPrice < 1 ? 6 : 2)}</span>
            ) : (
              <span className="text-gray-400">Price unavailable</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <span className="text-xs text-slate-500">
          Select any token - compatible networks will be shown next
        </span>
      </div>
    </div>
  );
}

// Export the SUPPORTED_TOKENS for use in other components
export { SUPPORTED_TOKENS };