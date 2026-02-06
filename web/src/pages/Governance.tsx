/**
 * Governance Page - DAO 거버넌스
 * AlmaNEOGovernor 컨트랙트 연동
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Vote, Plus, Clock, CheckCircle, XCircle, AlertCircle, Users, Loader2, RefreshCw, Lock } from 'lucide-react';
import { useWallet } from '../components/wallet';
import { useGovernance } from '../hooks';
import { ProposalState, VoteSupport } from '../contracts/abis';

// 숫자 포맷팅
function formatNumber(value: string | number, decimals = 0): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

// 시간 포맷팅
function formatDuration(seconds: number, t: (key: string) => string): string {
  if (seconds < 3600) return `${Math.floor(seconds / 60)} ${t('governance.minutes')}`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${t('governance.hours')}`;
  return `${Math.floor(seconds / 86400)} ${t('governance.days')}`;
}

// 제안 상태별 스타일
const getStateStyle = (state: ProposalState | string) => {
  const stateNum = typeof state === 'string'
    ? ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'].indexOf(state)
    : state;

  switch (stateNum) {
    case ProposalState.Active:
      return { bg: 'bg-green-500/20', text: 'text-green-400', icon: Clock };
    case ProposalState.Pending:
      return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock };
    case ProposalState.Succeeded:
      return { bg: 'bg-neos-blue/20', text: 'text-neos-blue', icon: CheckCircle };
    case ProposalState.Queued:
      return { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Clock };
    case ProposalState.Executed:
      return { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: CheckCircle };
    case ProposalState.Defeated:
    case ProposalState.Canceled:
    case ProposalState.Expired:
      return { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle };
    default:
      return { bg: 'bg-slate-500/20', text: 'text-slate-400', icon: AlertCircle };
  }
};

// 제안 제목 추출 (description에서 첫 줄 또는 첫 문장)
function extractProposalTitle(description: string, fallback: string): string {
  if (!description) return fallback;
  const firstLine = description.split('\n')[0].trim();
  if (firstLine.length > 80) {
    return firstLine.substring(0, 77) + '...';
  }
  return firstLine || fallback;
}

export default function Governance() {
  const { t } = useTranslation('common');
  const { isConnected, connect: login, address } = useWallet();
  const {
    proposals,
    votingPower,
    governanceStats,
    isLoading,
    proposalsLoading,
    error,
    isDeployed,
    castVote,
    selfDelegate,
    refresh,
  } = useGovernance();

  const [votingProposalId, setVotingProposalId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 투표 실행
  const handleVote = async (proposalId: string, support: VoteSupport) => {
    setVotingProposalId(proposalId);
    setActionLoading(support === VoteSupport.For ? 'for' : 'against');
    await castVote(proposalId, support);
    setVotingProposalId(null);
    setActionLoading(null);
  };

  // 자기 위임
  const handleSelfDelegate = async () => {
    setActionLoading('delegate');
    await selfDelegate();
    setActionLoading(null);
  };

  // 컨트랙트 미배포 상태
  if (!isDeployed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t('governance.title')}</h1>
              <p className="text-slate-400">{t('governance.subtitle')}</p>
            </div>
            <button className="btn-primary flex items-center gap-2 opacity-50 cursor-not-allowed" disabled>
              <Plus className="w-5 h-5" />
              {t('governance.createProposal')}
            </button>
          </div>

          {/* Contract Not Deployed Notice */}
          <div className="card p-6 mb-10">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">{t('governance.contractNotDeployed')}</h2>
                <p className="text-slate-400 text-sm">{t('governance.contractNotDeployedDesc')}</p>
              </div>
            </div>
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="card p-6 text-center">
              <p className="text-3xl font-bold text-white mb-1">1 {t('governance.days')}</p>
              <p className="text-slate-400 text-sm">{t('governance.votingDelay')}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-3xl font-bold text-white mb-1">7 {t('governance.days')}</p>
              <p className="text-slate-400 text-sm">{t('governance.votingPeriod')}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-3xl font-bold text-white mb-1">100,000</p>
              <p className="text-slate-400 text-sm">{t('governance.proposalThreshold')}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-3xl font-bold text-white mb-1">4%</p>
              <p className="text-slate-400 text-sm">{t('governance.currentQuorum')}</p>
            </div>
          </div>

          {/* Preview Proposals */}
          <h2 className="text-xl font-semibold text-white mb-4">{t('governance.proposals')}</h2>
          <div className="card p-12 text-center">
            <Vote className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('governance.comingSoon')}</h3>
            <p className="text-slate-400">{t('governance.comingSoonDesc')}</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">{t('governance.title')}</h1>
            <p className="text-slate-400">{t('governance.subtitle')}</p>
          </div>

          <div className="card p-8 text-center">
            <Lock className="w-16 h-16 text-neos-blue mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">{t('governance.connectWallet')}</h2>
            <p className="text-slate-400 mb-6">{t('governance.connectWalletDesc')}</p>
            <button onClick={login} className="btn-primary px-8 py-3">
              {t('governance.connectWallet')}
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
            <h1 className="text-3xl font-bold text-white mb-2">{t('governance.title')}</h1>
            <p className="text-slate-400">{t('governance.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('governance.refresh')}
            </button>
            <button
              className="btn-primary flex items-center gap-2 opacity-50 cursor-not-allowed"
              disabled
              title={t('governance.comingSoonTooltip')}
            >
              <Plus className="w-5 h-5" />
              {t('governance.createProposal')}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Voting Power Card */}
        <div className="card p-6 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-neos-blue/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-neos-blue" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('governance.yourVotingPower')}</p>
                <p className="text-2xl font-bold text-white">
                  {isLoading ? (
                    <span className="text-slate-500">{t('common.loading')}</span>
                  ) : (
                    `${formatNumber(votingPower?.votes || '0')} ALMAN`
                  )}
                </p>
              </div>
            </div>
            {votingPower && parseFloat(votingPower.votes) === 0 && (
              <button
                onClick={handleSelfDelegate}
                disabled={actionLoading === 'delegate'}
                className="btn-secondary flex items-center gap-2"
              >
                {actionLoading === 'delegate' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('governance.activating')}
                  </>
                ) : (
                  t('governance.activateVotingPower')
                )}
              </button>
            )}
          </div>
          {votingPower && votingPower.delegated && votingPower.delegated !== address && (
            <p className="text-slate-400 text-sm mt-2">
              {t('governance.delegatedTo')}: {votingPower.delegated.slice(0, 6)}...{votingPower.delegated.slice(-4)}
            </p>
          )}
        </div>

        {/* Governance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="card p-6 text-center">
            <p className="text-2xl font-bold text-white mb-1">
              {isLoading ? '...' : formatDuration(governanceStats?.votingDelay || 86400, t)}
            </p>
            <p className="text-slate-400 text-sm">{t('governance.votingDelay')}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-2xl font-bold text-white mb-1">
              {isLoading ? '...' : formatDuration(governanceStats?.votingPeriod || 604800, t)}
            </p>
            <p className="text-slate-400 text-sm">{t('governance.votingPeriod')}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-2xl font-bold text-white mb-1">
              {isLoading ? '...' : formatNumber(governanceStats?.proposalThreshold || '100000')}
            </p>
            <p className="text-slate-400 text-sm">{t('governance.proposalThreshold')}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-2xl font-bold text-white mb-1">
              {isLoading ? '...' : formatNumber(governanceStats?.quorum || '0')}
            </p>
            <p className="text-slate-400 text-sm">{t('governance.currentQuorum')}</p>
          </div>
        </div>

        {/* Proposals List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">{t('governance.proposals')}</h2>
          {proposalsLoading && (
            <span className="text-slate-400 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('governance.loadingProposals')}
            </span>
          )}
        </div>
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const style = getStateStyle(proposal.state);
            const Icon = style.icon;
            const totalVotes = parseFloat(proposal.forVotes) + parseFloat(proposal.againstVotes);
            const forPercent = totalVotes > 0 ? (parseFloat(proposal.forVotes) / totalVotes) * 100 : 50;
            const isVoting = votingProposalId === proposal.id;
            const proposalTitle = extractProposalTitle(proposal.description, t('governance.untitledProposal'));
            const shortProposer = `${proposal.proposer.slice(0, 6)}...${proposal.proposer.slice(-4)}`;

            return (
              <div key={proposal.id} className="card card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${style.bg} ${style.text}`}>
                        <Icon className="w-3 h-3" />
                        {proposal.stateName}
                      </span>
                      {proposal.deadline && proposal.state === ProposalState.Active && (
                        <span className="text-slate-500 text-sm">
                          {t('governance.ends')}: {proposal.deadline.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{proposalTitle}</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{proposal.description}</p>
                    <p className="text-slate-500 text-xs">{t('governance.proposedBy')} {shortProposer}</p>
                  </div>
                </div>

                {/* Vote Progress */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-green-400">{t('governance.voteFor')}: {formatNumber(proposal.forVotes)}</span>
                    <span className="text-slate-400">{t('governance.abstain')}: {formatNumber(proposal.abstainVotes)}</span>
                    <span className="text-red-400">{t('governance.voteAgainst')}: {formatNumber(proposal.againstVotes)}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400"
                      style={{ width: `${forPercent}%` }}
                    />
                  </div>

                  {/* Voting Buttons */}
                  {proposal.state === ProposalState.Active && !proposal.hasVoted && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleVote(proposal.id, VoteSupport.For)}
                        disabled={isVoting}
                        className="flex-1 py-2 px-4 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isVoting && actionLoading === 'for' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Vote className="w-4 h-4" />
                        )}
                        {t('governance.voteFor')}
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, VoteSupport.Against)}
                        disabled={isVoting}
                        className="flex-1 py-2 px-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isVoting && actionLoading === 'against' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Vote className="w-4 h-4" />
                        )}
                        {t('governance.voteAgainst')}
                      </button>
                    </div>
                  )}

                  {proposal.hasVoted && (
                    <div className="mt-4 text-center">
                      <span className="text-slate-400 text-sm flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {t('governance.alreadyVoted')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!proposalsLoading && proposals.length === 0 && (
          <div className="card p-12 text-center">
            <Vote className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('governance.noProposals')}</h3>
            <p className="text-slate-400 mb-6">{t('governance.noProposalsDesc')}</p>
            <button
              className="btn-primary px-6 py-3 opacity-50 cursor-not-allowed"
              disabled
              title={t('governance.comingSoonTooltip')}
            >
              {t('governance.createFirstProposal')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
