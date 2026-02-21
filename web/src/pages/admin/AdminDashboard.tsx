/**
 * AdminDashboard - Platform overview with key metrics
 * Shows user, meetup, partner, and activity stats from Supabase
 */

import { useState, useEffect } from 'react';
import {
  Users,
  CalendarCheck,
  Store,
  Clock,
  Loader2,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../../supabase';
import { CONTRACT_ADDRESSES } from '../../contracts/addresses';

interface DashboardStats {
  totalUsers: number;
  totalMeetups: number;
  completedMeetups: number;
  totalPartners: number;
  activePartners: number;
  verifiedPartners: number;
  pendingReviews: number;
}

interface RecentUser {
  wallet_address: string;
  nickname: string | null;
  kindness_score: number;
  created_at: string;
}

interface RecentMeetup {
  id: string;
  title: string;
  host_address: string | null;
  meeting_date: string;
  status: string;
  verified: boolean | null;
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    upcoming: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-amber-500/20 text-amber-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    ended: 'bg-slate-500/20 text-slate-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || 'bg-slate-500/20 text-slate-400'}`}>
      {status}
    </span>
  );
}

const CONTRACTS = [
  { name: 'ALMANToken', key: 'ALMANToken' as const },
  { name: 'JeongSBT', key: 'JeongSBT' as const },
  { name: 'AmbassadorSBT', key: 'AmbassadorSBT' as const },
  { name: 'PartnerSBT', key: 'PartnerSBT' as const },
  { name: 'ALMANStaking', key: 'ALMANStaking' as const },
  { name: 'ALMANGovernor', key: 'ALMANGovernor' as const },
  { name: 'KindnessAirdrop', key: 'KindnessAirdrop' as const },
  { name: 'TokenVesting', key: 'TokenVesting' as const },
  { name: 'MiningPool', key: 'MiningPool' as const },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentMeetups, setRecentMeetups] = useState<RecentMeetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, meetupsRes, partnersRes, pendingRes] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('meetups').select('status'),
        supabase.from('partners').select('is_active, sbt_token_id'),
        supabase.from('meetups').select('id', { count: 'exact', head: true })
          .eq('status', 'completed')
          .or('verified.is.null,verified.eq.false'),
      ]);

      const meetups = meetupsRes.data || [];
      const partners = partnersRes.data || [];

      setStats({
        totalUsers: usersRes.count || 0,
        totalMeetups: meetups.length,
        completedMeetups: meetups.filter(m => m.status === 'completed').length,
        totalPartners: partners.length,
        activePartners: partners.filter(p => p.is_active).length,
        verifiedPartners: partners.filter(p => p.sbt_token_id != null).length,
        pendingReviews: pendingRes.count || 0,
      });

      // Recent users
      const { data: users } = await supabase
        .from('users')
        .select('wallet_address, nickname, kindness_score, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentUsers(users || []);

      // Recent meetups
      const { data: mtps } = await supabase
        .from('meetups')
        .select('id, title, host_address, meeting_date, status, verified')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentMeetups(mtps || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-neos-blue animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="glass rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-300 mb-4">{error}</p>
          <button onClick={loadData} className="btn-ghost text-sm">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Platform overview and key metrics</p>
        </div>
        <button onClick={loadData} className="btn-ghost text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <StatCard
            icon={CalendarCheck}
            label="Total Meetups"
            value={stats.totalMeetups}
            sub={`${stats.completedMeetups} completed`}
            color="text-jeong-orange"
            bgColor="bg-jeong-orange/10"
          />
          <StatCard
            icon={Store}
            label="Partners"
            value={stats.totalPartners}
            sub={`${stats.verifiedPartners} verified`}
            color="text-cyan-400"
            bgColor="bg-cyan-500/10"
          />
          <StatCard
            icon={Clock}
            label="Pending Reviews"
            value={stats.pendingReviews}
            color="text-amber-400"
            bgColor="bg-amber-500/10"
          />
        </div>
      )}

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase">
                  <th className="text-left px-5 py-3">Address</th>
                  <th className="text-left px-3 py-3">Nickname</th>
                  <th className="text-right px-3 py-3">Score</th>
                  <th className="text-right px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u.wallet_address} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-mono text-slate-300 text-xs">
                      {truncateAddress(u.wallet_address)}
                    </td>
                    <td className="px-3 py-3 text-slate-300">
                      {u.nickname || <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-300">{u.kindness_score}</td>
                    <td className="px-5 py-3 text-right text-slate-500 text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-6 text-center text-slate-600">No users yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Meetups */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Recent Meetups</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase">
                  <th className="text-left px-5 py-3">Title</th>
                  <th className="text-left px-3 py-3">Host</th>
                  <th className="text-center px-3 py-3">Status</th>
                  <th className="text-right px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentMeetups.map(m => (
                  <tr key={m.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-slate-300 max-w-[150px] truncate">{m.title}</td>
                    <td className="px-3 py-3 font-mono text-slate-400 text-xs">
                      {m.host_address ? truncateAddress(m.host_address) : '—'}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {statusBadge(m.status)}
                        {m.verified && (
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center" title="Verified">
                            <span className="text-emerald-400 text-[10px]">✓</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-slate-500 text-xs">
                      {new Date(m.meeting_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentMeetups.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-6 text-center text-slate-600">No meetups yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contract Addresses */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold">Contract Addresses (Polygon Amoy)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {CONTRACTS.map(c => {
            const addr = CONTRACT_ADDRESSES.amoy[c.key];
            return (
              <div key={c.key} className="bg-slate-950 px-5 py-3">
                <p className="text-slate-500 text-xs mb-1">{c.name}</p>
                <a
                  href={`https://amoy.polygonscan.com/address/${addr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 font-mono text-xs hover:text-neos-blue flex items-center gap-1 transition-colors"
                >
                  {truncateAddress(addr)}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bgColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  sub?: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <p className="text-slate-400 text-sm">{label}</p>
      </div>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}
