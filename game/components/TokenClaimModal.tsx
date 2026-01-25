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
          src="/images/icons/alman-token.png"
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
            bgcolor: 'rgba(0, 82, 255, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(0, 82, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(0, 82, 255, 0.1), transparent)',
              animation: 'shimmer 3s infinite',
            },
            '@keyframes shimmer': {
              '100%': { left: '100%' },
            },
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'rgba(255,255,255,0.7)' }}>
            Wallet Assets
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant={isLandscape ? 'h6' : 'h5'} color="primary" sx={{ fontWeight: 'bold' }}>
              {tokenBalance}
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.light', fontWeight: 'bold' }}>
              ALMAN
            </Typography>
          </Box>
        </Box>

        {/* Mining Progress */}
        <Box sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'rgba(255, 107, 0, 0.05)',
          border: '1px solid rgba(255, 107, 0, 0.2)',
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                }
              }}>
                <MiningIcon sx={{ fontSize: isLandscape ? 18 : 20, color: '#FF6B00' }} />
              </Box>
              <Typography variant={isLandscape ? 'body2' : 'body1'} fontWeight="bold" sx={{ color: '#FF6B00' }}>
                Global Mining Pool
              </Typography>
            </Box>
            <Chip
              label={miningStats.currentEpoch?.label || 'Complete'}
              size="small"
              sx={{
                fontSize: isLandscape ? 10 : 11,
                bgcolor: 'rgba(255, 107, 0, 0.2)',
                color: '#FF6B00',
                border: '1px solid rgba(255, 107, 0, 0.3)',
                fontWeight: 'bold'
              }}
            />
          </Box>

          <Box sx={{ position: 'relative', mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={miningStats.progress}
              sx={{
                height: isLandscape ? 8 : 12,
                borderRadius: 1,
                bgcolor: 'rgba(255, 107, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#FF6B00',
                  backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                  backgroundSize: '1rem 1rem',
                  animation: 'progress-bar-stripes 1s linear infinite',
                },
                '@keyframes progress-bar-stripes': {
                  'from': { backgroundPosition: '1rem 0' },
                  'to': { backgroundPosition: '0 0' },
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                Mined
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {formatMiningProgress(miningStats.totalMined)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                Pool Capacity
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                10,000,000
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Current Rate & Halving */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.03)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <RateIcon sx={{ fontSize: 20, color: 'info.main' }} />
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                Labeling Hashrate
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>
                {formatConversionRate(currentRate)}
              </Typography>
            </Box>
          </Box>

          {miningStats.tokensUntilHalving !== null && (
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                Next Epoch In
              </Typography>
              <Typography variant="body2" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                {miningStats.tokensUntilHalving.toLocaleString()} ALMAN
              </Typography>
            </Box>
          )}
        </Box>

        {/* Claimable Area */}
        <Box
          sx={{
            mt: 1,
            p: 3,
            bgcolor: 'rgba(0, 82, 255, 0.1)',
            borderRadius: 3,
            border: '2px solid rgba(0, 82, 255, 0.3)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(0, 82, 255, 0.15) 0%, transparent 70%)',
            }
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, fontWeight: 'bold' }}>
            READY TO CLAIM
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
            <Typography variant={isLandscape ? 'h4' : 'h3'} color="primary" sx={{ fontWeight: 'black', textShadow: '0 0 20px rgba(0, 82, 255, 0.5)' }}>
              {formatTokenAmount(claimableTokens, 4)}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', opacity: 0.8 }}>
              ALMAN
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            Accumulated from {formatGamePoints(totalPoints)} points
          </Typography>

          {isClaiming && (
            <Box sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 10,
            }}>
              <CircularProgress size={40} thickness={2} sx={{ mb: 2 }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: 1 }}>
                MINING TRANSACTION...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Status Messages */}
        {claimStatus === 'success' && (
          <Alert severity="success" variant="filled" icon={<SuccessIcon />}>
            <Typography variant="body2" fontWeight="bold">
              Tokens Successfully Mined!
            </Typography>
            {txHash && (
              <Typography
                variant="caption"
                component="a"
                href={getTxExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'block', mt: 0.5, color: 'inherit', textDecoration: 'underline' }}
              >
                View on Explorer
              </Typography>
            )}
          </Alert>
        )}

        {claimStatus === 'error' && (
          <Alert severity="error" variant="outlined" icon={<ErrorIcon />}>
            <Typography variant="body2">
              {errorMessage}
            </Typography>
          </Alert>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClose}
            disabled={isClaiming}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            Later
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleClaim}
            disabled={!canClaim || isClaiming || !isConnected || miningStats.isMiningComplete}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              boxShadow: '0 4px 14px 0 rgba(0, 82, 255, 0.39)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0, 82, 255, 0.23)',
              }
            }}
          >
            {isClaiming ? 'Mining...' : 'Claim Tokens'}
          </Button>
        </Box>

        {/* Network Status */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isConnected ? '#4caf50' : '#f44336' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not Connected'}
          </Typography>
        </Box>
      </Box>
    </GameModal>
  );
}
