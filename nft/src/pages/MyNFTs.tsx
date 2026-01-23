import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  useTheme,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Collections,
  LocalOffer,
  Gavel,
  Add,
  Refresh,
  Send,
  Home,
  Key,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import NFTCard from '../components/nft/NFTCard';
import { useWeb3 } from '../contexts/Web3Context';
import { useContracts } from '../hooks/useContracts';
import { CONTRACTS } from '../contracts/addresses';
import { ipfsToHttp } from '../utils/ipfs';
import { formatEther } from 'ethers';
import { getTxOptions } from '../utils/gas';
import type { Offer, RentalListing } from '../types';
import { OfferStatus, RentalStatus } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface NFTItem {
  tokenId: string;
  contractAddress: string;
  contractType: 'ERC721' | 'ERC1155';
  metadata: {
    name: string;
    description: string;
    image: string;
  };
  balance?: number; // For ERC-1155
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
      {value === index && children}
    </Box>
  );
};

interface ListedNFTItem extends NFTItem {
  listingId: number;
  price: string;
  listingType: 'fixed' | 'auction' | 'rental';
}

interface MyOfferItem extends Offer {
  nftName?: string;
  nftImage?: string;
}

interface MyRentalListing extends RentalListing {
  metadata?: {
    name: string;
    description: string;
    image: string;
  };
}

interface BorrowedNFT {
  activeRentalId: number;
  rentalListingId: number;
  nftContract: string;
  tokenId: string;
  nftType: 'ERC721' | 'ERC1155';
  owner: string;
  renter: string;
  startTime: number;
  endTime: number;
  totalPaid: string;
  pricePerDay: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
  };
}

const MyNFTs: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isConnected, address, signer } = useWeb3();
  const contracts = useContracts();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState<NFTItem[]>([]);
  const [listedNFTs, setListedNFTs] = useState<ListedNFTItem[]>([]);
  const [auctionNFTs, setAuctionNFTs] = useState<ListedNFTItem[]>([]);
  const [myRentalListings, setMyRentalListings] = useState<MyRentalListing[]>([]);
  const [borrowedNFTs, setBorrowedNFTs] = useState<BorrowedNFT[]>([]);
  const [myOffers, setMyOffers] = useState<MyOfferItem[]>([]);
  const [processingOffer, setProcessingOffer] = useState<number | null>(null);
  const [processingRental, setProcessingRental] = useState<number | null>(null);
  const hasFetched = useRef(false);

  const fetchMetadata = async (tokenUri: string) => {
    try {
      // Handle data URI
      if (tokenUri.startsWith('data:')) {
        const base64 = tokenUri.split(',')[1];
        return JSON.parse(atob(base64));
      }

      // Convert IPFS URI to HTTP
      const httpUrl = ipfsToHttp(tokenUri);

      const response = await fetch(httpUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch metadata from ${httpUrl}, status: ${response.status}`);
        throw new Error('Failed to fetch metadata');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching metadata:', error, tokenUri);
      return {
        name: 'Unknown NFT',
        description: '',
        image: '',
      };
    }
  };

  const fetchOwnedNFTs = useCallback(async () => {
    if (!contracts || !address) return;

    setLoading(true);
    const nfts: NFTItem[] = [];
    const listed: ListedNFTItem[] = [];
    const auctions: ListedNFTItem[] = [];

    try {
      // Fetch ERC-721 NFTs
      const balance721 = await contracts.nft721.balanceOf(address);
      const balance721Num = Number(balance721);

      for (let i = 0; i < balance721Num; i++) {
        try {
          const tokenId = await contracts.nft721.tokenOfOwnerByIndex(address, i);
          const tokenUri = await contracts.nft721.tokenURI(tokenId);
          const metadata = await fetchMetadata(tokenUri);

          nfts.push({
            tokenId: tokenId.toString(),
            contractAddress: CONTRACTS.AlmaNFT721,
            contractType: 'ERC721',
            metadata: {
              name: metadata.name || `NFT #${tokenId}`,
              description: metadata.description || '',
              image: ipfsToHttp(metadata.image || ''),
            },
          });
        } catch (err) {
          console.error(`Error fetching ERC-721 token ${i}:`, err);
        }
      }

      // Fetch ERC-1155 NFTs
      const currentTokenId1155 = await contracts.nft1155.currentTokenId();
      const totalTokens1155 = Number(currentTokenId1155);

      for (let tokenId = 1; tokenId <= totalTokens1155; tokenId++) {
        try {
          const balance = await contracts.nft1155.balanceOf(address, tokenId);
          if (Number(balance) > 0) {
            const tokenUri = await contracts.nft1155.uri(tokenId);
            const metadata = await fetchMetadata(tokenUri);

            nfts.push({
              tokenId: tokenId.toString(),
              contractAddress: CONTRACTS.AlmaNFT1155,
              contractType: 'ERC1155',
              metadata: {
                name: metadata.name || `NFT #${tokenId}`,
                description: metadata.description || '',
                image: ipfsToHttp(metadata.image || ''),
              },
              balance: Number(balance),
            });
          }
        } catch (err) {
          console.error(`Error fetching ERC-1155 token ${tokenId}:`, err);
        }
      }

      setOwnedNFTs(nfts);

      // Fetch listings from marketplace for current user
      try {
        const userListingIds: bigint[] = await contracts.marketplace.getUserListings(address);

        for (const listingId of userListingIds) {
          try {
            const listing = await contracts.marketplace.getListing(listingId);
            // Check if listing is active (status === 0)
            if (Number(listing.status) === 0) {
              const contractAddr = listing.nftContract;
              const tokenId = listing.tokenId.toString();
              const is1155 = contractAddr.toLowerCase() === CONTRACTS.AlmaNFT1155.toLowerCase();

              // Fetch metadata
              let tokenUri = '';
              try {
                tokenUri = is1155
                  ? await contracts.nft1155.uri(tokenId)
                  : await contracts.nft721.tokenURI(tokenId);
              } catch (e) {
                console.error('Error fetching tokenURI for listing:', e);
              }

              const metadata = tokenUri ? await fetchMetadata(tokenUri) : { name: `NFT #${tokenId}`, description: '', image: '' };

              const listingType = Number(listing.listingType);
              const nftItem: ListedNFTItem = {
                tokenId,
                contractAddress: contractAddr,
                contractType: is1155 ? 'ERC1155' : 'ERC721',
                metadata: {
                  name: metadata.name || `NFT #${tokenId}`,
                  description: metadata.description || '',
                  image: ipfsToHttp(metadata.image || ''),
                },
                listingId: Number(listing.listingId),
                price: listing.price.toString(),
                listingType: listingType === 1 ? 'auction' : listingType === 2 ? 'rental' : 'fixed',
              };

              if (listingType === 1) {
                auctions.push(nftItem);
              } else {
                listed.push(nftItem);
              }
            }
          } catch (err) {
            // Listing might not exist, skip
          }
        }

        setListedNFTs(listed);
        setAuctionNFTs(auctions);
      } catch (err) {
        console.error('Error fetching listings:', err);
      }

      // Fetch user's rental listings
      try {
        const rentals: MyRentalListing[] = [];
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

            // Check if this rental listing belongs to user and is listed or rented (active)
            const rentalStatus = Number(rentalData.status);
            if (rentalData.owner.toLowerCase() === address.toLowerCase() &&
              (rentalStatus === RentalStatus.Listed || rentalStatus === RentalStatus.Rented)) {
              const is1155 = rentalData.nftContract.toLowerCase() === CONTRACTS.AlmaNFT1155.toLowerCase();
              let metadata = { name: `NFT #${rentalData.tokenId}`, description: '', image: '' };

              try {
                const tokenUri = is1155
                  ? await contracts.nft1155.uri(rentalData.tokenId)
                  : await contracts.nft721.tokenURI(rentalData.tokenId);
                const fetchedMeta = await fetchMetadata(tokenUri);
                metadata = {
                  name: fetchedMeta.name || metadata.name,
                  description: fetchedMeta.description || '',
                  image: ipfsToHttp(fetchedMeta.image || ''),
                };
              } catch (e) {
                console.error('Error fetching rental metadata:', e);
              }

              rentals.push({
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
                metadata,
              });
            }

            rentalId++;
          } catch (err) {
            consecutiveErrors++;
            rentalId++;
          }
        }

        setMyRentalListings(rentals);
      } catch (err) {
        console.error('Error fetching rental listings:', err);
      }

      // Fetch borrowed NFTs (NFTs user is currently renting)
      try {
        const borrowed: BorrowedNFT[] = [];
        let consecutiveErrors = 0;
        const maxConsecutiveErrors = 5;
        let activeRentalId = 1;

        while (consecutiveErrors < maxConsecutiveErrors) {
          try {
            const activeRental = await contracts.marketplace.getActiveRental(activeRentalId);

            if (Number(activeRental.rentalListingId) === 0) {
              consecutiveErrors++;
              activeRentalId++;
              continue;
            }

            consecutiveErrors = 0;

            // Check if this rental belongs to user and is not ended
            if (activeRental.renter.toLowerCase() === address.toLowerCase() && !activeRental.ended) {
              const rentalListing = await contracts.marketplace.getRentalListing(activeRental.rentalListingId);
              const is1155 = rentalListing.nftContract.toLowerCase() === CONTRACTS.AlmaNFT1155.toLowerCase();
              let metadata = { name: `NFT #${rentalListing.tokenId}`, description: '', image: '' };

              try {
                const tokenUri = is1155
                  ? await contracts.nft1155.uri(rentalListing.tokenId)
                  : await contracts.nft721.tokenURI(rentalListing.tokenId);
                const fetchedMeta = await fetchMetadata(tokenUri);
                metadata = {
                  name: fetchedMeta.name || metadata.name,
                  description: fetchedMeta.description || '',
                  image: ipfsToHttp(fetchedMeta.image || ''),
                };
              } catch (e) {
                console.error('Error fetching borrowed NFT metadata:', e);
              }

              borrowed.push({
                activeRentalId,
                rentalListingId: Number(activeRental.rentalListingId),
                nftContract: rentalListing.nftContract,
                tokenId: rentalListing.tokenId.toString(),
                nftType: Number(rentalListing.nftType) === 0 ? 'ERC721' : 'ERC1155',
                owner: rentalListing.owner,
                renter: activeRental.renter,
                startTime: Number(activeRental.startTime),
                endTime: Number(activeRental.endTime),
                totalPaid: activeRental.totalPaid.toString(),
                pricePerDay: rentalListing.pricePerDay.toString(),
                metadata,
              });
            }

            activeRentalId++;
          } catch (err) {
            consecutiveErrors++;
            activeRentalId++;
          }
        }

        setBorrowedNFTs(borrowed);
      } catch (err) {
        console.error('Error fetching borrowed NFTs:', err);
      }

      // Fetch user's offers
      try {
        const userOfferIds: bigint[] = await contracts.marketplace.getUserOffers(address);
        const offers: MyOfferItem[] = [];

        for (const offerId of userOfferIds) {
          try {
            const offer = await contracts.marketplace.getOffer(offerId);
            // Only show pending offers
            if (Number(offer.status) === OfferStatus.Pending) {
              const contractAddr = offer.nftContract;
              const tokenId = offer.tokenId.toString();
              const is1155 = contractAddr.toLowerCase() === CONTRACTS.AlmaNFT1155.toLowerCase();

              // Fetch metadata for the NFT
              let tokenUri = '';
              let nftName = `NFT #${tokenId}`;
              let nftImage = '';
              try {
                tokenUri = is1155
                  ? await contracts.nft1155.uri(tokenId)
                  : await contracts.nft721.tokenURI(tokenId);
                const metadata = await fetchMetadata(tokenUri);
                nftName = metadata.name || nftName;
                nftImage = ipfsToHttp(metadata.image || '');
              } catch (e) {
                console.error('Error fetching metadata for offer:', e);
              }

              offers.push({
                offerId: Number(offer.offerId),
                nftContract: contractAddr,
                tokenId,
                amount: Number(offer.amount),
                nftType: is1155 ? 'ERC1155' : 'ERC721',
                offerer: offer.offerer,
                paymentToken: offer.paymentToken,
                price: offer.price.toString(),
                expiry: Number(offer.expiry),
                status: Number(offer.status) as OfferStatus,
                nftName,
                nftImage,
              });
            }
          } catch (err) {
            console.error('Error fetching offer:', err);
          }
        }

        setMyOffers(offers);
      } catch (err) {
        console.error('Error fetching user offers:', err);
      }

    } catch (error) {
      console.error('Error fetching owned NFTs:', error);
    } finally {
      setLoading(false);
    }
  }, [contracts, address]);

  useEffect(() => {
    if (isConnected && contracts && address && !hasFetched.current) {
      hasFetched.current = true;
      fetchOwnedNFTs();
    }
  }, [isConnected, contracts, address, fetchOwnedNFTs]);

  // Reset fetch flag when address changes
  useEffect(() => {
    hasFetched.current = false;
  }, [address]);

  const handleCancelOffer = async (offerId: number) => {
    if (!contracts || !signer) return;

    setProcessingOffer(offerId);
    try {
      console.log('Cancelling offer:', offerId);
      const tx = await contracts.marketplace.cancelOffer(offerId, getTxOptions('cancel'));
      console.log('Cancel offer tx sent:', tx.hash);
      await tx.wait();
      console.log('Offer cancelled successfully');
      // Refresh offers
      hasFetched.current = false;
      fetchOwnedNFTs();
    } catch (err: any) {
      console.error('Cancel offer error:', err);
      alert(err.message || 'Failed to cancel offer');
    } finally {
      setProcessingOffer(null);
    }
  };

  const handleEndRental = async (activeRentalId: number) => {
    if (!contracts || !signer) return;

    setProcessingRental(activeRentalId);
    try {
      console.log('Ending rental:', activeRentalId);
      const tx = await contracts.marketplace.endRental(activeRentalId, getTxOptions('cancel'));
      console.log('End rental tx sent:', tx.hash);
      await tx.wait();
      console.log('Rental ended successfully');
      // Refresh
      hasFetched.current = false;
      fetchOwnedNFTs();
    } catch (err: any) {
      console.error('End rental error:', err);
      alert(err.message || 'Failed to end rental');
    } finally {
      setProcessingRental(null);
    }
  };

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const getTimeRemaining = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (!isConnected) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Collections sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Connect Your Wallet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please connect your wallet to view your NFTs
          </Typography>
        </Paper>
      </Container>
    );
  }

  const tabs = [
    { label: 'Owned', count: ownedNFTs.length, icon: <Collections /> },
    { label: 'Listed', count: listedNFTs.length, icon: <LocalOffer /> },
    { label: 'Auctions', count: auctionNFTs.length, icon: <Gavel /> },
    { label: 'For Rent', count: myRentalListings.length, icon: <Home /> },
    { label: 'Borrowed', count: borrowedNFTs.length, icon: <Key /> },
    { label: 'My Offers', count: myOffers.length, icon: <Send /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            My NFTs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your NFT collection
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              hasFetched.current = false;
              fetchOwnedNFTs();
            }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/admin/mint"
          >
            Create NFT
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        {tabs.map((tab) => (
          <Paper
            key={tab.label}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
            }}
            onClick={() => setTabValue(tabs.indexOf(tab))}
          >
            <Box sx={{ color: 'primary.main', mb: 1 }}>{tab.icon}</Box>
            <Typography variant="h5" fontWeight={700}>
              {tab.count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tab.label}
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
          {tabs.map((tab) => (
            <Tab
              key={tab.label}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.icon}
                  {tab.label}
                  <Chip label={tab.count} size="small" />
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* Loading */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading your NFTs...
            </Typography>
          </Box>
        )}

        {/* Owned NFTs */}
        {!loading && (
          <>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: 2 }}>
                {ownedNFTs.length === 0 ? (
                  <Alert severity="info">
                    You don't own any NFTs yet.
                    <Button component={Link} to="/admin/mint" size="small" sx={{ ml: 1 }}>
                      Create your first NFT
                    </Button>
                  </Alert>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                      gap: 3,
                    }}
                  >
                    {ownedNFTs.map((nft) => (
                      <NFTCard
                        key={`${nft.contractAddress}-${nft.tokenId}`}
                        tokenId={nft.tokenId}
                        contractAddress={nft.contractAddress}
                        metadata={nft.metadata}
                        contractType={nft.contractType}
                        balance={nft.balance}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Listed NFTs */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 2 }}>
                {listedNFTs.length === 0 ? (
                  <Alert severity="info">
                    You don't have any NFTs listed for sale.
                    Go to your Owned NFTs and click on one to list it.
                  </Alert>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                      gap: 3,
                    }}
                  >
                    {listedNFTs.map((nft) => (
                      <NFTCard
                        key={`${nft.contractAddress}-${nft.tokenId}`}
                        tokenId={nft.tokenId}
                        contractAddress={nft.contractAddress}
                        metadata={nft.metadata}
                        contractType={nft.contractType}
                        price={formatEther(nft.price)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Auction NFTs */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: 2 }}>
                {auctionNFTs.length === 0 ? (
                  <Alert severity="info">You don't have any active auctions</Alert>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                      gap: 3,
                    }}
                  >
                    {auctionNFTs.map((nft) => (
                      <NFTCard
                        key={`${nft.contractAddress}-${nft.tokenId}`}
                        tokenId={nft.tokenId}
                        contractAddress={nft.contractAddress}
                        metadata={nft.metadata}
                        contractType={nft.contractType}
                        price={formatEther(nft.price)}
                        isAuction
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Rented NFTs */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ px: 2 }}>
                {myRentalListings.length === 0 ? (
                  <Alert severity="info">You don't have any NFTs listed for rent</Alert>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                      gap: 3,
                    }}
                  >
                    {myRentalListings.map((rental) => (
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
                )}
              </Box>
            </TabPanel>

            {/* Borrowed NFTs */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ px: 2 }}>
                {borrowedNFTs.length === 0 ? (
                  <Alert severity="info">
                    You haven't rented any NFTs yet.
                    Browse the marketplace and rent NFTs to use them.
                  </Alert>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>NFT</TableCell>
                          <TableCell>Owner</TableCell>
                          <TableCell>Rental Period</TableCell>
                          <TableCell>Time Remaining</TableCell>
                          <TableCell>Verify</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {borrowedNFTs.map((rental) => {
                          const isExpired = rental.endTime <= Math.floor(Date.now() / 1000);
                          return (
                            <TableRow key={rental.activeRentalId}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  {rental.metadata?.image && (
                                    <Box
                                      component="img"
                                      src={rental.metadata.image}
                                      alt={rental.metadata?.name}
                                      sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                                    />
                                  )}
                                  <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                      {rental.metadata?.name || `NFT #${rental.tokenId}`}
                                    </Typography>
                                    <Chip
                                      label={rental.nftType}
                                      size="small"
                                      color={rental.nftType === 'ERC721' ? 'primary' : 'secondary'}
                                      variant="outlined"
                                      sx={{ mt: 0.5 }}
                                    />
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {truncateAddress(rental.owner)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {new Date(rental.startTime * 1000).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  to {new Date(rental.endTime * 1000).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {isExpired ? (
                                  <Chip label="Expired" size="small" color="error" />
                                ) : (
                                  <Chip
                                    label={getTimeRemaining(rental.endTime)}
                                    size="small"
                                    color="success"
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  variant="text"
                                  href={`https://amoy.polygonscan.com/address/${rental.nftContract}#readContract`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                                >
                                  PolygonScan
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => navigate(`/nft/${rental.nftContract}/${rental.tokenId}`)}
                                  >
                                    View
                                  </Button>
                                  {isExpired && (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="warning"
                                      onClick={() => handleEndRental(rental.activeRentalId)}
                                      disabled={processingRental === rental.activeRentalId}
                                    >
                                      {processingRental === rental.activeRentalId ? 'Ending...' : 'End Rental'}
                                    </Button>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </TabPanel>

            {/* My Offers */}
            <TabPanel value={tabValue} index={5}>
              <Box sx={{ px: 2 }}>
                {myOffers.length === 0 ? (
                  <Alert severity="info">
                    You haven't made any offers yet.
                    Browse NFTs and make offers on items you're interested in.
                  </Alert>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>NFT</TableCell>
                          <TableCell>Contract</TableCell>
                          <TableCell>Offer Price</TableCell>
                          <TableCell>Expiry</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {myOffers.map((offer) => (
                          <TableRow key={offer.offerId}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {offer.nftImage && (
                                  <Box
                                    component="img"
                                    src={offer.nftImage}
                                    alt={offer.nftName}
                                    sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                                  />
                                )}
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {offer.nftName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Token #{offer.tokenId}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={offer.nftType}
                                size="small"
                                color={offer.nftType === 'ERC721' ? 'primary' : 'secondary'}
                                variant="outlined"
                              />
                              <Typography variant="caption" display="block" color="text.secondary">
                                {truncateAddress(offer.nftContract)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600} color="primary">
                                {formatEther(offer.price)} POL
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(offer.expiry * 1000).toLocaleDateString()}
                              </Typography>
                              {offer.expiry < Math.floor(Date.now() / 1000) && (
                                <Chip label="Expired" size="small" color="error" sx={{ mt: 0.5 }} />
                              )}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => navigate(`/nft/${offer.nftContract}/${offer.tokenId}`)}
                                >
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleCancelOffer(offer.offerId)}
                                  disabled={processingOffer === offer.offerId}
                                >
                                  {processingOffer === offer.offerId ? 'Cancelling...' : 'Cancel'}
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </TabPanel>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default MyNFTs;
