/**
 * Staking Page - 토큰 스테이킹
 * ALMANStaking 컨트랙트 연동
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Lock, Unlock, Gift, Shield, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useWallet } from '../components/wallet';
import { useStaking } from '../hooks';

// 숫자 포맷팅
function formatNumber(value: string | number, decimals = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

// 남은 시간 포맷팅
function formatTimeRemaining(date: Date | null, t: (key: string) => string): string {
  if (!date) return 'N/A';
  const now = Date.now();
  const diff = date.getTime() - now;
  if (diff <= 0) return t('staking.unlocked');

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}${t('staking.days')} ${hours}h`;
  return `${hours}h`;
}

// 티어 색상
const tierColors: Record<string, string> = {
  Bronze: 'from-amber-700 to-amber-600',
  Silver: 'from-slate-400 to-slate-300',
  Gold: 'from-yellow-500 to-yellow-400',
  Diamond: 'from-cyan-400 to-blue-400',
};

export default function Staking() {
  const { t } = useTranslation('common');
  const { isConnected, connect: login } = useWallet();
  const {
    stakeInfo,
    tokenBalance,
    stakingStats,
    tierInfos,
    isLoading,
    error,
    isDeployed,
    stake,
    unstake,
    claimReward,
    refresh,
  } = useStaking();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 스테이킹 실행
  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    setActionLoading('stake');
    const success = await stake(stakeAmount);
    if (success) setStakeAmount('');
    setActionLoading(null);
  };

  // 언스테이킹 실행
  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
    setActionLoading('unstake');
    const success = await unstake(unstakeAmount);
    if (success) setUnstakeAmount('');
    setActionLoading(null);
  };

  // 보상 클레임
  const handleClaim = async () => {
    setActionLoading('claim');
    await claimReward();
    setActionLoading(null);
  };

  // 컨트랙트 미배포 상태
  if (!isDeployed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">{t('staking.title')}</h1>
            <p className="text-slate-400">{t('staking.subtitle')}</p>
          </div>

          <div className="card p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">{t('staking.contractNotDeployed')}</h2>
            <p className="text-slate-400 mb-4">{t('staking.contractNotDeployedDesc')}</p>
            <p className="text-slate-500 text-sm">
              Set <code className="bg-slate-800 px-2 py-1 rounded">VITE_NEOS_STAKING_ADDRESS</code> in your environment variables after deployment.
            </p>
          </div>

          {/* Preview Tier Cards */}
          <h2 className="text-xl font-semibold text-white mt-10 mb-6">{t('staking.tiersPreview')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Bronze', min: '0', apy: '5%', weight: '1.0x', lock: `7 ${t('staking.days')}` },
              { name: 'Silver', min: '1,000', apy: '8%', weight: '1.1x', lock: `14 ${t('staking.days')}` },
              { name: 'Gold', min: '10,000', apy: '12%', weight: '1.25x', lock: `30 ${t('staking.days')}` },
              { name: 'Diamond', min: '100,000', apy: '18%', weight: '1.5x', lock: `60 ${t('staking.days')}` },
            ].map((tier) => (
              <div key={tier.name} className="card p-6 relative overflow-hidden opacity-75">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierColors[tier.name]}`} />
                <h3 className="text-xl font-bold text-white mb-4">{tier.name}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('staking.minStake')}</span>
                    <span className="text-white font-semibold">{tier.min} ALMAN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">APY</span>
                    <span className="text-green-400 font-semibold">{tier.apy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('staking.govWeight')}</span>
                    <span className="text-neos-blue font-semibold">{tier.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('staking.lockPeriod')}</span>
                    <span className="text-slate-300">{tier.lock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 미연결 상태
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">{t('staking.title')}</h1>
            <p className="text-slate-400">{t('staking.subtitle')}</p>
          </div>

          <div className="card p-8 text-center">
            <Lock className="w-16 h-16 text-neos-blue mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">{t('staking.connectWallet')}</h2>
            <p className="text-slate-400 mb-6">{t('staking.connectWalletDesc')}</p>
            <button onClick={login} className="btn-primary px-8 py-3">
              {t('staking.connectWallet')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('staking.title')}</h1>
            <p className="text-slate-400">{t('staking.subtitle')}</p>
          </div>
          <button
            onClick={refresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('staking.refresh')}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Current Staking Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-neos-blue/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-neos-blue" />
              </div>
              <span className="text-slate-400 text-sm">{t('staking.stakedAmount')}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {isLoading ? (
                <span className="text-slate-500">{t('common.loading')}</span>
              ) : (
                `${formatNumber(stakeInfo?.amount || '0')} ALMAN`
              )}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-slate-400 text-sm">{t('staking.pendingRewards')}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {isLoading ? (
                <span className="text-slate-500">{t('common.loading')}</span>
              ) : (
                `${formatNumber(stakeInfo?.pendingReward || '0', 4)} ALMAN`
              )}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-400 text-sm">{t('staking.currentTier')}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {isLoading ? (
                <span className="text-slate-500">{t('common.loading')}</span>
              ) : (
                stakeInfo?.tierName || 'Bronze'
              )}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-jeong-orange/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-jeong-orange" />
              </div>
              <span className="text-slate-400 text-sm">{t('staking.lockStatus')}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {isLoading ? (
                <span className="text-slate-500">{t('common.loading')}</span>
              ) : stakeInfo?.isLocked ? (
                formatTimeRemaining(stakeInfo.lockEndTime, t)
              ) : (
                <span className="text-green-400">{t('staking.unlocked')}</span>
              )}
            </p>
          </div>
        </div>

        {/* Staking Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Stake */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-neos-blue" />
              {t('staking.stakeAlman')}
            </h3>
            <div className="mb-4">
              <label className="text-slate-400 text-sm mb-2 block">{t('staking.amountToStake')}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neos-blue"
                />
                <button
                  onClick={() => setStakeAmount(tokenBalance)}
                  className="px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  MAX
                </button>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                {t('staking.available')}: {formatNumber(tokenBalance)} ALMAN
              </p>
            </div>
            <button
              onClick={handleStake}
              disabled={actionLoading === 'stake' || !stakeAmount || parseFloat(stakeAmount) <= 0}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'stake' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('staking.stakingProgress')}
                </>
              ) : (
                t('staking.stakeAlman')
              )}
            </button>
          </div>

          {/* Unstake */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Unlock className="w-5 h-5 text-jeong-orange" />
              {t('staking.unstakeAlman')}
            </h3>
            <div className="mb-4">
              <label className="text-slate-400 text-sm mb-2 block">{t('staking.amountToUnstake')}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-jeong-orange"
                />
                <button
                  onClick={() => setUnstakeAmount(stakeInfo?.amount || '0')}
                  className="px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  MAX
                </button>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                {t('staking.staked')}: {formatNumber(stakeInfo?.amount || '0')} ALMAN
              </p>
              {stakeInfo?.isLocked && stakingStats && (
                <p className="text-yellow-400 text-xs mt-1">
                  ⚠️ {t('staking.earlyWithdrawalPenalty')}: {stakingStats.earlyWithdrawPenaltyPercent}%
                </p>
              )}
            </div>
            <button
              onClick={handleUnstake}
              disabled={actionLoading === 'unstake' || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
              className="w-full btn-secondary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'unstake' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('staking.unstakingProgress')}
                </>
              ) : (
                t('staking.unstakeAlman')
              )}
            </button>
          </div>
        </div>

        {/* Claim Rewards */}
        <div className="card p-6 mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{t('staking.claimRewards')}</h3>
              <p className="text-slate-400 text-sm">
                {t('staking.pendingRewards')}:{' '}
                <span className="text-green-400 font-semibold">
                  {formatNumber(stakeInfo?.pendingReward || '0', 4)} ALMAN
                </span>
              </p>
            </div>
            <button
              onClick={handleClaim}
              disabled={actionLoading === 'claim' || parseFloat(stakeInfo?.pendingReward || '0') <= 0}
              className="btn-primary px-6 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'claim' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('staking.claimingProgress')}
                </>
              ) : (
                t('staking.claimAll')
              )}
            </button>
          </div>
        </div>

        {/* Global Stats */}
        {stakingStats && (
          <div className="card p-6 mb-10">
            <h3 className="text-lg font-semibold text-white mb-4">{t('staking.stakingStatistics')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-400 text-sm">{t('staking.totalStaked')}</p>
                <p className="text-xl font-bold text-white">{formatNumber(stakingStats.totalStaked)} ALMAN</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('staking.rewardPool')}</p>
                <p className="text-xl font-bold text-white">{formatNumber(stakingStats.rewardPool)} ALMAN</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('staking.earlyWithdrawalPenalty')}</p>
                <p className="text-xl font-bold text-yellow-400">{stakingStats.earlyWithdrawPenaltyPercent}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Tier Cards */}
        <h2 className="text-xl font-semibold text-white mb-6">{t('staking.stakingTiers')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(tierInfos.length > 0 ? tierInfos : [
            { name: 'Bronze', minAmount: '0', apyPercent: 5, kindnessMultiplier: 1, lockPeriodDays: 7 },
            { name: 'Silver', minAmount: '1000', apyPercent: 8, kindnessMultiplier: 1.1, lockPeriodDays: 14 },
            { name: 'Gold', minAmount: '10000', apyPercent: 12, kindnessMultiplier: 1.25, lockPeriodDays: 30 },
            { name: 'Diamond', minAmount: '100000', apyPercent: 18, kindnessMultiplier: 1.5, lockPeriodDays: 60 },
          ]).map((tier) => (
            <div
              key={tier.name}
              className={`card p-6 relative overflow-hidden ${
                stakeInfo?.tierName === tier.name ? 'ring-2 ring-neos-blue' : ''
              }`}
            >
              {/* Gradient Header */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierColors[tier.name]}`} />

              <h3 className="text-xl font-bold text-white mb-4">{tier.name}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('staking.minStake')}</span>
                  <span className="text-white font-semibold">{formatNumber(tier.minAmount)} ALMAN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">APY</span>
                  <span className="text-green-400 font-semibold">{tier.apyPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('staking.govWeight')}</span>
                  <span className="text-neos-blue font-semibold">{tier.kindnessMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('staking.lockPeriod')}</span>
                  <span className="text-slate-300">{tier.lockPeriodDays} {t('staking.days')}</span>
                </div>
              </div>

              {stakeInfo?.tierName === tier.name && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs px-2 py-1 bg-neos-blue/20 text-neos-blue rounded-full">
                    {t('staking.current')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
