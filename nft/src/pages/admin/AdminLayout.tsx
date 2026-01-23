import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import {
  Dashboard,
  AddPhotoAlternate,
  Collections,
  Payment,
  Settings,
  Store,
  Home,
  ViewCarousel,
} from '@mui/icons-material';
import { useAdmin } from '../../hooks/useAdmin';
import { useWeb3 } from '../../contexts/Web3Context';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/admin/mint', label: 'Mint NFT', icon: <AddPhotoAlternate /> },
  { path: '/admin/collections', label: 'Collections', icon: <Collections /> },
  { path: '/admin/payments', label: 'Payment Tokens', icon: <Payment /> },
  { path: '/admin/marketplace', label: 'Marketplace', icon: <Store /> },
  { path: '/admin/hero', label: 'Hero Section', icon: <ViewCarousel /> },
  { path: '/admin/settings', label: 'Settings', icon: <Settings /> },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { isAdmin, hasOperatorRole, loading, isConnected, address, adminAddress } = useAdmin();
  const { connect } = useWeb3();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Checking admin status...</Typography>
      </Container>
    );
  }

  if (!isConnected) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Admin Panel
          </Typography>
          <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
            Please connect your wallet to access the admin panel.
          </Alert>
          <Button variant="contained" size="large" onClick={connect}>
            Connect Wallet
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Access Denied
          </Typography>
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Your wallet is not authorized to access the admin panel.
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
              Connected: {address}
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
              Required: {adminAddress}
            </Typography>
          </Alert>
          <Button
            variant="outlined"
            startIcon={<Home />}
            component={Link}
            to="/"
          >
            Go to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Sidebar */}
        <Paper
          sx={{
            width: 280,
            flexShrink: 0,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" fontWeight={700}>
              Admin Panel
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
              NFT Marketplace Management
            </Typography>
          </Box>

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Admin"
                size="small"
                color="success"
              />
              {hasOperatorRole && (
                <Chip
                  label="Operator"
                  size="small"
                  color="primary"
                />
              )}
            </Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                fontFamily: 'monospace',
                color: 'text.secondary',
              }}
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Typography>
          </Box>

          <Divider />

          <List sx={{ px: 1 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'inherit',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Home />}
              component={Link}
              to="/"
              size="small"
            >
              Back to Site
            </Button>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
};

export default AdminLayout;
