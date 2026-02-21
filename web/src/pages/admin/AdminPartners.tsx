/**
 * AdminPartners - Partner SBT management page
 * Mint, renew, revoke Partner SBT tokens
 * View partner list with on-chain verification status
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  Shield,
  AlertCircle,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '../../supabase';

interface Partner {
  id: string;
  business_name: string;
  category_id: string | null;
  owner_user_id: string | null;
  is_active: boolean;
  sbt_token_id: number | null;
  partnership_expires_at: string | null;
  created_at: string;
  partner_categories?: { name: string } | null;
  // On-chain data (fetched separately)
  onchain?: {
    valid: boolean;
    daysUntilExpiry: number;
    renewalCount: number;
    isRevoked: boolean;
  } | null;
}

type FilterType = 'all' | 'active' | 'verified' | 'expired' | 'none';

function isEthAddress(str: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(str);
}

function truncateAddress(addr: string) {
  if (isEthAddress(addr)) return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  // For non-eth IDs (Web3Auth social login), show shortened version
  if (addr.length > 20) return `${addr.slice(0, 18)}...`;
  return addr;
}

function sbtStatusBadge(partner: Partner) {
  if (partner.onchain?.isRevoked) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">Revoked</span>;
  }
  if (partner.onchain?.valid) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">Verified</span>;
  }
  if (partner.sbt_token_id != null && !partner.onchain?.valid) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">Expired</span>;
  }
  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">None</span>;
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Modals
  const [mintModal, setMintModal] = useState(false);
  const [revokeModal, setRevokeModal] = useState<Partner | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);

  // Mint form
  const [mintAddress, setMintAddress] = useState('');
  const [mintBusinessName, setMintBusinessName] = useState('');

  // Revoke form
  const [revokeReason, setRevokeReason] = useState('');

  const loadPartners = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*, partner_categories(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const partnerList = (data || []) as Partner[];

      // Fetch on-chain data only for partners with valid Ethereum addresses
      const enriched = await Promise.all(
        partnerList.map(async (p) => {
          if (!p.owner_user_id || !isEthAddress(p.owner_user_id)) return p;
          try {
            const res = await fetch('/api/partner-sbt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'getPartnerData', partnerAddress: p.owner_user_id }),
            });
            const result = await res.json();
            if (result.success && result.data?.hasSBT) {
              return {
                ...p,
                onchain: {
                  valid: result.data.valid,
                  daysUntilExpiry: result.data.daysUntilExpiry,
                  renewalCount: result.data.renewalCount,
                  isRevoked: result.data.isRevoked,
                },
              };
            }
          } catch { /* ignore on-chain errors */ }
          return p;
        })
      );

      setPartners(enriched);
    } catch (err) {
      console.error('Failed to load partners:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPartners(); }, [loadPartners]);

  // Filter partners
  const filtered = partners.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      const nameMatch = p.business_name.toLowerCase().includes(q);
      const addrMatch = p.owner_user_id?.toLowerCase().includes(q);
      if (!nameMatch && !addrMatch) return false;
    }
    switch (filter) {
      case 'active': return p.is_active;
      case 'verified': return p.onchain?.valid === true;
      case 'expired': return p.sbt_token_id != null && !p.onchain?.valid && !p.onchain?.isRevoked;
      case 'none': return p.sbt_token_id == null;
      default: return true;
    }
  });

  // Mint Partner SBT
  async function handleMint() {
    if (!mintAddress || !mintBusinessName) return;
    if (!isEthAddress(mintAddress)) {
      setActionResult({ success: false, message: 'Invalid Ethereum address. Must start with 0x and be 42 characters.' });
      return;
    }
    setActionLoading(true);
    setActionResult(null);
    try {
      const res = await fetch('/api/admin-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'partner-sbt',
          action: 'mintPartner',
          params: { partnerAddress: mintAddress, businessName: mintBusinessName },
        }),
      });
      const result = await res.json();
      setActionResult({ success: result.success, message: result.message || result.error });
      if (result.success) {
        setMintAddress('');
        setMintBusinessName('');
        setTimeout(() => { setMintModal(false); setActionResult(null); loadPartners(); }, 1500);
      }
    } catch (err) {
      setActionResult({ success: false, message: err instanceof Error ? err.message : 'Failed' });
    } finally {
      setActionLoading(false);
    }
  }

  // Renew Partner SBT
  async function handleRenew(partnerAddress: string) {
    setActionLoading(true);
    setActionResult(null);
    try {
      const res = await fetch('/api/admin-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'partner-sbt',
          action: 'renewPartner',
          params: { partnerAddress },
        }),
      });
      const result = await res.json();
      setActionResult({ success: result.success, message: result.message || result.error });
      if (result.success) {
        setTimeout(() => { setActionResult(null); loadPartners(); }, 1500);
      }
    } catch (err) {
      setActionResult({ success: false, message: err instanceof Error ? err.message : 'Failed' });
    } finally {
      setActionLoading(false);
    }
  }

  // Revoke Partner SBT
  async function handleRevoke() {
    if (!revokeModal?.owner_user_id || !revokeReason) return;
    setActionLoading(true);
    setActionResult(null);
    try {
      const res = await fetch('/api/admin-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'partner-sbt',
          action: 'revokePartner',
          params: { partnerAddress: revokeModal.owner_user_id, reason: revokeReason },
        }),
      });
      const result = await res.json();
      setActionResult({ success: result.success, message: result.message || result.error });
      if (result.success) {
        setRevokeReason('');
        setTimeout(() => { setRevokeModal(null); setActionResult(null); loadPartners(); }, 1500);
      }
    } catch (err) {
      setActionResult({ success: false, message: err instanceof Error ? err.message : 'Failed' });
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Partners</h1>
          <p className="text-slate-400 text-sm mt-1">Manage Partner SBT tokens and verification</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setMintModal(true)} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Mint SBT
          </button>
          <button onClick={loadPartners} className="btn-ghost text-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Result */}
      {actionResult && (
        <div className={`rounded-lg p-3 flex items-center gap-2 text-sm ${
          actionResult.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {actionResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {actionResult.message}
          <button onClick={() => setActionResult(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-neos-blue/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'verified', 'expired', 'none'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-neos-blue/15 text-neos-blue'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Table */}
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
                  <th className="text-left px-5 py-3">Business Name</th>
                  <th className="text-left px-3 py-3">Owner</th>
                  <th className="text-center px-3 py-3">SBT Status</th>
                  <th className="text-center px-3 py-3">Expires</th>
                  <th className="text-center px-3 py-3">Token ID</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{p.business_name}</span>
                        {p.partner_categories?.name && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                            {p.partner_categories.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-400 text-xs">
                      {p.owner_user_id ? (
                        isEthAddress(p.owner_user_id) ? (
                          <a
                            href={`https://amoy.polygonscan.com/address/${p.owner_user_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-neos-blue flex items-center gap-1"
                          >
                            {truncateAddress(p.owner_user_id)}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500" title={p.owner_user_id}>
                            {truncateAddress(p.owner_user_id)}
                            <span className="text-[10px] ml-1 text-slate-600">(social)</span>
                          </span>
                        )
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">{sbtStatusBadge(p)}</td>
                    <td className="px-3 py-3 text-center text-slate-400 text-xs">
                      {p.onchain?.valid
                        ? `${p.onchain.daysUntilExpiry}d left`
                        : p.partnership_expires_at
                          ? new Date(p.partnership_expires_at).toLocaleDateString()
                          : '—'}
                    </td>
                    <td className="px-3 py-3 text-center text-slate-400 text-xs">
                      {p.sbt_token_id != null ? `#${p.sbt_token_id}` : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* No SBT → Mint (always available, address entered manually if not eth) */}
                        {p.sbt_token_id == null && (
                          <button
                            onClick={() => {
                              setMintAddress(p.owner_user_id && isEthAddress(p.owner_user_id) ? p.owner_user_id : '');
                              setMintBusinessName(p.business_name);
                              setMintModal(true);
                            }}
                            className="text-xs px-2.5 py-1 rounded-md bg-neos-blue/15 text-neos-blue hover:bg-neos-blue/25 transition-colors"
                            disabled={actionLoading}
                          >
                            Mint
                          </button>
                        )}
                        {/* Has SBT + valid eth address → Renew */}
                        {p.sbt_token_id != null && p.owner_user_id && isEthAddress(p.owner_user_id) && !p.onchain?.isRevoked && (
                          <button
                            onClick={() => handleRenew(p.owner_user_id!)}
                            className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                            disabled={actionLoading}
                          >
                            Renew
                          </button>
                        )}
                        {/* Has SBT + valid eth address → Revoke */}
                        {p.sbt_token_id != null && p.owner_user_id && isEthAddress(p.owner_user_id) && !p.onchain?.isRevoked && (
                          <button
                            onClick={() => setRevokeModal(p)}
                            className="text-xs px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                            disabled={actionLoading}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-600">
                      {search ? 'No partners match your search' : 'No partners found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mint Modal */}
      {mintModal && (
        <Modal onClose={() => { setMintModal(false); setActionResult(null); }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-neos-blue/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-neos-blue" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mint Partner SBT</h3>
              <p className="text-slate-400 text-xs">Issue new Partner verification token</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-1.5">Partner Wallet Address</label>
              <input
                type="text"
                value={mintAddress}
                onChange={e => setMintAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-neos-blue/50 focus:outline-none font-mono"
              />
              {mintAddress && !isEthAddress(mintAddress) && (
                <p className="text-amber-400 text-xs mt-1">Enter a valid Ethereum address (0x...)</p>
              )}
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1.5">Business Name</label>
              <input
                type="text"
                value={mintBusinessName}
                onChange={e => setMintBusinessName(e.target.value)}
                placeholder="Business name"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-neos-blue/50 focus:outline-none"
              />
            </div>
            {actionResult && (
              <div className={`rounded-lg p-3 text-sm ${actionResult.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {actionResult.message}
              </div>
            )}
            <button
              onClick={handleMint}
              disabled={actionLoading || !mintAddress || !mintBusinessName || !isEthAddress(mintAddress)}
              className="btn-primary w-full text-sm flex items-center justify-center gap-2"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {actionLoading ? 'Minting...' : 'Mint SBT'}
            </button>
          </div>
        </Modal>
      )}

      {/* Revoke Modal */}
      {revokeModal && (
        <Modal onClose={() => { setRevokeModal(null); setActionResult(null); setRevokeReason(''); }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Revoke Partner SBT</h3>
              <p className="text-slate-400 text-xs">{revokeModal.business_name}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-1.5">Revocation Reason</label>
              <textarea
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                placeholder="Reason for revoking partner verification..."
                rows={3}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-red-500/50 focus:outline-none resize-none"
              />
            </div>
            {actionResult && (
              <div className={`rounded-lg p-3 text-sm ${actionResult.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {actionResult.message}
              </div>
            )}
            <button
              onClick={handleRevoke}
              disabled={actionLoading || !revokeReason}
              className="w-full py-2.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              {actionLoading ? 'Revoking...' : 'Revoke SBT'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 w-full max-w-md">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
