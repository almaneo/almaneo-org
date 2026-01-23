/**
 * NEOS Unified Wallet Types
 * 통합 지갑 컴포넌트 타입 정의
 */

// 사용자 정보 (Web3Auth에서 제공)
export interface UserInfo {
  email?: string;
  name?: string;
  profileImage?: string;
  verifier?: string;
  verifierId?: string;
  typeOfLogin?: string;
}

// 토큰 잔액 정보
export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  address: string;
  usdValue?: string;
  icon?: string;
}

// NFT 요약 정보
export interface NFTSummary {
  totalOwned: number;
  totalListed: number;
  collections: number;
}

// 게임 요약 정보
export interface GameSummary {
  kindnessScore: number;
  totalPoints: number;
  level: number;
  dailyQuestsCompleted: number;
}

// 스테이킹 요약 정보
export interface StakingSummary {
  stakedAmount: string;
  pendingRewards: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  apy: number;
}

// 거버넌스 요약 정보
export interface GovernanceSummary {
  votingPower: string;
  activeProposals: number;
  delegatedTo?: string;
}

// 통합 지갑 상태
export interface WalletState {
  // 연결 상태
  isConnected: boolean;
  isConnecting: boolean;
  isLoading: boolean;

  // 기본 정보
  address: string | null;
  chainId: number | null;
  balance: string; // Native token (POL)

  // 사용자 정보
  userInfo: UserInfo | null;

  // 토큰 잔액
  tokens: TokenBalance[];

  // 요약 정보
  nftSummary: NFTSummary | null;
  gameSummary: GameSummary | null;
  stakingSummary: StakingSummary | null;
  governanceSummary: GovernanceSummary | null;

  // 에러
  error: string | null;
}

// 지갑 탭 타입
export type WalletTab = 'overview' | 'tokens' | 'nft' | 'game' | 'staking' | 'governance';

// 지갑 모달 Props
export interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: WalletTab;
  // 어떤 기능을 활성화할지 (서버별로 다름)
  enabledFeatures?: {
    tokens?: boolean;
    nft?: boolean;
    game?: boolean;
    staking?: boolean;
    governance?: boolean;
  };
}

// 지갑 버튼 Props
export interface WalletButtonProps {
  variant?: 'default' | 'compact' | 'icon-only';
  showBalance?: boolean;
  className?: string;
}

// 퀵 액션 타입
export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number | string;
  disabled?: boolean;
}
