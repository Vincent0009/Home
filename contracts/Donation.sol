// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Donation
 * @dev A contract for accepting donations in ETH and ERC20 tokens
 */
contract Donation is Ownable, ReentrancyGuard {
    // Events
    event DonationReceived(address indexed donor, uint256 amount, string currency, string message);
    event ERC20DonationReceived(address indexed donor, address indexed token, uint256 amount, string message);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event ERC20Withdrawn(address indexed token, address indexed to, uint256 amount);

    // Donation structure
    struct DonationInfo {
        address donor;
        uint256 amount;
        string currency;
        string message;
        uint256 timestamp;
    }

    // Array to store donation history
    DonationInfo[] public donations;
    
    // Mapping to track total donations per address
    mapping(address => uint256) public donorTotalAmount;
    
    // Mapping to track supported ERC20 tokens
    mapping(address => bool) public supportedTokens;

    /**
     * @dev Constructor to set the initial owner
     */
    constructor() Ownable(msg.sender) {
        // Initialize with no supported tokens
    }

    /**
     * @dev Add a supported ERC20 token
     * @param tokenAddress The address of the ERC20 token
     */
    function addSupportedToken(address tokenAddress) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        supportedTokens[tokenAddress] = true;
    }

    /**
     * @dev Remove a supported ERC20 token
     * @param tokenAddress The address of the ERC20 token
     */
    function removeSupportedToken(address tokenAddress) external onlyOwner {
        supportedTokens[tokenAddress] = false;
    }

    /**
     * @dev Donate ETH to the contract
     * @param message Optional message from the donor
     */
    function donate(string memory message) external payable nonReentrant {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        // Update donor's total amount
        donorTotalAmount[msg.sender] += msg.value;
        
        // Create donation record
        DonationInfo memory newDonation = DonationInfo({
            donor: msg.sender,
            amount: msg.value,
            currency: "ETH",
            message: message,
            timestamp: block.timestamp
        });
        
        // Add to donations array
        donations.push(newDonation);
        
        // Emit event
        emit DonationReceived(msg.sender, msg.value, "ETH", message);
    }

    /**
     * @dev Donate ERC20 tokens to the contract
     * @param tokenAddress The address of the ERC20 token
     * @param amount The amount of tokens to donate
     * @param message Optional message from the donor
     */
    function donateERC20(address tokenAddress, uint256 amount, string memory message) external nonReentrant {
        require(amount > 0, "Donation amount must be greater than 0");
        require(supportedTokens[tokenAddress], "Token not supported");
        
        IERC20 token = IERC20(tokenAddress);
        
        // Transfer tokens from sender to contract
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        // Create donation record
        DonationInfo memory newDonation = DonationInfo({
            donor: msg.sender,
            amount: amount,
            currency: "ERC20",
            message: message,
            timestamp: block.timestamp
        });
        
        // Add to donations array
        donations.push(newDonation);
        
        // Emit event
        emit ERC20DonationReceived(msg.sender, tokenAddress, amount, message);
    }

    /**
     * @dev Withdraw ETH from the contract (only owner)
     * @param to Address to send the funds to
     * @param amount Amount of ETH to withdraw
     */
    function withdraw(address payable to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= address(this).balance, "Insufficient balance");
        
        // Transfer ETH to the specified address
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
        
        // Emit event
        emit FundsWithdrawn(to, amount);
    }

    /**
     * @dev Withdraw ERC20 tokens from the contract (only owner)
     * @param tokenAddress The address of the ERC20 token
     * @param to Address to send the tokens to
     * @param amount Amount of tokens to withdraw
     */
    function withdrawERC20(address tokenAddress, address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= amount, "Insufficient token balance");
        
        // Transfer tokens to the specified address
        require(token.transfer(to, amount), "Token transfer failed");
        
        // Emit event
        emit ERC20Withdrawn(tokenAddress, to, amount);
    }

    /**
     * @dev Get the total number of donations
     * @return The number of donations
     */
    function getDonationCount() external view returns (uint256) {
        return donations.length;
    }

    /**
     * @dev Get donations with pagination
     * @param offset Starting index
     * @param limit Maximum number of donations to return
     * @return Array of donation information
     */
    function getDonations(uint256 offset, uint256 limit) external view returns (DonationInfo[] memory) {
        uint256 donationCount = donations.length;
        
        if (offset >= donationCount) {
            return new DonationInfo[](0);
        }
        
        uint256 size = limit;
        if (offset + limit > donationCount) {
            size = donationCount - offset;
        }
        
        DonationInfo[] memory result = new DonationInfo[](size);
        for (uint256 i = 0; i < size; i++) {
            result[i] = donations[offset + i];
        }
        
        return result;
    }

    /**
     * @dev Get contract ETH balance
     * @return The contract's ETH balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Get contract ERC20 token balance
     * @param tokenAddress The address of the ERC20 token
     * @return The contract's token balance
     */
    function getTokenBalance(address tokenAddress) external view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    /**
     * @dev Fallback function to accept ETH
     */
    receive() external payable {
        // Create donation record with empty message
        DonationInfo memory newDonation = DonationInfo({
            donor: msg.sender,
            amount: msg.value,
            currency: "ETH",
            message: "",
            timestamp: block.timestamp
        });
        
        // Add to donations array
        donations.push(newDonation);
        
        // Update donor's total amount
        donorTotalAmount[msg.sender] += msg.value;
        
        // Emit event
        emit DonationReceived(msg.sender, msg.value, "ETH", "");
    }
}