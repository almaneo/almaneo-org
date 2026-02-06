/**
 * Tokenomics Dashboard Page
 * 온체인 실시간 토큰 분배 현황
 */

import { useEffect } from 'react';
import {
  Coins,
  TrendingUp,
  Users,
  Pickaxe,
  Lock,
  Gift,
  Shield,
  Wallet,
  RefreshCw,
  ExternalLink,
  BarChart3,
} from 'lucide-react';
import { useTokenBalance, useMiningPool, useTokenVesting } from '../hooks';
import { useWallet } from '../components/wallet';
import { getContractAddress } from '../contracts/addresses';
import { EPOCH_NAMES } from '../contracts/abis/MiningPool';

// 토큰 분배 카테고리 (고정 데이터)
const DISTRIBUTION = [
  { key: 'foundation', label: 'Foundation Reserve', amount: '2,000,000,000', pct: 25, color: '#60a5fa', icon: Shield },
  { key: 'mining', label: 'Community Mining', amount: '800,000,000', pct: 10, color: '#FB923C', icon: Pickaxe },
  { key: 'staking', label: 'Community Staking', amount: '1,000,000,000', pct: 12.5, color: '#4ade80', icon: TrendingUp },
  { key: 'airdrop', label: 'Community Airdrop', amount: '600,000,000', pct: 7.5, color: '#f472b6', icon: Gift },
  { key: 'dao', label: 'DAO Reserve', amount: '800,000,000', pct: 10, color: '#a78bfa', icon: Users },
  { key: 'liquidity', label: 'Liquidity & Exchange', amount: '1,200,000,000', pct: 15, color: '#38bdf8', icon: BarChart3 },
  { key: 'team', label: 'Team & Advisors', amount: '800,000,000', pct: 10, color: '#fbbf24', icon: Lock },
  { key: 'grants', label: 'Kindness Grants', amount: '800,000,000', pct: 10, color: '#34d399', icon: Gift },
];

function formatNumber(value: string | number, decimals = 0): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="glass p-4 sm:p-5 rounded-xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color }} strokeWidth={1.5} />
        </div>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function ProgressBar({ value, max, color, label }: {
  value: number;
  max: number;
  color: string;
  label?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>{label}</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ExplorerLink({ address, label }: { address: string; label: string }) {
  const chainId: number = 80002; // TODO: dynamic
  const baseUrl = chainId === 137
    ? 'https://polygonscan.com/address/'
    : 'https://amoy.polygonscan.com/address/';

  return (
    <a
      href={`${baseUrl}${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-xs text-slate-500 hover:text-neos-blue transition-colors"
    >
      <span>{label}</span>
      <ExternalLink size={10} />
    </a>
  );
}

export default function Tokenomics() {
  const { isConnected } = useWallet();
  const { formattedBalance, refresh: refreshBalance } = useTokenBalance();
  const mining = useMiningPool();
  const vesting = useTokenVesting();

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      mining.refresh();
      vesting.refresh();
    }, 60000);
    return () => clearInterval(interval);
  }, [mining.refresh, vesting.refresh]);

  const handleRefresh = () => {
    refreshBalance();
    mining.refresh();
    vesting.refresh();
  };

  const chainId = 80002;
  const miningAddress = getContractAddress('MiningPool', chainId);
  const vestingAddress = getContractAddress('TokenVesting', chainId);
  const stakingAddress = getContractAddress('ALMANStaking', chainId);
  const airdropAddress = getContractAddress('KindnessAirdrop', chainId);
  const tokenAddress = getContractAddress('ALMANToken', chainId);

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Tokenomics Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              8,000,000,000 ALMAN — Real-time On-chain Data
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg glass hover:bg-slate-700/50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-slate-400" />
          </button>
        </div>

        {/* My Balance (if connected) */}
        {isConnected && (
          <div className="glass p-5 rounded-xl mb-6 border border-neos-blue/20">
            <div className="flex items-center gap-3">
              <Wallet size={20} className="text-neos-blue" />
              <span className="text-slate-400">My ALMAN Balance</span>
            </div>
            <p className="text-3xl font-bold text-white mt-2">{formattedBalance} ALMAN</p>
          </div>
        )}

        {/* Distribution Overview */}
        <div className="glass p-5 sm:p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Coins size={20} className="text-jeong-orange" />
            Token Distribution
          </h2>

          {/* Horizontal bar */}
          <div className="w-full h-8 rounded-full overflow-hidden flex mb-4">
            {DISTRIBUTION.map(d => (
              <div
                key={d.key}
                className="h-full relative group"
                style={{ width: `${d.pct}%`, backgroundColor: d.color }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 whitespace-nowrap">
                  <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                    {d.label}: {d.pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DISTRIBUTION.map(d => {
              const Icon = d.icon;
              return (
                <div key={d.key} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <Icon size={12} className="text-slate-500 flex-shrink-0" />
                      <span className="text-xs text-slate-300 truncate">{d.label}</span>
                    </div>
                    <span className="text-xs text-slate-500">{d.amount} ({d.pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mining Pool & Vesting Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Mining Pool Card */}
          <div className="glass p-5 sm:p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Pickaxe size={20} className="text-jeong-orange" />
                Mining Pool
              </h2>
              <ExplorerLink address={miningAddress} label="Contract" />
            </div>

            {mining.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-jeong-orange/30 border-t-jeong-orange rounded-full animate-spin" />
              </div>
            ) : mining.error ? (
              <p className="text-red-400 text-sm py-4">{mining.error}</p>
            ) : (
              <div className="space-y-4">
                {/* Epoch */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Current Epoch</span>
                  <span className="text-white font-medium">
                    {mining.currentEpoch > 0
                      ? `${mining.currentEpoch} — ${EPOCH_NAMES[mining.currentEpoch] || ''}`
                      : 'Mining Complete'}
                  </span>
                </div>

                {/* Mining Progress */}
                <ProgressBar
                  value={mining.miningProgress}
                  max={100}
                  color="#FB923C"
                  label="Mining Progress"
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Total Claimed</p>
                    <p className="text-sm font-medium text-white">{formatNumber(mining.totalClaimed)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Remaining</p>
                    <p className="text-sm font-medium text-white">{formatNumber(mining.remainingPool)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Daily Remaining</p>
                    <p className="text-sm font-medium text-white">{formatNumber(mining.dailyRemaining)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Pool Balance</p>
                    <p className="text-sm font-medium text-white">{formatNumber(mining.contractBalance)}</p>
                  </div>
                </div>

                {/* User Daily Remaining */}
                {isConnected && (
                  <div className="bg-neos-blue/10 border border-neos-blue/20 p-3 rounded-lg">
                    <p className="text-xs text-slate-400">Your Daily Remaining</p>
                    <p className="text-sm font-medium text-neos-blue">{formatNumber(mining.userDailyRemaining)} ALMAN</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vesting Card */}
          <div className="glass p-5 sm:p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Lock size={20} className="text-yellow-400" />
                Team Vesting
              </h2>
              <ExplorerLink address={vestingAddress} label="Contract" />
            </div>

            {vesting.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
              </div>
            ) : vesting.error ? (
              <p className="text-red-400 text-sm py-4">{vesting.error}</p>
            ) : (
              <div className="space-y-4">
                {/* Vesting Progress */}
                <ProgressBar
                  value={parseFloat(vesting.totalReleased)}
                  max={parseFloat(vesting.totalAllocated) || 800000000}
                  color="#fbbf24"
                  label="Vesting Progress"
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Total Allocated</p>
                    <p className="text-sm font-medium text-white">{formatNumber(vesting.totalAllocated)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Total Released</p>
                    <p className="text-sm font-medium text-white">{formatNumber(vesting.totalReleased)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Locked Balance</p>
                    <p className="text-sm font-medium text-white">{formatNumber(vesting.contractBalance)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Beneficiaries</p>
                    <p className="text-sm font-medium text-white">{vesting.beneficiaryCount}</p>
                  </div>
                </div>

                {/* Vesting Schedule Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Vesting Schedule</p>
                  <p className="text-sm text-yellow-300">12-month cliff + 3-year linear vesting</p>
                  <p className="text-xs text-slate-500 mt-1">Team tokens are locked and gradually released over time</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* On-Chain Contract Stats */}
        <div className="glass p-5 sm:p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">On-Chain Contract Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="ALMAN Token"
              value="8B"
              sub="Total Supply"
              icon={Coins}
              color="#0052FF"
            />
            <StatCard
              label="Mining Pool"
              value={`${formatNumber(mining.contractBalance)}`}
              sub={`of 800M (Epoch ${mining.currentEpoch})`}
              icon={Pickaxe}
              color="#FB923C"
            />
            <StatCard
              label="Vesting Lock"
              value={`${formatNumber(vesting.contractBalance)}`}
              sub={`${vesting.beneficiaryCount} beneficiaries`}
              icon={Lock}
              color="#fbbf24"
            />
            <StatCard
              label="Staking Rewards"
              value="1B"
              sub="Allocated to stakers"
              icon={TrendingUp}
              color="#4ade80"
            />
          </div>
        </div>

        {/* Contract Addresses */}
        <div className="glass p-5 sm:p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Contract Addresses</h2>
          <div className="space-y-2">
            {[
              { name: 'ALMAN Token', address: tokenAddress },
              { name: 'Mining Pool', address: miningAddress },
              { name: 'Token Vesting', address: vestingAddress },
              { name: 'Staking', address: stakingAddress },
              { name: 'Airdrop', address: airdropAddress },
            ].map(c => (
              <div key={c.name} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                <span className="text-sm text-slate-400">{c.name}</span>
                <a
                  href={`https://amoy.polygonscan.com/address/${c.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-neos-blue font-mono flex items-center gap-1"
                >
                  {c.address.slice(0, 6)}...{c.address.slice(-4)}
                  <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
