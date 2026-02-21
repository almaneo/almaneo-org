/**
 * PartnerSBT Contract ABI
 * Deployed: 2026-02-21 (Polygon Amoy)
 */

export interface OnchainPartnerData {
  tokenId: bigint;
  businessName: string;
  mintedAt: bigint;
  expiresAt: bigint;
  lastRenewedAt: bigint;
  renewalCount: bigint;
  isRevoked: boolean;
  valid: boolean;
}

export const PartnerSBTABI = [
  // View Functions
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'isValid',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getPartnerByAddress',
    outputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'string', name: 'businessName', type: 'string' },
      { internalType: 'uint256', name: 'mintedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'expiresAt', type: 'uint256' },
      { internalType: 'uint256', name: 'lastRenewedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'renewalCount', type: 'uint256' },
      { internalType: 'bool', name: 'isRevoked', type: 'bool' },
      { internalType: 'bool', name: 'valid', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'daysUntilExpiry',
    outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'hasPartnerSBT',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalMinted',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'addressToTokenId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VALIDITY_PERIOD',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // ERC721 Functions
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write Functions (MINTER_ROLE)
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'string', name: 'businessName', type: 'string' },
    ],
    name: 'mintPartnerSBT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Write Functions (RENEWER_ROLE)
  {
    inputs: [{ internalType: 'address', name: 'partner', type: 'address' }],
    name: 'renewPartnerSBT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Write Functions (DEFAULT_ADMIN_ROLE)
  {
    inputs: [
      { internalType: 'address', name: 'partner', type: 'address' },
      { internalType: 'string', name: 'reason', type: 'string' },
    ],
    name: 'revokePartnerSBT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'businessName', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'expiresAt', type: 'uint256' },
    ],
    name: 'PartnerMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'partner', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'newExpiresAt', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'renewalCount', type: 'uint256' },
    ],
    name: 'PartnerRenewed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'partner', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'reason', type: 'string' },
    ],
    name: 'PartnerRevoked',
    type: 'event',
  },
] as const;
