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
          bgcolor: '#0052FF',
          color: '#FFF',
          fontSize: '0.7rem',
          padding: '4px 12px',
          borderRadius: '8px',
          minWidth: 'auto',
          fontWeight: 600,
          border: '1px solid rgba(0,82,255,0.3)',
        }}
      >
        ...
      </Button>
    );
  }

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={<AccountBalanceWalletIcon sx={{ fontSize: '0.9rem !important' }} />}
        sx={{
          bgcolor: isConnected ? 'rgba(26,31,46,0.9)' : '#0052FF',
          color: '#FFF',
          fontSize: '0.7rem',
          padding: '4px 12px',
          borderRadius: '8px',
          minWidth: 'auto',
          fontWeight: 600,
          border: isConnected ? '1px solid #2d3748' : '1px solid rgba(0,82,255,0.3)',
          boxShadow: 'none',
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: isConnected ? 'rgba(37,43,61,0.95)' : '#0047e0',
            borderColor: isConnected ? '#0052FF' : 'rgba(0,82,255,0.5)',
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'scale(0.97)',
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
            bgcolor: 'rgba(26,31,46,0.98)',
            border: '1px solid #2d3748',
            borderRadius: 2,
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            mt: 1,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={handleCopy}
          sx={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.8rem',
            py: 1.2,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(0,82,255,0.1)',
              color: '#FFF',
            },
          }}
        >
          <ContentCopyIcon sx={{ mr: 1.5, fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)' }} />
          <Typography sx={{ color: 'inherit', fontSize: '0.8rem', fontWeight: 500 }}>
            {copySuccess ? '✓ Copied!' : 'Copy Address'}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handleDisconnect}
          sx={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.8rem',
            py: 1.2,
            px: 2,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            '&:hover': {
              bgcolor: 'rgba(248,113,113,0.1)',
              color: '#f87171',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)' }} />
          <Typography sx={{ color: 'inherit', fontSize: '0.8rem', fontWeight: 500 }}>
            Disconnect
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
