/**
 * Test script for Etherscan v2 API functionality
 * Run with: node src/scripts/web3/test-etherscan-v2.js
 */

// Use proper ES module imports
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { callEtherscanV2API, getAccountBalance, isChainSupported } from '../../lib/web3/etherscan-v2.js';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function testEtherscanV2() {
  console.log('🔍 Testing Etherscan v2 API functionality...\n');
  
  // Test supported chains
  console.log('📋 Supported chains:', [1, 11155111, 56, 137, 42161, 10, 8453]);
  console.log('✅ Chain 1 supported:', isChainSupported(1));
  console.log('❌ Chain 999 supported:', isChainSupported(999));
  console.log('');
  
  // Log API keys to check if they're loaded (don't include in production code)
  console.log('API Keys loaded:', {
    'Ethereum (1)': process.env.ETHERSCAN_API_KEY ? '✅ Present' : '❌ Missing',
    'Sepolia (11155111)': process.env.ETHERSCAN_API_KEY ? '✅ Present' : '❌ Missing',
    'BSC (56)': process.env.BSCSCAN_API_KEY ? '✅ Present' : '❌ Missing',
    'Polygon (137)': process.env.POLYGONSCAN_API_KEY ? '✅ Present' : '❌ Missing',
    'Arbitrum (42161)': process.env.ARBISCAN_API_KEY ? '✅ Present' : '❌ Missing',
    'Optimism (10)': process.env.OPTIMISM_API_KEY ? '✅ Present' : '❌ Missing',
    'Base (8453)': process.env.BASESCAN_API_KEY ? '✅ Present' : '❌ Missing'
  });
  console.log('');
  
  // Test different chains with Vitalik's address (famous test address)
  const testAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Vitalik's address
  const testChains = [1, 11155111]; // Ethereum mainnet and Sepolia
  
  for (const chainId of testChains) {
    try {
      console.log(`🌐 Testing Chain ID: ${chainId}`);
      
      // Test balance API
      const balance = await getAccountBalance(testAddress, chainId);
      console.log(`💰 Balance: ${balance} wei`);
      
      // Test generic API call
      const response = await callEtherscanV2API(chainId, 'account', 'balance', {
        address: testAddress,
        tag: 'latest'
      });
      
      console.log(`✅ API Response Status: ${response.status}`);
      console.log(`📊 Result: ${response.result} wei`);
      console.log('');
      
    } catch (error) {
      console.log(`❌ Error testing chain ${chainId}:`, error.message);
      console.error('Full error:', error);
      if (error.message.includes('API key')) {
        console.log('💡 Tip: Make sure to set your API keys in .env file');
      }
      console.log('');
    }
  }
  
  console.log('🏁 Test completed!');
}

// Run the test
testEtherscanV2().catch(error => {
  console.error('Test failed with error:', error);
});