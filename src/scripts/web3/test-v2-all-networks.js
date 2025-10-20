/**
 * Test script to verify Etherscan v2 API works across all supported networks
 * Run with: node src/scripts/web3/test-v2-all-networks.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { callEtherscanV2API, getSupportedChains, getChainName } from '../../lib/web3/etherscan-v2.js';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function testAllNetworks() {
  console.log('🌐 Testing Etherscan v2 API across all supported networks...\n');
  
  const supportedChains = getSupportedChains();
  const testAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Vitalik's address
  
  console.log(`📋 Testing ${supportedChains.length} networks: ${supportedChains.join(', ')}\n`);
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const chainId of supportedChains) {
    const chainName = getChainName(chainId);
    
    try {
      console.log(`🔍 Testing ${chainName} (Chain ID: ${chainId})...`);
      
      // Test the v2 API endpoint
      const response = await callEtherscanV2API(chainId, 'account', 'balance', {
        address: testAddress,
        tag: 'latest'
      });
      
      if (response.status === '1' && response.result) {
        console.log(`✅ ${chainName}: Success - Balance: ${response.result} wei`);
        results.success.push({ chainId, chainName });
      } else {
        console.log(`❌ ${chainName}: API returned status ${response.status} - ${response.message}`);
        results.failed.push({ chainId, chainName, error: response.message });
      }
      
    } catch (error) {
      console.log(`❌ ${chainName}: Error - ${error.message}`);
      results.failed.push({ chainId, chainName, error: error.message });
    }
    
    console.log(''); // Add spacing between tests
  }
  
  // Summary
  console.log('=' .repeat(60));
  console.log('📊 SUMMARY');
  console.log('=' .repeat(60));
  console.log(`✅ Successful: ${results.success.length}/${supportedChains.length} networks`);
  console.log(`❌ Failed: ${results.failed.length}/${supportedChains.length} networks\n`);
  
  if (results.success.length > 0) {
    console.log('✅ Working Networks:');
    results.success.forEach(({ chainId, chainName }) => {
      console.log(`   • ${chainName} (${chainId})`);
    });
    console.log('');
  }
  
  if (results.failed.length > 0) {
    console.log('❌ Failed Networks:');
    results.failed.forEach(({ chainId, chainName, error }) => {
      console.log(`   • ${chainName} (${chainId}): ${error}`);
    });
    console.log('');
  }
  
  if (results.success.length === supportedChains.length) {
    console.log('🎉 All networks are working perfectly with Etherscan v2 API!');
  } else if (results.success.length > 0) {
    console.log('⚠️  Some networks are working. Check failed networks above.');
  } else {
    console.log('🚨 No networks are working. Check your API key configuration.');
  }
}

// Run the test
testAllNetworks().catch(error => {
  console.error('Test failed with error:', error);
});