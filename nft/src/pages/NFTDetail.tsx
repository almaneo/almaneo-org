import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Skeleton,
  Alert,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Gavel,
  ShoppingCart,
  LocalOffer,
  Timer,
  ContentCopy,
  ArrowBack,
  OpenInNew,
  VerifiedUser,
  Storefront,
  Replay,
} from '@mui/icons-material';
import { useWeb3 } from '../contexts/Web3Context';
import { useContracts, useReadOnlyContracts } from '../hooks/useContracts';
import { usePayment } from '../contexts/PaymentContext';
import { useERC20 } from '../hooks/useERC20';
import { PriceDisplay } from '../components/payment/PriceDisplay';
import { TokenSelector } from '../components/payment/TokenSelector';
import type { NFTMetadata, Listing, Auction, Offer, RentalListing, ActiveRental } from '../types';
import { ListingType, ListingStatus, OfferStatus, RentalStatus } from '../types';
import { formatEther, parseEther } from 'ethers';
import { getTxOptions, getTxOptionsWithValue } from '../utils/gas';
import { CONTRACTS } from '../contracts/addresses';
import { ipfsToHttp } from '../utils/ipfs';
import { Image as ImageIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface TransactionHistory {
  transactionId: number;
  from: string;
  to: string;
  price: string;
  paymentToken: string;
  timestamp: number;
  transactionType: string;
}

const NFTDetail: React.FC = () => {
  const { contractAddress, tokenId } = useParams<{ contractAddress: string; tokenId: string }>();
  const navigate = useNavigate();
  const { address, isConnected, signer, connect } = useWeb3();
  const walletContracts = useContracts(); // For write operations (needs wallet)
  const readOnlyContracts = useReadOnlyContracts(); // For read operations (no wallet needed)
  const contracts = walletContracts || readOnlyContracts; // Use wallet contracts if available, else read-only

  // Wallet connection dialog state
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const {
    selectedToken,
    setSelectedToken,
    activeTokens,
    formatUsd,
    getPrice,
    getTokenByAddress,
  } = usePayment();
  const { ensureAllowance, getBalance, loading: erc20Loading } = useERC20();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [owner, setOwner] = useState<string>('');
  const [listing, setListing] = useState<Listing | null>(null);
  const [auction, setAuction] = useState<Auction | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [rentalListing, setRentalListing] = useState<RentalListing | null>(null);
  const [activeRental, setActiveRental] = useState<ActiveRental | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Dialog states
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [rentDialogOpen, setRentDialogOpen] = useState(false);

  // Form states
  const [bidAmount, setBidAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerDuration, setOfferDuration] = useState('7');
  const [listPrice, setListPrice] = useState('');
  const [listType, setListType] = useState<'fixed' | 'auction' | 'rental'>('fixed');
  const [listDuration, setListDuration] = useState('7');
  const [listPaymentToken, setListPaymentToken] = useState<string>('0x0000000000000000000000000000000000000000'); // Default to POL
  const [rentalMinDays, setRentalMinDays] = useState('1');
  const [rentalMaxDays, setRentalMaxDays] = useState('30');
  const [rentalDays, setRentalDays] = useState('1');

  // Token balance states for dialogs
  const [tokenBalance, setTokenBalance] = useState<bigint>(0n);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Offer payment token state
  const [offerPaymentToken, setOfferPaymentToken] = useState<typeof selectedToken>(null);

  const [processing, setProcessing] = useState(false);

  // Image loading states
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image states when metadata changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [metadata?.image]);

  // ERC4907 user info states
  const [nftUser, setNftUser] = useState<string | null>(null);
  const [nftUserExpires, setNftUserExpires] = useState<number | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  // ERC-1155 inventory info (supply tracking)
  const [inventoryInfo, setInventoryInfo] = useState<{
    originalMinter: string;
    minterRemaining: number;
    totalSold: number;
    totalSupply: number;
    isOriginalSale: boolean;
  } | null>(null);

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();
  const is1155 = contractAddress?.toLowerCase() === CONTRACTS.AlmaNFT1155.toLowerCase();

  // For rental listings, check if current user is the rental listing owner
  const isRentalOwner = address && rentalListing && address.toLowerCase() === rentalListing.owner.toLowerCase();

  // Require wallet connection before action
  const requireWallet = (callback: () => void) => {
    if (!isConnected) {
      setWalletDialogOpen(true);
    } else {
      callback();
    }
  };

  // Handle wallet connection from dialog
  const handleConnectWallet = async () => {
    try {
      await connect();
      setWalletDialogOpen(false);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  useEffect(() => {
    if (contractAddress && tokenId) {
      fetchNFTData();
    }
  }, [contractAddress, tokenId, contracts]);

  // Analyze ERC-1155 inventory when transactions/listing are loaded
  useEffect(() => {
    if (is1155 && contracts && tokenId && !loading) {
      analyzeInventory();
    }
  }, [is1155, contracts, tokenId, loading, transactions, listing]);

  // Fetch token balance when dialogs open or token changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) {
        setTokenBalance(0n);
        return;
      }

      // Determine which token to check based on open dialog
      let tokenToCheck: string | null = null;

      if (buyDialogOpen && selectedToken) {
        tokenToCheck = selectedToken.address;
      } else if (bidDialogOpen && listing) {
        tokenToCheck = listing.paymentToken;
      } else if (offerDialogOpen) {
        tokenToCheck = offerPaymentToken?.address || '0x0000000000000000000000000000000000000000';
      }

      if (tokenToCheck) {
        setBalanceLoading(true);
        try {
          const balance = await getBalance(tokenToCheck);
          setTokenBalance(balance);
        } catch (err) {
          console.error('Error fetching balance:', err);
          setTokenBalance(0n);
        } finally {
          setBalanceLoading(false);
        }
      }
    };

    fetchBalance();
  }, [buyDialogOpen, bidDialogOpen, offerDialogOpen, selectedToken, offerPaymentToken, listing, address, getBalance]);

  // Set default offer payment token when dialog opens
  useEffect(() => {
    if (offerDialogOpen && !offerPaymentToken && activeTokens.length > 0) {
      // Default to POL (native token) or first active token
      const defaultToken = activeTokens.find(t => t.isNative) || activeTokens[0];
      setOfferPaymentToken(defaultToken);
    }
  }, [offerDialogOpen, offerPaymentToken, activeTokens]);

  const fetchNFTData = async () => {
    if (!contracts || !contractAddress || !tokenId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch token URI
      let tokenURI = '';
      try {
        tokenURI = is1155
          ? await contracts.nft1155.uri(tokenId)
          : await contracts.nft721.tokenURI(tokenId);
      } catch (e) {
        console.error('Error fetching tokenURI:', e);
      }

      // Fetch owner - for ERC-1155, check if current user has balance
      let ownerAddress = '';
      if (is1155) {
        if (address) {
          const balance = await contracts.nft1155.balanceOf(address, tokenId);
          if (Number(balance) > 0) {
            ownerAddress = address;
          }
        }
      } else {
        try {
          ownerAddress = await contracts.nft721.ownerOf(tokenId);
        } catch (e) {
          console.error('Error fetching owner:', e);
        }
      }

      setOwner(ownerAddress);

      // Fetch metadata from token URI
      if (tokenURI) {
        try {
          const metadataUrl = ipfsToHttp(tokenURI);
          const response = await fetch(metadataUrl);
          const metadataJson = await response.json();

          // Convert IPFS image URL using Pinata gateway
          metadataJson.image = ipfsToHttp(metadataJson.image || '');

          setMetadata(metadataJson);
        } catch (e) {
          console.error('Error fetching metadata:', e);
          setMetadata({
            name: `NFT #${tokenId}`,
            description: 'Metadata unavailable',
            image: '',
          });
        }
      }

      // Fetch active listing
      try {
        const listingId = await contracts.marketplace.getActiveListingForNFT(contractAddress, tokenId);
        if (listingId && Number(listingId) > 0) {
          const listingData = await contracts.marketplace.getListing(listingId);
          const formattedListing: Listing = {
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
          setListing(formattedListing);

          // Fetch auction details if it's an auction
          if (formattedListing.listingType === ListingType.Auction) {
            const auctionData = await contracts.marketplace.getAuction(listingId);
            setAuction({
              listingId: Number(auctionData.listingId),
              minBid: auctionData.minBid.toString(),
              minBidIncrement: auctionData.minBidIncrement.toString(),
              highestBid: auctionData.highestBid.toString(),
              highestBidder: auctionData.highestBidder,
              endTime: Number(auctionData.endTime),
              settled: auctionData.settled,
            });
          }
        }
      } catch (e) {
        console.log('No active listing found');
      }

      // Fetch offers
      try {
        const offersData = await contracts.marketplace.getNFTOffers(contractAddress, tokenId);
        const formattedOffers: Offer[] = offersData.map((o: any) => ({
          offerId: Number(o.offerId),
          nftContract: o.nftContract,
          tokenId: o.tokenId.toString(),
          amount: Number(o.amount),
          nftType: o.nftType === 0 ? 'ERC721' : 'ERC1155',
          offerer: o.offerer,
          paymentToken: o.paymentToken,
          price: o.price.toString(),
          expiry: Number(o.expiry),
          status: Number(o.status) as OfferStatus,
        }));
        setOffers(formattedOffers.filter(o => o.status === OfferStatus.Pending));
      } catch (e) {
        console.log('Error fetching offers:', e);
      }

      // Fetch transaction history
      try {
        const txData = await contracts.marketplace.getNFTTransactions(contractAddress, tokenId);
        const formattedTx: TransactionHistory[] = txData.map((tx: any) => ({
          transactionId: Number(tx.transactionId),
          from: tx.from,
          to: tx.to,
          price: tx.price.toString(),
          paymentToken: tx.paymentToken,
          timestamp: Number(tx.timestamp),
          transactionType: tx.transactionType,
        }));
        setTransactions(formattedTx.sort((a, b) => b.timestamp - a.timestamp));
      } catch (e) {
        console.log('Error fetching transactions:', e);
      }

      // Fetch rental listing
      try {
        const rentalListingId = await contracts.marketplace.getNFTRentalListing(contractAddress, tokenId);
        if (Number(rentalListingId) > 0) {
          const rentalData = await contracts.marketplace.getRentalListing(rentalListingId);
          const formattedRental: RentalListing = {
            rentalId: Number(rentalData.rentalId),
            nftContract: rentalData.nftContract,
            tokenId: rentalData.tokenId.toString(),
            amount: Number(rentalData.amount),
            nftType: rentalData.nftType === 0 ? 'ERC721' : 'ERC1155',
            owner: rentalData.owner,
            paymentToken: rentalData.paymentToken,
            pricePerDay: rentalData.pricePerDay.toString(),
            minDuration: Number(rentalData.minDuration),
            maxDuration: Number(rentalData.maxDuration),
            status: Number(rentalData.status) as RentalStatus,
          };
          setRentalListing(formattedRental);

          // Fetch active rental if rented
          if (formattedRental.status === RentalStatus.Rented) {
            try {
              const activeRentalId = await contracts.marketplace.getRentalActiveRental(rentalListingId);
              if (activeRentalId > 0) {
                const activeData = await contracts.marketplace.getActiveRental(activeRentalId);
                setActiveRental({
                  rentalId: Number(activeData.rentalId),
                  renter: activeData.renter,
                  startTime: Number(activeData.startTime),
                  endTime: Number(activeData.endTime),
                  totalPrice: activeData.totalPaid.toString(),
                });
              }
            } catch (e) {
              console.log('Error fetching active rental:', e);
            }
          }
        }
      } catch (e: any) {
        // No rental listing found
        setRentalListing(null);
        setActiveRental(null);
      }

    } catch (err: any) {
      console.error('Error fetching NFT data:', err);
      setError(err.message || 'Failed to load NFT data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch ERC4907 user info (userOf, userExpires)
  const fetchUserInfo = async () => {
    if (!contracts || !contractAddress || !tokenId || is1155) return;

    setLoadingUserInfo(true);
    try {
      // Call userOf(tokenId) on the NFT contract
      const user = await contracts.nft721.userOf(tokenId);
      const expires = await contracts.nft721.userExpires(tokenId);

      setNftUser(user);
      setNftUserExpires(Number(expires));
    } catch (err) {
      console.error('Error fetching userOf:', err);
      setNftUser(null);
      setNftUserExpires(null);
    } finally {
      setLoadingUserInfo(false);
    }
  };

  // Analyze ERC-1155 inventory (original minter, sold/remaining quantities)
  const analyzeInventory = async () => {
    if (!is1155 || !contracts || !tokenId) return;

    try {
      // Get token info first
      let supply = 0;
      let minter = '';

      try {
        const tokenInfo = await contracts.nft1155.getTokenInfo(tokenId);
        supply = Number(tokenInfo.totalSupply);
      } catch (e) {
        // Fallback: try totalSupply for the token
        try {
          supply = Number(await contracts.nft1155.totalSupply(tokenId));
        } catch (e2) {
          console.log('Could not get supply:', e2);
          supply = 1; // Default to 1 if can't get supply
        }
      }

      // Find original minter from transaction history (first Mint transaction)
      if (transactions.length > 0) {
        const mintTx = transactions.find(tx =>
          tx.transactionType === 'Mint' || tx.transactionType === '5'
        );
        if (mintTx) {
          minter = mintTx.to;
        } else {
          // Fallback: get from first transaction (oldest)
          const sortedTx = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
          minter = sortedTx[0].to;
        }
      }

      // If no minter found from transactions, use listing seller as fallback
      if (!minter && listing?.seller) {
        minter = listing.seller;
      }

      // If still no minter, we can't proceed with full analysis
      // but we can still show supply info
      let minterBalance = 0;
      if (minter) {
        try {
          minterBalance = Number(await contracts.nft1155.balanceOf(minter, tokenId));
        } catch (e) {
          console.log('Could not get minter balance:', e);
        }
      }

      // Check if current listing is original sale
      const isOriginal = Boolean(minter && listing?.seller?.toLowerCase() === minter.toLowerCase());

      setInventoryInfo({
        originalMinter: minter || 'Unknown',
        minterRemaining: minterBalance,
        totalSold: supply - minterBalance,
        totalSupply: supply,
        isOriginalSale: isOriginal,
      });
    } catch (err) {
      console.error('Error analyzing inventory:', err);
    }
  };

  const handleBuy = async () => {
    if (!contracts || !listing || !signer || !contractAddress || !tokenId) return;

    setProcessing(true);
    try {
      // Debug: Check NFT ownership and approval before purchase
      const nftContract = is1155 ? contracts.nft1155 : contracts.nft721;
      const seller = listing.seller;

      // Check approval
      const isApproved = await nftContract.isApprovedForAll(seller, CONTRACTS.AlmaMarketplace);
      console.log('Seller:', seller);
      console.log('Marketplace approved:', isApproved);

      // Check ownership
      if (is1155) {
        const balance = await contracts.nft1155.balanceOf(seller, tokenId);
        console.log('Seller ERC-1155 balance:', balance.toString());
      } else {
        const currentOwner = await contracts.nft721.ownerOf(tokenId);
        console.log('Current ERC-721 owner:', currentOwner);
        console.log('Seller matches owner:', currentOwner.toLowerCase() === seller.toLowerCase());
      }

      if (!isApproved) {
        setError('NFT is not approved for marketplace. Seller needs to approve first.');
        setProcessing(false);
        return;
      }

      // Calculate total payment including buyer fee (1%)
      const price = BigInt(listing.price);
      const buyerFeeBps = 100n; // 1%
      const buyerFee = (price * buyerFeeBps) / 10000n;
      const totalPayment = price + buyerFee;

      const isNativePayment = listing.paymentToken === '0x0000000000000000000000000000000000000000';

      // For ERC-20 tokens, ensure allowance before purchase
      if (!isNativePayment) {
        console.log('ERC-20 payment detected, checking allowance...');
        const hasAllowance = await ensureAllowance(listing.paymentToken, totalPayment);
        if (!hasAllowance) {
          setError('Failed to approve token. Please try again.');
          setProcessing(false);
          return;
        }
        console.log('ERC-20 allowance confirmed');
      }

      const value = isNativePayment ? totalPayment : 0n;
      const txOptions = getTxOptionsWithValue('buy', value);
      console.log('Buying listing:', listing.listingId, 'price:', price.toString(), 'fee:', buyerFee.toString(), 'total:', totalPayment.toString(), 'native:', isNativePayment);
      const tx = await contracts.marketplace.buyNow(listing.listingId, txOptions);
      console.log('Buy tx sent:', tx.hash);
      await tx.wait();
      console.log('Buy tx confirmed');
      setBuyDialogOpen(false);
      fetchNFTData();
    } catch (err: any) {
      console.error('Buy error:', err);
      // Parse contract errors
      let errorMsg = 'Failed to buy NFT';
      const errorData = err.data || err.error?.data;
      if (errorData) {
        const selector = typeof errorData === 'string' ? errorData.slice(0, 10) : '';
        const errorMap: Record<string, string> = {
          '0x25ab8dcc': 'This listing does not exist',
          '0x66cb03e9': 'This listing is not active',
          '0x398cfd02': 'This listing has expired',
          '0x1d547fe3': 'You cannot buy your own NFT',
          '0xc19f17a9': 'NFT is not approved for marketplace',
          '0xf499da20': 'Payment processing failed',
          '0xf4d678b8': 'Insufficient balance',
          '0xf4b3b1bc': 'Native token transfer failed',
          '0xfb8f41b2': 'Insufficient token allowance',
        };
        if (errorMap[selector]) {
          errorMsg = errorMap[selector];
        }
      } else if (err.reason) {
        errorMsg = err.reason;
      } else if (err.message?.includes('user rejected')) {
        errorMsg = 'Transaction was cancelled';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!contracts || !listing || !signer || !bidAmount) return;

    setProcessing(true);
    try {
      const bidValue = parseEther(bidAmount);
      const isNativeToken = listing.paymentToken === '0x0000000000000000000000000000000000000000';

      // For ERC-20 tokens, ensure allowance first
      if (!isNativeToken) {
        console.log('Bid with ERC-20 token, ensuring allowance...');
        const approved = await ensureAllowance(listing.paymentToken, bidValue);
        if (!approved) {
          setError('Token approval failed or was rejected');
          setProcessing(false);
          return;
        }
        console.log('Token approved for bid');
      }

      // For native tokens, send value; for ERC-20, value is 0
      const value = isNativeToken ? bidValue : 0n;

      console.log('Placing bid:', listing.listingId, 'amount:', bidValue.toString());
      const tx = await contracts.marketplace.placeBid(
        listing.listingId,
        bidValue,
        getTxOptionsWithValue('bid', value)
      );
      console.log('Bid tx sent:', tx.hash);
      await tx.wait();
      console.log('Bid tx confirmed');
      setBidDialogOpen(false);
      setBidAmount('');
      fetchNFTData();
    } catch (err: any) {
      console.error('Bid error:', err);
      setError(err.message || 'Failed to place bid');
    } finally {
      setProcessing(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!contracts || !signer || !offerAmount || !contractAddress || !tokenId || !offerPaymentToken) return;

    setProcessing(true);
    try {
      const paymentTokenAddress = offerPaymentToken.address;
      const isNativeToken = paymentTokenAddress === '0x0000000000000000000000000000000000000000';

      // Parse offer value based on token decimals
      let offerValue: bigint;
      if (offerPaymentToken.decimals === 18) {
        offerValue = parseEther(offerAmount);
      } else {
        offerValue = BigInt(Math.floor(parseFloat(offerAmount) * Math.pow(10, offerPaymentToken.decimals)));
      }

      const duration = parseInt(offerDuration) * 24 * 60 * 60; // Convert days to seconds

      // Calculate total amount including 1% buyer fee
      const buyerFee = offerValue / 100n; // 1% fee
      const totalValue = offerValue + buyerFee;

      console.log('Making offer:', {
        paymentToken: paymentTokenAddress,
        price: offerValue.toString(),
        buyerFee: buyerFee.toString(),
        totalValue: totalValue.toString(),
        isNativeToken
      });

      // For ERC-20 tokens, ensure allowance first
      if (!isNativeToken) {
        console.log('Offer with ERC-20 token, ensuring allowance...');
        const approved = await ensureAllowance(paymentTokenAddress, totalValue);
        if (!approved) {
          setError('Token approval failed or was rejected');
          setProcessing(false);
          return;
        }
        console.log('Token approved for offer');
      }

      const tx = await contracts.marketplace.makeOffer(
        contractAddress,
        tokenId,
        1, // amount
        is1155 ? 1 : 0, // nftType
        paymentTokenAddress,
        offerValue,
        duration,
        isNativeToken ? getTxOptionsWithValue('offer', totalValue) : getTxOptions('offer')
      );
      await tx.wait();
      setOfferDialogOpen(false);
      setOfferAmount('');
      fetchNFTData();
    } catch (err: any) {
      console.error('Offer error:', err);
      setError(err.message || 'Failed to make offer');
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptOffer = async (offerId: number) => {
    if (!contracts || !signer || !address) return;

    setProcessing(true);
    try {
      const nftContract = is1155 ? contracts.nft1155 : contracts.nft721;

      // First approve the marketplace to transfer NFT
      const isApproved = await nftContract.isApprovedForAll(address, CONTRACTS.AlmaMarketplace);
      if (!isApproved) {
        console.log('Approving marketplace for NFT transfer...');
        const approveTx = await nftContract.setApprovalForAll(
          CONTRACTS.AlmaMarketplace,
          true,
          getTxOptions('approve')
        );
        console.log('Approval tx sent:', approveTx.hash);
        await approveTx.wait();
        console.log('Approval confirmed');
      }

      console.log('Accepting offer:', offerId);
      const tx = await contracts.marketplace.acceptOffer(offerId, getTxOptions('buy'));
      console.log('Accept offer tx sent:', tx.hash);
      await tx.wait();
      console.log('Offer accepted successfully');
      fetchNFTData();
    } catch (err: any) {
      console.error('Accept offer error:', err);
      setError(err.message || 'Failed to accept offer');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectOffer = async (offerId: number) => {
    if (!contracts || !signer) return;

    setProcessing(true);
    try {
      console.log('Rejecting offer:', offerId);
      const tx = await contracts.marketplace.rejectOffer(offerId, getTxOptions('cancel'));
      console.log('Reject offer tx sent:', tx.hash);
      await tx.wait();
      console.log('Offer rejected successfully');
      fetchNFTData();
    } catch (err: any) {
      console.error('Reject offer error:', err);
      let errorMsg = 'Failed to reject offer';
      const errorData = err.data || err.error?.data;
      if (errorData) {
        const selector = typeof errorData === 'string' ? errorData.slice(0, 10) : '';
        const errorMap: Record<string, string> = {
          '0x': 'Offer not found',
        };
        if (errorMap[selector]) {
          errorMsg = errorMap[selector];
        }
      } else if (err.reason) {
        errorMsg = err.reason;
      } else if (err.message?.includes('user rejected')) {
        errorMsg = 'Transaction was cancelled';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelOffer = async (offerId: number) => {
    if (!contracts || !signer) return;

    setProcessing(true);
    try {
      console.log('Cancelling offer:', offerId);
      const tx = await contracts.marketplace.cancelOffer(offerId, getTxOptions('cancel'));
      console.log('Cancel offer tx sent:', tx.hash);
      await tx.wait();
      console.log('Offer cancelled successfully');
      fetchNFTData();
    } catch (err: any) {
      console.error('Cancel offer error:', err);
      let errorMsg = 'Failed to cancel offer';
      const errorData = err.data || err.error?.data;
      if (errorData) {
        const selector = typeof errorData === 'string' ? errorData.slice(0, 10) : '';
        const errorMap: Record<string, string> = {
          '0x': 'Offer not found',
        };
        if (errorMap[selector]) {
          errorMsg = errorMap[selector];
        }
      } else if (err.reason) {
        errorMsg = err.reason;
      } else if (err.message?.includes('user rejected')) {
        errorMsg = 'Transaction was cancelled';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateListing = async () => {
    if (!contracts || !signer || !listPrice || !contractAddress || !tokenId || !address || !selectedToken) return;

    setProcessing(true);
    try {
      const nftContract = is1155 ? contracts.nft1155 : contracts.nft721;

      // First approve the marketplace
      const isApproved = await nftContract.isApprovedForAll(address, CONTRACTS.AlmaMarketplace);
      if (!isApproved) {
        console.log('Approving marketplace for NFT contract...');
        const approveTx = await nftContract.setApprovalForAll(
          CONTRACTS.AlmaMarketplace,
          true,
          getTxOptions('approve')
        );
        console.log('Approval tx sent:', approveTx.hash);
        await approveTx.wait();
        console.log('Approval confirmed');
      }

      // Parse price based on selected token's decimals
      let price: bigint;
      if (selectedToken.decimals === 18) {
        price = parseEther(listPrice);
      } else {
        price = BigInt(Math.floor(parseFloat(listPrice) * Math.pow(10, selectedToken.decimals)));
      }
      const duration = parseInt(listDuration) * 24 * 60 * 60;
      const endTime = Math.floor(Date.now() / 1000) + duration;

      console.log('Creating listing...', { contractAddress, tokenId, price: price.toString(), endTime, paymentToken: listPaymentToken });

      if (listType === 'fixed') {
        const tx = await contracts.marketplace.createListing(
          contractAddress,
          tokenId,
          1, // amount
          is1155 ? 1 : 0, // nftType
          listPaymentToken, // Selected payment token
          price,
          endTime,
          getTxOptions('listing')
        );
        console.log('Listing tx sent:', tx.hash);
        await tx.wait();
      } else if (listType === 'auction') {
        // Minimum bid increment based on token decimals (0.01 for 18 decimals, 0.01 for 6 decimals)
        const minBidIncrement = selectedToken.decimals === 18
          ? parseEther('0.01')
          : BigInt(Math.floor(0.01 * Math.pow(10, selectedToken.decimals)));
        const tx = await contracts.marketplace.createAuction(
          contractAddress,
          tokenId,
          1, // amount
          is1155 ? 1 : 0, // nftType
          listPaymentToken, // Selected payment token
          price, // minBid
          minBidIncrement,
          duration,
          getTxOptions('listing')
        );
        console.log('Auction tx sent:', tx.hash);
        await tx.wait();
      } else if (listType === 'rental') {
        const minDuration = parseInt(rentalMinDays);
        const maxDuration = parseInt(rentalMaxDays);

        // Check if already has rental listing
        try {
          const existingRentalId = await contracts.marketplace.getNFTRentalListing(contractAddress, tokenId);
          if (existingRentalId > 0) {
            setError('This NFT already has an active rental listing. Cancel it first.');
            setProcessing(false);
            return;
          }
        } catch (e) {
          console.log('No existing rental listing');
        }

        console.log('Creating rental listing:', {
          nftContract: contractAddress,
          tokenId,
          pricePerDay: price.toString(),
          minDuration,
          maxDuration,
          is1155,
          paymentToken: listPaymentToken
        });
        const tx = await contracts.marketplace.listForRent(
          contractAddress,
          tokenId,
          1, // amount
          is1155 ? 1 : 0, // nftType
          listPaymentToken, // Selected payment token
          price, // pricePerDay
          minDuration,
          maxDuration,
          getTxOptions('listing')
        );
        console.log('Rental tx sent:', tx.hash);
        await tx.wait();
      }

      setListDialogOpen(false);
      setListPrice('');
      fetchNFTData();
    } catch (err: any) {
      console.error('Listing error:', err);
      // Extract more detailed error message
      let errorMsg = 'Failed to create listing';
      const errorData = err.data || err.error?.data;
      if (errorData) {
        const selector = typeof errorData === 'string' ? errorData.slice(0, 10) : '';
        const errorMap: Record<string, string> = {
          '0x3ee5aeb5': 'NFT is already listed',
          '0x6a172882': 'Invalid duration (min must be > 0, max must be >= min)',
          '0x3d693ada': 'NFT not approved for marketplace',
          '0xd92e233d': 'Invalid zero address',
          '0xe6c4247b': 'Invalid price',
          '0x2c5211c6': 'Invalid amount',
        };
        if (errorMap[selector]) {
          errorMsg = errorMap[selector];
        }
      } else if (err.reason) {
        errorMsg = err.reason;
      } else if (err.data?.message) {
        errorMsg = err.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelListing = async () => {
    if (!contracts || !signer || !listing) return;

    setProcessing(true);
    try {
      const tx = listing.listingType === ListingType.Auction
        ? await contracts.marketplace.cancelAuction(listing.listingId, getTxOptions('cancel'))
        : await contracts.marketplace.cancelListing(listing.listingId, getTxOptions('cancel'));
      await tx.wait();
      fetchNFTData();
    } catch (err: any) {
      console.error('Cancel error:', err);
      // Parse auction-specific errors
      let errorMsg = 'Failed to cancel listing';
      const errorData = err.data || err.error?.data;
      if (errorData) {
        const selector = typeof errorData === 'string' ? errorData.slice(0, 10) : '';
        if (selector === '0x5a34e7e1') { // AuctionHasBids
          errorMsg = 'Cannot cancel auction with existing bids';
        }
      } else if (err.reason) {
        errorMsg = err.reason;
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleSettleAuction = async () => {
    if (!contracts || !signer || !listing || !auction) return;

    setProcessing(true);
    try {
      console.log('Settling auction:', listing.listingId);
      const tx = await contracts.marketplace.settleAuction(listing.listingId, getTxOptions('buy'));
      console.log('Settle tx sent:', tx.hash);
      await tx.wait();
      console.log('Auction settled successfully');
      fetchNFTData();
    } catch (err: any) {
      console.error('Settle auction error:', err);
      let errorMsg = 'Failed to settle auction';
      const errorData = err.data || err.error?.data;
      if (errorData) {
        const selector = typeof errorData === 'string' ? errorData.slice(0, 10) : '';
        const errorMap: Record<string, string> = {
          '0x085de625': 'Auction has not ended yet',
          '0x66cb03e9': 'Auction already settled',
        };
        if (errorMap[selector]) {
          errorMsg = errorMap[selector];
        }
      } else if (err.reason) {
        errorMsg = err.reason;
      } else if (err.message?.includes('user rejected')) {
        errorMsg = 'Transaction was cancelled';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  // Rental handlers
  const handleRentNFT = async () => {
    if (!contracts || !signer || !rentalListing) return;

    setProcessing(true);
    try {
      const days = parseInt(rentalDays);
      const totalPrice = BigInt(rentalListing.pricePerDay) * BigInt(days);

      // Calculate total with 1% buyer fee
      const buyerFee = totalPrice / 100n;
      const totalValue = totalPrice + buyerFee;

      console.log('Renting NFT:', {
        rentalListingId: rentalListing.rentalId,
        days,
        pricePerDay: rentalListing.pricePerDay,
        totalPrice: totalPrice.toString(),
        totalValue: totalValue.toString()
      });

      const tx = await contracts.marketplace.rentNFT(
        rentalListing.rentalId,
        days,
        getTxOptionsWithValue('buy', totalValue)
      );
      console.log('Rent tx sent:', tx.hash);
      await tx.wait();
      console.log('NFT rented successfully');
      setRentDialogOpen(false);
      setRentalDays('1');
      fetchNFTData();
    } catch (err: any) {
      console.error('Rent error:', err);
      let errorMsg = 'Failed to rent NFT';
      if (err.reason) {
        errorMsg = err.reason;
      } else if (err.message?.includes('user rejected')) {
        errorMsg = 'Transaction was cancelled';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleEndRental = async () => {
    if (!contracts || !signer || !activeRental) return;

    setProcessing(true);
    try {
      console.log('Ending rental:', activeRental.rentalId);
      const tx = await contracts.marketplace.endRental(activeRental.rentalId, getTxOptions('cancel'));
      console.log('End rental tx sent:', tx.hash);
      await tx.wait();
      console.log('Rental ended successfully');
      fetchNFTData();
    } catch (err: any) {
      console.error('End rental error:', err);
      let errorMsg = 'Failed to end rental';
      const errorData = err.data || err.error?.data;
      if (errorData) {
        const selector = typeof errorData === 'string' ? errorData.slice(0, 10) : '';
        if (selector === '0x') {
          errorMsg = 'Rental period has not ended yet';
        }
      } else if (err.reason) {
        errorMsg = err.reason;
      } else if (err.message?.includes('user rejected')) {
        errorMsg = 'Transaction was cancelled';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelRentalListing = async () => {
    if (!contracts || !signer || !rentalListing) return;

    setProcessing(true);
    try {
      console.log('Cancelling rental listing:', rentalListing.rentalId);
      const tx = await contracts.marketplace.cancelRentalListing(rentalListing.rentalId, getTxOptions('cancel'));
      console.log('Cancel rental tx sent:', tx.hash);
      await tx.wait();
      console.log('Rental listing cancelled successfully');
      fetchNFTData();
    } catch (err: any) {
      console.error('Cancel rental error:', err);
      let errorMsg = 'Failed to cancel rental listing';
      if (err.reason) {
        errorMsg = err.reason;
      } else if (err.message?.includes('user rejected')) {
        errorMsg = 'Transaction was cancelled';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const getTimeRemaining = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
          <Box>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={30} width="60%" />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 2 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* NFT Image */}
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Box sx={{ position: 'relative', minHeight: 300 }}>
            {/* Placeholder shown while loading or on error */}
            {(!imageLoaded || imageError || !metadata?.image) && (
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.800',
                  borderRadius: 2,
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <ImageIcon sx={{ fontSize: 80, color: 'grey.600' }} />
                {imageError && (
                  <Typography variant="body2" color="grey.500">
                    Image failed to load
                  </Typography>
                )}
              </Box>
            )}
            {/* Actual image */}
            {metadata?.image && !imageError && (
              <Box
                component="img"
                src={ipfsToHttp(metadata.image)}
                alt={metadata?.name || 'NFT'}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 500,
                  objectFit: 'contain',
                  borderRadius: 2,
                  display: imageLoaded ? 'block' : 'none',
                }}
              />
            )}
          </Box>
        </Paper>

        {/* NFT Info */}
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            {metadata?.name || `NFT #${tokenId}`}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
              label={is1155 ? 'ERC-1155' : 'ERC-721'}
              size="small"
              color="primary"
              variant="outlined"
            />
            {listing && (
              <Chip
                icon={listing.listingType === ListingType.Auction ? <Gavel /> : <ShoppingCart />}
                label={listing.listingType === ListingType.Auction ? 'Auction' : 'For Sale'}
                size="small"
                color="secondary"
              />
            )}
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {metadata?.description || 'No description available'}
          </Typography>

          {/* Owner info */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Owner
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                {owner?.slice(2, 4)}
              </Avatar>
              <Typography variant="body2" fontWeight={500}>
                {isOwner ? 'You' : truncateAddress(owner || '')}
              </Typography>
              <IconButton size="small" onClick={() => navigator.clipboard.writeText(owner)}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </Paper>

          {/* ERC-1155 Supply Info */}
          {is1155 && inventoryInfo && (
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Supply Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Supply</Typography>
                  <Typography variant="body1" fontWeight={600}>{inventoryInfo.totalSupply}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Sold</Typography>
                  <Typography variant="body1" fontWeight={600} color="success.main">
                    {inventoryInfo.totalSold}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Remaining (Minter)</Typography>
                  <Typography variant="body1" fontWeight={600} color="info.main">
                    {inventoryInfo.minterRemaining}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Original Minter</Typography>
                  <Typography variant="body2">{truncateAddress(inventoryInfo.originalMinter)}</Typography>
                </Box>
              </Box>
              {/* Progress bar */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Sales Progress</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {inventoryInfo.totalSupply > 0 ? Math.round((inventoryInfo.totalSold / inventoryInfo.totalSupply) * 100) : 0}%
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: 'grey.700', borderRadius: 1, height: 8 }}>
                  <Box
                    sx={{
                      width: inventoryInfo.totalSupply > 0 ? ((inventoryInfo.totalSold / inventoryInfo.totalSupply) * 100) + '%' : '0%',
                      bgcolor: 'success.main',
                      borderRadius: 1,
                      height: '100%',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          )}

          {/* Price/Auction info */}
          {listing && (listing.status === ListingStatus.Active || (listing.listingType === ListingType.Auction && auction && !auction.settled)) && (
            <Paper sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              bgcolor: auction && auction.endTime <= Math.floor(Date.now() / 1000) ? 'warning.main' : 'primary.main',
              color: 'white'
            }}>
              {listing.listingType === ListingType.Auction && auction ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="caption">
                        {auction.highestBidder !== '0x0000000000000000000000000000000000000000' ? 'Winning Bid' : 'Starting Bid'}
                      </Typography>
                      {(() => {
                        const auctionToken = getTokenByAddress(listing.paymentToken);
                        const bidAmount = auctionToken?.decimals === 18
                          ? parseFloat(formatEther(auction.highestBid || auction.minBid))
                          : Number(auction.highestBid || auction.minBid) / Math.pow(10, auctionToken?.decimals || 18);
                        return (
                          <Typography variant="h5" fontWeight={700}>
                            {bidAmount.toFixed(auctionToken?.decimals === 6 ? 2 : 4)} {auctionToken?.symbol || 'POL'}
                          </Typography>
                        );
                      })()}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Timer fontSize="small" />
                        {auction.endTime <= Math.floor(Date.now() / 1000) ? 'Status' : 'Ends in'}
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {auction.endTime <= Math.floor(Date.now() / 1000)
                          ? (auction.settled ? 'Settled' : 'Ended - Awaiting Settlement')
                          : getTimeRemaining(auction.endTime)
                        }
                      </Typography>
                    </Box>
                  </Box>
                  {auction.highestBidder !== '0x0000000000000000000000000000000000000000' && (
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {auction.endTime <= Math.floor(Date.now() / 1000) ? 'Winner' : 'Highest bidder'}: {truncateAddress(auction.highestBidder)}
                    </Typography>
                  )}
                  {auction.endTime <= Math.floor(Date.now() / 1000) && !auction.settled &&
                    auction.highestBidder === '0x0000000000000000000000000000000000000000' && (
                      <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                        No bids received. Settle to close auction.
                      </Typography>
                    )}
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="caption">Price</Typography>
                      {(() => {
                        const listingToken = getTokenByAddress(listing.paymentToken);
                        console.log('Price Display Debug:', {
                          paymentToken: listing.paymentToken,
                          price: listing.price,
                          listingToken,
                          symbol: listingToken?.symbol || 'POL',
                          decimals: listingToken?.decimals || 18
                        });
                        return (
                          <PriceDisplay
                            priceWei={listing.price}
                            tokenSymbol={listingToken?.symbol || 'POL'}
                            tokenDecimals={listingToken?.decimals || 18}
                            variant="large"
                            showTokenAmount={true}
                          />
                        );
                      })()}
                    </Box>
                    {/* Original Sale / Resale Badge for ERC-1155 */}
                    {is1155 && inventoryInfo && (
                      <Chip
                        icon={inventoryInfo.isOriginalSale ? <Storefront /> : <Replay />}
                        label={inventoryInfo.isOriginalSale ? 'Original Sale' : 'Resale'}
                        size="small"
                        sx={{
                          bgcolor: inventoryInfo.isOriginalSale ? 'success.main' : 'warning.main',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                </>
              )}
            </Paper>
          )}

          {/* Rental Listing info */}
          {rentalListing && rentalListing.status === RentalStatus.Listed && (
            <Paper sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              bgcolor: 'info.main',
              color: 'white'
            }}>
              <Typography variant="caption">Available for Rent</Typography>
              {(() => {
                const rentalToken = getTokenByAddress(rentalListing.paymentToken);
                return (
                  <PriceDisplay
                    priceWei={rentalListing.pricePerDay}
                    tokenSymbol={rentalToken?.symbol || 'POL'}
                    tokenDecimals={rentalToken?.decimals || 18}
                    variant="default"
                    suffix="/ day"
                    showTokenAmount={true}
                  />
                );
              })()}
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                Duration: {rentalListing.minDuration} - {rentalListing.maxDuration} days
              </Typography>
            </Paper>
          )}

          {/* Active Rental info */}
          {rentalListing && rentalListing.status === RentalStatus.Rented && activeRental && (
            <Paper sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              bgcolor: activeRental.endTime <= Math.floor(Date.now() / 1000) ? 'warning.main' : 'success.main',
              color: 'white'
            }}>
              <Typography variant="caption">Currently Rented</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Renter: {truncateAddress(activeRental.renter)}
                  </Typography>
                  <Box sx={{ opacity: 0.8 }}>
                    <Typography variant="body2" component="span">Total Paid: </Typography>
                    <PriceDisplay
                      priceWei={activeRental.totalPrice}
                      tokenSymbol="POL"
                      variant="inline"
                      showTokenAmount={false}
                    />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Timer fontSize="small" />
                    {activeRental.endTime <= Math.floor(Date.now() / 1000) ? 'Status' : 'Ends in'}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {activeRental.endTime <= Math.floor(Date.now() / 1000)
                      ? 'Ended - Awaiting Return'
                      : getTimeRemaining(activeRental.endTime)
                    }
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Auction buttons */}
            {listing && listing.listingType === ListingType.Auction && auction && (
              <>
                {/* Auction ended - show settle button */}
                {auction.endTime <= Math.floor(Date.now() / 1000) && !auction.settled && (
                  <Button
                    variant="contained"
                    size="large"
                    color="success"
                    startIcon={<Gavel />}
                    onClick={() => requireWallet(handleSettleAuction)}
                    disabled={processing}
                  >
                    {processing ? 'Settling...' : 'Settle Auction'}
                  </Button>
                )}

                {/* Auction active - show bid button for non-owners */}
                {auction.endTime > Math.floor(Date.now() / 1000) && listing.status === ListingStatus.Active && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Gavel />}
                    onClick={() => requireWallet(() => setBidDialogOpen(true))}
                    disabled={processing || (isConnected && !!isOwner)}
                  >
                    Place Bid
                  </Button>
                )}

                {/* Owner can cancel auction only if no bids */}
                {isConnected && isOwner && listing.status === ListingStatus.Active &&
                  auction.highestBidder === '0x0000000000000000000000000000000000000000' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="large"
                      onClick={handleCancelListing}
                      disabled={processing}
                    >
                      Cancel Auction
                    </Button>
                  )}
              </>
            )}

            {/* Fixed price buttons */}
            {listing && listing.listingType === ListingType.FixedPrice && listing.status === ListingStatus.Active && (
              <>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={() => requireWallet(() => setBuyDialogOpen(true))}
                  disabled={processing || (isConnected && !!isOwner)}
                >
                  Buy Now
                </Button>
                {isConnected && isOwner && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={handleCancelListing}
                    disabled={processing}
                  >
                    Cancel Listing
                  </Button>
                )}
              </>
            )}

            {/* No listing - offer button */}
            {!listing && !rentalListing && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<LocalOffer />}
                onClick={() => requireWallet(() => setOfferDialogOpen(true))}
                disabled={processing || (isConnected && !!isOwner)}
              >
                Make Offer
              </Button>
            )}

            {/* Rental buttons */}
            {rentalListing && rentalListing.status === RentalStatus.Listed && (
              <Button
                variant="contained"
                size="large"
                color="info"
                onClick={() => requireWallet(() => setRentDialogOpen(true))}
                disabled={processing || (isConnected && !!isRentalOwner)}
              >
                Rent NFT
              </Button>
            )}

            {isConnected && rentalListing && rentalListing.status === RentalStatus.Listed && isRentalOwner && (
              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={handleCancelRentalListing}
                disabled={processing}
              >
                Cancel Rental
              </Button>
            )}

            {/* End rental button - when rental period ended */}
            {isConnected && activeRental && activeRental.endTime <= Math.floor(Date.now() / 1000) && (
              <Button
                variant="contained"
                size="large"
                color="warning"
                onClick={handleEndRental}
                disabled={processing}
              >
                End Rental
              </Button>
            )}

            {/* No listing - list button for owners */}
            {isConnected && isOwner && !listing && !rentalListing && (
              <Button
                variant="contained"
                size="large"
                onClick={() => setListDialogOpen(true)}
                disabled={processing}
              >
                List for Sale
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Tabs for additional info */}
      <Paper sx={{ mt: 4, borderRadius: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ px: 2 }}>
          <Tab label="Properties" />
          <Tab label={`Offers (${offers.length})`} />
          <Tab label="History" />
          <Tab label="Details" />
        </Tabs>

        <Divider />

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            {metadata?.attributes && metadata.attributes.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: 2,
                }}
              >
                {metadata.attributes.map((attr, index) => (
                  <Paper
                    key={index}
                    sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', borderRadius: 2 }}
                    variant="outlined"
                  >
                    <Typography variant="caption" color="primary.main" fontWeight={600}>
                      {attr.trait_type}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {attr.value}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No properties available</Typography>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>From</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Expiry</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offers.length > 0 ? (
                  offers.map((offer) => (
                    <TableRow key={offer.offerId}>
                      <TableCell>
                        {offer.offerer.toLowerCase() === address?.toLowerCase() ? (
                          <Chip label="You" size="small" color="primary" sx={{ mr: 1 }} />
                        ) : null}
                        {truncateAddress(offer.offerer)}
                      </TableCell>
                      <TableCell>{formatEther(offer.price)} POL</TableCell>
                      <TableCell>{new Date(offer.expiry * 1000).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* Owner can accept or reject */}
                          {isOwner && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleAcceptOffer(offer.offerId)}
                                disabled={processing}
                              >
                                Accept
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleRejectOffer(offer.offerId)}
                                disabled={processing}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {/* Offerer can cancel their own offer */}
                          {!isOwner && offer.offerer.toLowerCase() === address?.toLowerCase() && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              onClick={() => handleCancelOffer(offer.offerId)}
                              disabled={processing}
                            >
                              Cancel
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">No offers yet</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => {
                    // Determine if this is original sale or resale (for ERC-1155)
                    const isOriginalSaleTx = is1155 && inventoryInfo &&
                      (tx.transactionType === 'Sale' || tx.transactionType === '0') &&
                      tx.from.toLowerCase() === inventoryInfo.originalMinter.toLowerCase();
                    const isResaleTx = is1155 && inventoryInfo &&
                      (tx.transactionType === 'Sale' || tx.transactionType === '0') &&
                      tx.from.toLowerCase() !== inventoryInfo.originalMinter.toLowerCase();

                    return (
                      <TableRow key={tx.transactionId}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={tx.transactionType} size="small" />
                            {isOriginalSaleTx && (
                              <Chip
                                label="Original"
                                size="small"
                                sx={{ bgcolor: 'success.main', color: 'white', fontSize: '0.65rem' }}
                              />
                            )}
                            {isResaleTx && (
                              <Chip
                                label="Resale"
                                size="small"
                                sx={{ bgcolor: 'warning.main', color: 'white', fontSize: '0.65rem' }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{truncateAddress(tx.from)}</TableCell>
                        <TableCell>{truncateAddress(tx.to)}</TableCell>
                        <TableCell>{formatEther(tx.price)} POL</TableCell>
                        <TableCell>{new Date(tx.timestamp * 1000).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">No transaction history</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Contract Address</Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {contractAddress}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Token ID</Typography>
                <Typography variant="body2">{tokenId}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Token Standard</Typography>
                <Typography variant="body2">{is1155 ? 'ERC-1155' : 'ERC-721'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Blockchain</Typography>
                <Typography variant="body2">Polygon Amoy (Testnet)</Typography>
              </Box>
            </Box>

            {/* PolygonScan Links */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Verify on PolygonScan
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<OpenInNew />}
                href={`https://amoy.polygonscan.com/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                NFT Contract
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<OpenInNew />}
                href={`https://amoy.polygonscan.com/token/${contractAddress}?a=${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Token #{tokenId}
              </Button>
              {owner && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<OpenInNew />}
                  href={`https://amoy.polygonscan.com/address/${owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Owner Wallet
                </Button>
              )}
            </Box>

            {/* Rental Usage Rights (ERC4907) */}
            {(rentalListing || activeRental) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedUser fontSize="small" color="primary" />
                  Rental Usage Rights (ERC-4907)
                </Typography>

                {/* Direct userOf() Query Result */}
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      On-Chain User Rights
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={fetchUserInfo}
                      disabled={loadingUserInfo || is1155}
                    >
                      {loadingUserInfo ? <CircularProgress size={16} /> : 'Refresh'}
                    </Button>
                  </Box>

                  {is1155 ? (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      ERC-1155 uses ERC-5006 standard. Use Marketplace Contract to verify.
                    </Alert>
                  ) : nftUser === null && !loadingUserInfo ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={fetchUserInfo}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Check userOf({tokenId})
                    </Button>
                  ) : loadingUserInfo ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Current User:</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{
                          color: nftUser === '0x0000000000000000000000000000000000000000' ? 'text.disabled' : 'success.main'
                        }}>
                          {nftUser === '0x0000000000000000000000000000000000000000'
                            ? 'No active user'
                            : `${nftUser?.slice(0, 6)}...${nftUser?.slice(-4)}`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">User Expires:</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{
                          color: nftUserExpires && nftUserExpires > 0 && nftUserExpires > Math.floor(Date.now() / 1000)
                            ? 'success.main'
                            : 'text.disabled'
                        }}>
                          {nftUserExpires && nftUserExpires > 0
                            ? new Date(nftUserExpires * 1000).toLocaleString()
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Status:</Typography>
                        <Chip
                          size="small"
                          label={
                            nftUser === '0x0000000000000000000000000000000000000000'
                              ? 'No User'
                              : nftUserExpires && nftUserExpires > Math.floor(Date.now() / 1000)
                                ? 'Active'
                                : 'Expired'
                          }
                          color={
                            nftUser === '0x0000000000000000000000000000000000000000'
                              ? 'default'
                              : nftUserExpires && nftUserExpires > Math.floor(Date.now() / 1000)
                                ? 'success'
                                : 'error'
                          }
                        />
                      </Box>
                      {nftUser && nftUser !== '0x0000000000000000000000000000000000000000' && (
                        <Alert severity="success" sx={{ mt: 1 }}>
                          <Typography variant="caption">
                            This address has usage rights: <strong>{nftUser}</strong>
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  )}
                </Paper>

                {/* Marketplace rental info */}
                {activeRental && (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                      Marketplace Rental Record
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Renter:</strong> {activeRental.renter}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Rental Expires:</strong> {new Date(activeRental.endTime * 1000).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Status:</strong> {activeRental.endTime <= Math.floor(Date.now() / 1000) ? 'Expired' : 'Active'}
                    </Typography>
                  </Paper>
                )}

                {/* External verification links */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<OpenInNew />}
                    href={`https://amoy.polygonscan.com/address/${contractAddress}#readContract`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PolygonScan (NFT)
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<OpenInNew />}
                    href={`https://amoy.polygonscan.com/address/${CONTRACTS.AlmaMarketplace}#readContract`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PolygonScan (Marketplace)
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </TabPanel>
      </Paper>

      {/* Wallet Connection Dialog */}
      <Dialog open={walletDialogOpen} onClose={() => setWalletDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Connect Wallet</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please connect your wallet to continue with this action.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            You need a Web3 wallet (like MetaMask) to buy, bid, make offers, or list NFTs.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWalletDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConnectWallet}>
            Connect Wallet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onClose={() => setBuyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You are about to purchase <strong>{metadata?.name}</strong>
          </Typography>

          {/* Payment Token Info & Balance */}
          {listing && (() => {
            const listingToken = getTokenByAddress(listing.paymentToken);
            const tokenSymbol = listingToken?.symbol || 'POL';
            const tokenDecimals = listingToken?.decimals || 18;
            const tokenAmount = tokenDecimals === 18
              ? parseFloat(formatEther(listing.price))
              : Number(listing.price) / Math.pow(10, tokenDecimals);
            const requiredAmount = tokenAmount * 1.01;
            const requiredInSmallestUnit = BigInt(Math.ceil(requiredAmount * Math.pow(10, tokenDecimals)));
            const balanceAmount = tokenDecimals === 18
              ? parseFloat(formatEther(tokenBalance))
              : Number(tokenBalance) / Math.pow(10, tokenDecimals);
            const hasEnough = tokenBalance >= requiredInSmallestUnit;

            return (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Payment Token:</Typography>
                  <Typography variant="body2" fontWeight={600}>{tokenSymbol}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Your Balance:</Typography>
                  {balanceLoading ? (
                    <CircularProgress size={14} />
                  ) : (
                    <Typography variant="body2" fontWeight={600} color={hasEnough ? 'success.main' : 'error.main'}>
                      {balanceAmount.toFixed(tokenDecimals === 6 ? 2 : 4)} {tokenSymbol}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })()}

          <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
            {listing && (() => {
              const listingToken = getTokenByAddress(listing.paymentToken);
              const tokenSymbol = listingToken?.symbol || 'POL';
              const tokenDecimals = listingToken?.decimals || 18;
              const tokenAmount = tokenDecimals === 18
                ? parseFloat(formatEther(listing.price))
                : Number(listing.price) / Math.pow(10, tokenDecimals);
              const priceInUsd = tokenAmount * getPrice(tokenSymbol);

              return (
                <>
                  {/* Price in USD */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Price (USD):</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatUsd(priceInUsd)}
                    </Typography>
                  </Box>

                  {/* Buyer Fee */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Platform Fee (1%):</Typography>
                    <Typography variant="body2">
                      {formatUsd(priceInUsd * 0.01)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Total in USD */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" fontWeight={600}>Total (USD):</Typography>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      {formatUsd(priceInUsd * 1.01)}
                    </Typography>
                  </Box>

                  {/* Amount in listing token */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Pay ({tokenSymbol}):
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="secondary">
                      {(tokenAmount * 1.01).toFixed(tokenDecimals === 6 ? 2 : 4)} {tokenSymbol}
                    </Typography>
                  </Box>
                </>
              );
            })()}
          </Box>

          {/* Note about ERC-20 token approval */}
          {listing && listing.paymentToken !== '0x0000000000000000000000000000000000000000' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This listing accepts {getTokenByAddress(listing.paymentToken)?.symbol || 'ERC-20'}. Token approval will be requested if needed.
            </Alert>
          )}

          {/* Insufficient balance warning */}
          {listing && !balanceLoading && (() => {
            const listingToken = getTokenByAddress(listing.paymentToken);
            const tokenDecimals = listingToken?.decimals || 18;
            const tokenAmount = tokenDecimals === 18
              ? parseFloat(formatEther(listing.price))
              : Number(listing.price) / Math.pow(10, tokenDecimals);
            const requiredAmount = tokenAmount * 1.01;
            const requiredInSmallestUnit = BigInt(Math.ceil(requiredAmount * Math.pow(10, tokenDecimals)));
            return tokenBalance < requiredInSmallestUnit;
          })() && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Insufficient balance. You need at least {(() => {
                  const listingToken = getTokenByAddress(listing.paymentToken);
                  const tokenDecimals = listingToken?.decimals || 18;
                  const tokenAmount = tokenDecimals === 18
                    ? parseFloat(formatEther(listing.price))
                    : Number(listing.price) / Math.pow(10, tokenDecimals);
                  return (tokenAmount * 1.01).toFixed(tokenDecimals === 6 ? 2 : 4);
                })()} {getTokenByAddress(listing.paymentToken)?.symbol || 'tokens'}.
              </Alert>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBuy}
            disabled={processing || erc20Loading || !!(listing && (() => {
              const listingToken = getTokenByAddress(listing.paymentToken);
              const tokenDecimals = listingToken?.decimals || 18;
              const tokenAmount = tokenDecimals === 18
                ? parseFloat(formatEther(listing.price))
                : Number(listing.price) / Math.pow(10, tokenDecimals);
              const requiredAmount = tokenAmount * 1.01;
              const requiredInSmallestUnit = BigInt(Math.ceil(requiredAmount * Math.pow(10, tokenDecimals)));
              return tokenBalance < requiredInSmallestUnit;
            })())}
          >
            {processing || erc20Loading ? <CircularProgress size={24} /> : 'Confirm Purchase'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bid Dialog */}
      <Dialog open={bidDialogOpen} onClose={() => setBidDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Place a Bid</DialogTitle>
        <DialogContent>
          {/* Payment Token Info */}
          <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Payment Token:</Typography>
              <Typography variant="body2" fontWeight={600}>
                {listing?.paymentToken === '0x0000000000000000000000000000000000000000' ? 'POL' : 'ERC-20'} (set by seller)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Your Balance:</Typography>
              {balanceLoading ? (
                <CircularProgress size={14} />
              ) : (
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={tokenBalance > 0n ? 'success.main' : 'error.main'}
                >
                  {parseFloat(formatEther(tokenBalance)).toFixed(4)} {listing?.paymentToken === '0x0000000000000000000000000000000000000000' ? 'POL' : 'Token'}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Minimum Bid Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Minimum bid: {auction && (
                <>
                  {formatEther(
                    BigInt(auction.highestBid) > 0n
                      ? (BigInt(auction.highestBid) + BigInt(auction.minBidIncrement)).toString()
                      : auction.minBid
                  )} POL
                  <Typography component="span" variant="body2" color="primary.main" sx={{ ml: 1 }}>
                    ({formatUsd(parseFloat(formatEther(
                      BigInt(auction.highestBid) > 0n
                        ? (BigInt(auction.highestBid) + BigInt(auction.minBidIncrement)).toString()
                        : auction.minBid
                    )) * getPrice('POL'))})
                  </Typography>
                </>
              )}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Bid Amount (POL)"
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            helperText={bidAmount ? `${formatUsd(parseFloat(bidAmount) * getPrice('POL'))}` : ''}
          />

          {/* ERC-20 approval note */}
          {listing?.paymentToken !== '0x0000000000000000000000000000000000000000' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Token approval will be requested before placing bid.
            </Alert>
          )}

          {/* Insufficient balance warning */}
          {bidAmount && !balanceLoading && tokenBalance < parseEther(bidAmount) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Insufficient balance. You need at least {bidAmount} POL.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBidDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePlaceBid}
            disabled={processing || !bidAmount || erc20Loading || !!(bidAmount && tokenBalance < parseEther(bidAmount))}
          >
            {processing || erc20Loading ? <CircularProgress size={24} /> : 'Place Bid'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Offer Dialog */}
      <Dialog open={offerDialogOpen} onClose={() => setOfferDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Make an Offer</DialogTitle>
        <DialogContent>
          {/* Token Selection */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <TokenSelector
              value={offerPaymentToken}
              onChange={setOfferPaymentToken}
              label="Offer with"
              showPrice={true}
            />
            {/* Token Balance Display */}
            {offerPaymentToken && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Your Balance:
                </Typography>
                {balanceLoading ? (
                  <CircularProgress size={14} />
                ) : (
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={tokenBalance > 0n ? 'success.main' : 'error.main'}
                  >
                    {offerPaymentToken.decimals === 18
                      ? parseFloat(formatEther(tokenBalance)).toFixed(4)
                      : (Number(tokenBalance) / Math.pow(10, offerPaymentToken.decimals)).toFixed(2)
                    } {offerPaymentToken.symbol}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label={`Offer Amount (${offerPaymentToken?.symbol || 'POL'})`}
            type="number"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            helperText={offerAmount && offerPaymentToken
              ? `${formatUsd(parseFloat(offerAmount) * getPrice(offerPaymentToken.symbol))}`
              : ''
            }
          />

          {/* Fee Info */}
          {offerAmount && offerPaymentToken && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Offer Amount:</Typography>
                <Typography variant="body2">
                  {formatUsd(parseFloat(offerAmount) * getPrice(offerPaymentToken.symbol))}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Platform Fee (1%):</Typography>
                <Typography variant="body2">
                  {formatUsd(parseFloat(offerAmount) * getPrice(offerPaymentToken.symbol) * 0.01)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" fontWeight={600}>Total to Pay:</Typography>
                <Typography variant="body2" fontWeight={600} color="primary">
                  {(parseFloat(offerAmount) * 1.01).toFixed(offerPaymentToken.decimals === 6 ? 2 : 4)} {offerPaymentToken.symbol}
                  {' '}({formatUsd(parseFloat(offerAmount) * getPrice(offerPaymentToken.symbol) * 1.01)})
                </Typography>
              </Box>
            </Box>
          )}

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Offer Duration</InputLabel>
            <Select
              value={offerDuration}
              label="Offer Duration"
              onChange={(e) => setOfferDuration(e.target.value)}
            >
              <MenuItem value="1">1 Day</MenuItem>
              <MenuItem value="3">3 Days</MenuItem>
              <MenuItem value="7">7 Days</MenuItem>
              <MenuItem value="14">14 Days</MenuItem>
              <MenuItem value="30">30 Days</MenuItem>
            </Select>
          </FormControl>

          {/* ERC-20 approval note */}
          {offerPaymentToken && !offerPaymentToken.isNative && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Token approval will be requested before making offer.
            </Alert>
          )}

          {/* Insufficient balance warning */}
          {offerAmount && offerPaymentToken && !balanceLoading && (() => {
            const requiredAmount = offerPaymentToken.decimals === 18
              ? parseEther(offerAmount) + parseEther(offerAmount) / 100n
              : BigInt(Math.floor(parseFloat(offerAmount) * 1.01 * Math.pow(10, offerPaymentToken.decimals)));
            return tokenBalance < requiredAmount;
          })() && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Insufficient {offerPaymentToken.symbol} balance. You need at least {(parseFloat(offerAmount) * 1.01).toFixed(4)} {offerPaymentToken.symbol}.
              </Alert>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleMakeOffer}
            disabled={processing || !offerAmount || erc20Loading || !offerPaymentToken}
          >
            {processing || erc20Loading ? <CircularProgress size={24} /> : 'Make Offer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* List Dialog */}
      <Dialog open={listDialogOpen} onClose={() => setListDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>List NFT for Sale</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Listing Type</InputLabel>
            <Select
              value={listType}
              label="Listing Type"
              onChange={(e) => setListType(e.target.value as 'fixed' | 'auction' | 'rental')}
            >
              <MenuItem value="fixed">Fixed Price</MenuItem>
              <MenuItem value="auction">Auction</MenuItem>
              <MenuItem value="rental">Rental</MenuItem>
            </Select>
          </FormControl>

          {/* Payment Token Selection */}
          <Box sx={{ mt: 2 }}>
            <TokenSelector
              value={selectedToken}
              onChange={(token) => {
                setSelectedToken(token);
                setListPaymentToken(token.address);
              }}
              label="Accept Payment In"
              showPrice={true}
            />
          </Box>

          <TextField
            fullWidth
            label={`${listType === 'rental' ? 'Price Per Day' : listType === 'auction' ? 'Starting Price' : 'Price'} (${selectedToken?.symbol || 'POL'})`}
            type="number"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
            sx={{ mt: 2 }}
            helperText={listPrice && selectedToken ? `≈ ${formatUsd(parseFloat(listPrice) * getPrice(selectedToken.symbol))}` : ''}
          />
          {listType === 'rental' ? (
            <>
              <TextField
                fullWidth
                label="Min Rental Days"
                type="number"
                value={rentalMinDays}
                onChange={(e) => setRentalMinDays(e.target.value)}
                inputProps={{ min: 1 }}
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Max Rental Days"
                type="number"
                value={rentalMaxDays}
                onChange={(e) => setRentalMaxDays(e.target.value)}
                inputProps={{ min: 1 }}
                sx={{ mt: 2 }}
              />
            </>
          ) : (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Listing Duration</InputLabel>
              <Select
                value={listDuration}
                label="Listing Duration"
                onChange={(e) => setListDuration(e.target.value)}
              >
                <MenuItem value="1">1 Day</MenuItem>
                <MenuItem value="3">3 Days</MenuItem>
                <MenuItem value="7">7 Days</MenuItem>
                <MenuItem value="14">14 Days</MenuItem>
                <MenuItem value="30">30 Days</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* USD conversion info */}
          {listPrice && selectedToken && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Listing Price: <strong>{listPrice} {selectedToken.symbol}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                USD Value: <strong>{formatUsd(parseFloat(listPrice) * getPrice(selectedToken.symbol))}</strong>
              </Typography>
              {listType === 'rental' && (
                <Typography variant="caption" color="text.secondary">
                  Total for max duration ({rentalMaxDays} days): {formatUsd(parseFloat(listPrice) * parseInt(rentalMaxDays || '1') * getPrice(selectedToken.symbol))}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setListDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateListing} disabled={processing || !listPrice}>
            {processing ? <CircularProgress size={24} /> : 'Create Listing'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rent Dialog */}
      <Dialog open={rentDialogOpen} onClose={() => setRentDialogOpen(false)}>
        <DialogTitle>Rent NFT</DialogTitle>
        <DialogContent>
          {rentalListing && (
            <>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Price per day: <strong>{formatEther(rentalListing.pricePerDay)} POL</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration range: {rentalListing.minDuration} - {rentalListing.maxDuration} days
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Rental Duration (Days)"
                type="number"
                value={rentalDays}
                onChange={(e) => setRentalDays(e.target.value)}
                inputProps={{
                  min: rentalListing.minDuration,
                  max: rentalListing.maxDuration
                }}
                sx={{ mt: 2 }}
                helperText={`Min: ${rentalListing.minDuration} days, Max: ${rentalListing.maxDuration} days`}
              />
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
                <Typography variant="body2">
                  Total Cost: {rentalDays && formatEther(
                    (BigInt(rentalListing.pricePerDay) * BigInt(parseInt(rentalDays) || 1) * 101n / 100n).toString()
                  )} POL
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  (includes 1% buyer fee)
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRentDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleRentNFT}
            disabled={
              processing ||
              !rentalDays ||
              !!(rentalListing && (parseInt(rentalDays) < rentalListing.minDuration || parseInt(rentalDays) > rentalListing.maxDuration))
            }
          >
            {processing ? <CircularProgress size={24} /> : 'Confirm Rental'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NFTDetail;
