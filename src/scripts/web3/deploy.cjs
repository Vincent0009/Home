const { ethers, run, network } = require("hardhat");

async function main() {
  console.log("Deploying Donation contract...");

  // Deploy the contract
  const Donation = await ethers.getContractFactory("Donation");
  const donation = await Donation.deploy();
  await donation.waitForDeployment();

  const donationAddress = await donation.getAddress();
  console.log(`Donation contract deployed to: ${donationAddress}`);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await donation.deploymentTransaction().wait(5);

  // Verify the contract on Etherscan (if not on a local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Verifying contract on Etherscan...");
    try {
      await run("verify:verify", {
        address: donationAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });