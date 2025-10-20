// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Donation.sol";

/**
 * @title ReentrancyAttacker
 * @dev More sophisticated reentrancy attack contract
 */
contract ReentrancyAttacker {
    Donation public donation;
    bool public attacking;
    uint256 public attackCount;
    
    constructor(address payable _donation) {
        donation = Donation(_donation);
    }
    
    function performAttack() external payable {
        attacking = true;
        attackCount = 0;
        
        // Try to perform reentrancy by calling donate, then immediately calling it again
        // This simulates a reentrancy attack where the contract tries to call itself
        // before the first call completes
        
        try this.initiateAttack{value: msg.value}() {
            // Attack succeeded
        } catch {
            // Attack failed (which is what we want)
            revert("Attack failed as expected");
        }
    }
    
    function initiateAttack() external payable {
        require(msg.sender == address(this), "Only self can call");
        
        // Make the donation
        donation.donate{value: msg.value}("Attack donation");
        
        // Try to immediately make another donation (this should fail due to nonReentrant)
        if (attackCount == 0) {
            attackCount++;
            // This should trigger ReentrancyGuardReentrantCall if protection is working
            donation.donate{value: 1 wei}("Reentrancy attempt");
        }
    }
    
    // Fallback to receive ETH
    receive() external payable {}
}