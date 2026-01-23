// NFT Types
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: NFTAttribute[];
  external_url?: string;
  animation_url?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface NFT {
  tokenId: string;
  contractAddress: string;
  owner: string;
  tokenURI: string;
  metadata?: NFTMetadata;
  collectionId?: number;
  nftType: 'ERC721' | 'ERC1155';
  amount?: number; // For ERC1155
}

// Collection Types
// Category IDs start from 1 in the contract (CollectionManager)
export const Category = {
  Game: 1,
  Membership: 2,
  RWA: 3,
  Art: 4,
  Other: 5
} as const;

export type Category = typeof Category[keyof typeof Category];

export interface Collection {
  id: number;
  categoryId: number;
  name: string;
  symbol: string;
  description: string;
  imageUri: string;
  bannerUri: string;
  creator: string;
  nftContract: string;
  nftType: 'ERC721' | 'ERC1155';
  royaltyBps: number;
  royaltyRecipient: string;
  active: boolean;
  verified: boolean;
  createdAt: number;
  totalItems: number;
  totalVolume: string;
}

// Marketplace Types
export const ListingType = {
  FixedPrice: 0,
  Auction: 1
} as const;

export type ListingType = typeof ListingType[keyof typeof ListingType];

export const ListingStatus = {
  Active: 0,
  Sold: 1,
  Cancelled: 2,
  Expired: 3
} as const;

export type ListingStatus = typeof ListingStatus[keyof typeof ListingStatus];

export interface Listing {
  listingId: number;
  nftContract: string;
  tokenId: string;
  amount: number;
  nftType: 'ERC721' | 'ERC1155';
  seller: string;
  paymentToken: string;
  price: string;
  startTime: number;
  endTime: number;
  listingType: ListingType;
  status: ListingStatus;
  metadata?: NFTMetadata;
}

export interface Auction {
  listingId: number;
  minBid: string;
  minBidIncrement: string;
  highestBid: string;
  highestBidder: string;
  endTime: number;
  settled: boolean;
}

export const OfferStatus = {
  Pending: 0,
  Accepted: 1,
  Rejected: 2,
  Expired: 3,
  Cancelled: 4
} as const;

export type OfferStatus = typeof OfferStatus[keyof typeof OfferStatus];

export interface Offer {
  offerId: number;
  nftContract: string;
  tokenId: string;
  amount: number;
  nftType: 'ERC721' | 'ERC1155';
  offerer: string;
  paymentToken: string;
  price: string;
  expiry: number;
  status: OfferStatus;
}

export const RentalStatus = {
  Listed: 0,
  Rented: 1,
  Completed: 2,
  Cancelled: 3
} as const;

export type RentalStatus = typeof RentalStatus[keyof typeof RentalStatus];

export interface RentalListing {
  rentalId: number;
  nftContract: string;
  tokenId: string;
  amount: number;
  nftType: 'ERC721' | 'ERC1155';
  owner: string;
  paymentToken: string;
  pricePerDay: string;
  minDuration: number;
  maxDuration: number;
  status: RentalStatus;
}

export interface ActiveRental {
  rentalId: number;
  renter: string;
  startTime: number;
  endTime: number;
  totalPrice: string;
}

// Payment Types
export interface PaymentToken {
  address: string;
  symbol: string;
  decimals: number;
  active: boolean;
}

// Transaction History
export const TransactionType = {
  Sale: 0,
  Auction: 1,
  Offer: 2,
  Rental: 3,
  Transfer: 4,
  Mint: 5
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface Transaction {
  txHash: string;
  type: TransactionType;
  nftContract: string;
  tokenId: string;
  from: string;
  to: string;
  price: string;
  paymentToken: string;
  timestamp: number;
}
