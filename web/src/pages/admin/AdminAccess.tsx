/**
 * AdminAccess - Admin wallet access management
 * Only visible to Foundation wallet
 * Add/remove admin wallets stored in Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  RefreshCw,
  Trash2,
  Copy,
  Loader2,
  CheckCircle,
  XCircle,
  X,
  KeyRound,
  Shield,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '../../supabase';
import { useWallet } from '../../components/wallet';

const FOUNDATION_ADDRESS = '0x7BD8194c22b79B0BBa6B2AFDfe36c658707024FE';

interface AdminWallet {
  wallet_address: string;
  role: 'foundation' | 'verifier';
  label: string | null;
  added_by: string | null;
  created_at: string;
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function isEthAddress(str: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(str);
}

export default function AdminAccess() {
  const { address } = useWallet();
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [loading, setLoading] = useState(true);

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addAddress, setAddAddress] = useState('');
  const [addLabel, setAddLabel] = useState('');
  const [addRole, setAddRole] = useState<'verifier' | 'foundation'>('verifier');
  const [addLoading, setAddLoading] = useState(false);

  // Remove confirmation
  const [removeTarget, setRemoveTarget] = useState<AdminWallet | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  // Action result
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_wallets')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[AdminAccess] Failed to fetch:', error.message);
    } else {
      setWallets(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  // Clear action result after 4 seconds
  useEffect(() => {
    if (actionResult) {
      const timer = setTimeout(() => setActionResult(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionResult]);

  // Check Foundation access
  const isFoundation = address?.toLowerCase() === FOUNDATION_ADDRESS.toLowerCase();
  if (!isFoundation) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Foundation Only</h2>
          <p className="text-slate-400">This page is restricted to the Foundation wallet.</p>
        </div>
      </div>
    );
  }

  async function handleAdd() {
    if (!addAddress.trim()) return;

    if (!isEthAddress(addAddress.trim())) {
      setActionResult({ success: false, message: 'Invalid Ethereum address format (0x + 40 hex chars)' });
      return;
    }

    // Check duplicate
    const exists = wallets.some(w => w.wallet_address.toLowerCase() === addAddress.trim().toLowerCase());
    if (exists) {
      setActionResult({ success: false, message: 'This wallet is already in the admin list' });
      return;
    }

    setAddLoading(true);
    const { error } = await supabase.from('admin_wallets').insert({
      wallet_address: addAddress.trim(),
      role: addRole,
      label: addLabel.trim() || null,
      added_by: address,
    });

    if (error) {
      setActionResult({ success: false, message: `Failed to add: ${error.message}` });
    } else {
      setActionResult({ success: true, message: `Admin wallet added: ${truncateAddress(addAddress.trim())}` });
      setShowAddModal(false);
      setAddAddress('');
      setAddLabel('');
      setAddRole('verifier');
      await fetchWallets();
    }
    setAddLoading(false);
  }

  async function handleRemove() {
    if (!removeTarget) return;

    setRemoveLoading(true);
    const { error } = await supabase
      .from('admin_wallets')
      .delete()
      .eq('wallet_address', removeTarget.wallet_address);

    if (error) {
      setActionResult({ success: false, message: `Failed to remove: ${error.message}` });
    } else {
      setActionResult({ success: true, message: `Removed: ${removeTarget.label || truncateAddress(removeTarget.wallet_address)}` });
      setRemoveTarget(null);
      await fetchWallets();
    }
    setRemoveLoading(false);
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <KeyRound className="w-7 h-7 text-neos-blue" />
            Access Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage admin wallet addresses that can access the admin panel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchWallets}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neos-blue hover:bg-neos-blue/80 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        </div>
      </div>

      {/* Action Result Toast */}
      {actionResult && (
        <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border ${
          actionResult.success
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {actionResult.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          <span className="text-sm">{actionResult.message}</span>
        </div>
      )}

      {/* Info Card */}
      <div className="glass rounded-xl p-4 mb-6 border border-neos-blue/10">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-neos-blue shrink-0 mt-0.5" />
          <div className="text-sm text-slate-400">
            <p className="mb-1">
              <strong className="text-slate-300">Foundation wallet</strong> always has access (hardcoded fallback) and cannot be removed.
            </p>
            <p>
              <strong className="text-slate-300">Verifier wallets</strong> can access the admin panel for partner/meetup management.
              All on-chain transactions are signed by the server's Verifier private key regardless of which admin is connected.
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Table */}
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-slate-500 text-xs font-medium uppercase tracking-wider p-4">Wallet</th>
              <th className="text-left text-slate-500 text-xs font-medium uppercase tracking-wider p-4">Role</th>
              <th className="text-left text-slate-500 text-xs font-medium uppercase tracking-wider p-4">Label</th>
              <th className="text-left text-slate-500 text-xs font-medium uppercase tracking-wider p-4">Added</th>
              <th className="text-right text-slate-500 text-xs font-medium uppercase tracking-wider p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <Loader2 className="w-6 h-6 text-neos-blue animate-spin mx-auto" />
                </td>
              </tr>
            ) : wallets.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No admin wallets found
                </td>
              </tr>
            ) : (
              wallets.map((w) => {
                const isFoundationWallet = w.role === 'foundation';
                return (
                  <tr key={w.wallet_address} className="border-b border-white/5 hover:bg-white/[0.02]">
                    {/* Address */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://amoy.polygonscan.com/address/${w.wallet_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neos-blue hover:underline font-mono text-sm"
                        >
                          {truncateAddress(w.wallet_address)}
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(w.wallet_address);
                            setActionResult({ success: true, message: 'Address copied' });
                          }}
                          className="text-slate-600 hover:text-slate-400 transition-colors"
                          title="Copy full address"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`https://amoy.polygonscan.com/address/${w.wallet_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-400 transition-colors"
                          title="View on Explorer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isFoundationWallet
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {w.role === 'foundation' ? 'Foundation' : 'Verifier'}
                      </span>
                    </td>

                    {/* Label */}
                    <td className="p-4 text-slate-300 text-sm">
                      {w.label || <span className="text-slate-600">—</span>}
                    </td>

                    {/* Added date */}
                    <td className="p-4 text-slate-500 text-sm">
                      {new Date(w.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      {isFoundationWallet ? (
                        <span className="text-xs text-slate-600 italic">Permanent</span>
                      ) : (
                        <button
                          onClick={() => setRemoveTarget(w)}
                          className="text-red-400/60 hover:text-red-400 transition-colors p-1"
                          title="Remove admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-slate-600">
        {wallets.length} admin wallet{wallets.length !== 1 ? 's' : ''} registered
        {' · '}
        {wallets.filter(w => w.role === 'foundation').length} foundation
        {' · '}
        {wallets.filter(w => w.role === 'verifier').length} verifier
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl p-6 max-w-md w-full border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Add Admin Wallet</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Wallet Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={addAddress}
                onChange={(e) => setAddAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder:text-slate-600 focus:border-neos-blue focus:outline-none"
              />
              {addAddress && !isEthAddress(addAddress.trim()) && (
                <p className="text-red-400 text-xs mt-1">Invalid Ethereum address format</p>
              )}
            </div>

            {/* Label */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Label <span className="text-slate-600">(optional)</span>
              </label>
              <input
                type="text"
                value={addLabel}
                onChange={(e) => setAddLabel(e.target.value)}
                placeholder="e.g. Patrick Ma"
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:border-neos-blue focus:outline-none"
              />
            </div>

            {/* Role */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setAddRole('verifier')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    addRole === 'verifier'
                      ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Verifier
                </button>
                <button
                  onClick={() => setAddRole('foundation')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    addRole === 'foundation'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Foundation
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={addLoading || !addAddress.trim() || !isEthAddress(addAddress.trim())}
                className="flex-1 px-4 py-2.5 rounded-lg bg-neos-blue hover:bg-neos-blue/80 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {removeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl p-6 max-w-sm w-full border border-white/10">
            <div className="text-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Remove Admin?</h3>
              <p className="text-slate-400 text-sm">
                This wallet will lose access to the admin panel.
              </p>
              <div className="glass rounded-lg p-3 mt-3">
                <p className="text-slate-500 text-xs mb-0.5">{removeTarget.label || 'No label'}</p>
                <p className="text-white font-mono text-sm">{truncateAddress(removeTarget.wallet_address)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRemoveTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={removeLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {removeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
