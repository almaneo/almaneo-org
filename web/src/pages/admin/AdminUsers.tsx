/**
 * AdminUsers - User management with search, pagination, and detail view
 * View Kindness Score, activity history, and meetup stats
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  Award,
  Calendar,
  Activity,
  ArrowUpDown,
} from 'lucide-react';
import { supabase } from '../../supabase';

interface User {
  wallet_address: string;
  nickname: string | null;
  kindness_score: number;
  total_points: number;
  level: number;
  created_at: string;
}

interface UserActivity {
  id: string;
  activity_type: string;
  description: string | null;
  points: number;
  verified: boolean;
  created_at: string;
}

interface UserDetail {
  user: User;
  activities: UserActivity[];
  meetupsHosted: number;
  meetupsAttended: number;
}

const PAGE_SIZE = 15;

type SortField = 'kindness_score' | 'created_at' | 'total_points';

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function tierColor(score: number) {
  if (score >= 1000) return 'text-purple-400 bg-purple-500/10';
  if (score >= 500) return 'text-amber-400 bg-amber-500/10';
  if (score >= 100) return 'text-emerald-400 bg-emerald-500/10';
  return 'text-slate-400 bg-slate-500/10';
}

function tierName(score: number) {
  if (score >= 1000) return 'Guardian';
  if (score >= 500) return 'Ambassador';
  if (score >= 100) return 'Host';
  if (score > 0) return 'Friend';
  return 'New';
}

function activityTypeLabel(type: string) {
  const labels: Record<string, string> = {
    meetup_host: 'Hosted Meetup',
    meetup_attend: 'Attended Meetup',
    first_meetup: 'First Meetup',
    mentoring: 'Mentoring',
    onboarding: 'Onboarding',
    education_content: 'Education',
    translation: 'Translation',
    community_leader: 'Community Leader',
    volunteer: 'Volunteer',
    donation: 'Donation',
    charity_event: 'Charity Event',
    twitter_share: 'Twitter Share',
    discord_help: 'Discord Help',
    referral: 'Referral',
    governance_vote: 'Governance Vote',
    staking_weekly: 'Staking',
    daily_quest: 'Daily Quest',
    weekly_mission: 'Weekly Mission',
    monthly_challenge: 'Monthly Challenge',
  };
  return labels[type] || type;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('kindness_score');
  const [page, setPage] = useState(0);

  // Detail panel
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('users')
        .select('wallet_address, nickname, kindness_score, total_points, level, created_at', { count: 'exact' });

      if (search) {
        query = query.or(`wallet_address.ilike.%${search}%,nickname.ilike.%${search}%`);
      }

      query = query
        .order(sortBy, { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      const { data, count } = await query;
      setUsers(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, page]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // Reset page when search/sort changes
  useEffect(() => { setPage(0); }, [search, sortBy]);

  async function viewUser(user: User) {
    setLoadingDetail(true);
    setDetail(null);
    try {
      const [activitiesRes, hostedRes, attendedRes] = await Promise.all([
        supabase
          .from('kindness_activities')
          .select('*')
          .eq('user_address', user.wallet_address)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('meetups')
          .select('id', { count: 'exact', head: true })
          .eq('host_address', user.wallet_address),
        supabase
          .from('meetup_participants')
          .select('meetup_id', { count: 'exact', head: true })
          .eq('user_address', user.wallet_address),
      ]);

      setDetail({
        user,
        activities: activitiesRes.data || [],
        meetupsHosted: hostedRes.count || 0,
        meetupsAttended: attendedRes.count || 0,
      });
    } catch (err) {
      console.error('Failed to load user detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">
            {totalCount.toLocaleString()} registered users
          </p>
        </div>
        <button onClick={loadUsers} className="btn-ghost text-sm">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by address or nickname..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-neos-blue/50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-500" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortField)}
            className="bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-2.5 focus:border-neos-blue/50 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="kindness_score">Kindness Score</option>
            <option value="total_points">Total Points</option>
            <option value="created_at">Joined Date</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-6 h-6 text-neos-blue animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-white/5">
                  <th className="text-left px-5 py-3">Address</th>
                  <th className="text-left px-3 py-3">Nickname</th>
                  <th className="text-center px-3 py-3">Score</th>
                  <th className="text-center px-3 py-3">Points</th>
                  <th className="text-center px-3 py-3">Level</th>
                  <th className="text-right px-3 py-3">Joined</th>
                  <th className="text-right px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.wallet_address} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <a
                        href={`https://amoy.polygonscan.com/address/${u.wallet_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-slate-300 text-xs hover:text-neos-blue flex items-center gap-1"
                      >
                        {truncateAddress(u.wallet_address)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-3 py-3 text-slate-300">
                      {u.nickname || <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tierColor(u.kindness_score)}`}>
                          {tierName(u.kindness_score)}
                        </span>
                        <span className="text-white font-medium">{u.kindness_score}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-slate-400">{u.total_points}</td>
                    <td className="px-3 py-3 text-center text-slate-400">{u.level}</td>
                    <td className="px-3 py-3 text-right text-slate-500 text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => viewUser(u)}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-600">
                      {search ? 'No users match your search' : 'No users found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-slate-500 text-sm">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {(detail || loadingDetail) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div className="relative glass rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <button onClick={() => setDetail(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            {loadingDetail ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 text-neos-blue animate-spin" />
              </div>
            ) : detail && (
              <div className="space-y-5">
                {/* Profile */}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${tierColor(detail.user.kindness_score)}`}>
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {detail.user.nickname || truncateAddress(detail.user.wallet_address)}
                  </h3>
                  <p className="text-slate-500 font-mono text-xs mt-1">{detail.user.wallet_address}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${tierColor(detail.user.kindness_score)}`}>
                      {tierName(detail.user.kindness_score)} · {detail.user.kindness_score} pts
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Score', value: detail.user.kindness_score },
                    { label: 'Points', value: detail.user.total_points },
                    { label: 'Level', value: detail.user.level },
                    { label: 'Hosted', value: detail.meetupsHosted },
                  ].map(s => (
                    <div key={s.label} className="glass rounded-lg p-3 text-center">
                      <p className="text-white font-bold text-lg">{s.value}</p>
                      <p className="text-slate-500 text-[10px] uppercase">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Meetup Stats */}
                <div className="glass rounded-lg p-3 flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Meetup Activity</p>
                    <p className="text-slate-500 text-xs">
                      {detail.meetupsHosted} hosted · {detail.meetupsAttended} attended
                    </p>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-400 text-sm font-medium">Recent Activities</p>
                  </div>
                  {detail.activities.length === 0 ? (
                    <p className="text-slate-600 text-sm text-center py-4">No activities yet</p>
                  ) : (
                    <div className="space-y-1.5">
                      {detail.activities.map(a => (
                        <div key={a.id} className="glass rounded-lg px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-slate-300 font-medium shrink-0">
                              {activityTypeLabel(a.activity_type)}
                            </span>
                            {a.verified && (
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <span className="text-emerald-400 text-[8px]">✓</span>
                              </span>
                            )}
                            {a.description && (
                              <span className="text-slate-500 text-xs truncate">{a.description}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className="text-neos-blue text-xs font-medium">+{a.points}</span>
                            <span className="text-slate-600 text-[10px]">
                              {new Date(a.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
