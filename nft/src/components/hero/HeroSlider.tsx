import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, IconButton, Skeleton } from '@mui/material';
import { Verified, ChevronLeft, ChevronRight, Image as ImageIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ipfsToHttp } from '../../utils/ipfs';

interface HeroNFT {
  tokenId: string;
  contractAddress: string;
  name: string;
  image: string;
  collectionName?: string;
}

interface HeroSliderProps {
  nfts: HeroNFT[];
  loading?: boolean;
  autoPlayInterval?: number;
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  nfts,
  loading = false,
  autoPlayInterval = 4000,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  // Auto-play slider
  useEffect(() => {
    if (nfts.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % nfts.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [nfts.length, autoPlayInterval]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + nfts.length) % nfts.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % nfts.length);
  };

  const handleCardClick = (nft: HeroNFT) => {
    navigate(`/nft/${nft.contractAddress}/${nft.tokenId}`);
  };

  // Get NFTs to display: main + 2 side cards
  const getDisplayNFTs = () => {
    if (nfts.length === 0) return [];
    if (nfts.length === 1) return [{ nft: nfts[0], position: 'main' as const }];
    if (nfts.length === 2) return [
      { nft: nfts[activeIndex], position: 'main' as const },
      { nft: nfts[(activeIndex + 1) % nfts.length], position: 'side1' as const },
    ];

    return [
      { nft: nfts[activeIndex], position: 'main' as const },
      { nft: nfts[(activeIndex + 1) % nfts.length], position: 'side1' as const },
      { nft: nfts[(activeIndex + 2) % nfts.length], position: 'side2' as const },
    ];
  };

  const renderCard = (
    nft: HeroNFT,
    position: 'main' | 'side1' | 'side2',
    index: number
  ) => {
    const imageUrl = ipfsToHttp(nft.image);
    const isMain = position === 'main';

    return (
      <Box
        key={`${nft.contractAddress}-${nft.tokenId}-${position}`}
        onClick={() => handleCardClick(nft)}
        sx={{
          cursor: 'pointer',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: isMain
            ? '0 20px 40px rgba(0,0,0,0.4)'
            : '0 10px 20px rgba(0,0,0,0.2)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: isMain ? 'scale(1.02)' : 'scale(1.05)',
          },
        }}
      >
        {/* Square Image Container */}
        <Box
          sx={{
            position: 'relative',
            paddingTop: '100%',
            bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
          }}
        >
          {/* Placeholder */}
          {(!imageLoaded[index] || imageError[index] || !imageUrl) && (
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
                bgcolor: theme.palette.mode === 'light' ? 'grey.300' : 'grey.700',
              }}
            >
              <ImageIcon sx={{ fontSize: isMain ? 64 : 32, color: 'grey.500' }} />
            </Box>
          )}

          {/* Actual Image */}
          {imageUrl && !imageError[index] && (
            <Box
              component="img"
              src={imageUrl}
              alt={nft.name}
              onLoad={() => setImageLoaded((prev) => ({ ...prev, [index]: true }))}
              onError={() => setImageError((prev) => ({ ...prev, [index]: true }))}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: imageLoaded[index] ? 'block' : 'none',
              }}
            />
          )}

          {/* Gradient Overlay for Text (main card only) */}
          {isMain && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
              }}
            />
          )}

          {/* NFT Info */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: isMain ? 2.5 : 1.5,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.9,
                  fontSize: isMain ? '0.75rem' : '0.65rem',
                }}
              >
                {nft.collectionName || 'Alma ERC-721'}
              </Typography>
              <Verified sx={{ fontSize: isMain ? 14 : 10, color: 'primary.main' }} />
            </Box>
            <Typography
              variant={isMain ? 'h6' : 'body2'}
              fontWeight={600}
              noWrap
              sx={{ fontSize: isMain ? '1.1rem' : '0.8rem' }}
            >
              {nft.name}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Skeleton
          variant="rectangular"
          sx={{
            width: { xs: 280, sm: 320, md: 360 },
            height: { xs: 280, sm: 320, md: 360 },
            borderRadius: 3,
          }}
        />
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', gap: 2 }}>
          <Skeleton variant="rectangular" sx={{ width: 140, height: 140, borderRadius: 2 }} />
          <Skeleton variant="rectangular" sx={{ width: 140, height: 140, borderRadius: 2 }} />
        </Box>
      </Box>
    );
  }

  if (nfts.length === 0) {
    return (
      <Box
        sx={{
          width: { xs: 280, sm: 320, md: 360 },
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
          <ImageIcon sx={{ fontSize: 64, mb: 1 }} />
          <Typography>No featured NFTs</Typography>
        </Box>
      </Box>
    );
  }

  const displayNFTs = getDisplayNFTs();

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Cards Layout: Main + Side */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1.5, sm: 2 },
          alignItems: 'flex-start',
        }}
      >
        {/* Main Card */}
        <Box sx={{ width: { xs: 260, sm: 300, md: 340 }, flexShrink: 0 }}>
          {displayNFTs[0] && renderCard(displayNFTs[0].nft, 'main', activeIndex)}
        </Box>

        {/* Side Cards Column */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 2,
            width: { sm: 130, md: 150 },
          }}
        >
          {displayNFTs[1] && (
            <Box sx={{ opacity: 0.85 }}>
              {renderCard(displayNFTs[1].nft, 'side1', (activeIndex + 1) % nfts.length)}
            </Box>
          )}
          {displayNFTs[2] && (
            <Box sx={{ opacity: 0.7 }}>
              {renderCard(displayNFTs[2].nft, 'side2', (activeIndex + 2) % nfts.length)}
            </Box>
          )}
        </Box>
      </Box>

      {/* Navigation Controls */}
      {nfts.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          {/* Prev/Next Buttons */}
          <IconButton
            onClick={handlePrev}
            size="small"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <ChevronLeft />
          </IconButton>

          {/* Dots Indicator */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {nfts.map((_, index) => (
              <Box
                key={index}
                onClick={() => setActiveIndex(index)}
                sx={{
                  width: index === activeIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: index === activeIndex ? 'primary.main' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </Box>

          <IconButton
            onClick={handleNext}
            size="small"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default HeroSlider;
