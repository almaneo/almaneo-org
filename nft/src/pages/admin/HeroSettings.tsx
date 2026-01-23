import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Add,
  Delete,
  ArrowUpward,
  ArrowDownward,
  Image as ImageIcon,
  Visibility,
} from '@mui/icons-material';
import { useContracts } from '../../hooks/useContracts';
import { CONTRACTS } from '../../contracts/addresses';
import { ipfsToHttp } from '../../utils/ipfs';
import {
  getHeroNFTs,
  addHeroNFT,
  removeHeroNFT,
  reorderHeroNFTs,
} from '../../services/heroSettings';
import type { HeroNFT } from '../../services/heroSettings';

interface AvailableNFT {
  tokenId: string;
  contractAddress: string;
  name: string;
  image: string;
  contractType: 'ERC721' | 'ERC1155';
}

const HeroSettings: React.FC = () => {
  const contracts = useContracts();
  const [heroNFTs, setHeroNFTs] = useState<HeroNFT[]>([]);
  const [availableNFTs, setAvailableNFTs] = useState<AvailableNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Load hero NFTs from storage
  useEffect(() => {
    setHeroNFTs(getHeroNFTs());
    setLoading(false);
  }, []);

  // Fetch all available NFTs when dialog opens
  const fetchAvailableNFTs = async () => {
    if (!contracts) return;

    setLoadingAvailable(true);
    const nfts: AvailableNFT[] = [];

    try {
      // Fetch ERC-721 NFTs
      const total721 = await contracts.nft721.totalSupply().catch(() => 0n);
      for (let i = 1; i <= Number(total721); i++) {
        try {
          const tokenURI = await contracts.nft721.tokenURI(i);
          const metadataUrl = ipfsToHttp(tokenURI);
          const response = await fetch(metadataUrl);
          const metadata = await response.json();

          nfts.push({
            tokenId: i.toString(),
            contractAddress: CONTRACTS.AlmaNFT721,
            name: metadata.name || `NFT #${i}`,
            image: ipfsToHttp(metadata.image || ''),
            contractType: 'ERC721',
          });
        } catch (err) {
          console.error(`Error fetching ERC-721 #${i}:`, err);
        }
      }

      // Fetch ERC-1155 NFTs
      const total1155 = await contracts.nft1155.currentTokenId().catch(() => 0n);
      for (let i = 1; i <= Number(total1155); i++) {
        try {
          const tokenURI = await contracts.nft1155.uri(i);
          const metadataUrl = ipfsToHttp(tokenURI);
          const response = await fetch(metadataUrl);
          const metadata = await response.json();

          nfts.push({
            tokenId: i.toString(),
            contractAddress: CONTRACTS.AlmaNFT1155,
            name: metadata.name || `NFT #${i}`,
            image: ipfsToHttp(metadata.image || ''),
            contractType: 'ERC1155',
          });
        } catch (err) {
          console.error(`Error fetching ERC-1155 #${i}:`, err);
        }
      }

      setAvailableNFTs(nfts);
    } catch (err) {
      console.error('Error fetching NFTs:', err);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    fetchAvailableNFTs();
  };

  const handleAddNFT = (nft: AvailableNFT) => {
    addHeroNFT({
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      name: nft.name,
      image: nft.image,
      collectionName: nft.contractType === 'ERC721' ? 'Alma ERC-721' : 'Alma ERC-1155',
    });
    setHeroNFTs(getHeroNFTs());
    setSuccess(`Added "${nft.name}" to Hero section`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleRemoveNFT = (nft: HeroNFT) => {
    removeHeroNFT(nft.tokenId, nft.contractAddress);
    setHeroNFTs(getHeroNFTs());
    setSuccess(`Removed "${nft.name}" from Hero section`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleMoveUp = (nft: HeroNFT, currentIndex: number) => {
    if (currentIndex === 0) return;
    reorderHeroNFTs(nft.tokenId, nft.contractAddress, currentIndex - 1);
    setHeroNFTs(getHeroNFTs());
  };

  const handleMoveDown = (nft: HeroNFT, currentIndex: number) => {
    if (currentIndex === heroNFTs.length - 1) return;
    reorderHeroNFTs(nft.tokenId, nft.contractAddress, currentIndex + 1);
    setHeroNFTs(getHeroNFTs());
  };

  const isInHero = (nft: AvailableNFT) => {
    return heroNFTs.some(
      (h) => h.tokenId === nft.tokenId && h.contractAddress === nft.contractAddress
    );
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Hero Section Settings
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
          Add NFT
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Featured NFTs ({heroNFTs.length}/3 recommended)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select up to 3 NFTs to display in the Hero slider. NFTs will be displayed in the order shown below.
        </Typography>

        {heroNFTs.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              bgcolor: 'background.default',
              borderRadius: 2,
            }}
          >
            <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">
              No NFTs selected for Hero section
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleOpenDialog}
              sx={{ mt: 2 }}
            >
              Add NFT
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {heroNFTs.map((nft, index) => (
              <Card
                key={`${nft.contractAddress}-${nft.tokenId}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  gap: 2,
                }}
              >
                {/* Order Number */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </Box>

                {/* Image */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    overflow: 'hidden',
                    flexShrink: 0,
                    bgcolor: 'grey.800',
                  }}
                >
                  {nft.image ? (
                    <Box
                      component="img"
                      src={ipfsToHttp(nft.image)}
                      alt={nft.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImageIcon sx={{ color: 'grey.500' }} />
                    </Box>
                  )}
                </Box>

                {/* Info */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {nft.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {nft.collectionName || 'Alma Collection'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Token ID: {nft.tokenId}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveUp(nft, index)}
                    disabled={index === 0}
                  >
                    <ArrowUpward />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveDown(nft, index)}
                    disabled={index === heroNFTs.length - 1}
                  >
                    <ArrowDownward />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveNFT(nft)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      {/* Preview Section */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Visibility />
          <Typography variant="h6" fontWeight={600}>
            Preview
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This is how the Hero slider will appear on the home page.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 4,
            bgcolor: 'background.default',
            borderRadius: 2,
          }}
        >
          {heroNFTs.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 2, perspective: '1000px' }}>
              {heroNFTs.slice(0, 3).map((nft, index) => (
                <Box
                  key={`preview-${nft.contractAddress}-${nft.tokenId}`}
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 3,
                    transform: index === 1 ? 'scale(1.1)' : 'scale(0.9)',
                    opacity: index === 1 ? 1 : 0.7,
                    transition: 'all 0.3s',
                  }}
                >
                  {nft.image ? (
                    <Box
                      component="img"
                      src={ipfsToHttp(nft.image)}
                      alt={nft.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: 'grey.800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">No NFTs to preview</Typography>
          )}
        </Box>
      </Paper>

      {/* Add NFT Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select NFT for Hero Section</DialogTitle>
        <DialogContent>
          {loadingAvailable ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading NFTs...</Typography>
            </Box>
          ) : availableNFTs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary">
                No NFTs available. Mint some NFTs first.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 2,
                mt: 2,
              }}
            >
              {availableNFTs.map((nft) => {
                const inHero = isInHero(nft);
                return (
                  <Card
                    key={`${nft.contractAddress}-${nft.tokenId}`}
                    sx={{
                      cursor: inHero ? 'default' : 'pointer',
                      opacity: inHero ? 0.5 : 1,
                      transition: 'all 0.2s',
                      '&:hover': inHero ? {} : { transform: 'translateY(-4px)', boxShadow: 4 },
                    }}
                    onClick={() => !inHero && handleAddNFT(nft)}
                  >
                    {/* Square Image */}
                    <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                      {nft.image ? (
                        <Box
                          component="img"
                          src={nft.image}
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
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.800',
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                        </Box>
                      )}
                      <Chip
                        label={nft.contractType}
                        size="small"
                        color={nft.contractType === 'ERC721' ? 'primary' : 'secondary'}
                        sx={{ position: 'absolute', top: 8, left: 8 }}
                      />
                      {inHero && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(0,0,0,0.6)',
                          }}
                        >
                          <Chip label="Already Added" color="success" />
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ p: 1.5 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {nft.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        #{nft.tokenId}
                      </Typography>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HeroSettings;
