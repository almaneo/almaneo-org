/**
 * Dashboard Page - 사용자 대시보드
 * 토큰 잔액, 스테이킹, Kindness Score 등
 */

import { Link } from 'react-router-dom';
import { Wallet, Coins, Heart, TrendingUp, Award, ArrowUpRight, RefreshCw, Loader2 } from 'lucide-react';
import { useWallet } from '../components/wallet';
import { useUserData, STAKING_TIERS } from '../hooks';

// 주소 축약 유틸리티
function shortenAddress(address: string, chars = 6): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// 티어 색상
const TIER_COLORS = {
  bronze: 'text-amber-600',
  silver: 'text-slate-300',
  gold: 'text-yellow-400',
  diamond: 'text-cyan-400',
};

export default function Dashboard() {
  const { address, balance, isConnected, isLoading: authLoading, connect: login } = useWallet();
  const { user, isLoading: userLoading, refreshUser } = useUserData();

  const isLoading = authLoading || userLoading;

  // 지갑 미연결 상태
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-neos-blue to-cyan-500 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-slate-400 mb-8">
            지갑을 연결하여 NEOS 대시보드에 접근하세요.
            토큰 잔액, 스테이킹, Kindness Score를 확인할 수 있습니다.
          </p>
          <button
            onClick={login}
            disabled={authLoading}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50"
          >
            {authLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </span>
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>
      </div>
    );
  }

  // 데이터 로딩 상태
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-neos-blue animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // 사용자 데이터 (기본값 포함)
  const userData = {
    walletAddress: address || '0x0000...0000',
    neosBalance: '0', // TODO: 토큰 컨트랙트 연동 후 업데이트
    polBalance: balance || '0',
    stakedAmount: user?.stakedAmount || 0,
    stakingTier: user?.stakingTier || 'bronze',
    kindnessScore: user?.kindnessScore || 0,
    level: user?.level || 1,
    totalPoints: user?.totalPoints || 0,
    nickname: user?.profile?.nickname || `NEOS_${address?.slice(0, 6)}`,
  };

  const tierInfo = STAKING_TIERS[userData.stakingTier as keyof typeof STAKING_TIERS];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">
              Welcome back, <span className="text-neos-blue">{userData.nickname}</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {shortenAddress(userData.walletAddress)}
            </p>
          </div>
          <button
            onClick={refreshUser}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* NEOS Balance */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-neos-blue/20 flex items-center justify-center">
                <Coins className="w-6 h-6 text-neos-blue" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-slate-400 text-sm mb-1">NEOS Balance</p>
            <p className="text-2xl font-bold text-white">
              {userData.neosBalance}
              <span className="text-sm text-slate-500 ml-2">NEOS</span>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {userData.polBalance} POL
            </p>
          </div>

          {/* Staked Amount */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <span className={`text-xs px-2 py-1 bg-slate-800 rounded-full capitalize ${TIER_COLORS[userData.stakingTier as keyof typeof TIER_COLORS]}`}>
                {userData.stakingTier}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Staked</p>
            <p className="text-2xl font-bold text-white">
              {userData.stakedAmount.toLocaleString()}
              <span className="text-sm text-slate-500 ml-2">NEOS</span>
            </p>
            <p className="text-xs text-green-400 mt-2">
              APY: {tierInfo.apy}%
            </p>
          </div>

          {/* Kindness Score */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-jeong-orange/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-jeong-orange" />
              </div>
              <span className="text-xs px-2 py-1 bg-jeong-orange/20 text-jeong-orange rounded-full">
                +{tierInfo.weight}x
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Kindness Score</p>
            <p className="text-2xl font-bold text-white">{userData.kindnessScore.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">
              Total Points: {userData.totalPoints.toLocaleString()}
            </p>
          </div>

          {/* Level */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Level</p>
            <p className="text-2xl font-bold text-white">{userData.level}</p>
            <div className="mt-2">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-neos-blue rounded-full"
                  style={{ width: `${Math.min((userData.totalPoints % 1000) / 10, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {userData.totalPoints % 1000} / 1000 XP
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/staking" className="card card-hover p-6 text-center">
            <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Staking</h3>
            <p className="text-slate-400 text-sm">Stake NEOS to earn rewards</p>
          </Link>

          <Link to="/governance" className="card card-hover p-6 text-center">
            <Award className="w-8 h-8 text-neos-blue mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Governance</h3>
            <p className="text-slate-400 text-sm">Participate in DAO voting</p>
          </Link>

          <Link to="/airdrop" className="card card-hover p-6 text-center">
            <Coins className="w-8 h-8 text-jeong-orange mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Airdrop</h3>
            <p className="text-slate-400 text-sm">Claim your NEOS tokens</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
