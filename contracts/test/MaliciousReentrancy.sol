// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Donation.sol";

/**
 * @title MaliciousReentrancy
 * @dev Contract to test reentrancy protection
 */
contract MaliciousReentrancy {
    Donation public donation;
    uint256 public attackCount;
    bool public attacking;
    uint256 public donationAmount;
    
    constructor(address payable _donation) {
        donation = Donation(_donation);
    }
    
    // Attack function - tries to make multiple donations in one transaction
    function attack() external payable {
        require(msg.value > 0, "Need ETH to attack");
        attacking = true;
        attackCount = 0;
        donationAmount = msg.value;
        
        // Make initial donation - this should succeed
        donation.donate{value: msg.value}("Initial malicious donation");
    }
    
    // This fallback will be triggered if the donation contract tries to send ETH
    // But since your donation contract doesn't send ETH back, we need a different approach
    fallback() external payable {
        if (attacking && attackCount < 3 && msg.sender == address(donation)) {
            attackCount++;
            // Try to re-enter the donation function
            donation.donate{value: donationAmount}("Reentrancy attack!");
        }
    }
    
    receive() external payable {
        if (attacking && attackCount < 3 && msg.sender == address(donation)) {
            attackCount++;
            // Try to re-enter the donation function
            donation.donate{value: donationAmount}("Reentrancy attack!");
        }
    }
    
    // Direct reentrancy attack - calls donate from within donate
    function directReentrancyAttack() external payable {
        attacking = true;
        attackCount = 0;
        
        // This will call the malicious donate function
        this.maliciousDonate{value: msg.value}();
    }
    
    function maliciousDonate() external payable {
        // First donation - use half the value
        donation.donate{value: msg.value / 2}("First donation");
        
        // Second donation - use the other half of the value
        // This is a second, separate call (not reentrancy)
        donation.donate{value: msg.value / 2}("Second donation");
    }
    
    // Stop the attack
    function stopAttack() external {
        attacking = false;
    }
}