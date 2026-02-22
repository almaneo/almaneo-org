/**
 * AdminMeetups - Meetup verification management
 * Two-panel layout: meetup list + detail with approve/reject flow
 */

import { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  Search,
  RefreshCw,
  Loader2,
  MapPin,
  Users,
  Camera,
  CheckCircle,
  XCircle,
  X,
  Clock,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { supabase } from '../../supabase';
import { useWallet } from '../../components/wallet';

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_API_SECRET || '';

interface Meetup {
  id: string;
  title: string;
  description: string | null;
  host_address: string | null;
  location: string | null;
  meeting_date: string;
  max_participants: number;
  status: string;
  photo_url: string | null;
  verified: boolean | null;
  verified_at: string | null;
  verified_by: string | null;
  verification_notes: string | null;
  created_at: string;
}

interface Participant {
  user_address: string;
  attended: boolean;
  points_earned: number;
  joined_at: string;
}

type FilterType = 'pending' | 'all' | 'verified' | 'upcoming';

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    upcoming: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-amber-500/20 text-amber-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    ended: 'bg-slate-500/20 text-slate-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };
  return map[status] || 'bg-slate-500/20 text-slate-400';
}

export default function AdminMeetups() {
  const { address } = useWallet();
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('pending');
  const [search, setSearch] = useState('');

  // Selected meetup
  const [selected, setSelected] = useState<Meetup | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Verification
  const [verifyNotes, setVerifyNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadMeetups = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('meetups')
        .select('*')
        .order('meeting_date', { ascending: false });
      setMeetups(data || []);
    } catch (err) {
      console.error('Failed to load meetups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMeetups(); }, [loadMeetups]);

  // Load participants when meetup is selected
  async function selectMeetup(meetup: Meetup) {
    setSelected(meetup);
    setLoadingDetail(true);
    setVerifyNotes('');
    setActionResult(null);
    try {
      const { data } = await supabase
        .from('meetup_participants')
        .select('*')
        .eq('meetup_id', meetup.id)
        .order('joined_at', { ascending: true });
      setParticipants(data || []);
    } catch (err) {
      console.error('Failed to load participants:', err);
    } finally {
      setLoadingDetail(false);
    }
  }

  // Filter meetups
  const filtered = meetups.filter(m => {
    if (search) {
      const q = search.toLowerCase();
      if (!m.title.toLowerCase().includes(q) && !m.host_address?.toLowerCase().includes(q)) return false;
    }
    switch (filter) {
      case 'pending': return (m.status === 'completed' || m.status === 'ended') && !m.verified;
      case 'verified': return m.verified === true;
      case 'upcoming': return m.status === 'upcoming' || m.status === 'in_progress';
      default: return true;
    }
  });

  const pendingCount = meetups.filter(m => (m.status === 'completed' || m.status === 'ended') && !m.verified).length;

  // Approve meetup
  async function handleApprove() {
    if (!selected) return;
    setActionLoading(true);
    setActionResult(null);
    try {
      // 1. Update meetup as verified
      const { error: updateError } = await supabase
        .from('meetups')
        .update({
          verified: true,
          verified_at: new Date().toISOString(),
          verified_by: address || null,
          verification_notes: verifyNotes || 'Approved by admin',
        })
        .eq('id', selected.id);

      if (updateError) throw updateError;

      // 2. Award points to participants
      const attendedParticipants = participants.filter(p => p.attended);
      for (const p of attendedParticipants) {
        const isHost = p.user_address === selected.host_address;
        const points = isHost ? 80 : 30;

        // Add kindness activity
        await supabase.from('kindness_activities').insert({
          user_address: p.user_address,
          activity_type: isHost ? 'meetup_host' : 'meetup_attend',
          description: `Meetup: ${selected.title}`,
          points,
          verified: true,
        });

        // Update user score (increment, not overwrite)
        const rpcRes = await supabase.rpc('increment_kindness_score', {
          p_address: p.user_address,
          p_points: points,
        });
        if (rpcRes.error) {
          // Fallback: read current score then add
          const { data: userData } = await supabase
            .from('users')
            .select('kindness_score')
            .eq('wallet_address', p.user_address)
            .maybeSingle();
          const currentScore = userData?.kindness_score ?? 0;
          await supabase
            .from('users')
            .update({ kindness_score: currentScore + points })
            .eq('wallet_address', p.user_address);
        }
      }

      // 3. Record on-chain (best-effort)
      if (selected.host_address) {
        try {
          await fetch('/api/ambassador', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': ADMIN_SECRET },
            body: JSON.stringify({
              action: 'recordMeetupVerification',
              meetupId: selected.id,
              hostAddress: selected.host_address,
              attendedAddresses: attendedParticipants.map(p => p.user_address),
            }),
          });
        } catch (e) {
          console.warn('[AdminMeetups] On-chain recording failed (best-effort):', e);
        }
      }

      setActionResult({ success: true, message: `Meetup approved! ${attendedParticipants.length} participants awarded points.` });
      setTimeout(() => { loadMeetups(); setSelected(null); setActionResult(null); }, 2000);
    } catch (err) {
      setActionResult({ success: false, message: err instanceof Error ? err.message : 'Approval failed' });
    } finally {
      setActionLoading(false);
    }
  }

  // Reject meetup
  async function handleReject() {
    if (!selected) return;
    setActionLoading(true);
    setActionResult(null);
    try {
      await supabase
        .from('meetups')
        .update({
          status: 'cancelled',
          verified_by: address || null,
          verification_notes: verifyNotes || 'Rejected by admin',
        })
        .eq('id', selected.id);

      setActionResult({ success: true, message: 'Meetup rejected.' });
      setTimeout(() => { loadMeetups(); setSelected(null); setActionResult(null); }, 1500);
    } catch (err) {
      setActionResult({ success: false, message: err instanceof Error ? err.message : 'Rejection failed' });
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="p-6 h-[calc(100vh)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Meetups</h1>
          <p className="text-slate-400 text-sm mt-1">Verify meetup attendance and award points</p>
        </div>
        <button onClick={loadMeetups} className="btn-ghost text-sm">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search meetups..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-neos-blue/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['pending', 'all', 'verified', 'upcoming'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize flex items-center gap-1.5 ${
                filter === f
                  ? 'bg-neos-blue/15 text-neos-blue'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
              {f === 'pending' && pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-400 text-[10px] flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left: Meetup List */}
        <div className="w-[340px] shrink-0 glass rounded-xl overflow-y-auto">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-6 h-6 text-neos-blue animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-600 text-sm">No meetups found</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map(m => (
                <button
                  key={m.id}
                  onClick={() => selectMeetup(m)}
                  className={`w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors ${
                    selected?.id === m.id ? 'bg-neos-blue/5 border-l-2 border-neos-blue' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{m.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColor(m.status)}`}>
                          {m.status}
                        </span>
                        {m.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-slate-500 text-xs">
                        <span>{new Date(m.meeting_date).toLocaleDateString()}</span>
                        {m.photo_url && <Camera className="w-3 h-3" />}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Meetup Detail */}
        <div className="flex-1 glass rounded-xl overflow-y-auto">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-slate-600">
              <div className="text-center">
                <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a meetup to view details</p>
              </div>
            </div>
          ) : loadingDetail ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-neos-blue animate-spin" />
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* Meetup Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(selected.meeting_date).toLocaleString()}
                    </span>
                    {selected.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {selected.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(selected.status)}`}>
                    {selected.status}
                  </span>
                  {selected.verified && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {selected.description && (
                <p className="text-slate-400 text-sm">{selected.description}</p>
              )}

              {/* Host */}
              <div className="glass rounded-lg p-3">
                <p className="text-slate-500 text-xs mb-1">Host</p>
                <p className="text-white font-mono text-sm">
                  {selected.host_address ? truncateAddress(selected.host_address) : 'Unknown'}
                </p>
              </div>

              {/* Photo */}
              {selected.photo_url && (
                <div>
                  <p className="text-slate-500 text-xs mb-2">Verification Photo</p>
                  <img
                    src={selected.photo_url}
                    alt="Meetup photo"
                    className="rounded-lg max-h-64 object-cover w-full"
                  />
                </div>
              )}

              {/* Participants */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-400 text-sm font-medium">
                    Participants ({participants.length})
                  </p>
                </div>
                <div className="glass rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-500 text-xs uppercase">
                        <th className="text-left px-4 py-2">Address</th>
                        <th className="text-center px-3 py-2">Attended</th>
                        <th className="text-right px-4 py-2">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map(p => (
                        <tr key={p.user_address} className="border-t border-white/5">
                          <td className="px-4 py-2 font-mono text-slate-300 text-xs">
                            {truncateAddress(p.user_address)}
                            {p.user_address === selected.host_address && (
                              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-neos-blue/20 text-neos-blue">host</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {p.attended ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                            ) : (
                              <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                            )}
                          </td>
                          <td className="px-4 py-2 text-right text-slate-400 text-xs">{p.points_earned}</td>
                        </tr>
                      ))}
                      {participants.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-4 text-center text-slate-600 text-xs">No participants</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Verification Notes */}
              {selected.verification_notes && (
                <div className="glass rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Verification Notes</p>
                  <p className="text-slate-300 text-sm">{selected.verification_notes}</p>
                </div>
              )}

              {/* Action Result */}
              {actionResult && (
                <div className={`rounded-lg p-3 flex items-center gap-2 text-sm ${
                  actionResult.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {actionResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {actionResult.message}
                </div>
              )}

              {/* Verification Actions (only for pending meetups) */}
              {!selected.verified && (selected.status === 'completed' || selected.status === 'ended') && (
                <div className="border-t border-white/5 pt-5 space-y-3">
                  <div>
                    <label className="text-slate-400 text-xs block mb-1.5">Verification Notes</label>
                    <textarea
                      value={verifyNotes}
                      onChange={e => setVerifyNotes(e.target.value)}
                      placeholder="Optional notes..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-neos-blue/50 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      Approve & Award Points
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
