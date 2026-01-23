import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Skeleton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  Verified,
  OpenInNew,
  ContentCopy,
  Search,
  Image as ImageIcon,
  ShoppingCart,
  Gavel,
} from '@mui/icons-material';
import { useContracts } from '../hooks/useContracts';
import { ipfsToHttp } from '../utils/ipfs';
import { formatEther } from 'ethers';
import { CONTRACTS } from '../contracts/addresses';
import { Category, ListingType, ListingStatus } from '../types';

interface CollectionData {
  id: number;
  categoryId: number;
  name: string;
  symbol: string;
  description: string;
  imageUri: string;
  bannerUri: string;
  creator: string;
  nftContract: string;
  nftType: number; // 0 = ERC721, 1 = ERC1155
  royaltyBps: number;
  royaltyRecipient: string;
  active: boolean;
  verified: boolean;
  createdAt: number;
  totalItems: number;
  totalVolume: string;
}

interface NFTItem {
  tokenId: string;
  name: string;
  image: string;
  listingId?: number;
  price?: string;
  listingType?: ListingType;
}

const getCategoryLabel = (categoryId: number): string => {
  switch (categoryId) {
    case Category.Game:
      return 'Game';
    case Category.Membership:
      return 'Membership';
    case Category.RWA:
      return 'RWA';
    case Category.Art:
      return 'Art';
    default:
      return 'Other';
  }
};

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contracts = useContracts();

  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nftsLoading, setNftsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('tokenId');
  const hasFetched = useRef(false);

  const fetchCollection = useCallback(async () => {
    if (!contracts || !id) return;

    setLoading(true);
    setError(null);

    try {
      const col = await contracts.collectionManager.getCollection(id);

      setCollection({
        id: Number(col.id),
        categoryId: Number(col.categoryId),
        name: col.name,
        symbol: col.symbol,
        description: col.description,
        imageUri: ipfsToHttp(col.imageUri || ''),
        bannerUri: ipfsToHttp(col.bannerUri || ''),
        creator: col.creator,
        nftContract: col.nftContract,
        nftType: Number(col.nftType),
        royaltyBps: Number(col.royaltyBps),
        royaltyRecipient: col.royaltyRecipient,
        active: col.active,
        verified: col.verified,
        createdAt: Number(col.createdAt),
        totalItems: Number(col.totalItems),
        totalVolume: formatEther(col.totalVolume),
      });
    } catch (err: any) {
      console.error('Error fetching collection:', err);
      setError(err.message || 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  }, [contracts, id]);

  const fetchNFTs = useCallback(async () => {
    if (!contracts || !collection) return;

    setNftsLoading(true);

    try {
      const isERC721 = collection.nftContract.toLowerCase() === CONTRACTS.AlmaNFT721.toLowerCase();
      const isERC1155 = collection.nftContract.toLowerCase() === CONTRACTS.AlmaNFT1155.toLowerCase();

      if (!isERC721 && !isERC1155) {
        setNfts([]);
        setNftsLoading(false);
        return;
      }

      // Get total supply
      let totalSupply = 0;
      try {
        if (isERC721) {
          totalSupply = Number(await contracts.nft721.totalSupply());
        } else {
          totalSupply = Number(await contracts.nft1155.totalSupply());
        }
      } catch (e) {
        console.error('Error getting total supply:', e);
      }

      const items: NFTItem[] = [];
      const collectionId = collection.id;

      // Fetch NFT metadata - filter by collectionId
      for (let i = 1; i <= Math.min(totalSupply, 100); i++) {
        try {
          // Check if this token belongs to the current collection
          let tokenCollectionId = 0;
          try {
            if (isERC721) {
              tokenCollectionId = Number(await contracts.nft721.tokenCollection(i));
            } else {
              tokenCollectionId = Number(await contracts.nft1155.tokenCollection(i));
            }
          } catch (e) {
            // Token may not exist or doesn't have collection info
            continue;
          }

          // Skip if token doesn't belong to this collection
          if (tokenCollectionId !== collectionId) {
            continue;
          }

          let tokenURI = '';
          if (isERC721) {
            tokenURI = await contracts.nft721.tokenURI(i);
          } else {
            tokenURI = await contracts.nft1155.uri(i);
          }

          if (tokenURI) {
            const metadataUrl = ipfsToHttp(tokenURI);
            const response = await fetch(metadataUrl);
            const metadata = await response.json();

            // Check for active listing
            let listingInfo: { listingId?: number; price?: string; listingType?: ListingType } = {};
            try {
              const listingId = await contracts.marketplace.getActiveListingForNFT(
                collection.nftContract,
                i
              );
              if (listingId && Number(listingId) > 0) {
                const listing = await contracts.marketplace.getListing(listingId);
                if (Number(listing.status) === ListingStatus.Active) {
                  listingInfo = {
                    listingId: Number(listingId),
                    price: formatEther(listing.price),
                    listingType: Number(listing.listingType) as ListingType,
                  };
                }
              }
            } catch (e) {
              // No active listing
            }

            items.push({
              tokenId: i.toString(),
              name: metadata.name || `#${i}`,
              image: ipfsToHttp(metadata.image || ''),
              ...listingInfo,
            });
          }
        } catch (e) {
          console.error(`Error fetching NFT ${i}:`, e);
        }
      }

      setNfts(items);
    } catch (err: any) {
      console.error('Error fetching NFTs:', err);
    } finally {
      setNftsLoading(false);
    }
  }, [contracts, collection]);

  useEffect(() => {
    if (contracts && !hasFetched.current) {
      hasFetched.current = true;
      fetchCollection();
    }
  }, [contracts, fetchCollection]);

  useEffect(() => {
    if (collection) {
      fetchNFTs();
    }
  }, [collection, fetchNFTs]);

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const filteredNFTs = nfts.filter((nft) => {
    if (searchQuery && !nft.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'tokenId':
        return parseInt(a.tokenId) - parseInt(b.tokenId);
      case 'price':
        return (parseFloat(b.price || '0') - parseFloat(a.price || '0'));
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Skeleton variant="circular" width={120} height={120} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" height={40} width="40%" />
            <Skeleton variant="text" height={24} width="60%" />
          </Box>
        </Box>
      </Container>
    );
  }

  if (error || !collection) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Collection not found'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/collections')}>
          Back to Collections
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/collections')} sx={{ mb: 3 }}>
        Back to Collections
      </Button>

      {/* Banner */}
      <Paper
        sx={{
          height: 300,
          borderRadius: 3,
          mb: -8,
          background: collection.bannerUri
            ? `url(${collection.bannerUri}) center/cover`
            : 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          position: 'relative',
        }}
      />

      {/* Collection Info */}
      <Box sx={{ px: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-end', mb: 3 }}>
          <Avatar
            src={collection.imageUri}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid',
              borderColor: 'background.paper',
              bgcolor: 'primary.main',
              fontSize: 40,
            }}
          >
            {collection.name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h4" fontWeight={700}>
                {collection.name}
              </Typography>
              {collection.verified && <Verified color="primary" />}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {collection.symbol} • {collection.nftType === 0 ? 'ERC-721' : 'ERC-1155'}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 800 }}>
          {collection.description || 'No description available'}
        </Typography>

        {/* Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              {collection.totalItems}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Items
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              {collection.totalVolume} POL
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Volume
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              {collection.royaltyBps / 100}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Royalty
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Chip label={getCategoryLabel(collection.categoryId)} size="small" color="primary" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Category
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" fontWeight={600}>
              {new Date(collection.createdAt * 1000).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created
            </Typography>
          </Paper>
        </Box>

        {/* Contract Info */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            Contract Details
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                NFT Contract
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{truncateAddress(collection.nftContract)}</Typography>
                <IconButton
                  size="small"
                  onClick={() => navigator.clipboard.writeText(collection.nftContract)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  href={`https://amoy.polygonscan.com/address/${collection.nftContract}`}
                  target="_blank"
                >
                  <OpenInNew fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Creator
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{truncateAddress(collection.creator)}</Typography>
                <IconButton
                  size="small"
                  onClick={() => navigator.clipboard.writeText(collection.creator)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Royalty Recipient
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{truncateAddress(collection.royaltyRecipient)}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Divider sx={{ mb: 4 }} />

        {/* NFT Items Section */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Items
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="tokenId">Token ID</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* NFT Grid */}
        {nftsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : sortedNFTs.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {sortedNFTs.map((nft) => (
              <Card
                key={nft.tokenId}
                component={Link}
                to={`/nft/${collection.nftContract}/${nft.tokenId}`}
                sx={{
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                  {nft.image ? (
                    <CardMedia
                      component="img"
                      image={nft.image}
                      alt={nft.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.800',
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 40, color: 'grey.600' }} />
                    </Box>
                  )}
                  {nft.listingType !== undefined && (
                    <Chip
                      icon={nft.listingType === ListingType.Auction ? <Gavel /> : <ShoppingCart />}
                      label={nft.listingType === ListingType.Auction ? 'Auction' : 'For Sale'}
                      size="small"
                      color="secondary"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                    />
                  )}
                </Box>
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {nft.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    #{nft.tokenId}
                  </Typography>
                  {nft.price && (
                    <Typography variant="body2" color="primary" fontWeight={600} sx={{ mt: 0.5 }}>
                      {nft.price} POL
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No items in this collection yet
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CollectionDetail;
