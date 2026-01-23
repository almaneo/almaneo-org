import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  Explore,
  Gavel,
  AccessTime,
  TrendingUp,
  Security,
  Collections,
  Store,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import NFTCard from '../components/nft/NFTCard';
import HeroSlider from '../components/hero/HeroSlider';
import { useReadOnlyContracts } from '../hooks/useContracts';
import { CONTRACTS } from '../contracts/addresses';
import { ipfsToHttp } from '../utils/ipfs';
import { getHeroNFTs } from '../services/heroSettings';
import type { HeroNFT } from '../services/heroSettings';

interface NFTData {
  tokenId: string;
  contractAddress: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
  price?: string;
  paymentSymbol?: string;
}

interface Stats {
  totalNFTs: number;
  totalCollections: number;
  activeListings: number;
  activeAuctions: number;
}

const Home: React.FC = () => {
  const theme = useTheme();
  const contracts = useReadOnlyContracts();
  const [stats, setStats] = useState<Stats>({
    totalNFTs: 0,
    totalCollections: 0,
    activeListings: 0,
    activeAuctions: 0,
  });
  const [featuredNFTs, setFeaturedNFTs] = useState<NFTData[]>([]);
  const [heroNFTs, setHeroNFTs] = useState<HeroNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [nftsLoading, setNftsLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);

  // Load hero NFTs from localStorage, if empty will be populated from contract
  useEffect(() => {
    const storedHeroNFTs = getHeroNFTs();
    if (storedHeroNFTs.length > 0) {
      setHeroNFTs(storedHeroNFTs);
      setHeroLoading(false);
    }
    // If no stored hero NFTs, we'll load from contract in the next useEffect
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats from contracts (read-only, no wallet needed)
        const [totalNFTs721, totalNFTs1155, totalCollections] = await Promise.all([
          contracts.nft721.totalSupply().catch(() => 0n),
          contracts.nft1155.currentTokenId().catch(() => 0n),
          contracts.collectionManager.collectionCount().catch(() => 0n),
        ]);

        // Count active listings and auctions
        let activeListingCount = 0;
        let activeAuctionCount = 0;
        let consecutiveErrors = 0;
        let listingId = 1;

        while (consecutiveErrors < 5 && listingId < 100) {
          try {
            const listing = await contracts.marketplace.getListing(listingId);
            if (Number(listing.listingId) === 0) {
              consecutiveErrors++;
            } else {
              consecutiveErrors = 0;
              // Status 0 = Active
              if (Number(listing.status) === 0) {
                // ListingType 0 = FixedPrice, 1 = Auction
                if (Number(listing.listingType) === 1) {
                  activeAuctionCount++;
                } else {
                  activeListingCount++;
                }
              }
            }
            listingId++;
          } catch {
            consecutiveErrors++;
            listingId++;
          }
        }

        setStats({
          totalNFTs: Number(totalNFTs721) + Number(totalNFTs1155),
          totalCollections: Number(totalCollections),
          activeListings: activeListingCount,
          activeAuctions: activeAuctionCount,
        });
        setLoading(false);

        // Fetch NFT metadata for featured and hero sections
        const total721 = Number(totalNFTs721);
        const nftsToFetch: NFTData[] = [];
        const heroNftsToFetch: HeroNFT[] = [];

        for (let i = total721; i > 0 && nftsToFetch.length < 4; i--) {
          try {
            const tokenURI = await contracts.nft721.tokenURI(i);
            const metadataUrl = ipfsToHttp(tokenURI);
            const response = await fetch(metadataUrl);
            const metadata = await response.json();

            const nftData = {
              tokenId: i.toString(),
              contractAddress: CONTRACTS.AlmaNFT721,
              metadata: {
                name: metadata.name || `AlmaNEO NFT #${i}`,
                description: metadata.description || '',
                image: ipfsToHttp(metadata.image || ''),
              },
            };
            nftsToFetch.push(nftData);

            // Also prepare hero NFTs if localStorage is empty
            if (heroNftsToFetch.length < 3) {
              heroNftsToFetch.push({
                tokenId: i.toString(),
                contractAddress: CONTRACTS.AlmaNFT721,
                name: metadata.name || `AlmaNEO NFT #${i}`,
                image: metadata.image || '',
                collectionName: 'AlmaNEO ERC-721',
                order: heroNftsToFetch.length,
              });
            }
          } catch (err) {
            console.error(`Error fetching NFT #${i}:`, err);
          }
        }

        setFeaturedNFTs(nftsToFetch);

        // If no hero NFTs in localStorage, use the fetched ones
        const storedHeroNFTs = getHeroNFTs();
        if (storedHeroNFTs.length === 0 && heroNftsToFetch.length > 0) {
          setHeroNFTs(heroNftsToFetch);
        }
        setHeroLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
        setNftsLoading(false);
        setHeroLoading(false);
      }
    };

    fetchData();
  }, [contracts]);

  const statCards = [
    { label: 'Total NFTs', value: stats.totalNFTs, icon: <TrendingUp /> },
    { label: 'Collections', value: stats.totalCollections, icon: <Collections /> },
    { label: 'Listings', value: stats.activeListings, icon: <Store /> },
    { label: 'Auctions', value: stats.activeAuctions, icon: <Gavel /> },
  ];

  const features = [
    {
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      title: 'NFT Rental',
      description: 'Rent NFTs with ERC-4907/5006 standard. Use without owning.',
    },
    {
      icon: <Gavel sx={{ fontSize: 40 }} />,
      title: 'Live Auctions',
      description: 'Participate in exciting English auctions for rare NFTs.',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Trading',
      description: 'Secure transactions with audited smart contracts.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 6, md: 10 },
          background: theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}20 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.dark}40 0%, ${theme.palette.background.paper} 100%)`,
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                variant="h2"
                component="h1"
                fontWeight={800}
                sx={{
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Discover, Collect, and Trade Unique NFTs
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 500, fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                The next generation NFT marketplace with rental support, auctions, and multi-token payments.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/explore"
                  startIcon={<Explore />}
                >
                  Explore NFTs
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/auctions"
                  startIcon={<Gavel />}
                >
                  Live Auctions
                </Button>
              </Box>
            </Box>

            {/* Hero Slider */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: 350, md: 450 },
              }}
            >
              <HeroSlider
                nfts={heroNFTs}
                loading={heroLoading}
                autoPlayInterval={4000}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ mb: 1.5 }}
            >
              Marketplace Statistics
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: 'auto' }}
            >
              Real-time data from the AlmaNEO NFT ecosystem on Polygon Amoy Testnet
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {statCards.map((stat) => (
              <Paper
                key={stat.label}
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'background.default',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'light' ? 'grey.200' : 'divider',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: theme.palette.mode === 'light'
                      ? 'primary.light'
                      : 'rgba(45, 139, 139, 0.2)',
                    color: 'primary.main',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" sx={{ mx: 'auto', height: 48 }} />
                ) : (
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    sx={{
                      mb: 0.5,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Typography>
                )}
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 1 }}>
            Why AlmaNEO NFT?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Experience the future of NFT trading with our innovative features
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            {features.map((feature) => (
              <Card
                key={feature.title}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Featured NFTs */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Featured NFTs
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover trending and top-rated NFTs
            </Typography>
          </Box>
          <Button component={Link} to="/explore" variant="outlined">
            View All
          </Button>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {nftsLoading ? (
            // Loading skeletons with square aspect ratio
            [...Array(4)].map((_, index) => (
              <Card key={index} sx={{ borderRadius: 3 }}>
                <Box sx={{ paddingTop: '100%', position: 'relative' }}>
                  <Skeleton
                    variant="rectangular"
                    sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                  />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="50%" />
                </Box>
              </Card>
            ))
          ) : featuredNFTs.length > 0 ? (
            featuredNFTs.map((nft) => (
              <NFTCard
                key={nft.tokenId}
                tokenId={nft.tokenId}
                contractAddress={nft.contractAddress}
                metadata={nft.metadata}
                price={nft.price}
                paymentSymbol={nft.paymentSymbol || 'POL'}
              />
            ))
          ) : (
            // No NFTs message
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No NFTs minted yet. Be the first to create one!
              </Typography>
              <Button
                component={Link}
                to="/admin/mint"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Mint NFT
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color="white" sx={{ mb: 2 }}>
            Ready to Start?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
            Connect your wallet and start exploring the world of AlmaNEO NFTs
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
            component={Link}
            to="/explore"
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
