/**
 * NEOS Wallet Button
 * 헤더에 표시되는 지갑 연결 버튼
 */

import React from 'react';
import { useWallet } from './WalletContext';
import type { WalletButtonProps } from './types';

interface WalletButtonInternalProps extends WalletButtonProps {
  onOpenModal: () => void;
}

export const WalletButton: React.FC<WalletButtonInternalProps> = ({
  variant = 'default',
  showBalance = true,
  className = '',
  onOpenModal,
}) => {
  const {
    isConnected,
    isConnecting,
    isLoading,
    address,
    balance,
    userInfo,
    connect,
    truncateAddress,
  } = useWallet();

  // 로딩 중
  if (isLoading) {
    return (
      <button
        disabled
        className={`wallet-btn wallet-btn-loading ${className}`}
      >
        <span className="wallet-btn-spinner" />
        <span>Loading...</span>
      </button>
    );
  }

  // 연결 안됨
  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className={`wallet-btn wallet-btn-connect ${className}`}
      >
        {isConnecting ? (
          <>
            <span className="wallet-btn-spinner" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <WalletIcon />
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    );
  }

  // 연결됨 - variant에 따라 다른 UI
  if (variant === 'icon-only') {
    return (
      <button
        onClick={onOpenModal}
        className={`wallet-btn wallet-btn-icon ${className}`}
      >
        {userInfo?.profileImage ? (
          <img
            src={userInfo.profileImage}
            alt="profile"
            className="wallet-avatar"
          />
        ) : (
          <WalletIcon />
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={onOpenModal}
        className={`wallet-btn wallet-btn-compact ${className}`}
      >
        {userInfo?.profileImage ? (
          <img
            src={userInfo.profileImage}
            alt="profile"
            className="wallet-avatar"
          />
        ) : (
          <WalletIcon />
        )}
        <span>{userInfo?.name || truncateAddress(address!)}</span>
      </button>
    );
  }

  // Default variant
  return (
    <div className={`wallet-btn-group ${className}`}>
      {showBalance && (
        <span className="wallet-balance">
          {parseFloat(balance).toFixed(3)} POL
        </span>
      )}
      <button
        onClick={onOpenModal}
        className="wallet-btn wallet-btn-connected"
      >
        {userInfo?.profileImage ? (
          <img
            src={userInfo.profileImage}
            alt="profile"
            className="wallet-avatar"
          />
        ) : (
          <WalletIcon />
        )}
        <span>{userInfo?.name || truncateAddress(address!)}</span>
        <ChevronDown />
      </button>
    </div>
  );
};

// 아이콘 컴포넌트
const WalletIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const ChevronDown: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default WalletButton;
