import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  AccountBalanceWallet,
  Store,
  Collections,
  Gavel,
  Home,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useWeb3 } from '../../contexts/Web3Context';
import { CHAIN_CONFIG } from '../../contracts/addresses';
import { WalletModal } from '../wallet/WalletModal';
import '../wallet/wallet.css';

const Header: React.FC = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();
  const { isConnected, address, balance, chainId, connect, isConnecting, userInfo, isLoading } = useWeb3();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isWrongNetwork = chainId !== null && chainId !== CHAIN_CONFIG.chainId;

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Explore', path: '/explore', icon: <Store /> },
    { label: 'Collections', path: '/collections', icon: <Collections /> },
    { label: 'Auctions', path: '/auctions', icon: <Gavel /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              mr: 4,
            }}
          >
            AlmaNEO NFT
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color={isActive(item.path) ? 'primary' : 'inherit'}
                  sx={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    borderBottom: isActive(item.path) ? 2 : 0,
                    borderColor: 'primary.main',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {isConnected && address ? (
              <>
                {isWrongNetwork && (
                  <Chip
                    label="Wrong Network"
                    color="error"
                    size="small"
                  />
                )}
                <Chip
                  label={`${parseFloat(balance).toFixed(3)} POL`}
                  size="small"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                />
                <Button
                  variant="outlined"
                  startIcon={userInfo?.profileImage ? (
                    <img
                      src={userInfo.profileImage}
                      alt="profile"
                      style={{ width: 24, height: 24, borderRadius: '50%' }}
                    />
                  ) : (
                    <AccountBalanceWallet />
                  )}
                  onClick={() => setWalletModalOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  {userInfo?.name || truncateAddress(address)}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<AccountBalanceWallet />}
                onClick={connect}
                disabled={isConnecting || isLoading}
              >
                {isLoading ? 'Loading...' : isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 2 }}>
            AlmaNEO NFT
          </Typography>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  bgcolor: isActive(item.path) ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Wallet Modal */}
      <WalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        enabledFeatures={{
          tokens: true,
          nft: true,
          game: true,
          staking: true,
          governance: true,
        }}
      />
    </>
  );
};

export default Header;
