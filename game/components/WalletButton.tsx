'use client';

import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useWeb3Auth } from '@/contexts/Web3AuthProvider';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';

export default function WalletButton() {
  const { address, isConnected, isLoading, login, logout } = useWeb3Auth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isConnected) {
      setAnchorEl(event.currentTarget);
    } else {
      login();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleDisconnect = async () => {
    handleClose();
    await logout();
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <Button
        variant="contained"
        disabled
        sx={{
          border: '3px solid #FFF',
          bgcolor: 'rgba(76, 175, 80, 0.9)',
          color: '#FFF',
          fontSize: '0.75rem',
          padding: '6px 16px',
          borderRadius: '50px',
          minWidth: 'auto',
          fontWeight: 600,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}
      >
        Loading...
      </Button>
    );
  }

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={<AccountBalanceWalletIcon sx={{ fontSize: '1.1rem' }} />}
        sx={{
          border: '3px solid #FFF',
          bgcolor: isConnected ? 'rgba(76, 175, 80, 0.9)' : 'rgba(33, 150, 243, 0.9)',
          color: '#FFF',
          fontSize: '0.75rem',
          padding: '6px 16px',
          borderRadius: '50px',
          minWidth: 'auto',
          fontWeight: 600,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            border: '3px solid #FFF',
            bgcolor: isConnected ? 'rgba(76, 175, 80, 1)' : 'rgba(33, 150, 243, 1)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        {isConnected && address ? formatAddress(address) : 'Connect'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: 'rgba(20, 15, 10, 0.95)',
            border: '2px solid #FFD700',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,215,0,0.2)',
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        <MenuItem 
          onClick={handleCopy}
          sx={{
            color: '#FFD700',
            fontSize: '0.875rem',
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(255, 215, 0, 0.1)',
              color: '#FFF',
            },
          }}
        >
          <ContentCopyIcon sx={{ mr: 1.5, fontSize: '1.1rem', color: '#FFD700' }} />
          <Typography sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500 }}>
            {copySuccess ? '✓ Copied!' : 'Copy Address'}
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleDisconnect}
          sx={{
            color: '#FFD700',
            fontSize: '0.875rem',
            py: 1.5,
            px: 2,
            borderTop: '1px solid rgba(255, 215, 0, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(255, 215, 0, 0.1)',
              color: '#FFF',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: '1.1rem', color: '#FFD700' }} />
          <Typography sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500 }}>
            Disconnect
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
