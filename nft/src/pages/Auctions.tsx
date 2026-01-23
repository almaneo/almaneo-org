import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Timer, Gavel, LocalFireDepartment, Refresh } from '@mui/icons-material';
import NFTCard from '../components/nft/NFTCard';
import { useContracts } from '../hooks/useContracts';
import { useWeb3 } from '../contexts/Web3Context';
import type { Listing, Auction, NFTMetadata } from '../types';
import { ListingStatus, ListingType } from '../types';
import { CONTRACTS } from '../contracts/addresses';
import { ipfsToHttp } from '../utils/ipfs';
import { formatEther } from 'ethers';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AuctionListing extends Listing {
  auction?: Auction;
  metadata?: NFTMetadata;
  bidCount?: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
      {value === index && children}
    </Box>
  );
};

const Auctions: React.FC = () => {
  const navigate = useNavigate();
  const contracts = useContracts();
  const { isConnected } = useWeb3();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auctions, setAuctions] = useState<AuctionListing[]>([]);

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

  const fetchAuctions = useCallback(async () => {
    if (!contracts) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedAuctions: AuctionListing[] = [];
      let consecutiveErrors = 0;
      const maxConsecutiveErrors = 5;
      let listingId = 1;

      while (consecutiveErrors < maxConsecutiveErrors) {
        try {
          const listingData = await contracts.marketplace.getListing(listingId);

          if (Number(listingData.listingId) === 0) {
            consecutiveErrors++;
            listingId++;
            continue;
          }

          consecutiveErrors = 0;

          // Only show AUCTION type listings that are ACTIVE
          if (
            Number(listingData.listingType) === ListingType.Auction &&
            Number(listingData.status) === ListingStatus.Active
          ) {
            const listing: AuctionListing = {
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
              listingType: ListingType.Auction,
              status: Number(listingData.status) as ListingStatus,
            };

            // Fetch auction details
            try {
              const auctionData = await contracts.marketplace.getAuction(listingId);
              listing.auction = {
                listingId: Number(auctionData.listingId),
                minBid: auctionData.minBid.toString(),
                minBidIncrement: auctionData.minBidIncrement.toString(),
                highestBid: auctionData.highestBid.toString(),
                highestBidder: auctionData.highestBidder,
                endTime: Number(auctionData.endTime),
                settled: auctionData.settled,
              };
            } catch (e) {
              console.log('Failed to fetch auction data for listing', listingId);
            }

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

            fetchedAuctions.push(listing);
          }

          listingId++;
        } catch (err) {
          consecutiveErrors++;
          listingId++;
        }
      }

      // Sort by ending soonest
      fetchedAuctions.sort((a, b) => {
        const aEndTime = a.auction?.endTime || a.endTime;
        const bEndTime = b.auction?.endTime || b.endTime;
        return aEndTime - bEndTime;
      });

      setAuctions(fetchedAuctions);
    } catch (err) {
      console.error('Error fetching auctions:', err);
      setError('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const now = Math.floor(Date.now() / 1000);

  // Filter auctions
  const liveAuctions = auctions.filter((a) => {
    const endTime = a.auction?.endTime || a.endTime;
    return endTime > now && !a.auction?.settled;
  });

  const endingSoon = liveAuctions
    .filter((a) => {
      const endTime = a.auction?.endTime || a.endTime;
      return endTime - now < 3600; // Less than 1 hour
    })
    .sort((a, b) => {
      const aEnd = a.auction?.endTime || a.endTime;
      const bEnd = b.auction?.endTime || b.endTime;
      return aEnd - bEnd;
    });

  const hotAuctions = liveAuctions.filter((a) => {
    // Consider "hot" if has highest bid > minBid (meaning multiple bids)
    if (!a.auction) return false;
    return BigInt(a.auction.highestBid) > BigInt(a.auction.minBid);
  });

  const stats = [
    { label: 'Live Auctions', value: liveAuctions.length, icon: <Gavel color="primary" /> },
    { label: 'Ending Soon', value: endingSoon.length, icon: <Timer color="warning" /> },
    { label: 'Hot Auctions', value: hotAuctions.length, icon: <LocalFireDepartment color="error" /> },
  ];

  const renderAuctionCard = (auction: AuctionListing) => {
    const endTime = auction.auction?.endTime || auction.endTime;
    const currentBid = auction.auction?.highestBid || auction.auction?.minBid || auction.price;
    const hasNoBids = auction.auction?.highestBidder === '0x0000000000000000000000000000000000000000';

    return (
      <NFTCard
        key={auction.listingId}
        tokenId={auction.tokenId}
        contractAddress={auction.nftContract}
        metadata={auction.metadata}
        price={formatEther(currentBid)}
        paymentSymbol="POL"
        isAuction
        endTime={endTime}
        contractType={auction.nftType === 'ERC1155' ? 'erc1155' : 'erc721'}
        onClick={() => navigate(`/nft/${auction.nftContract}/${auction.tokenId}`)}
        extraInfo={
          hasNoBids
            ? `Starting: ${formatEther(auction.auction?.minBid || auction.price)} POL`
            : `${auction.auction?.highestBidder?.slice(0, 6)}... is winning`
        }
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Live Auctions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bid on exclusive NFTs in real-time auctions
          </Typography>
        </Box>
        <Button
          startIcon={<Refresh />}
          onClick={fetchAuctions}
          disabled={loading}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!isConnected && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Connect your wallet to place bids on auctions
        </Alert>
      )}

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
          mb: 4,
        }}
      >
        {stats.map((stat) => (
          <Paper
            key={stat.label}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Box sx={{ mb: 1 }}>{stat.icon}</Box>
            <Typography variant="h4" fontWeight={700}>
              {loading ? <CircularProgress size={24} /> : stat.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                All Auctions
                <Chip label={liveAuctions.length} size="small" />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timer fontSize="small" />
                Ending Soon
                <Chip label={endingSoon.length} size="small" color="warning" />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalFireDepartment fontSize="small" />
                Hot
                <Chip label={hotAuctions.length} size="small" color="error" />
              </Box>
            }
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 2 }}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Loading auctions from blockchain...
                </Typography>
              </Box>
            ) : liveAuctions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Gavel sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No live auctions
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Check back later or create your own auction!
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 3,
                }}
              >
                {liveAuctions.map(renderAuctionCard)}
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 2 }}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : endingSoon.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Timer sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No auctions ending soon
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 3,
                }}
              >
                {endingSoon.map(renderAuctionCard)}
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 2 }}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : hotAuctions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <LocalFireDepartment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No hot auctions right now
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Auctions with active bidding will appear here
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 3,
                }}
              >
                {hotAuctions.map(renderAuctionCard)}
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Auctions;
