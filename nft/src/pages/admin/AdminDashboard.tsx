import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Token,
  Collections,
  Store,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { useContracts } from '../../hooks/useContracts';

interface Stats {
  totalNFTs721: number;
  totalNFTs1155: number;
  totalCollections: number;
  totalListings: number;
  platformBalance: string;
}

const AdminDashboard: React.FC = () => {
  const contracts = useContracts();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!contracts) {
        setLoading(false);
        return;
      }

      try {
        // Fetch various stats from contracts
        const [
          totalNFTs721,
          totalNFTs1155,
          totalCollections,
        ] = await Promise.all([
          contracts.nft721.totalSupply().catch(() => 0n),
          contracts.nft1155.currentTokenId().catch(() => 0n),
          contracts.collectionManager.collectionCount().catch(() => 0n),
        ]);

        // Count active listings by iterating through getListing
        let activeListingCount = 0;
        let consecutiveErrors = 0;
        let listingId = 1;

        while (consecutiveErrors < 5) {
          try {
            const listing = await contracts.marketplace.getListing(listingId);
            if (Number(listing.listingId) === 0) {
              consecutiveErrors++;
            } else {
              consecutiveErrors = 0;
              // Status 0 = Active
              if (Number(listing.status) === 0) {
                activeListingCount++;
              }
            }
            listingId++;
          } catch {
            consecutiveErrors++;
            listingId++;
          }
        }

        setStats({
          totalNFTs721: Number(totalNFTs721),
          totalNFTs1155: Number(totalNFTs1155),
          totalCollections: Number(totalCollections),
          totalListings: activeListingCount,
          platformBalance: '0',
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [contracts]);

  const statCards = [
    {
      label: 'ERC-721 NFTs',
      value: stats?.totalNFTs721 || 0,
      icon: <Token sx={{ fontSize: 40 }} />,
      color: '#1A5E5E',  // Deep Teal
    },
    {
      label: 'ERC-1155 NFTs',
      value: stats?.totalNFTs1155 || 0,
      icon: <Token sx={{ fontSize: 40 }} />,
      color: '#4AA8A8',  // Medium Teal
    },
    {
      label: 'Collections',
      value: stats?.totalCollections || 0,
      icon: <Collections sx={{ fontSize: 40 }} />,
      color: '#C9A227',  // Gold
    },
    {
      label: 'Active Listings',
      value: stats?.totalListings || 0,
      icon: <Store sx={{ fontSize: 40 }} />,
      color: '#E8C547',  // Light Gold
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Stats Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
              mb: 4,
            }}
          >
            {statCards.map((stat) => (
              <Paper
                key={stat.label}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${stat.color}20`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              <Paper
                component="a"
                href="/admin/mint"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Token sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography fontWeight={600}>Mint New NFT</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create ERC-721 or ERC-1155
                </Typography>
              </Paper>

              <Paper
                component="a"
                href="/admin/collections"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Collections sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                <Typography fontWeight={600}>Create Collection</Typography>
                <Typography variant="body2" color="text.secondary">
                  Organize your NFTs
                </Typography>
              </Paper>

              <Paper
                component="a"
                href="/admin/payments"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <AccountBalanceWallet sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography fontWeight={600}>Manage Payments</Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure payment tokens
                </Typography>
              </Paper>
            </Box>
          </Paper>

          {/* Contract Addresses */}
          <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Deployed Contracts
            </Typography>
            <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ width: 180, fontWeight: 600 }}>AlmaNFT721</Typography>
                <Typography color="text.secondary">0xbFbE2b1eDB0f7F0675D5E449E508adE3697B8dfa</Typography>
              </Box>
              <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ width: 180, fontWeight: 600 }}>AlmaNFT1155</Typography>
                <Typography color="text.secondary">0x50FC5Ecaa9517CCD24b86874b0E87ab6225E9cfF</Typography>
              </Box>
              <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ width: 180, fontWeight: 600 }}>AlmaCollectionManager</Typography>
                <Typography color="text.secondary">0x1Ad2176A1181CFF2d82289f5cc5d143d9B3AFE1D</Typography>
              </Box>
              <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ width: 180, fontWeight: 600 }}>AlmaPaymentManager</Typography>
                <Typography color="text.secondary">0x2410Fa2958f2966DB85eF98aCbA4b9e360257E4e</Typography>
              </Box>
              <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ width: 180, fontWeight: 600 }}>AlmaMarketplace</Typography>
                <Typography color="text.secondary">0x27EDe449fF2367aB00B5b04A1A1BcCdE03F8E76b</Typography>
              </Box>
              <Box sx={{ display: 'flex', py: 1 }}>
                <Typography sx={{ width: 180, fontWeight: 600 }}>TrustedForwarder</Typography>
                <Typography color="text.secondary">0xd240234dacd7ffdca7e4effcf6c7190885d7e2f0</Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;
