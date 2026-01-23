/**
 * Token Claim Modal
 * AlmaNEO Kindness Game - Mining Reward Claim Interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Alert,
  CircularProgress,
  useMediaQuery,
  Divider,
  Chip,
} from '@mui/material';
import {
  LocalFireDepartment as MiningIcon,
  TrendingUp as RateIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import GameModal from './GameModal';
import { useGameStore } from '@/hooks/useGameStore';
import { useWeb3Auth } from '@/contexts/Web3AuthProvider';
import { formatTokenAmount, formatGamePoints } from '@/lib/tokenReward';
import { formatMiningProgress, formatConversionRate } from '@/lib/tokenMining';
import { claimTokenReward, getTokenBalance } from '@/lib/smartContract';
import { getEthersSigner, checkNetwork, switchToPolygonAmoy } from '@/lib/web3AuthHelpers';
import { getTxExplorerUrl } from '@/contracts/addresses';

interface TokenClaimModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TokenClaimModal({ open, onClose }: TokenClaimModalProps) {
  // Media query for landscape orientation
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  // Game store
  const {
    totalPoints,
    getClaimableTokenAmount,
    canClaimTokens,
    getCurrentConversionRate,
    getMiningStats,
    recordTokenClaim,
  } = useGameStore();

  // Web3Auth
  const { provider, address, isConnected } = useWeb3Auth();

  // Local state
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');

  // Mining stats
  const miningStats = getMiningStats();
  const claimableTokens = getClaimableTokenAmount();
  const currentRate = getCurrentConversionRate();
  const canClaim = canClaimTokens();

  // Load token balance
  useEffect(() => {
    if (open && isConnected && address && provider) {
      loadTokenBalance();
    }
  }, [open, isConnected, address, provider]);

  const loadTokenBalance = async () => {
    try {
      if (!provider || !address) return;
      
      const { BrowserProvider } = await import('ethers');
      const ethersProvider = new BrowserProvider(provider);
      
      const balance = await getTokenBalance(address, ethersProvider);
      setTokenBalance(balance.formatted);
    } catch (error) {
      console.error('Failed to load token balance:', error);
    }
  };

  // Handle claim
  const handleClaim = async () => {
    if (!provider || !address || !isConnected) {
      setClaimStatus('error');
      setErrorMessage('Please connect your wallet');
      return;
    }

    if (!canClaim) {
      setClaimStatus('error');
      setErrorMessage('Not enough points to claim');
      return;
    }

    setIsClaiming(true);
    setClaimStatus('idle');
    setErrorMessage('');
    setTxHash('');

    try {
      // Check network
      const isCorrectNetwork = await checkNetwork(provider);
      if (!isCorrectNetwork) {
        const switched = await switchToPolygonAmoy(provider);
        if (!switched) {
          throw new Error('Please switch to Polygon Amoy network');
        }
      }

      // Get signer
      const signer = await getEthersSigner(provider);

      // Claim tokens
      const result = await claimTokenReward(signer, claimableTokens, address);

      if (result.success) {
        setClaimStatus('success');
        setTxHash(result.transactionHash || '');
        
        // Record claim in game store
        recordTokenClaim(claimableTokens, result.transactionHash);
        
        // Reload balance
        await loadTokenBalance();
      } else {
        setClaimStatus('error');
        setErrorMessage(result.error || 'Transaction failed');
      }
    } catch (error: any) {
      console.error('Claim error:', error);
      setClaimStatus('error');
      setErrorMessage(error.message || 'Failed to claim tokens');
    } finally {
      setIsClaiming(false);
    }
  };

  // Reset status on close
  const handleClose = () => {
    setClaimStatus('idle');
    setErrorMessage('');
    setTxHash('');
    onClose();
  };

  return (
    <GameModal
      open={open}
      onClose={handleClose}
      title="Claim Mining Rewards"
      icon={
        <Image
          src="/images/icons/mimig-token.png"
          alt="ALMAN Token"
          width={32}
          height={32}
        />
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: isLandscape ? 1.5 : 2 }}>
        
        {/* Token Balance */}
        <Box
          sx={{
            p: isLandscape ? 1.5 : 2,
            bgcolor: 'rgba(76, 175, 80, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(76, 175, 80, 0.3)',
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'rgba(255,255,255,0.7)' }}>
            Your ALMAN Balance
          </Typography>
          <Typography variant={isLandscape ? 'h6' : 'h5'} color="primary" sx={{ fontWeight: 'bold' }}>
            {tokenBalance} ALMAN
          </Typography>
        </Box>

        {/* Mining Progress */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MiningIcon sx={{ fontSize: isLandscape ? 18 : 20, color: 'warning.main' }} />
              <Typography variant={isLandscape ? 'body2' : 'body1'} fontWeight="bold">
                Mining Pool
              </Typography>
            </Box>
            <Chip
              label={miningStats.currentEpoch?.label || 'Complete'}
              size="small"
              color={miningStats.isMiningComplete ? 'default' : 'warning'}
              sx={{ fontSize: isLandscape ? 10 : 11 }}
            />
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={miningStats.progress}
            sx={{
              height: isLandscape ? 6 : 8,
              borderRadius: 1,
              bgcolor: 'rgba(255, 152, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'warning.main',
              },
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {formatMiningProgress(miningStats.totalMined)} Mined
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {miningStats.remainingPool.toLocaleString()} / 10M Remaining
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Current Rate */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <RateIcon sx={{ fontSize: isLandscape ? 20 : 24, color: 'info.main' }} />
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Current Conversion Rate
            </Typography>
            <Typography variant={isLandscape ? 'body2' : 'body1'} fontWeight="bold" sx={{ color: 'white' }}>
              {formatConversionRate(currentRate)}
            </Typography>
          </Box>
        </Box>

        {/* Next Halving Info */}
        {miningStats.tokensUntilHalving !== null && (
          <Alert severity="info" sx={{ py: isLandscape ? 0.5 : 1 }}>
            <Typography variant="caption">
              Next halving in {miningStats.tokensUntilHalving.toLocaleString()} tokens
            </Typography>
          </Alert>
        )}

        <Divider />

        {/* Claimable Tokens */}
        <Box
          sx={{
            p: isLandscape ? 1.5 : 2,
            bgcolor: 'rgba(33, 150, 243, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(33, 150, 243, 0.3)',
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'rgba(255,255,255,0.7)' }}>
            You Can Claim
          </Typography>
          <Typography variant={isLandscape ? 'h5' : 'h4'} color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
            {formatTokenAmount(claimableTokens, 4)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            From {formatGamePoints(totalPoints)} game points
          </Typography>
        </Box>

        {/* Status Messages */}
        {claimStatus === 'success' && (
          <Alert severity="success" icon={<SuccessIcon />}>
            <Typography variant={isLandscape ? 'caption' : 'body2'}>
              Successfully claimed {formatTokenAmount(claimableTokens, 2)}!
            </Typography>
            {txHash && (
              <Typography
                variant="caption"
                component="a"
                href={getTxExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'block', mt: 0.5, color: 'primary.main', textDecoration: 'underline' }}
              >
                View Transaction
              </Typography>
            )}
          </Alert>
        )}

        {claimStatus === 'error' && (
          <Alert severity="error" icon={<ErrorIcon />}>
            <Typography variant={isLandscape ? 'caption' : 'body2'}>
              {errorMessage}
            </Typography>
          </Alert>
        )}

        {!isConnected && (
          <Alert severity="warning">
            <Typography variant={isLandscape ? 'caption' : 'body2'}>
              Please connect your wallet to claim rewards
            </Typography>
          </Alert>
        )}

        {miningStats.isMiningComplete && (
          <Alert severity="info">
            <Typography variant={isLandscape ? 'caption' : 'body2'}>
              Mining pool exhausted. No more tokens can be mined.
            </Typography>
          </Alert>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: isLandscape ? 1 : 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClose}
            disabled={isClaiming}
            sx={{ 
              py: isLandscape ? 1 : 1.5,
              fontSize: isLandscape ? 14 : 16,
            }}
          >
            Close
          </Button>
          
          <Button
            fullWidth
            variant="contained"
            onClick={handleClaim}
            disabled={!canClaim || isClaiming || !isConnected || miningStats.isMiningComplete}
            startIcon={
              isClaiming ? (
                <CircularProgress size={20} />
              ) : (
                <Image
                  src="/images/icons/mimig-token.png"
                  alt="Token"
                  width={20}
                  height={20}
                />
              )
            }
            sx={{ 
              py: isLandscape ? 1 : 1.5,
              fontSize: isLandscape ? 14 : 16,
            }}
          >
            {isClaiming ? 'Claiming...' : 'Claim Tokens'}
          </Button>
        </Box>

        {/* Help Text */}
        {!canClaim && !miningStats.isMiningComplete && (
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Minimum 0.1 ALMAN required to claim
          </Typography>
        )}
      </Box>
    </GameModal>
  );
}
