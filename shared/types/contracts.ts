/**
 * NEOS Contract Types
 * 스마트 컨트랙트 관련 타입 정의
 */

/**
 * 지원하는 체인
 */
export type SupportedChainId = 137 | 80002;  // Polygon Mainnet | Amoy Testnet

/**
 * 컨트랙트 주소 타입
 */
export type ContractAddress = `0x${string}`;

/**
 * 컨트랙트 목록
 */
export interface ContractAddresses {
  // 토큰
  NEOSToken: ContractAddress;

  // 거버넌스
  NEOSGovernor: ContractAddress;
  NEOSTimelock: ContractAddress;

  // 스테이킹 & 에어드롭
  NEOSStaking: ContractAddress;
  KindnessAirdrop: ContractAddress;

  // Kindness Protocol
  KindnessRegistry: ContractAddress;
  JeongSBT: ContractAddress;

  // NFT
  NEOSNFT721: ContractAddress;
  NEOSNFT1155: ContractAddress;
  NFTMarketplace: ContractAddress;
  CollectionManager: ContractAddress;
  PaymentManager: ContractAddress;
}

/**
 * 스테이킹 티어
 */
export type StakingTier = 'bronze' | 'silver' | 'gold' | 'diamond';

/**
 * 스테이킹 티어 설정
 */
export interface StakingTierConfig {
  tier: StakingTier;
  name: string;
  minStake: bigint;
  apyBps: number;        // basis points (100 = 1%)
  govMultiplier: number; // 거버넌스 가중치 (1.0 ~ 1.5)
}

/**
 * 스테이킹 티어 상수
 */
export const STAKING_TIERS: StakingTierConfig[] = [
  { tier: 'bronze', name: 'Bronze', minStake: 1000n * 10n**18n, apyBps: 500, govMultiplier: 1.0 },
  { tier: 'silver', name: 'Silver', minStake: 10000n * 10n**18n, apyBps: 800, govMultiplier: 1.1 },
  { tier: 'gold', name: 'Gold', minStake: 50000n * 10n**18n, apyBps: 1200, govMultiplier: 1.25 },
  { tier: 'diamond', name: 'Diamond', minStake: 100000n * 10n**18n, apyBps: 1800, govMultiplier: 1.5 },
];

/**
 * 스테이킹 정보
 */
export interface StakingInfo {
  stakedAmount: bigint;
  tier: StakingTier;
  rewards: bigint;
  stakedAt: number;      // timestamp
  lastClaimAt: number;   // timestamp
}

/**
 * 거버넌스 제안 상태
 */
export type ProposalState =
  | 'Pending'
  | 'Active'
  | 'Canceled'
  | 'Defeated'
  | 'Succeeded'
  | 'Queued'
  | 'Expired'
  | 'Executed';

/**
 * 거버넌스 제안
 */
export interface Proposal {
  id: bigint;
  proposer: ContractAddress;
  title: string;
  description: string;
  targets: ContractAddress[];
  values: bigint[];
  calldatas: `0x${string}`[];
  startBlock: bigint;
  endBlock: bigint;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
  state: ProposalState;
  eta?: number;  // 실행 예정 시간 (Timelock)
}

/**
 * 투표 타입
 */
export type VoteType = 'Against' | 'For' | 'Abstain';

/**
 * NFT 리스팅 상태
 */
export type ListingStatus = 'active' | 'sold' | 'cancelled' | 'expired';

/**
 * NFT 리스팅 타입
 */
export type ListingType = 'fixed' | 'auction' | 'rental';

/**
 * NFT 리스팅
 */
export interface NFTListing {
  listingId: bigint;
  tokenAddress: ContractAddress;
  tokenId: bigint;
  seller: ContractAddress;
  price: bigint;
  paymentToken: ContractAddress;
  listingType: ListingType;
  status: ListingStatus;
  startTime: number;
  endTime: number;

  // 경매용
  highestBidder?: ContractAddress;
  highestBid?: bigint;

  // 렌탈용
  rentalDuration?: number;
  renter?: ContractAddress;
}

/**
 * Jeong-SBT (영혼 토큰) 정보
 */
export interface JeongSBT {
  tokenId: bigint;
  owner: ContractAddress;
  kindnessScore: number;
  tier: StakingTier;
  issuedAt: number;
  lastUpdatedAt: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

/**
 * 에어드롭 태스크 카테고리
 */
export type AirdropTaskCategory =
  | 'dao_participation'   // DAO 참여 (제안, 투표)
  | 'social_media'        // 소셜 미디어 활동
  | 'growth_referral'     // 성장 & 추천
  | 'education'           // 교육 (튜토리얼, 퀴즈)
  | 'loyalty';            // 충성도 (체크인, 홀딩)

/**
 * 에어드롭 태스크
 */
export interface AirdropTask {
  taskId: number;
  category: AirdropTaskCategory;
  title: string;
  description: string;
  rewardAmount: bigint;
  totalClaims: number;
  maxClaims: number;
  isActive: boolean;
  startTime: number;
  endTime: number;
}

/**
 * 트랜잭션 상태
 */
export type TxStatus = 'pending' | 'confirmed' | 'failed';

/**
 * 트랜잭션 결과
 */
export interface TxResult {
  hash: `0x${string}`;
  status: TxStatus;
  blockNumber?: number;
  gasUsed?: bigint;
  error?: string;
}
