/**
 * ALMAN Wallet Modal
 * 통합 지갑 모달 - Overview, Tokens, NFT, Game, Staking, Governance 탭
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useWallet } from './WalletContext';
import type { WalletModalProps, WalletTab, QuickAction, TokenBalance, NFTSummary, GameSummary, StakingSummary, GovernanceSummary } from './types';

// Block Explorer URL
const BLOCK_EXPLORER = import.meta.env.VITE_BLOCK_EXPLORER || 'https://amoy.polygonscan.com';

export const WalletModal: React.FC<WalletModalProps> = ({
  open,
  onClose,
  defaultTab = 'overview',
  enabledFeatures = {
    tokens: true,
    nft: true,
    game: true,
    staking: true,
    governance: true,
  },
}) => {
  const [activeTab, setActiveTab] = useState<WalletTab>(defaultTab);
  const { address, balance, userInfo, disconnect, nftSummary, gameSummary, stakingSummary, governanceSummary, tokens } = useWallet();

  // 유틸리티 함수
  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const getExplorerUrl = (type: 'address' | 'tx', value: string) => `${BLOCK_EXPLORER}/${type}/${value}`;

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      return true;
    }
    return false;
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [open, onClose]);

  if (!open || !address) return null;

  // 활성화된 탭 목록
  const allTabs: { id: WalletTab; label: string; enabled: boolean }[] = [
    { id: 'overview' as WalletTab, label: 'Overview', enabled: true },
    { id: 'tokens' as WalletTab, label: 'Tokens', enabled: enabledFeatures.tokens ?? true },
    { id: 'nft' as WalletTab, label: 'NFT', enabled: enabledFeatures.nft ?? true },
    { id: 'game' as WalletTab, label: 'Game', enabled: enabledFeatures.game ?? true },
    { id: 'staking' as WalletTab, label: 'Staking', enabled: enabledFeatures.staking ?? true },
    { id: 'governance' as WalletTab, label: 'DAO', enabled: enabledFeatures.governance ?? true },
  ];
  const tabs = allTabs.filter(tab => tab.enabled);

  const handleCopyAddress = async () => {
    const success = await copyAddress();
    if (success) {
      console.log('Address copied');
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    onClose();
  };

  return createPortal(
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="wallet-modal-header">
          <div className="wallet-modal-profile">
            {userInfo?.profileImage ? (
              <img
                src={userInfo.profileImage}
                alt="profile"
                className="wallet-modal-avatar"
              />
            ) : (
              <div className="wallet-modal-avatar-placeholder">
                {address.slice(2, 4).toUpperCase()}
              </div>
            )}
            <div className="wallet-modal-info">
              <h3 className="wallet-modal-name">
                {userInfo?.name || 'Wallet'}
              </h3>
              <div className="wallet-modal-address-row">
                <span className="wallet-modal-address">
                  {truncateAddress(address)}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="wallet-modal-copy-btn"
                  title="Copy address"
                >
                  <CopyIcon />
                </button>
                <a
                  href={getExplorerUrl('address', address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wallet-modal-explorer-btn"
                  title="View on explorer"
                >
                  <ExternalLinkIcon />
                </a>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="wallet-modal-close">
            <CloseIcon />
          </button>
        </div>

        {/* 잔액 카드 */}
        <div className="wallet-modal-balance-card">
          <span className="wallet-modal-balance-label">Total Balance</span>
          <span className="wallet-modal-balance-value">
            {parseFloat(balance).toFixed(4)} POL
          </span>
        </div>

        {/* 탭 */}
        <div className="wallet-modal-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`wallet-modal-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="wallet-modal-content">
          {activeTab === 'overview' && (
            <OverviewTab
              nftSummary={nftSummary}
              gameSummary={gameSummary}
              stakingSummary={stakingSummary}
              governanceSummary={governanceSummary}
              enabledFeatures={enabledFeatures}
            />
          )}
          {activeTab === 'tokens' && <TokensTab tokens={tokens} balance={balance} />}
          {activeTab === 'nft' && <NFTTab summary={nftSummary} />}
          {activeTab === 'game' && <GameTab summary={gameSummary} />}
          {activeTab === 'staking' && <StakingTab summary={stakingSummary} />}
          {activeTab === 'governance' && <GovernanceTab summary={governanceSummary} />}
        </div>

        {/* 푸터 */}
        <div className="wallet-modal-footer">
          <button onClick={handleDisconnect} className="wallet-modal-disconnect">
            <LogoutIcon />
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Overview 탭
const OverviewTab: React.FC<{
  nftSummary: NFTSummary | null;
  gameSummary: GameSummary | null;
  stakingSummary: StakingSummary | null;
  governanceSummary: GovernanceSummary | null;
  enabledFeatures: WalletModalProps['enabledFeatures'];
}> = ({ nftSummary, gameSummary, stakingSummary, governanceSummary, enabledFeatures }) => {
  const quickActions: QuickAction[] = [];

  if (enabledFeatures?.nft) {
    quickActions.push({
      id: 'my-nfts',
      label: 'My NFTs',
      icon: <ImageIcon />,
      href: '/my-nfts',
      badge: nftSummary?.totalOwned,
    });
  }

  if (enabledFeatures?.game) {
    quickActions.push({
      id: 'kindness-game',
      label: 'Kindness Game',
      icon: <GamepadIcon />,
      href: '/game',
      badge: gameSummary?.level ? `Lv.${gameSummary.level}` : undefined,
    });
  }

  if (enabledFeatures?.staking) {
    quickActions.push({
      id: 'staking',
      label: 'Staking',
      icon: <CoinsIcon />,
      href: '/staking',
      badge: stakingSummary?.tier,
    });
  }

  if (enabledFeatures?.governance) {
    quickActions.push({
      id: 'governance',
      label: 'Governance',
      icon: <VoteIcon />,
      href: '/governance',
      badge: governanceSummary?.activeProposals,
    });
  }

  return (
    <div className="wallet-tab-content">
      {/* 퀵 액션 그리드 */}
      <div className="wallet-quick-actions">
        {quickActions.map(action => (
          <a
            key={action.id}
            href={action.href}
            className="wallet-quick-action"
          >
            <div className="wallet-quick-action-icon">{action.icon}</div>
            <span className="wallet-quick-action-label">{action.label}</span>
            {action.badge && (
              <span className="wallet-quick-action-badge">{action.badge}</span>
            )}
          </a>
        ))}
      </div>

      {/* 요약 카드들 */}
      <div className="wallet-summary-cards">
        {enabledFeatures?.nft && nftSummary && (
          <div className="wallet-summary-card">
            <h4>NFT</h4>
            <div className="wallet-summary-stats">
              <div className="wallet-summary-stat">
                <span className="label">Owned</span>
                <span className="value">{nftSummary.totalOwned}</span>
              </div>
              <div className="wallet-summary-stat">
                <span className="label">Listed</span>
                <span className="value">{nftSummary.totalListed}</span>
              </div>
            </div>
          </div>
        )}

        {enabledFeatures?.game && gameSummary && (
          <div className="wallet-summary-card">
            <h4>Kindness Game</h4>
            <div className="wallet-summary-stats">
              <div className="wallet-summary-stat">
                <span className="label">Score</span>
                <span className="value">{gameSummary.kindnessScore}</span>
              </div>
              <div className="wallet-summary-stat">
                <span className="label">Level</span>
                <span className="value">{gameSummary.level}</span>
              </div>
            </div>
          </div>
        )}

        {enabledFeatures?.staking && stakingSummary && (
          <div className="wallet-summary-card">
            <h4>Staking</h4>
            <div className="wallet-summary-stats">
              <div className="wallet-summary-stat">
                <span className="label">Staked</span>
                <span className="value">{stakingSummary.stakedAmount} ALMAN</span>
              </div>
              <div className="wallet-summary-stat">
                <span className="label">APY</span>
                <span className="value">{stakingSummary.apy}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Tokens 탭
const TokensTab: React.FC<{ tokens: TokenBalance[]; balance: string }> = ({ tokens, balance }) => (
  <div className="wallet-tab-content">
    <div className="wallet-token-list">
      {/* Native Token */}
      <div className="wallet-token-item">
        <div className="wallet-token-icon">
          <img src="https://images.web3auth.io/chains/80002.png" alt="POL" />
        </div>
        <div className="wallet-token-info">
          <span className="wallet-token-name">POL</span>
          <span className="wallet-token-network">Polygon</span>
        </div>
        <div className="wallet-token-balance">
          <span className="wallet-token-amount">{parseFloat(balance).toFixed(4)}</span>
        </div>
      </div>

      {/* Other Tokens */}
      {tokens.map(token => (
        <div key={token.address} className="wallet-token-item">
          <div className="wallet-token-icon">
            {token.icon ? (
              <img src={token.icon} alt={token.symbol} />
            ) : (
              <div className="wallet-token-icon-placeholder">
                {token.symbol.slice(0, 2)}
              </div>
            )}
          </div>
          <div className="wallet-token-info">
            <span className="wallet-token-name">{token.symbol}</span>
            <span className="wallet-token-network">{token.name}</span>
          </div>
          <div className="wallet-token-balance">
            <span className="wallet-token-amount">{token.balance}</span>
          </div>
        </div>
      ))}

      {tokens.length === 0 && (
        <p className="wallet-empty-message">No additional tokens found</p>
      )}
    </div>
  </div>
);

// NFT 탭
const NFTTab: React.FC<{ summary: NFTSummary | null }> = ({ summary }) => (
  <div className="wallet-tab-content">
    {summary ? (
      <div className="wallet-nft-summary">
        <div className="wallet-stat-grid">
          <div className="wallet-stat-item">
            <span className="label">Total Owned</span>
            <span className="value">{summary.totalOwned}</span>
          </div>
          <div className="wallet-stat-item">
            <span className="label">Listed</span>
            <span className="value">{summary.totalListed}</span>
          </div>
          <div className="wallet-stat-item">
            <span className="label">Collections</span>
            <span className="value">{summary.collections}</span>
          </div>
        </div>
        <a href="/my-nfts" className="wallet-action-btn">
          View My NFTs
        </a>
      </div>
    ) : (
      <div className="wallet-empty-state">
        <ImageIcon />
        <p>No NFT data available</p>
        <a href="/explore" className="wallet-action-btn">
          Explore NFTs
        </a>
      </div>
    )}
  </div>
);

// Game 탭
const GameTab: React.FC<{ summary: GameSummary | null }> = ({ summary }) => (
  <div className="wallet-tab-content">
    {summary ? (
      <div className="wallet-game-summary">
        <div className="wallet-stat-grid">
          <div className="wallet-stat-item">
            <span className="label">Kindness Score</span>
            <span className="value">{summary.kindnessScore}</span>
          </div>
          <div className="wallet-stat-item">
            <span className="label">Total Points</span>
            <span className="value">{summary.totalPoints.toLocaleString()}</span>
          </div>
          <div className="wallet-stat-item">
            <span className="label">Level</span>
            <span className="value">{summary.level}</span>
          </div>
          <div className="wallet-stat-item">
            <span className="label">Daily Quests</span>
            <span className="value">{summary.dailyQuestsCompleted}/3</span>
          </div>
        </div>
        <a href="/game" className="wallet-action-btn">
          Play Kindness Game
        </a>
      </div>
    ) : (
      <div className="wallet-empty-state">
        <GamepadIcon />
        <p>Start playing to earn rewards</p>
        <a href="/game" className="wallet-action-btn">
          Start Game
        </a>
      </div>
    )}
  </div>
);

// Staking 탭
const StakingTab: React.FC<{ summary: StakingSummary | null }> = ({ summary }) => (
  <div className="wallet-tab-content">
    {summary ? (
      <div className="wallet-staking-summary">
        <div className="wallet-tier-badge" data-tier={summary.tier.toLowerCase()}>
          {summary.tier}
        </div>
        <div className="wallet-stat-grid">
          <div className="wallet-stat-item">
            <span className="label">Staked</span>
            <span className="value">{summary.stakedAmount} ALMAN</span>
          </div>
          <div className="wallet-stat-item">
            <span className="label">Pending Rewards</span>
            <span className="value">{summary.pendingRewards} ALMAN</span>
          </div>
          <div className="wallet-stat-item">
            <span className="label">APY</span>
            <span className="value highlight">{summary.apy}%</span>
          </div>
        </div>
        <a href="/staking" className="wallet-action-btn">
          Manage Staking
        </a>
      </div>
    ) : (
      <div className="wallet-empty-state">
        <CoinsIcon />
        <p>Stake ALMAN to earn rewards</p>
        <a href="/staking" className="wallet-action-btn">
          Start Staking
        </a>
      </div>
    )}
  </div>
);

// Governance 탭
const GovernanceTab: React.FC<{ summary: GovernanceSummary | null }> = ({ summary }) => (
  <div className="wallet-tab-content">
    {summary ? (
      <div className="wallet-governance-summary">
        <div className="wallet-stat-grid">
          <div className="wallet-stat-item">
            <span className="label">Voting Power</span>
            <span className="value">{summary.votingPower} ALMAN</span>
          </div>
          <div className="wallet-stat-item">
            <span className="label">Active Proposals</span>
            <span className="value">{summary.activeProposals}</span>
          </div>
        </div>
        {summary.delegatedTo && (
          <p className="wallet-delegated-info">
            Delegated to: {summary.delegatedTo.slice(0, 10)}...
          </p>
        )}
        <a href="/governance" className="wallet-action-btn">
          View Proposals
        </a>
      </div>
    ) : (
      <div className="wallet-empty-state">
        <VoteIcon />
        <p>Participate in governance</p>
        <a href="/governance" className="wallet-action-btn">
          View Proposals
        </a>
      </div>
    )}
  </div>
);

// 아이콘들
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const GamepadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="6" x2="10" y1="12" y2="12" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <circle cx="15" cy="13" r="1" />
    <circle cx="18" cy="11" r="1" />
    <rect width="20" height="12" x="2" y="6" rx="2" />
  </svg>
);

const CoinsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

const VoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 12 2 2 4-4" />
    <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
    <path d="M22 19H2" />
  </svg>
);

export default WalletModal;
