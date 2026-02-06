/**
 * Kindness Dashboard Page
 * Kindness Score, 활동 기록, 밋업 관리
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Users,
  Calendar,
  RefreshCw,
  Loader2,
  ChevronRight,
  Clock,
  CheckCircle2,
  Plus,
  Shield,
  ExternalLink,
  Award,
} from 'lucide-react';
import { useWallet } from '../components/wallet';
import { useKindness, getTierColor, getTierBgColor, getTierIcon } from '../hooks/useKindness';
import { useMeetups } from '../hooks/useMeetups';
import {
  useAmbassadorSBT,
  getOnchainTierColor,
  getOnchainTierBgColor,
  getOnchainTierIcon,
} from '../hooks/useAmbassadorSBT';
import { AMBASSADOR_TIERS } from '../services/kindness';

// 주소 축약 유틸리티
function shortenAddress(address: string, chars = 6): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// 활동 타입 아이콘
const ACTIVITY_ICONS: Record<string, string> = {
  first_meetup: '🎉',
  meetup_attend: '👥',
  meetup_host: '🏠',
  meetup_host_large: '🎊',
  onboarding: '🤝',
  mentoring: '🎓',
  education_content: '📚',
  workshop: '🎤',
  translation: '🌍',
  community_leader: '👑',
  volunteer: '❤️',
  donation: '💝',
  twitter_share: '🐦',
  discord_help: '💬',
  governance_vote: '🗳️',
  referral: '👋',
  daily_quest: '✅',
  weekly_mission: '🎯',
  monthly_challenge: '🏆',
};

// 날짜 포맷 (i18n 언어 기반)
function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 밋업 상태 라벨
function getMeetupStatusLabel(status: string, t: (key: string) => string): string {
  switch (status) {
    case 'completed': return t('kindness.statusCompleted');
    case 'upcoming': return t('kindness.statusUpcoming');
    case 'cancelled': return t('kindness.statusCancelled');
    default: return status;
  }
}

export default function Kindness() {
  const { t, i18n } = useTranslation('common');
  const { address, isConnected, isLoading: authLoading, connect: login, getExplorerUrl } = useWallet();
  const {
    kindnessStats,
    activities,
    activityStats,
    leaderboard,
    isLoading: kindnessLoading,
    refreshKindnessData,
    loadLeaderboard,
  } = useKindness();
  const {
    myHostedMeetups,
    isLoading: meetupsLoading,
  } = useMeetups();
  const {
    ambassadorData,
    nextTierRequirements,
    contractConstants,
    isLoading: sbtLoading,
    isContractAvailable,
    error: sbtError,
    refresh: refreshSBT,
  } = useAmbassadorSBT();

  const isLoading = authLoading || kindnessLoading || meetupsLoading || sbtLoading;
  const locale = i18n.language;

  // 리더보드 로드
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  // 지갑 미연결 상태
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-jeong-orange to-amber-500 flex items-center justify-center">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {t('kindness.title')}
          </h1>
          <p className="text-slate-400 mb-8">
            {t('kindness.connectDescription')}
          </p>
          <button
            onClick={login}
            disabled={authLoading}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50"
          >
            {authLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('kindness.connecting')}
              </span>
            ) : (
              t('kindness.connectWallet')
            )}
          </button>
        </div>
      </div>
    );
  }

  // 데이터 로딩 상태
  if (isLoading && !kindnessStats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-jeong-orange animate-spin mx-auto mb-4" />
          <p className="text-slate-400">{t('kindness.loading')}</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">{t('kindness.title')}</h1>
            <p className="text-slate-400">
              {t('kindness.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/meetup/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('kindness.createMeetup')}
            </Link>
            <button
              onClick={refreshKindnessData}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              title={t('kindness.refresh')}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Kindness Score Card */}
        {kindnessStats && (
          <div className="card p-8 mb-8 bg-gradient-to-r from-jeong-orange/10 to-amber-500/10 border-jeong-orange/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl ${getTierBgColor(kindnessStats.tier)} flex items-center justify-center text-4xl`}>
                  {getTierIcon(kindnessStats.tier)}
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">{t('kindness.kindnessScore')}</p>
                  <p className="text-4xl font-bold text-white mb-2">
                    {kindnessStats.score.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierBgColor(kindnessStats.tier)} ${getTierColor(kindnessStats.tier)}`}>
                      {kindnessStats.tierLabel}
                    </span>
                    {kindnessStats.nextTier && (
                      <span className="text-xs text-slate-500">
                        → {t('kindness.pointsToNextTier', { tierLabel: kindnessStats.nextTierLabel, points: kindnessStats.pointsToNextTier })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress to Next Tier */}
              {kindnessStats.nextTier && (
                <div className="w-full md:w-64">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">{t('kindness.nextTierProgress')}</span>
                    <span className="text-white">{kindnessStats.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-jeong-orange to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${kindnessStats.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onchain Ambassador SBT Card */}
        {isContractAvailable && (
          <div className="card p-6 mb-8 border border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">{t('kindness.ambassadorSbt')}</h2>
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                  {t('kindness.onChain')}
                </span>
              </div>
              <button
                onClick={refreshSBT}
                disabled={sbtLoading}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                title={t('kindness.refresh')}
              >
                <RefreshCw className={`w-4 h-4 ${sbtLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {sbtError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {sbtError}
              </div>
            )}

            {sbtLoading && !ambassadorData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              </div>
            ) : ambassadorData ? (
              <div className="space-y-6">
                {/* SBT 상태 */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl ${getOnchainTierBgColor(ambassadorData.tier)} flex items-center justify-center text-3xl`}>
                      {getOnchainTierIcon(ambassadorData.tier)}
                    </div>
                    <div>
                      {ambassadorData.hasSBT ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${getOnchainTierColor(ambassadorData.tier)}`}>
                              {ambassadorData.tierName}
                            </span>
                            <Award className="w-4 h-4 text-yellow-400" />
                          </div>
                          <p className="text-slate-400 text-sm">
                            Token ID: #{ambassadorData.tokenId.toString()}
                          </p>
                          {ambassadorData.mintedAt && (
                            <p className="text-slate-500 text-xs">
                              {t('kindness.issuedDate')}: {ambassadorData.mintedAt.toLocaleDateString(locale)}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-medium text-slate-300">{t('kindness.noSbt')}</p>
                          <p className="text-slate-400 text-sm">
                            {t('kindness.noSbtDesc')}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {ambassadorData.hasSBT && address && (
                    <a
                      href={getExplorerUrl('address', address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-neos-blue hover:underline"
                    >
                      {t('kindness.viewOnExplorer')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* 온체인 통계 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">{t('kindness.meetupsAttended')}</p>
                    <p className="text-xl font-bold text-white">{ambassadorData.meetupsAttended}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">{t('kindness.meetupsHosted')}</p>
                    <p className="text-xl font-bold text-white">{ambassadorData.meetupsHosted}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">{t('kindness.kindnessScore')}</p>
                    <p className="text-xl font-bold text-jeong-orange">{ambassadorData.kindnessScore}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">{t('kindness.referrals')}</p>
                    <p className="text-xl font-bold text-white">{ambassadorData.referralCount}</p>
                  </div>
                </div>

                {/* 다음 티어 진행률 */}
                {nextTierRequirements && (
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm">{t('kindness.nextTier')}</span>
                      <span className={`font-medium ${getOnchainTierColor(nextTierRequirements.nextTier)}`}>
                        {getOnchainTierIcon(nextTierRequirements.nextTier)} {nextTierRequirements.nextTierName}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {nextTierRequirements.meetupsNeeded > 0 && (
                        <div className="flex justify-between text-slate-400">
                          <span>{t('kindness.meetupsNeeded')}</span>
                          <span className="text-white">{t('kindness.timesUnit', { count: nextTierRequirements.meetupsNeeded })}</span>
                        </div>
                      )}
                      {nextTierRequirements.hostingsNeeded > 0 && (
                        <div className="flex justify-between text-slate-400">
                          <span>{t('kindness.hostingsNeeded')}</span>
                          <span className="text-white">{t('kindness.timesUnit', { count: nextTierRequirements.hostingsNeeded })}</span>
                        </div>
                      )}
                      {nextTierRequirements.scoreNeeded > 0 && (
                        <div className="flex justify-between text-slate-400">
                          <span>{t('kindness.scoreNeeded')}</span>
                          <span className="text-white">{t('kindness.pointsUnit', { count: nextTierRequirements.scoreNeeded })}</span>
                        </div>
                      )}
                      {nextTierRequirements.referralsNeeded > 0 && (
                        <div className="flex justify-between text-slate-400">
                          <span>{t('kindness.referralsNeeded')}</span>
                          <span className="text-white">{t('kindness.peopleUnit', { count: nextTierRequirements.referralsNeeded })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 컨트랙트 통계 */}
                {contractConstants && (
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-700/50">
                    <span>{t('kindness.totalSbtIssued')}</span>
                    <span className="text-slate-300">{t('kindness.countUnit', { count: contractConstants.totalSupply })}</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-neos-blue" />
              <span className="text-slate-400 text-sm">{t('kindness.statsAttended')}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {activityStats?.meetupsAttended || 0}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-400 text-sm">{t('kindness.statsHosted')}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {activityStats?.meetupsHosted || 0}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">{t('kindness.statsVerified')}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {activityStats?.verifiedActivities || 0}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-400 text-sm">{t('kindness.statsPending')}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {activityStats?.pendingActivities || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activities & Meetups */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Hosted Meetups */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">{t('kindness.myHostedMeetups')}</h2>
                <Link to="/meetup" className="text-sm text-neos-blue hover:underline flex items-center gap-1">
                  {t('kindness.viewAll')} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {myHostedMeetups.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">{t('kindness.noHostedMeetups')}</p>
                  <Link to="/meetup/new" className="btn-secondary text-sm">
                    {t('kindness.createFirstMeetup')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myHostedMeetups.slice(0, 3).map((meetup) => (
                    <Link
                      key={meetup.id}
                      to={`/meetup/${meetup.id}`}
                      className="block p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">{meetup.title}</h3>
                          <p className="text-slate-400 text-sm">
                            {meetup.location} · {formatDate(meetup.meeting_date, locale)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          meetup.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : meetup.status === 'upcoming'
                              ? 'bg-neos-blue/20 text-neos-blue'
                              : 'bg-red-500/20 text-red-400'
                        }`}>
                          {getMeetupStatusLabel(meetup.status, t)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activities */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-6">{t('kindness.recentActivities')}</h2>

              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">{t('kindness.noActivities')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.slice(0, 5).map((activity) => {
                    const icon = ACTIVITY_ICONS[activity.activity_type] || '📝';
                    const label = t(`kindness.activities.${activity.activity_type}`, { defaultValue: activity.activity_type });

                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{icon}</span>
                          <div>
                            <p className="text-white text-sm">{label}</p>
                            <p className="text-slate-500 text-xs">
                              {formatDateTime(activity.created_at, locale)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-jeong-orange font-medium">+{activity.points}</span>
                          {activity.verified ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Leaderboard & Tiers */}
          <div className="space-y-8">
            {/* Ambassador Tiers */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t('kindness.ambassadorTiers')}</h2>
              <div className="space-y-3">
                {Object.entries(AMBASSADOR_TIERS).map(([key, tier]) => {
                  const tierKey = key as keyof typeof AMBASSADOR_TIERS;
                  const isCurrentTier = kindnessStats?.tier === tierKey;

                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-lg ${
                        isCurrentTier
                          ? 'bg-jeong-orange/20 border border-jeong-orange/50'
                          : 'bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={getTierColor(tierKey)}>{getTierIcon(tierKey)}</span>
                          <span className={`font-medium ${isCurrentTier ? 'text-white' : 'text-slate-300'}`}>
                            {tier.label}
                          </span>
                        </div>
                        {isCurrentTier && (
                          <span className="text-xs bg-jeong-orange/30 text-jeong-orange px-2 py-0.5 rounded">
                            {t('kindness.currentTier')}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mt-1">{tier.requirement}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t('kindness.leaderboard')}</h2>
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry) => (
                  <div
                    key={entry.walletAddress}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      entry.walletAddress === address?.toLowerCase()
                        ? 'bg-jeong-orange/20'
                        : 'bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-center font-bold ${
                        entry.rank <= 3 ? 'text-yellow-400' : 'text-slate-500'
                      }`}>
                        {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                      </span>
                      <div>
                        <p className="text-white text-sm">
                          {entry.nickname || shortenAddress(entry.walletAddress, 4)}
                        </p>
                        <span className={`text-xs ${getTierColor(entry.tier)}`}>
                          {getTierIcon(entry.tier)} {entry.tier}
                        </span>
                      </div>
                    </div>
                    <span className="text-jeong-orange font-medium text-sm">
                      {entry.kindnessScore.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
