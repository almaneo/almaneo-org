import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Search, GridView, ViewList, LocalOffer, Collections } from '@mui/icons-material';
import NFTCard from '../components/nft/NFTCard';
import { useContracts } from '../hooks/useContracts';
import type { Listing, NFTMetadata, RentalListing } from '../types';
import { ListingStatus, ListingType, RentalStatus } from '../types';
import { Home } from '@mui/icons-material';
import { CONTRACTS } from '../contracts/addresses';
import { ipfsToHttp } from '../utils/ipfs';

interface NFTItem {
  tokenId: string;
  contractAddress: string;
  contractType: 'ERC721' | 'ERC1155';
  metadata: NFTMetadata;
  listing?: Listing; // Active listing if exists
}

interface ListingWithMetadata extends Listing {
  metadata?: NFTMetadata;
}

interface RentalListingWithMetadata extends RentalListing {
  metadata?: NFTMetadata;
}

const Explore: React.FC = () => {
  const contracts = useContracts();
  const [tabValue, setTabValue] = useState(0); // 0: Listed, 1: Rentals, 2: All NFTs
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<ListingWithMetadata[]>([]);
  const [rentalListings, setRentalListings] = useState<RentalListingWithMetadata[]>([]);
  const [allNFTs, setAllNFTs] = useState<NFTItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12;

  const sortOptions = [
    { value: 'recent', label: 'Recently Listed' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'ending_soon', label: 'Ending Soon' },
  ];

  const fetchMetadata = async (tokenUri: string): Promise<NFTMetadata> => {
    try {
      if (tokenUri.startsWith('data:')) {
        const base64 = tokenUri.split(',')[1];
        return JSON.parse(atob(base64));
      }

      const httpUrl = ipfsToHttp(tokenUri);
      const response = await fetch(httpUrl);

      if (!response.ok) throw new Error('Failed to fetch metadata');
      const data = await response.json();

      return {
        name: data.name || 'Unknown NFT',
        description: data.description || '',
        image: ipfsToHttp(data.image || ''),
        attributes: data.attributes,
      };
    } catch {
      return {
        name: 'Unknown NFT',
        description: '',
        image: '',
      };
    }
  };

  const fetchListings = useCallback(async () => {
    if (!contracts) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedListings: ListingWithMetadata[] = [];
      let consecutiveErrors = 0;
      const maxConsecutiveErrors = 5;
      let listingId = 1;

      // Iterate through listings starting from 1 until we hit consecutive errors
      while (consecutiveErrors < maxConsecutiveErrors) {
        try {
          const listingData = await contracts.marketplace.getListing(listingId);

          // Check if this is a valid listing (listingId > 0 means it exists)
          if (Number(listingData.listingId) === 0) {
            consecutiveErrors++;
            listingId++;
            continue;
          }

          consecutiveErrors = 0; // Reset on successful fetch

          // Only show active listings
          if (Number(listingData.status) === ListingStatus.Active) {
            const listing: ListingWithMetadata = {
              listingId: Number(listingData.listingId),
              nftContract: listingData.nftContract,
              tokenId: listingData.tokenId.toString(),
              amount: Number(listingData.amount),
              nftType: listingData.nftType === 0 ? 'ERC721' : 'ERC1155',
              seller: listingData.seller,
              paymentToken: listingData.paymentToken,
              price: listingData.price.toString(),
              startTime: Number(listingData.startTime),
              endTime: Number(listingData.endTime),
              listingType: Number(listingData.listingType) as ListingType,
              status: Number(listingData.status) as ListingStatus,
            };

            // Fetch metadata
            const is1155 = listingData.nftContract.toLowerCase() === CONTRACTS.AlmaNFT1155.toLowerCase();
            const nftContract = is1155 ? contracts.nft1155 : contracts.nft721;

            try {
              const tokenUri = is1155
                ? await nftContract.uri(listingData.tokenId)
                : await nftContract.tokenURI(listingData.tokenId);

              listing.metadata = await fetchMetadata(tokenUri);
            } catch {
              listing.metadata = {
                name: `NFT #${listing.tokenId}`,
                description: '',
                image: '',
              };
            }

            fetchedListings.push(listing);
          }

          listingId++;
        } catch (err) {
          // getListing might throw for non-existent listings
          consecutiveErrors++;
          listingId++;
        }
      }

      // Sort by most recent first (highest listingId first)
      fetchedListings.sort((a, b) => b.listingId - a.listingId);

      setListings(fetchedListings);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load marketplace listings');
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  const fetchRentalListings = useCallback(async () => {
    if (!contracts) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedRentals: RentalListingWithMetadata[] = [];
      let consecutiveErrors = 0;
      const maxConsecutiveErrors = 5;
      let rentalId = 1;

      while (consecutiveErrors < maxConsecutiveErrors) {
        try {
          const rentalData = await contracts.marketplace.getRentalListing(rentalId);

          if (Number(rentalData.rentalId) === 0) {
            consecutiveErrors++;
            rentalId++;
            continue;
          }

          consecutiveErrors = 0;

          // Only show listed rentals
          if (Number(rentalData.status) === RentalStatus.Listed) {
            const rental: RentalListingWithMetadata = {
              rentalId: Number(rentalData.rentalId),
              nftContract: rentalData.nftContract,
              tokenId: rentalData.tokenId.toString(),
              amount: Number(rentalData.amount),
              nftType: Number(rentalData.nftType) === 0 ? 'ERC721' : 'ERC1155',
              owner: rentalData.owner,
              paymentToken: rentalData.paymentToken,
              pricePerDay: rentalData.pricePerDay.toString(),
              minDuration: Number(rentalData.minDuration),
              maxDuration: Number(rentalData.maxDuration),
              status: Number(rentalData.status) as RentalStatus,
            };

            // Fetch metadata
            const is1155 = rentalData.nftContract.toLowerCase() === CONTRACTS.AlmaNFT1155.toLowerCase();
            const nftContract = is1155 ? contracts.nft1155 : contracts.nft721;

            try {
              const tokenUri = is1155
                ? await nftContract.uri(rentalData.tokenId)
                : await nftContract.tokenURI(rentalData.tokenId);

              rental.metadata = await fetchMetadata(tokenUri);
            } catch {
              rental.metadata = {
                name: `NFT #${rental.tokenId}`,
                description: '',
                image: '',
              };
            }

            fetchedRentals.push(rental);
          }

          rentalId++;
        } catch (err) {
          consecutiveErrors++;
          rentalId++;
        }
      }

      fetchedRentals.sort((a, b) => b.rentalId - a.rentalId);
      setRentalListings(fetchedRentals);
    } catch (err) {
      console.error('Error fetching rental listings:', err);
      setError('Failed to load rental listings');
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  // Helper function to check if NFT has active listing
  const checkActiveListing = async (contractAddress: string, tokenId: string): Promise<Listing | undefined> => {
    if (!contracts) return undefined;
    try {
      const listingId = await contracts.marketplace.getActiveListingForNFT(contractAddress, tokenId);
      if (listingId && Number(listingId) > 0) {
        const listingData = await contracts.marketplace.getListing(listingId);
        if (Number(listingData.status) === ListingStatus.Active) {
          return {
            listingId: Number(listingData.listingId),
            nftContract: listingData.nftContract,
            tokenId: listingData.tokenId.toString(),
            amount: Number(listingData.amount),
            nftType: listingData.nftType === 0 ? 'ERC721' : 'ERC1155',
            seller: listingData.seller,
            paymentToken: listingData.paymentToken,
            price: listingData.price.toString(),
            startTime: Number(listingData.startTime),
            endTime: Number(listingData.endTime),
            listingType: Number(listingData.listingType) as ListingType,
            status: Number(listingData.status) as ListingStatus,
          };
        }
      }
    } catch {
      // No active listing
    }
    return undefined;
  };

  // Fetch all NFTs (not just listed ones)
  const fetchAllNFTs = useCallback(async () => {
    if (!contracts) return;

    setLoading(true);
    setError(null);

    try {
      const nfts: NFTItem[] = [];

      // Fetch ERC-721 NFTs
      try {
        // Get total supply or iterate through token IDs
        let tokenId = 1;
        let consecutiveErrors = 0;
        const maxErrors = 5;

        while (consecutiveErrors < maxErrors) {
          try {
            // Check if token exists by trying to get its owner
            await contracts.nft721.ownerOf(tokenId);

            // Token exists, fetch metadata
            const tokenUri = await contracts.nft721.tokenURI(tokenId);
            const metadata = await fetchMetadata(tokenUri);

            // Check if NFT has active listing
            const listing = await checkActiveListing(CONTRACTS.AlmaNFT721, tokenId.toString());

            nfts.push({
              tokenId: tokenId.toString(),
              contractAddress: CONTRACTS.AlmaNFT721,
              contractType: 'ERC721',
              metadata,
              listing,
            });

            consecutiveErrors = 0;
          } catch {
            consecutiveErrors++;
          }
          tokenId++;
        }
      } catch (err) {
        console.error('Error fetching ERC-721 NFTs:', err);
      }

      // Fetch ERC-1155 NFTs
      try {
        const currentTokenId = await contracts.nft1155.currentTokenId();
        const totalTokens = Number(currentTokenId);

        for (let tokenId = 1; tokenId <= totalTokens; tokenId++) {
          try {
            const tokenUri = await contracts.nft1155.uri(tokenId);
            const metadata = await fetchMetadata(tokenUri);

            // Check if NFT has active listing
            const listing = await checkActiveListing(CONTRACTS.AlmaNFT1155, tokenId.toString());

            nfts.push({
              tokenId: tokenId.toString(),
              contractAddress: CONTRACTS.AlmaNFT1155,
              contractType: 'ERC1155',
              metadata,
              listing,
            });
          } catch (err) {
            console.error(`Error fetching ERC-1155 token ${tokenId}:`, err);
          }
        }
      } catch (err) {
        console.error('Error fetching ERC-1155 NFTs:', err);
      }

      setAllNFTs(nfts);
    } catch (err) {
      console.error('Error fetching all NFTs:', err);
      setError('Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  useEffect(() => {
    if (tabValue === 0) {
      fetchListings();
    } else if (tabValue === 1) {
      fetchRentalListings();
    } else {
      fetchAllNFTs();
    }
  }, [tabValue, fetchListings, fetchRentalListings, fetchAllNFTs]);

  // Filter and sort listings
  const filteredListings = listings
    .filter((listing) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        listing.metadata?.name?.toLowerCase().includes(query) ||
        listing.metadata?.description?.toLowerCase().includes(query) ||
        listing.tokenId.includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return Number(a.price) - Number(b.price);
        case 'price_high':
          return Number(b.price) - Number(a.price);
        case 'ending_soon':
          return a.endTime - b.endTime;
        case 'recent':
        default:
          return b.startTime - a.startTime;
      }
    });

  // Filter rental listings
  const filteredRentalListings = rentalListings
    .filter((rental) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        rental.metadata?.name?.toLowerCase().includes(query) ||
        rental.metadata?.description?.toLowerCase().includes(query) ||
        rental.tokenId.includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return Number(a.pricePerDay) - Number(b.pricePerDay);
        case 'price_high':
          return Number(b.pricePerDay) - Number(a.pricePerDay);
        case 'recent':
        default:
          return b.rentalId - a.rentalId;
      }
    });

  // Filter all NFTs
  const filteredAllNFTs = allNFTs.filter((nft) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      nft.metadata?.name?.toLowerCase().includes(query) ||
      nft.metadata?.description?.toLowerCase().includes(query) ||
      nft.tokenId.includes(query)
    );
  });

  // Pagination - use the appropriate data based on tab
  const getCurrentData = () => {
    if (tabValue === 0) return filteredListings;
    if (tabValue === 1) return filteredRentalListings;
    return filteredAllNFTs;
  };
  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const paginatedRentals = filteredRentalListings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const paginatedNFTs = filteredAllNFTs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Reset page when tab changes
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Explore NFTs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover unique digital assets on AlmaNEO Marketplace
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<LocalOffer />}
            iconPosition="start"
            label={`For Sale (${listings.length})`}
          />
          <Tab
            icon={<Home />}
            iconPosition="start"
            label={`For Rent (${rentalListings.length})`}
          />
          <Tab
            icon={<Collections />}
            iconPosition="start"
            label={`All NFTs (${allNFTs.length})`}
          />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: (tabValue === 0 || tabValue === 1) ? '2fr 1fr auto' : '2fr auto' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search NFTs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            size="small"
          />
          {(tabValue === 0 || tabValue === 1) && (
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions
                  .filter(opt => tabValue === 1 ? opt.value !== 'ending_soon' : true)
                  .map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="grid">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {searchQuery && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Active Filters:
          </Typography>
          <Chip
            label={`"${searchQuery}"`}
            onDelete={() => setSearchQuery('')}
            size="small"
          />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {tabValue === 0 ? 'Loading marketplace listings...' : tabValue === 1 ? 'Loading rental listings...' : 'Loading all NFTs...'}
          </Typography>
        </Box>
      ) : tabValue === 0 ? (
        // For Sale Tab
        filteredListings.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No NFTs For Sale
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? 'No NFTs match your search criteria'
                : 'There are currently no NFTs listed for sale. Be the first to list!'}
            </Typography>
          </Paper>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredListings.length} NFT{filteredListings.length !== 1 ? 's' : ''} for sale
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: viewMode === 'grid' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {paginatedListings.map((listing) => (
                <NFTCard
                  key={listing.listingId}
                  listing={listing}
                  metadata={listing.metadata}
                />
              ))}
            </Box>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )
      ) : tabValue === 1 ? (
        // For Rent Tab
        filteredRentalListings.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No NFTs For Rent
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? 'No NFTs match your search criteria'
                : 'There are currently no NFTs available for rent.'}
            </Typography>
          </Paper>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredRentalListings.length} NFT{filteredRentalListings.length !== 1 ? 's' : ''} for rent
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: viewMode === 'grid' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {paginatedRentals.map((rental) => (
                <NFTCard
                  key={`rental-${rental.rentalId}`}
                  tokenId={rental.tokenId}
                  contractAddress={rental.nftContract}
                  metadata={rental.metadata}
                  contractType={rental.nftType}
                  rentalListing={rental}
                />
              ))}
            </Box>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )
      ) : (
        // All NFTs Tab
        filteredAllNFTs.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No NFTs Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? 'No NFTs match your search criteria'
                : 'No NFTs have been minted yet.'}
            </Typography>
          </Paper>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredAllNFTs.length} NFT{filteredAllNFTs.length !== 1 ? 's' : ''} found
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: viewMode === 'grid' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {paginatedNFTs.map((nft) => (
                <NFTCard
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  tokenId={nft.tokenId}
                  contractAddress={nft.contractAddress}
                  metadata={nft.metadata}
                  contractType={nft.contractType}
                  listing={nft.listing}
                />
              ))}
            </Box>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )
      )}
    </Container>
  );
};

export default Explore;
