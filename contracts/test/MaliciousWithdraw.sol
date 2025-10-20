// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Donation.sol";

/**
 * @title MaliciousWithdraw
 * @dev Contract to test reentrancy protection on withdraw
 */
contract MaliciousWithdraw {
    Donation public donation;
    uint256 public withdrawCount;
    bool public attacking;
    
    constructor(address payable _donation) {  // ✅ Changed to payable
        donation = Donation(_donation);
    }
    
    // ✅ Removed acceptOwnership() since it doesn't exist in your contract
    
    function maliciousWithdraw(uint256 amount) external {
        attacking = true;
        withdrawCount = 0;
        donation.withdraw(payable(address(this)), amount);
    }
    
    receive() external payable {
        if (attacking && withdrawCount < 3) {
            withdrawCount++;
            // Try to re-enter withdraw
            if (address(donation).balance > 0) {
                donation.withdraw(payable(address(this)), address(donation).balance);
            }
        }
    }
}
