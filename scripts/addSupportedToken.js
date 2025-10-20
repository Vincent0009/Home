import pkg from 'hardhat';
const { ethers } = pkg;
import { getContractAddress } from "../src/lib/web3/contracts/contractAddresses.js";

async function main() {
  // Get network info
  const network = await ethers.provider.getNetwork();
  const chainId = `0x${network.chainId.toString(16)}`;
  
  console.log(`Adding supported token on network: ${network.name} (${chainId})`);

  // Get donation contract address
  const donationAddress = getContractAddress('donation', chainId);
  if (!donationAddress) {
    console.error(`No donation contract found for chain ID: ${chainId}`);
    process.exit(1);
  }

  console.log(`Donation contract address: ${donationAddress}`);

  // Get contract instance
  const Donation = await ethers.getContractFactory("Donation");
  const donation = Donation.attach(donationAddress);

  // Token addresses for different networks
  const tokenAddresses = {
    '0x2105': { // Base
      USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    },
    '0x1': { // Ethereum Mainnet
      USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
    '0x89': { // Polygon
      USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      USDT: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    },
    '0xa4b1': { // Arbitrum
      USDC: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      USDT: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    },
    '0xa': { // Optimism
      USDC: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      USDT: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    },
    '0xaa36a7': { // Sepolia (testnet)
      // Mock token addresses - replace with actual testnet tokens
      USDC: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238',
    }
  };

  // Get tokens for current network
  const networkTokens = tokenAddresses[chainId];
  if (!networkTokens) {
    console.log(`No predefined tokens for chain ID: ${chainId}`);
    console.log('You can manually add token addresses by modifying this script.');
    process.exit(0);
  }

  console.log(`Adding tokens for ${network.name}:`);

  // Add each token
  for (const [symbol, address] of Object.entries(networkTokens)) {
    try {
      console.log(`\nAdding ${symbol} (${address})...`);
      
      // Check if token is already supported
      const isSupported = await donation.supportedTokens(address);
      if (isSupported) {
        console.log(`${symbol} is already supported`);
        continue;
      }

      // Add the token
      const tx = await donation.addSupportedToken(address);
      console.log(`Transaction hash: ${tx.hash}`);
      
      // Wait for confirmation
      await tx.wait();
      console.log(`${symbol} added successfully!`);
      
    } catch (error) {
      console.error(`Error adding ${symbol}:`, error.message);
    }
  }

  console.log('\nAll done!');
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });