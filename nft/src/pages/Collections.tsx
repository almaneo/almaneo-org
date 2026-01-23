import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Paper,
  CircularProgress,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import { Search, Verified, TrendingUp, Refresh } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { useContracts } from '../hooks/useContracts';
import { ipfsToHttp } from '../utils/ipfs';
import { formatEther } from 'ethers';

interface CollectionCardProps {
  id: number;
  name: string;
  description: string;
  imageUri: string;
  bannerUri: string;
  verified: boolean;
  totalItems: number;
  totalVolume: string;
  floorPrice: string;
  category: Category;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  id,
  name,
  description,
  imageUri,
  bannerUri,
  verified,
  totalItems,
  totalVolume,
  floorPrice,
  category,
}) => {
  const theme = useTheme();

  const getCategoryLabel = (cat: Category) => {
    const labels: Record<Category, string> = {
      [Category.Game]: 'Game',
      [Category.Membership]: 'Membership',
      [Category.RWA]: 'RWA',
      [Category.Art]: 'Art',
      [Category.Other]: 'Other',
    };
    return labels[cat];
  };

  return (
    <Card
      component={Link}
      to={`/collection/${id}`}
      sx={{
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 120 }}>
        <CardMedia
          component="div"
          sx={{
            height: '100%',
            bgcolor: `${theme.palette.primary.main}30`,
            background: bannerUri
              ? `url(${bannerUri}) center/cover`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          }}
        />
        <Avatar
          src={imageUri}
          sx={{
            width: 64,
            height: 64,
            position: 'absolute',
            bottom: -32,
            left: 16,
            border: `4px solid ${theme.palette.background.paper}`,
            bgcolor: theme.palette.primary.main,
          }}
        >
          {name.charAt(0)}
        </Avatar>
        <Chip
          label={getCategoryLabel(category)}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
          }}
        />
      </Box>

      <CardContent sx={{ pt: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Typography variant="h6" fontWeight={600} noWrap>
            {name}
          </Typography>
          {verified && <Verified color="primary" fontSize="small" />}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: 40,
          }}
        >
          {description || 'No description available'}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Floor
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {floorPrice} POL
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Volume
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {totalVolume} POL
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Items
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {totalItems}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Collections: React.FC = () => {
  const contracts = useContracts();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('volume');
  const [collections, setCollections] = useState<CollectionCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchCollections = useCallback(async () => {
    if (!contracts) return;

    setLoading(true);
    setError(null);

    try {
      const collectionCount = await contracts.collectionManager.collectionCount();
      const totalCount = Number(collectionCount);

      const fetchedCollections: CollectionCardProps[] = [];

      for (let i = 1; i <= totalCount; i++) {
        try {
          const col = await contracts.collectionManager.getCollection(i);

          // Only include active collections
          if (col.active) {
            fetchedCollections.push({
              id: Number(col.id),
              name: col.name,
              description: col.description,
              imageUri: ipfsToHttp(col.imageUri || ''),
              bannerUri: ipfsToHttp(col.bannerUri || ''),
              verified: col.verified,
              totalItems: Number(col.totalItems),
              totalVolume: formatEther(col.totalVolume),
              floorPrice: '0', // Floor price needs separate calculation
              category: Number(col.categoryId) as Category,
            });
          }
        } catch (err) {
          console.error(`Error fetching collection ${i}:`, err);
        }
      }

      setCollections(fetchedCollections);
    } catch (err: any) {
      console.error('Error fetching collections:', err);
      setError(err.message || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  useEffect(() => {
    if (contracts && !hasFetched.current) {
      hasFetched.current = true;
      fetchCollections();
    }
  }, [contracts, fetchCollections]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: Category.Game, label: 'Game' },
    { value: Category.Membership, label: 'Membership' },
    { value: Category.RWA, label: 'RWA' },
    { value: Category.Art, label: 'Art' },
    { value: Category.Other, label: 'Other' },
  ];

  const filteredCollections = collections.filter((col) => {
    if (category !== 'all' && col.category !== Number(category)) return false;
    if (searchQuery && !col.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sort collections
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return parseFloat(b.totalVolume) - parseFloat(a.totalVolume);
      case 'floor':
        return parseFloat(b.floorPrice) - parseFloat(a.floorPrice);
      case 'items':
        return b.totalItems - a.totalItems;
      case 'recent':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Collections
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore curated NFT collections on AlmaNEO Marketplace
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search collections..."
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
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={String(cat.value)} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="volume">Volume</MenuItem>
              <MenuItem value="floor">Floor Price</MenuItem>
              <MenuItem value="items">Items</MenuItem>
              <MenuItem value="recent">Recently Added</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <TrendingUp color="primary" />
          <Typography variant="h6" fontWeight={700}>
            {collections.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Collections
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            {collections.reduce((sum, c) => sum + c.totalItems, 0).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total NFTs
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            {collections.reduce((sum, c) => sum + parseFloat(c.totalVolume), 0).toLocaleString()} POL
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Volume
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            {collections.filter((c) => c.verified).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verified
          </Typography>
        </Paper>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Collections Grid */}
      {!loading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {sortedCollections.map((collection) => (
            <CollectionCard key={collection.id} {...collection} />
          ))}
        </Box>
      )}

      {!loading && sortedCollections.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No collections found
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              hasFetched.current = false;
              fetchCollections();
            }}
          >
            Refresh
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Collections;
