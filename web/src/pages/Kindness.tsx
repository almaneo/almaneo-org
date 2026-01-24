/**
 * Kindness Dashboard Page
 * Kindness Score, 활동 기록, 밋업 관리
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { useWallet } from '../components/wallet';
import { useKindness, getTierColor, getTierBgColor, getTierIcon } from '../hooks/useKindness';
import { useMeetups } from '../hooks/useMeetups';
import { AMBASSADOR_TIERS } from '../services/kindness';

// 주소 축약 유틸리티
function shortenAddress(address: string, chars = 6): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// 활동 타입 라벨
const ACTIVITY_LABELS: Record<string, { label: string; icon: string }> = {
  first_meetup: { label: '첫 밋업 참가', icon: '🎉' },
  meetup_attend: { label: '밋업 참가', icon: '👥' },
  meetup_host: { label: '밋업 주최', icon: '🏠' },
  meetup_host_large: { label: '대규모 밋업 주최', icon: '🎊' },
  onboarding: { label: '신규 사용자 온보딩', icon: '🤝' },
  mentoring: { label: '멘토링', icon: '🎓' },
  education_content: { label: '교육 콘텐츠 제작', icon: '📚' },
  workshop: { label: '워크샵 진행', icon: '🎤' },
  translation: { label: '번역 기여', icon: '🌍' },
  community_leader: { label: '커뮤니티 리더', icon: '👑' },
  volunteer: { label: '봉사 활동', icon: '❤️' },
  donation: { label: '기부', icon: '💝' },
  twitter_share: { label: 'Twitter 공유', icon: '🐦' },
  discord_help: { label: 'Discord 도움', icon: '💬' },
  governance_vote: { label: '거버넌스 투표', icon: '🗳️' },
  referral: { label: '친구 초대', icon: '👋' },
  daily_quest: { label: '일일 퀘스트', icon: '✅' },
  weekly_mission: { label: '주간 미션', icon: '🎯' },
  monthly_challenge: { label: '월간 챌린지', icon: '🏆' },
};

// 날짜 포맷
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Kindness() {
  const { address, isConnected, isLoading: authLoading, connect: login } = useWallet();
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

  const isLoading = authLoading || kindnessLoading || meetupsLoading;

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
            Kindness Protocol
          </h1>
          <p className="text-slate-400 mb-8">
            지갑을 연결하여 Kindness Score를 확인하고
            밋업에 참여하세요. 따뜻한 연결이 시작됩니다.
          </p>
          <button
            onClick={login}
            disabled={authLoading}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50"
          >
            {authLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </span>
            ) : (
              'Connect Wallet'
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
          <p className="text-slate-400">Loading your Kindness data...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Kindness Protocol</h1>
            <p className="text-slate-400">
              따뜻한 연결을 통해 Kindness Score를 쌓아가세요
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/meetup/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              밋업 만들기
            </Link>
            <button
              onClick={refreshKindnessData}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
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
                  <p className="text-slate-400 text-sm mb-1">Kindness Score</p>
                  <p className="text-4xl font-bold text-white mb-2">
                    {kindnessStats.score.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierBgColor(kindnessStats.tier)} ${getTierColor(kindnessStats.tier)}`}>
                      {kindnessStats.tierLabel}
                    </span>
                    {kindnessStats.nextTier && (
                      <span className="text-xs text-slate-500">
                        → {kindnessStats.nextTierLabel}까지 {kindnessStats.pointsToNextTier}점
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress to Next Tier */}
              {kindnessStats.nextTier && (
                <div className="w-full md:w-64">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">다음 티어 진행률</span>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-neos-blue" />
              <span className="text-slate-400 text-sm">참가한 밋업</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {activityStats?.meetupsAttended || 0}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-400 text-sm">주최한 밋업</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {activityStats?.meetupsHosted || 0}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">인증된 활동</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {activityStats?.verifiedActivities || 0}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-400 text-sm">대기 중</span>
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
                <h2 className="text-xl font-semibold text-white">내가 주최한 밋업</h2>
                <Link to="/meetup" className="text-sm text-neos-blue hover:underline flex items-center gap-1">
                  전체 보기 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {myHostedMeetups.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">아직 주최한 밋업이 없습니다</p>
                  <Link to="/meetup/new" className="btn-secondary text-sm">
                    첫 밋업 만들기
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
                            {meetup.location} · {formatDate(meetup.meeting_date)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          meetup.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : meetup.status === 'upcoming'
                              ? 'bg-neos-blue/20 text-neos-blue'
                              : 'bg-red-500/20 text-red-400'
                        }`}>
                          {meetup.status === 'completed' ? '완료' : meetup.status === 'upcoming' ? '예정' : '취소'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activities */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-6">최근 활동</h2>

              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">아직 기록된 활동이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.slice(0, 5).map((activity) => {
                    const activityInfo = ACTIVITY_LABELS[activity.activity_type] || {
                      label: activity.activity_type,
                      icon: '📝',
                    };

                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{activityInfo.icon}</span>
                          <div>
                            <p className="text-white text-sm">{activityInfo.label}</p>
                            <p className="text-slate-500 text-xs">
                              {formatDateTime(activity.created_at)}
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
              <h2 className="text-xl font-semibold text-white mb-4">Ambassador 티어</h2>
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
                            현재
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
              <h2 className="text-xl font-semibold text-white mb-4">Kindness 리더보드</h2>
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
