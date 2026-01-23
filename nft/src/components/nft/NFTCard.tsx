import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Skeleton,
  useTheme,
  Tooltip,
} from '@mui/material';
import { Favorite, FavoriteBorder, Timer, Gavel, Visibility, Token, Image as ImageIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Listing, NFTMetadata, RentalListing } from '../../types';
import { ListingType, RentalStatus } from '../../types';
import { Home } from '@mui/icons-material';
import { formatEther } from 'ethers';
import { usePayment } from '../../contexts/PaymentContext';
import { ipfsToHttp } from '../../utils/ipfs';

interface NFTCardProps {
  listing?: Listing;
  rentalListing?: RentalListing;
  tokenId?: string;
  contractAddress?: string;
  metadata?: NFTMetadata;
  price?: string;
  paymentSymbol?: string;
  isAuction?: boolean;
  endTime?: number;
  loading?: boolean;
  onBuy?: () => void;
  onBid?: () => void;
  onClick?: () => void;
  // New props
  contractType?: 'ERC721' | 'ERC1155' | 'erc721' | 'erc1155';
  balance?: number;
  isOwned?: boolean;
  hideBuyButton?: boolean;
  extraInfo?: string;
}

const NFTCard: React.FC<NFTCardProps> = ({
  listing,
  rentalListing,
  tokenId,
  contractAddress,
  metadata,
  price,
  paymentSymbol = 'POL',
  isAuction = false,
  endTime,
  loading = false,
  onBuy,
  onBid,
  onClick,
  contractType,
  balance,
  isOwned,
  hideBuyButton = false,
  extraInfo,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getPrice, formatUsd, getTokenByAddress } = usePayment();
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={250} />
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      </Card>
    );
  }

  const nftMetadata = metadata || listing?.metadata;
  const nftTokenId = tokenId || listing?.tokenId || rentalListing?.tokenId;
  const nftContract = contractAddress || listing?.nftContract || rentalListing?.nftContract;

  // Get payment token info from listing
  const listingPaymentToken = listing?.paymentToken ? getTokenByAddress(listing.paymentToken) : null;
  const rentalPaymentToken = rentalListing?.paymentToken ? getTokenByAddress(rentalListing.paymentToken) : null;

  // Calculate price based on token decimals
  const nftPrice = price || (listing?.price ? (
    listingPaymentToken?.decimals === 6
      ? (Number(listing.price) / Math.pow(10, 6)).toString()
      : formatEther(listing.price)
  ) : null);

  const rentalPrice = rentalListing?.pricePerDay ? (
    rentalPaymentToken?.decimals === 6
      ? (Number(rentalListing.pricePerDay) / Math.pow(10, 6)).toString()
      : formatEther(rentalListing.pricePerDay)
  ) : null;

  // Determine actual payment symbol
  const actualPaymentSymbol = listingPaymentToken?.symbol || rentalPaymentToken?.symbol || paymentSymbol;

  const isAuctionType = isAuction || listing?.listingType === ListingType.Auction;
  const isRental = !!rentalListing;
  const showPrice = nftPrice !== null && nftPrice !== undefined;

  // Determine if this is owned (no price, no listing)
  const isOwnedNFT = isOwned || (!listing && !price && !rentalListing);

  // Get image URL using ipfsToHttp
  const imageUrl = nftMetadata?.image ? ipfsToHttp(nftMetadata.image) : '';

  const getTimeRemaining = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleViewDetails = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/nft/${nftContract}/${nftTokenId}`);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
      onClick={handleViewDetails}
    >
      {/* Square aspect ratio container */}
      <Box sx={{ position: 'relative', paddingTop: '100%' }}>
        {/* Image placeholder while loading or on error */}
        {(!imageLoaded || imageError || !imageUrl) && (
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
              color: 'grey.500',
            }}
          >
            <ImageIcon sx={{ fontSize: 64 }} />
          </Box>
        )}
        {/* Actual image */}
        {imageUrl && !imageError && (
          <Box
            component="img"
            src={imageUrl}
            alt={nftMetadata?.name || 'NFT'}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none',
            }}
          />
        )}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          {liked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>

        {/* Contract Type Badge */}
        {contractType && (
          <Chip
            icon={<Token />}
            label={contractType.toUpperCase()}
            size="small"
            color={contractType.toLowerCase() === 'erc721' ? 'primary' : 'secondary'}
            sx={{ position: 'absolute', top: 8, left: 8 }}
          />
        )}

        {/* Auction Badge */}
        {isAuctionType && !contractType && (
          <Chip
            icon={<Gavel />}
            label="Auction"
            size="small"
            color="secondary"
            sx={{ position: 'absolute', top: 8, left: 8 }}
          />
        )}

        {/* Rental Badge */}
        {isRental && !contractType && (
          <Chip
            icon={<Home />}
            label={rentalListing?.status === RentalStatus.Rented ? "Rented" : "For Rent"}
            size="small"
            color={rentalListing?.status === RentalStatus.Rented ? "warning" : "info"}
            sx={{ position: 'absolute', top: 8, left: 8 }}
          />
        )}

        {/* Balance Badge for ERC-1155 */}
        {balance && balance > 1 && (
          <Chip
            label={`x${balance}`}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          noWrap
          sx={{ textDecoration: 'none', color: 'text.primary' }}
        >
          {nftMetadata?.name || `NFT #${nftTokenId}`}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
          {extraInfo || nftMetadata?.description || 'No description'}
        </Typography>

        {isRental && rentalPrice ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title={`${parseFloat(rentalPrice).toFixed(4)} ${actualPaymentSymbol}/day`}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Price Per Day
                </Typography>
                <Typography variant="h6" fontWeight={700} color="info.main">
                  {formatUsd(parseFloat(rentalPrice) * getPrice(actualPaymentSymbol))}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {parseFloat(rentalPrice).toFixed(4)} {actualPaymentSymbol}
                </Typography>
              </Box>
            </Tooltip>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {rentalListing?.minDuration}-{rentalListing?.maxDuration} days
              </Typography>
            </Box>
          </Box>
        ) : showPrice ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title={`${parseFloat(nftPrice).toFixed(4)} ${actualPaymentSymbol}`}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {isAuctionType ? 'Current Bid' : 'Price'}
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {formatUsd(parseFloat(nftPrice) * getPrice(actualPaymentSymbol))}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {parseFloat(nftPrice).toFixed(4)} {actualPaymentSymbol}
                </Typography>
              </Box>
            </Tooltip>

            {isAuctionType && endTime && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Timer fontSize="small" /> Ends in
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {getTimeRemaining(endTime)}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Not Listed
            </Typography>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Owned
            </Typography>
          </Box>
        )}
      </CardContent>

      {!hideBuyButton && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          {isOwnedNFT ? (
            <Button
              variant="outlined"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              startIcon={<Visibility />}
            >
              View / List
            </Button>
          ) : isRental ? (
            <Button
              variant="contained"
              color="info"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              startIcon={<Home />}
            >
              Rent Now
            </Button>
          ) : isAuctionType ? (
            <Button
              variant="contained"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                if (onBid) {
                  onBid();
                } else {
                  // Navigate to detail page for bidding
                  handleViewDetails();
                }
              }}
              startIcon={<Gavel />}
            >
              Place Bid
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                if (onBuy) {
                  onBuy();
                } else {
                  // Navigate to detail page for purchase
                  handleViewDetails();
                }
              }}
            >
              Buy Now
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default NFTCard;
