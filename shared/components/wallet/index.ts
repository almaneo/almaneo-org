/**
 * NEOS Unified Wallet Components
 * 통합 지갑 컴포넌트 Export
 */

// Context & Hook
export { WalletProvider, useWallet } from './WalletContext';

// Components
export { WalletButton } from './WalletButton';
export { WalletModal } from './WalletModal';

// Types
export type {
  UserInfo,
  TokenBalance,
  NFTSummary,
  GameSummary,
  StakingSummary,
  GovernanceSummary,
  WalletState,
  WalletTab,
  WalletModalProps,
  WalletButtonProps,
  QuickAction,
} from './types';

// CSS (import in your app)
// import '@neos/shared/components/wallet/wallet.css';
