// SPDX-License-Identifier: MIT
// Deployment script for Donation contract across multiple networks

import hre from "hardhat";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Contract addresses registry file path
const CONTRACT_ADDRESSES_PATH = path.join(__dirname, '../src/lib/web3/contracts/contractAddresses.js');

async function main() {
  const networkName = hre.network.name;
  const chainId = hre.network.config.chainId;
  
  console.log(`\n🚀 Deploying Donation contract to ${networkName} (Chain ID: ${chainId})...`);
  console.log(`📡 Using account: ${(await hre.ethers.getSigners())[0].address}\n`);

  // Get the contract factory
  const DonationFactory = await hre.ethers.getContractFactory("Donation");
  
  // Check deployment cost
  const deploymentData = DonationFactory.interface.encodeDeploy([]);
  const estimatedGas = await hre.ethers.provider.estimateGas({ data: deploymentData });
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  const estimatedCost = estimatedGas * gasPrice;
  
  console.log(`⛽ Estimated deployment cost: ${hre.ethers.formatEther(estimatedCost)} ETH`);
  console.log(`📊 Gas estimate: ${estimatedGas.toString()} gas at ${hre.ethers.formatUnits(gasPrice, 'gwei')} gwei\n`);
  
  // Deploy the contract
  console.log("🔄 Deploying contract...");
  const donation = await DonationFactory.deploy();
  
  // Wait for deployment to complete
  await donation.waitForDeployment();
  const contractAddress = await donation.getAddress();
  
  console.log(`✅ Donation contract deployed successfully!`);
  console.log(`📍 Contract address: ${contractAddress}`);
  console.log(`🔗 Network: ${networkName} (${chainId})`);
  
  // Wait for a few block confirmations on non-local networks
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await donation.deploymentTransaction().wait(3);
    console.log("✅ Transaction confirmed!");
  }

  // Update contract addresses registry
  await updateContractAddresses(chainId, contractAddress);
  
  // Verify contract on Etherscan (if not local network)
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("\n🔍 Attempting contract verification...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on block explorer!");
    } catch (error) {
      console.log("❌ Contract verification failed:", error.message);
      console.log("💡 You may need to verify manually on the block explorer");
    }
  }

  // Display deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log(`Network: ${networkName}`);
  console.log(`Chain ID: ${chainId}`);
  console.log(`Contract: ${contractAddress}`);
  console.log(`Deployer: ${(await hre.ethers.getSigners())[0].address}`);
  console.log(`Transaction: ${donation.deploymentTransaction().hash}`);
  console.log("=".repeat(60));
  
  return {
    contractAddress,
    networkName,
    chainId,
    transactionHash: donation.deploymentTransaction().hash
  };
}

/**
 * Update the contract addresses registry with the new deployment
 */
async function updateContractAddresses(chainId, contractAddress) {
  console.log("\n📝 Updating contract addresses registry...");
  
  try {
    // Read current contract addresses
    const contractAddressesContent = fs.readFileSync(CONTRACT_ADDRESSES_PATH, 'utf8');
    
    // Convert chainId to hex string format used in the registry
    const chainIdHex = `0x${chainId.toString(16)}`;
    
    // Replace the placeholder address with the actual deployed address
    const updatedContent = contractAddressesContent.replace(
      new RegExp(`('${chainIdHex}':\\s*{[^}]*donation:\\s*)'0x0000000000000000000000000000000000000000'`),
      `$1'${contractAddress}'`
    );
    
    // Write back to file
    fs.writeFileSync(CONTRACT_ADDRESSES_PATH, updatedContent, 'utf8');
    console.log(`✅ Updated contract address for chain ${chainIdHex} in registry`);
    
  } catch (error) {
    console.log("❌ Failed to update contract addresses registry:", error.message);
    console.log(`💡 Please manually update the address for chain ID ${chainId} (0x${chainId.toString(16)}) to: ${contractAddress}`);
  }
}

// Execute deployment
main()
  .then((result) => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });