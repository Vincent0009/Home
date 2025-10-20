// CommonJS version of the test file
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donation Contract", function () {
  let Donation;
  let donation;
  let owner;
  let donor1;
  let donor2;
  let MockERC20;
  let mockToken;

  const donationAmount = ethers.parseEther("1.0");
  const tokenAmount = ethers.parseUnits("100", 18);

  beforeEach(async function () {
    // Get signers
    [owner, donor1, donor2] = await ethers.getSigners();

    // Deploy mock ERC20 token
    MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Mock Token", "MTK");
    await mockToken.waitForDeployment();

    // Deploy Donation contract
    Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy();
    await donation.waitForDeployment();

    // Add token to supported tokens
    await donation.addSupportedToken(await mockToken.getAddress());

    // Mint tokens to donor1
    await mockToken.mint(donor1.address, tokenAmount);

    // Approve tokens for donation contract
    await mockToken.connect(donor1).approve(await donation.getAddress(), tokenAmount);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await donation.owner()).to.equal(owner.address);
    });

    it("Should have zero initial balance", async function () {
      expect(await donation.getBalance()).to.equal(0);
    });
  });

  describe("ETH Donations", function () {
    it("Should accept ETH donations", async function () {
      const message = "Thank you for your work!";

      await expect(donation.connect(donor1).donate(message, { value: donationAmount }))
        .to.emit(donation, "DonationReceived")
        .withArgs(donor1.address, donationAmount, "ETH", message);

      expect(await donation.getBalance()).to.equal(donationAmount);
      expect(await donation.donorTotalAmount(donor1.address)).to.equal(donationAmount);
    });

    it("Should accept ETH via receive function", async function () {
      await expect(donor1.sendTransaction({
        to: await donation.getAddress(),
        value: donationAmount
      }))
        .to.emit(donation, "DonationReceived")
        .withArgs(donor1.address, donationAmount, "ETH", "");

      expect(await donation.getBalance()).to.equal(donationAmount);
    });

    it("Should reject zero amount donations", async function () {
      await expect(donation.connect(donor1).donate("Test", { value: 0 }))
        .to.be.revertedWith("Donation amount must be greater than 0");
    });
  });

  describe("ERC20 Donations", function () {
    it("Should accept ERC20 token donations", async function () {
      const message = "Token donation";
      const donationTokenAmount = ethers.parseUnits("10", 18);

      await expect(donation.connect(donor1).donateERC20(await mockToken.getAddress(), donationTokenAmount, message))
        .to.emit(donation, "ERC20DonationReceived")
        .withArgs(donor1.address, await mockToken.getAddress(), donationTokenAmount, message);

      expect(await mockToken.balanceOf(await donation.getAddress())).to.equal(donationTokenAmount);
    });

    it("Should reject unsupported tokens", async function () {
      const unsupportedToken = await MockERC20.deploy("Unsupported", "UNS");
      await unsupportedToken.waitForDeployment();

      await expect(donation.connect(donor1).donateERC20(
        await unsupportedToken.getAddress(),
        ethers.parseUnits("10", 18),
        "Test"
      )).to.be.revertedWith("Token not supported");
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      // Make a donation first
      await donation.connect(donor1).donate("Test donation", { value: donationAmount });
      await donation.connect(donor1).donateERC20(
        await mockToken.getAddress(),
        ethers.parseUnits("10", 18),
        "Token donation"
      );
    });

    it("Should allow owner to withdraw ETH", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);

      await expect(donation.withdraw(owner.address, donationAmount))
        .to.emit(donation, "FundsWithdrawn")
        .withArgs(owner.address, donationAmount);

      expect(await donation.getBalance()).to.equal(0);

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should allow owner to withdraw ERC20 tokens", async function () {
      const tokenAmount = ethers.parseUnits("10", 18);

      await expect(donation.withdrawERC20(await mockToken.getAddress(), owner.address, tokenAmount))
        .to.emit(donation, "ERC20Withdrawn")
        .withArgs(await mockToken.getAddress(), owner.address, tokenAmount);

      expect(await mockToken.balanceOf(await donation.getAddress())).to.equal(0);
      expect(await mockToken.balanceOf(owner.address)).to.equal(tokenAmount);
    });

    it("Should prevent non-owners from withdrawing", async function () {
      await expect(donation.connect(donor1).withdraw(donor1.address, donationAmount))
        .to.be.revertedWithCustomError(donation, "OwnableUnauthorizedAccount");

      await expect(donation.connect(donor1).withdrawERC20(await mockToken.getAddress(), donor1.address, ethers.parseUnits("10", 18)))
        .to.be.revertedWithCustomError(donation, "OwnableUnauthorizedAccount");
    });
  });

  describe("Donation History", function () {
    beforeEach(async function () {
      // Make multiple donations with different amounts
      await donation.connect(donor1).donate("First donation", { value: donationAmount });
      await donation.connect(donor2).donate("Second donation", { value: donationAmount * 2n });
      await donation.connect(donor1).donateERC20(
        await mockToken.getAddress(),
        ethers.parseUnits("10", 18),
        "Token donation"
      );
    });

    it("Should correctly track donation count", async function () {
      expect(await donation.getDonationCount()).to.equal(3);
    });

    it("Should return donations with pagination", async function () {
      const donations = await donation.getDonations(0, 2);
      expect(donations.length).to.equal(2);
      expect(donations[0].donor).to.equal(donor1.address);
      expect(donations[0].amount).to.equal(donationAmount);
      expect(donations[1].donor).to.equal(donor2.address);
      expect(donations[1].amount).to.equal(donationAmount * 2n);
    });

    it("Should handle pagination correctly", async function () {
      const allDonations = await donation.getDonations(0, 10);
      expect(allDonations.length).to.equal(3);

      const firstTwo = await donation.getDonations(0, 2);
      expect(firstTwo.length).to.equal(2);

      const lastOne = await donation.getDonations(2, 2);
      expect(lastOne.length).to.equal(1);
    });

    it("Should return empty array for out of bounds pagination", async function () {
      const donations = await donation.getDonations(10, 5);
      expect(donations.length).to.equal(0);
    });
  });

  describe("Security Tests", function () {
    let maliciousContract;

    beforeEach(async function () {
      // Deploy malicious contract
      const MaliciousReentrancy = await ethers.getContractFactory("MaliciousReentrancy");
      maliciousContract = await MaliciousReentrancy.deploy(await donation.getAddress());
      await maliciousContract.waitForDeployment();
    });

    describe("Reentrancy Protection", function () {
      // contracts/test/Donation.test.cjs
      it("Should prevent reentrancy attacks on donate function", async function () {
        const attackAmount = ethers.parseEther("2.0");

        // Reset donation count before test
        // Deploy a fresh donation contract for this test
        const freshDonation = await Donation.deploy();
        await freshDonation.waitForDeployment();

        // Deploy a new malicious contract pointing to the fresh donation contract
        const freshMalicious = await (await ethers.getContractFactory("MaliciousReentrancy"))
          .deploy(await freshDonation.getAddress());
        await freshMalicious.waitForDeployment();

        // Test direct attack
        await expect(freshMalicious.directReentrancyAttack({ value: attackAmount }))
          .to.not.be.reverted;

        // The key assertion: Despite the attack attempt, only two donations should be recorded
        // because the reentrancy attempt should fail due to nonReentrant modifier
        expect(await freshDonation.getDonationCount()).to.equal(2);
      });

      it("Should prevent reentrancy through external contract calls", async function () {
        // Create a more sophisticated reentrancy test
        const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker");
        const attacker = await ReentrancyAttacker.deploy(await donation.getAddress());
        await attacker.waitForDeployment();

        const attackAmount = ethers.parseEther("1.0");

        // This should fail due to reentrancy protection
        await expect(attacker.performAttack({ value: attackAmount }))
          .to.be.revertedWith("Attack failed as expected");

        // The key is that the contract should maintain correct state
        const finalBalance = await donation.getBalance();
        const donationCount = await donation.getDonationCount();

        // Verify that only legitimate donations were recorded
        expect(donationCount).to.be.lessThanOrEqual(1);
        expect(finalBalance).to.be.lessThanOrEqual(attackAmount);
      });

      it("Should maintain correct state during concurrent operations", async function () {
        // Test that the contract maintains correct state even with complex interactions
        const amount1 = ethers.parseEther("1.0");
        const amount2 = ethers.parseEther("2.0");

        // Make donations from different accounts simultaneously (in different transactions)
        await donation.connect(donor1).donate("Donation 1", { value: amount1 });
        await donation.connect(donor2).donate("Donation 2", { value: amount2 });

        // Verify state consistency
        expect(await donation.getDonationCount()).to.equal(2);
        expect(await donation.getBalance()).to.equal(amount1 + amount2);
        expect(await donation.donorTotalAmount(donor1.address)).to.equal(amount1);
        expect(await donation.donorTotalAmount(donor2.address)).to.equal(amount2);
      });

      it("Should allow legitimate sequential donations", async function () {
        // These should work fine (not reentrancy)
        await donation.connect(donor1).donate("First donation", { value: donationAmount });
        await donation.connect(donor1).donate("Second donation", { value: donationAmount });
        await donation.connect(donor2).donate("Third donation", { value: donationAmount });

        expect(await donation.getDonationCount()).to.equal(3);
        expect(await donation.getBalance()).to.equal(donationAmount * 3n);
      });
    });

    describe("Input Validation", function () {
      it("Should handle edge case amounts correctly", async function () {
        const smallAmount = 1n; // 1 wei

        await expect(donation.connect(donor1).donate("Tiny donation", { value: smallAmount }))
          .to.emit(donation, "DonationReceived")
          .withArgs(donor1.address, smallAmount, "ETH", "Tiny donation");

        expect(await donation.getBalance()).to.equal(smallAmount);
      });

      it("Should reject zero amount donations", async function () {
        await expect(donation.connect(donor1).donate("Zero donation", { value: 0 }))
          .to.be.revertedWith("Donation amount must be greater than 0");
      });
    });

    describe("Gas Optimization Tests", function () {
      it("Should handle multiple donations efficiently", async function () {
        const numberOfDonations = 10; // Reduced for faster testing
        const smallAmount = ethers.parseEther("0.01");

        // Make multiple donations
        for (let i = 0; i < numberOfDonations; i++) {
          await donation.connect(donor1).donate(`Donation ${i}`, { value: smallAmount });
        }

        expect(await donation.getDonationCount()).to.equal(numberOfDonations);

        // Test pagination with dataset
        const firstBatch = await donation.getDonations(0, 5);
        expect(firstBatch.length).to.equal(5);

        const secondBatch = await donation.getDonations(5, 5);
        expect(secondBatch.length).to.equal(5);
      });

      it("Should handle large donation amounts", async function () {
        const largeAmount = ethers.parseEther("100"); // Large but reasonable amount

        await expect(donation.connect(donor1).donate("Large donation", { value: largeAmount }))
          .to.emit(donation, "DonationReceived")
          .withArgs(donor1.address, largeAmount, "ETH", "Large donation");

        expect(await donation.getBalance()).to.equal(largeAmount);
      });
    });

    describe("Access Control", function () {
      it("Should only allow owner to withdraw", async function () {
        // Make a donation first
        await donation.connect(donor1).donate("Test donation", { value: donationAmount });

        // Non-owner should not be able to withdraw
        await expect(donation.connect(donor1).withdraw(donor1.address, donationAmount))
          .to.be.revertedWithCustomError(donation, "OwnableUnauthorizedAccount");

        // Owner should be able to withdraw
        await expect(donation.connect(owner).withdraw(owner.address, donationAmount))
          .to.emit(donation, "FundsWithdrawn")
          .withArgs(owner.address, donationAmount);
      });

      it("Should only allow owner to manage supported tokens", async function () {
        const newToken = await MockERC20.deploy("New Token", "NEW");
        await newToken.waitForDeployment();

        // Non-owner should not be able to add tokens
        await expect(donation.connect(donor1).addSupportedToken(await newToken.getAddress()))
          .to.be.revertedWithCustomError(donation, "OwnableUnauthorizedAccount");

        // Owner should be able to add tokens
        await expect(donation.connect(owner).addSupportedToken(await newToken.getAddress()))
          .to.not.be.reverted;

        expect(await donation.supportedTokens(await newToken.getAddress())).to.be.true;
      });
    });
  });

});
