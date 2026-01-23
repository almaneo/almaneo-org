// Web3AuthProvider는 더 이상 사용하지 않음
// 대신 components/wallet의 WalletProvider 사용
// 기존 코드 호환성을 위해 CURRENT_CHAIN만 내보냄

export { CURRENT_CHAIN } from './Web3AuthProvider';

// Kindness Mode (친절 모드)
export { KindnessModeProvider, useKindnessMode } from './KindnessModeContext';
