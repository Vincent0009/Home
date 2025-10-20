'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain, useWalletClient, usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import TokenSelector, { SUPPORTED_TOKENS } from './TokenSelector';
import ChainSelector, { SUPPORTED_CHAINS } from './ChainSelector';
import { getContractAddress } from '@/lib/web3/contracts/contractAddresses';
import useCachedTokenPrices from '@/hooks/useCachedTokenPrices';

// Contract ABIs
const DONATION_ABI = [
  "function donate(string memory message) external payable",
  "function donateERC20(address tokenAddress, uint256 amount, string memory message) external",
  "function supportedTokens(address) external view returns (bool)",
  "event DonationReceived(address indexed donor, uint256 amount, string currency, string message)",
  "event ERC20DonationReceived(address indexed donor, address indexed token, uint256 amount, string message)"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)"
];

export default function ModernDonationForm() {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  
  // Form state
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [selectedChain, setSelectedChain] = useState('0x1');
  const [tokenAmount, setTokenAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isEditingUsd, setIsEditingUsd] = useState(false);

  // Use cached price hook
  const { prices, loading: priceLoading, getPrice } = useCachedTokenPrices(SUPPORTED_TOKENS);
  const tokenPrice = getPrice(selectedToken);

  // Transaction state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Balance state
  const [tokenBalance, setTokenBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Note: Token prices are now handled by useCachedTokenPrices hook

  // Update USD amount when token amount or price changes (but not when user is editing USD)
  useEffect(() => {
    if (isEditingUsd) return; // Don't update USD when user is typing in USD field

    if (tokenAmount && tokenPrice) {
      setUsdAmount((parseFloat(tokenAmount) * tokenPrice).toFixed(2));
    } else if (!tokenAmount) {
      setUsdAmount('');
    }
  }, [tokenAmount, tokenPrice, isEditingUsd]);

  // Update token amount when USD amount changes
  const handleUsdAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setIsEditingUsd(true);
      setUsdAmount(value);
      if (value && tokenPrice) {
        setTokenAmount((parseFloat(value) / tokenPrice).toFixed(8));
      } else {
        setTokenAmount('');
      }
    }
  };

  const handleTokenAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setIsEditingUsd(false); // User is now editing token amount
      setTokenAmount(value);
    }
  };

  // Fetch token balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!isConnected || !address || !publicClient || !selectedToken || !selectedChain) {
        setTokenBalance(null);
        return;
      }
      
      setBalanceLoading(true);
      try {
        // Use Wagmi's public client instead of window.ethereum
        const provider = publicClient;
        const tokenData = SUPPORTED_TOKENS[selectedToken];
        
        if (!tokenData) {
          console.warn(`Token data not found for ${selectedToken}`);
          setTokenBalance(null);
          return;
        }
        
        // Check if we're on the correct network
        const expectedChainId = parseInt(selectedChain);
        
        if (provider.chain.id !== expectedChainId) {
          console.warn(`Network mismatch: connected to ${provider.chain.id}, expected ${expectedChainId}`);
          setTokenBalance(null);
          return;
        }
        
        if (tokenData.type === 'native') {
          // For native tokens, get the balance directly
          const balance = await provider.getBalance({ address });
          setTokenBalance(ethers.formatEther(balance));
        } else if (tokenData.addresses?.[selectedChain] && (tokenData.type === 'stablecoin' || tokenData.type === 'wrapped' || tokenData.type === 'governance')) {
          // For ERC20 tokens (stablecoins, wrapped tokens, and governance tokens), check if the token is available on the selected chain
          const tokenAddress = tokenData.addresses[selectedChain];
          if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
            console.warn(`Invalid token address for ${selectedToken} on chain ${selectedChain}:`, tokenAddress);
            setTokenBalance(null);
            return;
          }
          
          // Verify the contract exists by checking if it has code
          const contractCode = await provider.getCode({ address: tokenAddress });
          if (contractCode === '0x') {
            console.warn(`No contract found at address ${tokenAddress} for ${selectedToken} on chain ${selectedChain}`);
            setTokenBalance(null);
            return;
          }
          
          // Create ethers provider for contract interactions from public client
          const ethersProvider = new ethers.BrowserProvider(walletClient || publicClient.transport);
          const contract = new ethers.Contract(tokenAddress, ERC20_ABI, ethersProvider);
          
          // Double-check contract validity before making calls
          try {
            // Test if contract supports ERC20 interface by checking if it has a balanceOf function
            const contractInterface = new ethers.Interface(ERC20_ABI);
            if (!contractInterface.hasFunction('balanceOf')) {
              throw new Error('Contract does not support ERC20 interface');
            }
          } catch (interfaceError) {
            console.warn(`Invalid ERC20 contract at ${tokenAddress}:`, interfaceError);
            setTokenBalance(null);
            return;
          }
          
          // Use Promise.allSettled to handle partial failures gracefully
          const [balanceResult, decimalsResult] = await Promise.allSettled([
            contract.balanceOf(address),
            contract.decimals()
          ]);
          
          if (balanceResult.status === 'rejected') {
            console.error(`Failed to get balance for ${selectedToken}:`, balanceResult.reason);
            setTokenBalance(null);
            return;
          }
          
          if (decimalsResult.status === 'rejected') {
            console.error(`Failed to get decimals for ${selectedToken}:`, decimalsResult.reason);
            // Default to 18 decimals for most ERC20 tokens
            setTokenBalance(ethers.formatUnits(balanceResult.value, 18));
            return;
          }
          
          setTokenBalance(ethers.formatUnits(balanceResult.value, decimalsResult.value));
        } else {
          // Token not available on selected chain
          console.warn(`${selectedToken} not available on chain ${selectedChain}`);
          setTokenBalance(null);
        }
      } catch (err) {
        console.error('Balance fetch error:', err);
        // Provide more specific error information
        if (err.code === 'BAD_DATA') {
          console.error('Contract call returned empty data - contract may not exist or network mismatch');
        } else if (err.code === 'NETWORK_ERROR') {
          console.error('Network error - check connection and try again');
        }
        setTokenBalance(null);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, [isConnected, address, selectedToken, selectedChain, currentChainId, publicClient, walletClient]);

  const handleDonate = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!tokenAmount || parseFloat(tokenAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Check if we need to switch chains
    const targetChainId = parseInt(selectedChain);
    if (currentChainId !== targetChainId) {
      setError(`Please switch to ${SUPPORTED_CHAINS[selectedChain]?.name} network first, then try again.`);
      return;
    }

    setIsProcessing(true);
    setProcessingStage('');
    setError('');
    setSuccess(false);

    try {
      if (!walletClient) {
        throw new Error('Wallet not connected properly');
      }
      
      // Use the connected wallet client instead of window.ethereum
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      
      // Get contract address
      const contractAddress = getContractAddress('donation', selectedChain);
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error(`Donation contract not deployed on ${SUPPORTED_CHAINS[selectedChain]?.name}`);
      }

      const donationContract = new ethers.Contract(contractAddress, DONATION_ABI, signer);
      let tx;

      if (SUPPORTED_TOKENS[selectedToken].type === 'native') {
        // Native token donation
        setProcessingStage('Confirm the transaction in your wallet to complete the donation');
        const amountWei = ethers.parseEther(tokenAmount);
        try {
          tx = await donationContract.donate(message, { value: amountWei });
        } catch (nativeError) {
          if (nativeError.message?.toLowerCase().includes('reject') || 
              nativeError.code === 'ACTION_REJECTED' || 
              nativeError.code === 4001 ||
              nativeError.code === 117) {
            throw new Error('Donation transaction was rejected. Please try again and confirm the transaction in your wallet.');
          }
          throw nativeError;
        }
      } else {
        // ERC20 token donation
        const tokenAddress = SUPPORTED_TOKENS[selectedToken].addresses[selectedChain];
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
        
        const decimals = await tokenContract.decimals();
        const tokenAmountWei = ethers.parseUnits(tokenAmount, decimals);
        
        // Check allowance and request exact approval if needed
        const allowance = await tokenContract.allowance(address, contractAddress);
        const needsApproval = allowance < tokenAmountWei;
        
        if (needsApproval) {
          // Stage 1: Token approval
          setProcessingStage(`STEP 1 OF 2|Please approve ${selectedToken} spending in your wallet`);
          try {
            const approveTx = await tokenContract.approve(contractAddress, tokenAmountWei);
            setProcessingStage('STEP 1 OF 2|Waiting for approval confirmation...');
            await approveTx.wait();
          } catch (approvalError) {
            if (approvalError.message?.toLowerCase().includes('reject') || 
                approvalError.code === 'ACTION_REJECTED' || 
                approvalError.code === 4001 ||
                approvalError.code === 117) {
              throw new Error('Token spending approval was rejected. Please try again and accept the approval in your wallet.');
            }
            throw approvalError;
          }
        }
        
        // Stage 2: Actual donation
        setProcessingStage(`${needsApproval ? 'STEP 2 OF 2|' : ''}Please confirm the ${selectedToken} donation in your wallet`);
        try {
          tx = await donationContract.donateERC20(tokenAddress, tokenAmountWei, message);
        } catch (donationError) {
          if (donationError.message?.toLowerCase().includes('reject') || 
              donationError.code === 'ACTION_REJECTED' || 
              donationError.code === 4001 ||
              donationError.code === 117) {
            throw new Error('Donation transaction was rejected. Please try again and confirm the transaction in your wallet.');
          }
          throw donationError;
        }
      }

      setProcessingStage('Confirming transaction on blockchain...');
      await tx.wait();
      
      setTxHash(tx.hash);
      setSuccess(true);
      setProcessingStage('');
      setTokenAmount('');
      setUsdAmount('');
      setMessage('');
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.message || 'Failed to process donation');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const getExplorerUrl = () => {
    const chain = SUPPORTED_CHAINS[selectedChain];
    return chain ? chain.explorer : 'https://etherscan.io';
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent mb-4">Ready to Donate?</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">Connect your wallet to start making donations with cryptocurrency</p>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-slate-500">
            Supported: ETH • BNB • MATIC • ARB • OP • USDT • USDC
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Selection */}
      <TokenSelector
        selectedToken={selectedToken}
        onTokenSelect={setSelectedToken}
      />

      {/* Chain Selection */}
      <ChainSelector
        selectedToken={selectedToken}
        selectedChain={selectedChain}
        onChainSelect={setSelectedChain}
        currentWalletChain={currentChainId}
      />

      {/* Donation Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
            Donation Amount
          </h3>
        </div>

        <form onSubmit={handleDonate} className="space-y-6">
          {/* Amount inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Amount ({selectedToken})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tokenAmount}
                  onChange={handleTokenAmountChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg font-medium"
                  disabled={isProcessing}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-slate-500">
                  {selectedToken}
                </div>
              </div>
              {balanceLoading ? (
                <div className="mt-1 text-xs text-slate-500">
                  <div className="animate-pulse bg-gray-200 h-3 w-24 rounded"></div>
                </div>
              ) : tokenBalance !== null ? (
                <div className="mt-1 text-xs text-slate-500">
                  Balance: {parseFloat(tokenBalance).toFixed(6)} {selectedToken}
                </div>
              ) : (
                <div className="mt-1 text-xs text-red-500">
                  {!SUPPORTED_TOKENS[selectedToken]?.addresses?.[selectedChain] && SUPPORTED_TOKENS[selectedToken]?.type !== 'native' 
                    ? `${selectedToken} not available on selected network` 
                    : 'Unable to fetch balance'}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usdAmount}
                  onChange={handleUsdAmountChange}
                  onBlur={() => setIsEditingUsd(false)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg font-medium"
                  disabled={isProcessing}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-slate-500">
                  USD
                </div>
              </div>
              {tokenPrice && (
                <div className="mt-1 text-xs text-slate-500">
                  1 {selectedToken} = ${tokenPrice.toFixed(2)} USD
                </div>
              )}
            </div>
          </div>

          {/* Message input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message with your donation..."
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              rows="3"
              disabled={isProcessing}
            />
          </div>

          {/* Network switch warning and button */}
          {selectedChain && currentChainId && currentChainId !== parseInt(selectedChain) && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <div className="text-yellow-800 text-sm">
                    <div className="font-medium mb-1">Network Switch Required</div>
                    <div className="mb-3">
                      Your wallet is connected to {SUPPORTED_CHAINS[`0x${currentChainId.toString(16)}`]?.name || 'Unknown Network'}, but you selected {SUPPORTED_CHAINS[selectedChain]?.name}. 
                      Please switch your wallet network to continue.
                    </div>
                    <button
                      onClick={() => {
                        try {
                          switchChain({ chainId: parseInt(selectedChain) });
                        } catch (err) {
                          setError('Failed to switch network. Please switch manually in your wallet.');
                        }
                      }}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Switch to {SUPPORTED_CHAINS[selectedChain]?.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing Stage Display */}
          {isProcessing && processingStage && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="text-blue-800 font-medium">Transaction in Progress</div>
                    {processingStage.includes('|') && (
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {processingStage.split('|')[0]}
                      </div>
                    )}
                  </div>
                  <div className="text-blue-700 text-sm">
                    {processingStage.includes('|') ? processingStage.split('|')[1] : processingStage}
                  </div>
                  <div className="text-blue-600 text-xs mt-2 bg-blue-100 p-2 rounded">
                    💡 <strong>Tip:</strong> Check your wallet app or browser extension to approve the transaction
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Success display */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Donation successful! Thank you!</span>
              </div>
              {txHash && (
                <a 
                  href={`${getExplorerUrl()}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View transaction
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isProcessing || !tokenAmount || (currentChainId !== parseInt(selectedChain))}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              isProcessing || !tokenAmount || (currentChainId !== parseInt(selectedChain))
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {processingStage ? 'Processing...' : 'Starting...'}
              </span>
            ) : currentChainId !== parseInt(selectedChain) ? (
              'Switch Network First'
            ) : (
              `Donate ${tokenAmount ? `${tokenAmount} ${selectedToken}` : 'Now'}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}