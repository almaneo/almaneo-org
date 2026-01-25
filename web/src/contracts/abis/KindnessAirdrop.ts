/**
 * KindnessAirdrop ABI
 * Kindness 활동 기반 에어드롭 컨트랙트
 */

export const KindnessAirdropABI = [
  // ============ View Functions ============
  {
    inputs: [],
    name: 'campaignCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'campaignId', type: 'uint256' }],
    name: 'getCampaignInfo',
    outputs: [
      { name: 'merkleRoot', type: 'bytes32' },
      { name: 'totalAmount', type: 'uint256' },
      { name: 'claimedAmount', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'maxClaimPerUser', type: 'uint256' },
      { name: 'active', type: 'bool' },
      { name: 'description', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserInfo',
    outputs: [
      { name: 'totalClaimed', type: 'uint256' },
      { name: 'lastClaimTime', type: 'uint256' },
      { name: 'dailyClaimed', type: 'uint256' },
      { name: 'remainingDailyLimit', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'campaignId', type: 'uint256' },
      { name: 'user', type: 'address' },
    ],
    name: 'hasClaimed',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRemainingDailyLimit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dailyClaimLimit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'userDailyClaimLimit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },

  // ============ Write Functions ============
  {
    inputs: [
      { name: 'campaignId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'merkleProof', type: 'bytes32[]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // ============ Events ============
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'campaignId', type: 'uint256' },
      { indexed: false, name: 'totalAmount', type: 'uint256' },
      { indexed: false, name: 'description', type: 'string' },
    ],
    name: 'CampaignCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'campaignId', type: 'uint256' },
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'TokensClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'reason', type: 'string' },
    ],
    name: 'DirectAirdrop',
    type: 'event',
  },
] as const;

// 캠페인 정보 타입
export interface AirdropCampaign {
  id: number;
  merkleRoot: string;
  totalAmount: bigint;
  claimedAmount: bigint;
  startTime: number;
  endTime: number;
  maxClaimPerUser: bigint;
  active: boolean;
  description: string;
}

// 사용자 클레임 정보 타입
export interface UserClaimInfo {
  totalClaimed: bigint;
  lastClaimTime: number;
  dailyClaimed: bigint;
  remainingDailyLimit: bigint;
}
