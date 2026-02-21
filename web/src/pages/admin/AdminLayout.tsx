/**
 * AdminLayout - Auth gate + sidebar navigation for platform admin
 * Only accessible by hardcoded admin wallet addresses
 */

import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Store,
  ArrowLeft,
  Shield,
  Loader2,
  AlertTriangle,
  Wallet,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useWallet } from '../../components/wallet';

const ADMIN_ADDRESSES = [
  '0x7BD8194c22b79B0BBa6B2AFDfe36c658707024FE', // Foundation
  '0x30073c2f47D41539dA6147324bb9257E0638144E', // Verifier
];

const MENU_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/partners', label: 'Partners', icon: Store, exact: false },
  { path: '/admin/meetups', label: 'Meetups', icon: CalendarCheck, exact: false },
  { path: '/admin/users', label: 'Users', icon: Users, exact: false },
];

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function AdminLayout() {
  const { isConnected, address, isLoading, connect } = useWallet();
  const location = useLocation();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-neos-blue animate-spin" />
          <p className="text-slate-400">Checking admin status...</p>
        </div>
      </div>
    );
  }

  // Not connected
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <Wallet className="w-12 h-12 text-neos-blue mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400 mb-6">Connect your admin wallet to access the platform management panel.</p>
          <button onClick={connect} className="btn-primary w-full">
            Connect Wallet
          </button>
          <Link to="/" className="text-slate-500 text-sm mt-4 inline-block hover:text-slate-300">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Check admin access
  const isAdmin = ADMIN_ADDRESSES.some(a => a.toLowerCase() === address.toLowerCase());

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-4">Your wallet is not authorized to access the admin panel.</p>
          <div className="glass rounded-lg p-3 mb-6">
            <p className="text-slate-500 text-xs mb-1">Connected Address</p>
            <p className="text-red-300 font-mono text-sm">{truncateAddress(address)}</p>
          </div>
          <Link to="/" className="btn-ghost inline-block">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Determine admin role
  const adminRole = address.toLowerCase() === ADMIN_ADDRESSES[0].toLowerCase() ? 'Foundation' : 'Verifier';
  const roleColor = adminRole === 'Foundation' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400';

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 glass-strong border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Header */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-neos-blue/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-neos-blue" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Admin Panel</h1>
              <p className="text-slate-500 text-xs">Platform Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor}`}>
              {adminRole}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1 text-xs font-mono"
              title="Copy address"
            >
              {truncateAddress(address)}
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-neos-blue/15 text-neos-blue border-l-2 border-neos-blue'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <a
            href={`https://amoy.polygonscan.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-400 text-xs mt-2 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View on Explorer
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
