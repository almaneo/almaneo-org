/**
 * AmbassadorSBT Contract ABI
 * Deployed: 2026-01-25
 */

// Ambassador Tier Enum
export enum AmbassadorTier {
  None = 0,
  Friend = 1,
  Host = 2,
  Ambassador = 3,
  Guardian = 4,
}

export const TIER_NAMES: Record<AmbassadorTier, string> = {
  [AmbassadorTier.None]: 'None',
  [AmbassadorTier.Friend]: 'Kindness Friend',
  [AmbassadorTier.Host]: 'Kindness Host',
  [AmbassadorTier.Ambassador]: 'Kindness Ambassador',
  [AmbassadorTier.Guardian]: 'Kindness Guardian',
};

export const TIER_REQUIREMENTS = {
  [AmbassadorTier.Friend]: { meetupsAttended: 1 },
  [AmbassadorTier.Host]: { meetupsHosted: 3 },
  [AmbassadorTier.Ambassador]: { kindnessScore: 500 },
  [AmbassadorTier.Guardian]: { kindnessScore: 1000, referrals: 10 },
};

export const AmbassadorSBTABI = [
  // View Functions
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getAmbassadorByAddress',
    outputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'enum AmbassadorSBT.AmbassadorTier', name: 'tier', type: 'uint8' },
      { internalType: 'uint256', name: 'meetupsAttended', type: 'uint256' },
      { internalType: 'uint256', name: 'meetupsHosted', type: 'uint256' },
      { internalType: 'uint256', name: 'kindnessScore', type: 'uint256' },
      { internalType: 'uint256', name: 'referralCount', type: 'uint256' },
      { internalType: 'uint256', name: 'mintedAt', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'hasAmbassadorSBT',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getTierByAddress',
    outputs: [{ internalType: 'enum AmbassadorSBT.AmbassadorTier', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getNextTierRequirements',
    outputs: [
      { internalType: 'enum AmbassadorSBT.AmbassadorTier', name: 'nextTier', type: 'uint8' },
      { internalType: 'uint256', name: 'meetupsNeeded', type: 'uint256' },
      { internalType: 'uint256', name: 'hostingsNeeded', type: 'uint256' },
      { internalType: 'uint256', name: 'scoreNeeded', type: 'uint256' },
      { internalType: 'uint256', name: 'referralsNeeded', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getReferrals',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'enum AmbassadorSBT.AmbassadorTier', name: 'tier', type: 'uint8' }],
    name: 'getTierName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
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
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'referredBy',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Constants
  {
    inputs: [],
    name: 'FRIEND_MEETUPS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'HOST_MEETUPS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'AMBASSADOR_SCORE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GUARDIAN_SCORE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GUARDIAN_REFERRALS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write Functions (VERIFIER_ROLE required)
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'recordMeetupAttendance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'recordMeetupHosted',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'newScore', type: 'uint256' },
    ],
    name: 'updateKindnessScore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'referrer', type: 'address' },
      { internalType: 'address', name: 'referee', type: 'address' },
    ],
    name: 'recordReferral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Write Functions (MINTER_ROLE required)
  {
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'mintAmbassador',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'enum AmbassadorSBT.AmbassadorTier', name: 'tier', type: 'uint8' },
    ],
    name: 'AmbassadorMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'enum AmbassadorSBT.AmbassadorTier', name: 'oldTier', type: 'uint8' },
      { indexed: false, internalType: 'enum AmbassadorSBT.AmbassadorTier', name: 'newTier', type: 'uint8' },
    ],
    name: 'TierUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'totalMeetups', type: 'uint256' },
    ],
    name: 'MeetupAttended',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'totalHosted', type: 'uint256' },
    ],
    name: 'MeetupHosted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'referrer', type: 'address' },
      { indexed: true, internalType: 'address', name: 'referee', type: 'address' },
    ],
    name: 'ReferralRecorded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'newScore', type: 'uint256' },
    ],
    name: 'KindnessScoreUpdated',
    type: 'event',
  },
] as const;
