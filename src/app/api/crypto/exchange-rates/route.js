import { NextResponse } from 'next/server';

// In-memory cache for exchange rates
let cachedRates = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

/**
 * API route to fetch cryptocurrency exchange rates
 * @param {Request} request - The request object
 * @returns {NextResponse} The response with exchange rates
 */
export async function GET(request) {
  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
      return NextResponse.json({ rates: cachedRates }, {
        headers: {
          'Cache-Control': `public, max-age=${Math.floor((CACHE_DURATION - (now - lastFetchTime)) / 1000)}`,
        }
      });
    }

    // Get the URL parameters
    const { searchParams } = new URL(request.url);
    const currencies = searchParams.get('currencies') || 'bitcoin,ethereum,matic-network,binancecoin,tether';
    const vsCurrency = searchParams.get('vs_currency') || 'usd';

    // Fetch data from CoinGecko API
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${currencies}&vs_currencies=${vsCurrency}`,
      {
        headers: {
          'Accept': 'application/json',
          // Add API key if you have one
          // 'x-cg-pro-api-key': process.env.COINGECKO_API_KEY,
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data into a more usable format
    const rates = {
      ETH: data.ethereum?.[vsCurrency] || null,
      BTC: data.bitcoin?.[vsCurrency] || null,
      MATIC: data['matic-network']?.[vsCurrency] || null,
      BNB: data.binancecoin?.[vsCurrency] || null,
      USDT: data.tether?.[vsCurrency] || 1, // USDT should be close to 1 USD
      timestamp: now
    };

    // Update cache
    cachedRates = rates;
    lastFetchTime = now;

    return NextResponse.json({ rates }, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION / 1000}`,
      }
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}