/**
 * Post-deployment test script for the Donation contract on Sepolia testnet
 * 
 * This script tests the basic functionality of the deployed Donation contract:
 * - Making ETH donations
 * - Adding supported tokens
 * - Making ERC20 donations
 * - Withdrawing funds (owner only)
 * - Querying donation history
 */

const { ethers } = require("ethers");
require("dotenv").config();
const { getNetworkProvider } = require("../../lib/web3/providers");
const { formatEther, formatAddress } = require("../../lib/web3/utils");

// Configuration - Update these values
const CONTRACT_ADDRESS = "0x90E2275C8E4135D27212b2595e0037ac3A1bECe9"; // Replace with your contract address
const ERC20_TOKEN_ADDRESS = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; // Optional: for testing ERC20 donations

// Get private key and ensure it has the correct format
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// Ensure private key has proper format (add 0x prefix if missing)
const formattedPrivateKey = PRIVATE_KEY && !PRIVATE_KEY.startsWith('0x') 
  ? `0x${PRIVATE_KEY}` 
  : PRIVATE_KEY;

// Contract ABI - Import from your artifacts or use a minimal ABI for the functions we need
const CONTRACT_ABI = require("../../lib/web3/contracts/artifacts/contracts/Donation.sol/Donation.json").abi;
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

// Setup provider and signer
async function setupProvider() {
  // Use Sepolia testnet
  const provider = getNetworkProvider(11155111); // Sepolia chainId
  const wallet = new ethers.Wallet(formattedPrivateKey, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
  
  console.log(`Connected to contract at: ${formatAddress(CONTRACT_ADDRESS)}`);
  console.log(`Using wallet: ${formatAddress(wallet.address)}`);
  
  return { provider, wallet, contract };
}

// Test functions
async function testBasicInfo(contract) {
  console.log("\n--- Testing Basic Contract Information ---");
  
  const balance = await contract.getBalance();
  console.log(`Contract ETH balance: ${formatEther(balance)} ETH`);
  
  const donationCount = await contract.getDonationCount();
  console.log(`Total donations: ${donationCount.toString()}`);
  
  // Fix: Check if donationCount is greater than 0 using regular JavaScript comparison
  // instead of BigNumber methods
  if (parseInt(donationCount.toString()) > 0) {
    console.log("\nFetching most recent donations:");
    
    // Calculate the starting index for fetching donations
    const startIndex = Math.max(0, parseInt(donationCount.toString()) - 5);
    const count = Math.min(5, parseInt(donationCount.toString()));
    
    const donations = await contract.getDonations(startIndex, count);
    
    donations.forEach((donation, index) => {
      console.log(`\nDonation #${index + 1}:`);
      console.log(`  Donor: ${formatAddress(donation.donor)}`);
      console.log(`  Amount: ${formatEther(donation.amount)} ${donation.currency}`);
      console.log(`  Message: ${donation.message}`);
      console.log(`  Time: ${new Date(parseInt(donation.timestamp.toString()) * 1000).toLocaleString()}`);
    });
  }
}

async function testEthDonation(contract) {
  console.log("\n--- Testing ETH Donation ---");

  const donationAmount = ethers.parseEther("0.0001"); // 0.0001 ETH
  const message = "Test donation from script";
  
  console.log(`Making donation of ${formatEther(donationAmount)} ETH`);
  console.log(`Message: "${message}"`);
  
  const tx = await contract.donate(message, { value: donationAmount });
  console.log(`Transaction hash: ${tx.hash}`);
  
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  
  // Check for events
  const events = receipt.events && receipt.events.filter(e => e.event === "DonationReceived");
  if (events && events.length > 0) {
    const event = events[0];
    console.log(`\nEvent DonationReceived emitted:`);
    console.log(`  Donor: ${formatAddress(event.args.donor)}`);
    console.log(`  Amount: ${formatEther(event.args.amount)} ${event.args.currency}`);
    console.log(`  Message: ${event.args.message}`);
  }
  
  // Verify donation was recorded
  const newDonationCount = await contract.getDonationCount();
  console.log(`\nNew donation count: ${newDonationCount.toString()}`);
}

async function testAddSupportedToken(contract, tokenAddress) {
  console.log("\n--- Testing Add Supported Token ---");
  console.log(`Adding token at address: ${formatAddress(tokenAddress)}`);
  
  // Check if token is already supported
  const isSupported = await contract.supportedTokens(tokenAddress);
  if (isSupported) {
    console.log("Token is already supported.");
    return;
  }
  
  const tx = await contract.addSupportedToken(tokenAddress);
  console.log(`Transaction hash: ${tx.hash}`);
  
  await tx.wait();
  console.log("Transaction confirmed");
  
  // Verify token is now supported
  const nowSupported = await contract.supportedTokens(tokenAddress);
  console.log(`Token is now supported: ${nowSupported}`);
}

async function testERC20Donation(contract, tokenAddress) {
  if (!tokenAddress) {
    console.log("\n--- Skipping ERC20 Donation Test (no token address provided) ---");
    return;
  }
  
  console.log("\n--- Testing ERC20 Donation ---");
  
  const { wallet } = await setupProvider();
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
  
  // Get token information
  const decimals = await tokenContract.decimals();
  const tokenBalance = await tokenContract.balanceOf(wallet.address);
  
  console.log(`Token balance: ${formatEther(tokenBalance)} tokens`);
  
  if (tokenBalance.toString() === '0') {
    console.log("Insufficient token balance. Skipping ERC20 donation test.");
    return;
  }

  // Determine donation amount (1% of balance or 1 token, whichever is smaller)
  // Use BigInt operations instead of BigNumber methods
  const oneToken = ethers.parseUnits("1", decimals);
  const onePercentOfBalance = tokenBalance / 100n; // Use BigInt division
  
  const donationAmount = onePercentOfBalance < oneToken ? onePercentOfBalance : oneToken;

  console.log(`Approving ${formatEther(donationAmount)} tokens for donation...`);
  
  // Approve tokens first
  const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, donationAmount);
  console.log(`Approval transaction hash: ${approveTx.hash}`);
  await approveTx.wait();
  console.log("Approval confirmed");
  
  // Make donation
  const message = "ERC20 donation test";
  console.log(`Making ERC20 donation of ${formatEther(donationAmount)} tokens`);
  console.log(`Message: "${message}"`);
  
  const donateTx = await contract.donateERC20(tokenAddress, donationAmount, message);
  console.log(`Transaction hash: ${donateTx.hash}`);
  
  const receipt = await donateTx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  
  // Check for events - Updated for ethers v6
  const events = receipt.logs?.filter(log => {
    try {
      const parsedLog = contract.interface.parseLog(log);
      return parsedLog.name === "ERC20DonationReceived";
    } catch {
      return false;
    }
  });
  
  if (events && events.length > 0) {
    const parsedEvent = contract.interface.parseLog(events[0]);
    console.log(`\nEvent ERC20DonationReceived emitted:`);
    console.log(`  Donor: ${formatAddress(parsedEvent.args.donor)}`);
    console.log(`  Token: ${formatAddress(parsedEvent.args.token)}`);
    console.log(`  Amount: ${formatEther(parsedEvent.args.amount)}`);
    console.log(`  Message: ${parsedEvent.args.message}`);
  }
  
  // Verify token balance
  const contractTokenBalance = await contract.getTokenBalance(tokenAddress);
  console.log(`\nContract token balance: ${formatEther(contractTokenBalance)}`);
}


async function testWithdraw(contract) {
  console.log("\n--- Testing ETH Withdrawal ---");
  
  const { wallet } = await setupProvider();
  const contractBalance = await contract.getBalance();
  
  if (contractBalance.toString() === '0') {
    console.log("Contract has no ETH balance. Skipping withdrawal test.");
    return;
  }
  
  // Withdraw half of the balance using BigInt division
  const withdrawAmount = contractBalance / 2n;
  console.log(`Withdrawing ${formatEther(withdrawAmount)} ETH to ${formatAddress(wallet.address)}`);
  
  const tx = await contract.withdraw(wallet.address, withdrawAmount);
  console.log(`Transaction hash: ${tx.hash}`);
  
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  
  // Check for events - Updated for ethers v6
  const events = receipt.logs?.filter(log => {
    try {
      const parsedLog = contract.interface.parseLog(log);
      return parsedLog.name === "FundsWithdrawn";
    } catch {
      return false;
    }
  });
  
  if (events && events.length > 0) {
    const parsedEvent = contract.interface.parseLog(events[0]);
    console.log(`\nEvent FundsWithdrawn emitted:`);
    console.log(`  To: ${formatAddress(parsedEvent.args.to)}`);
    console.log(`  Amount: ${formatEther(parsedEvent.args.amount)} ETH`);
  }
  
  // Verify new balance
  const newBalance = await contract.getBalance();
  console.log(`\nNew contract balance: ${formatEther(newBalance)} ETH`);
}


// Main function to run all tests
async function runTests() {
  try {
    console.log("Starting Donation Contract Tests on Sepolia");
    console.log("==========================================");
    
    const { contract } = await setupProvider();
    
    // Run tests in sequence
    await testBasicInfo(contract);
    await testEthDonation(contract);
    
    if (ERC20_TOKEN_ADDRESS && ERC20_TOKEN_ADDRESS !== "SEPOLIA_TEST_TOKEN_ADDRESS") {
      await testAddSupportedToken(contract, ERC20_TOKEN_ADDRESS);
      await testERC20Donation(contract, ERC20_TOKEN_ADDRESS);
    }
    
    await testWithdraw(contract);
    
    console.log("\n==========================================");
    console.log("All tests completed successfully!");
    
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
}

// Export functions for potential reuse
module.exports = {
  setupProvider,
  testBasicInfo,
  testEthDonation,
  testAddSupportedToken,
  testERC20Donation,
  testWithdraw,
  runTests
};

// Run the tests if this file is executed directly
if (require.main === module) {
  runTests();
}
