import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Refresh,
  Cancel,
} from '@mui/icons-material';
import { useContracts } from '../../hooks/useContracts';
import { formatEther } from 'ethers';
import { getTxOptions } from '../../utils/gas';

// Listing types from contract
const ListingTypes = ['FixedPrice', 'Auction', 'Rental'];

interface Listing {
  id: number;
  seller: string;
  nftContract: string;
  tokenId: bigint;
  listingType: number;
  paymentToken: string;
  price: bigint;
  status: number; // 0=Active, 1=Sold, 2=Cancelled
  startTime: number;
  endTime: number;
}

// Status enum from contract
const ListingStatus = {
  Active: 0,
  Sold: 1,
  Cancelled: 2,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 2 }}>
    {value === index && children}
  </Box>
);

const MarketplaceManagement: React.FC = () => {
  const contracts = useContracts();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const fetchListings = async () => {
    if (!contracts) return;

    setLoading(true);
    try {
      const listingList: Listing[] = [];
      let consecutiveErrors = 0;
      let listingId = 1;

      // Iterate through listings starting from 1 until we hit consecutive errors
      while (consecutiveErrors < 5 && listingId <= 100) {
        try {
          const listing = await contracts.marketplace.getListing(listingId);

          // Check if this is a valid listing (listingId > 0 means it exists)
          if (Number(listing.listingId) === 0) {
            consecutiveErrors++;
            listingId++;
            continue;
          }

          consecutiveErrors = 0;
          listingList.push({
            id: Number(listing.listingId),
            seller: listing.seller,
            nftContract: listing.nftContract,
            tokenId: listing.tokenId,
            listingType: Number(listing.listingType),
            paymentToken: listing.paymentToken,
            price: listing.price,
            status: Number(listing.status),
            startTime: Number(listing.startTime),
            endTime: Number(listing.endTime),
          });
          listingId++;
        } catch (err) {
          consecutiveErrors++;
          listingId++;
        }
      }

      setListings(listingList);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [contracts]);

  const handleCancelListing = async (listingId: number) => {
    if (!contracts) return;

    try {
      const tx = await contracts.marketplace.cancelListing(listingId, getTxOptions('cancel'));
      await tx.wait();
      setSuccess('Listing cancelled!');
      fetchListings();
    } catch (err: any) {
      setError(err.reason || err.message || 'Failed to cancel listing');
    }
  };

  const activeListings = listings.filter((l) => l.status === ListingStatus.Active);
  const inactiveListings = listings.filter((l) => l.status !== ListingStatus.Active);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return '-';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const renderListingsTable = (items: Listing[]) => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>NFT</TableCell>
            <TableCell>Token ID</TableCell>
            <TableCell>Seller</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No listings found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            items.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>{listing.id}</TableCell>
                <TableCell>
                  <Chip
                    label={ListingTypes[listing.listingType] || 'Unknown'}
                    size="small"
                    color={
                      listing.listingType === 0
                        ? 'primary'
                        : listing.listingType === 1
                        ? 'secondary'
                        : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {formatAddress(listing.nftContract)}
                  </Typography>
                </TableCell>
                <TableCell>#{listing.tokenId.toString()}</TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {formatAddress(listing.seller)}
                  </Typography>
                </TableCell>
                <TableCell>{formatEther(listing.price)}</TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {formatDate(listing.endTime)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={listing.status === ListingStatus.Active ? 'Active' : listing.status === ListingStatus.Sold ? 'Sold' : 'Cancelled'}
                    size="small"
                    color={listing.status === ListingStatus.Active ? 'success' : listing.status === ListingStatus.Sold ? 'info' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  {listing.status === ListingStatus.Active && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleCancelListing(listing.id)}
                      title="Cancel Listing"
                    >
                      <Cancel fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Marketplace
        </Typography>
        <IconButton onClick={fetchListings} disabled={loading}>
          <Refresh />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          mb: 3,
        }}
      >
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color="primary">
            {listings.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Listings
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color="success.main">
            {activeListings.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700}>
            {activeListings.filter((l) => l.listingType === 1).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Auctions
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700}>
            {activeListings.filter((l) => l.listingType === 2).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rentals
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label={`Active (${activeListings.length})`} />
          <Tab label={`History (${inactiveListings.length})`} />
        </Tabs>

        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              {renderListingsTable(activeListings)}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {renderListingsTable(inactiveListings)}
            </TabPanel>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MarketplaceManagement;
