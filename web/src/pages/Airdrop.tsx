/**
 * Airdrop Page - 에어드롭 클레임
 * KindnessAirdrop 컨트랙트 연동
 */

import { useTranslation } from 'react-i18next';
import { Gift, CheckCircle, Clock, Users, MessageSquare, GraduationCap, Heart, RefreshCw, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useWallet } from '../components/wallet';
import { useAirdrop } from '../hooks';
import { getContractAddress } from '../contracts/addresses';

// 에어드롭 태스크 카테고리 정의 (오프체인 활동 - 추후 연동)
const taskCategoryDefs = [
  {
    id: 'dao',
    nameKey: 'airdrop.categories.dao',
    icon: Users,
    color: 'text-neos-blue',
    bgColor: 'bg-neos-blue/20',
    tasks: [
      { id: 1, titleKey: 'airdrop.tasks.voteProposals', reward: 500, completed: false },
      { id: 2, titleKey: 'airdrop.tasks.delegateVoting', reward: 200, completed: false },
      { id: 3, titleKey: 'airdrop.tasks.createProposal', reward: 1000, completed: false },
    ],
  },
  {
    id: 'social',
    nameKey: 'airdrop.categories.social',
    icon: MessageSquare,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    tasks: [
      { id: 4, titleKey: 'airdrop.tasks.followX', reward: 100, completed: false },
      { id: 5, titleKey: 'airdrop.tasks.joinDiscord', reward: 100, completed: false },
      { id: 6, titleKey: 'airdrop.tasks.sharePost', reward: 150, completed: false },
    ],
  },
  {
    id: 'education',
    nameKey: 'airdrop.categories.education',
    icon: GraduationCap,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    tasks: [
      { id: 7, titleKey: 'airdrop.tasks.aiQuiz', reward: 300, completed: false },
      { id: 8, titleKey: 'airdrop.tasks.watchTutorial', reward: 200, completed: false },
      { id: 9, titleKey: 'airdrop.tasks.readWhitepaper', reward: 250, completed: false },
    ],
  },
  {
    id: 'kindness',
    nameKey: 'airdrop.categories.kindness',
    icon: Heart,
    color: 'text-jeong-orange',
    bgColor: 'bg-jeong-orange/20',
    tasks: [
      { id: 10, titleKey: 'airdrop.tasks.attendMeetup', reward: 400, completed: false },
      { id: 11, titleKey: 'airdrop.tasks.hostMeetup', reward: 800, completed: false },
      { id: 12, titleKey: 'airdrop.tasks.mentorUser', reward: 600, completed: false },
    ],
  },
];

export default function Airdrop() {
  const { t } = useTranslation('common');
  const { isConnected, connect, chainId } = useWallet();
  const {
    campaigns,
    userStats,
    isLoading,
    error,
    isContractAvailable,
    refresh,
    hasClaimedCampaign,
    getActiveCampaigns,
    formatAmount,
  } = useAirdrop();

  const activeCampaigns = getActiveCampaigns();
  const contractAddress = getContractAddress('KindnessAirdrop', chainId ?? undefined);

  // 캠페인 상태 라벨
  const getStatusLabel = (campaign: { active: boolean; startTime: number; endTime: number }) => {
    const now = Math.floor(Date.now() / 1000);
    if (!campaign.active) return { label: t('airdrop.statusInactive'), color: 'text-slate-500' };
    if (now < campaign.startTime) return { label: t('airdrop.statusUpcoming'), color: 'text-yellow-400' };
    if (now > campaign.endTime) return { label: t('airdrop.statusEnded'), color: 'text-red-400' };
    return { label: t('airdrop.statusActive'), color: 'text-green-400' };
  };

  // 미연결 상태
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <Gift className="w-16 h-16 text-neos-blue mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-4">{t('airdrop.connectWallet')}</h2>
            <p className="text-slate-400 mb-8">{t('airdrop.connectWalletDesc')}</p>
            <button onClick={connect} className="btn-primary px-8 py-3">
              {t('airdrop.connectWallet')}
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
            <h1 className="text-3xl font-bold text-white mb-2">{t('airdrop.title')}</h1>
            <p className="text-slate-400">{t('airdrop.subtitle')}</p>
          </div>
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            title={t('airdrop.refreshData')}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card p-4 mb-6 bg-red-500/10 border-red-500/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Contract Status */}
        {!isContractAvailable && !isLoading && (
          <div className="card p-6 mb-10 bg-yellow-500/10 border-yellow-500/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-medium">{t('airdrop.contractNotAvailable')}</p>
                <p className="text-slate-400 text-sm mt-1">{t('airdrop.contractNotAvailableDesc')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-neos-blue animate-spin" />
          </div>
        )}

        {/* Stats */}
        {isContractAvailable && userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-neos-blue/20 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-neos-blue" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">{t('airdrop.totalClaimed')}</p>
              <p className="text-2xl font-bold text-white">{userStats.totalClaimed} ALMAN</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">{t('airdrop.todayClaimed')}</p>
              <p className="text-2xl font-bold text-white">{userStats.dailyClaimed} ALMAN</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-jeong-orange/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-jeong-orange" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">{t('airdrop.dailyLimitLeft')}</p>
              <p className="text-2xl font-bold text-white">{userStats.remainingDailyLimit} ALMAN</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">{t('airdrop.activeCampaigns')}</p>
              <p className="text-2xl font-bold text-white">{activeCampaigns.length}</p>
            </div>
          </div>
        )}

        {/* Active Campaigns */}
        {isContractAvailable && activeCampaigns.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">{t('airdrop.activeCampaigns')}</h2>
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => {
                const isClaimed = hasClaimedCampaign(campaign.id);
                const progress = Number(campaign.claimedAmount * BigInt(100) / campaign.totalAmount);
                const maxClaim = formatAmount(campaign.maxClaimPerUser);
                const remaining = formatAmount(campaign.totalAmount - campaign.claimedAmount);

                return (
                  <div
                    key={campaign.id}
                    className={`card p-6 ${isClaimed ? 'border-green-500/30 bg-green-500/5' : 'border-neos-blue/30'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{campaign.description}</h3>
                        <p className="text-slate-400 text-sm mt-1">
                          {t('airdrop.campaign')} #{campaign.id} • {t('airdrop.maxClaim')}: {maxClaim} ALMAN
                        </p>
                      </div>
                      {isClaimed ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">{t('airdrop.claimed')}</span>
                        </div>
                      ) : (
                        <button
                          className="btn-primary px-6 py-2"
                          disabled
                          title={t('airdrop.merkleProofRequired')}
                        >
                          {t('airdrop.claim')}
                        </button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{t('airdrop.progress')}</span>
                        <span className="text-slate-400">{progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neos-blue to-jeong-orange"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-slate-400">
                      <span>{t('airdrop.remaining')}: {remaining} ALMAN</span>
                      <span>
                        {t('airdrop.ends')}: {new Date(campaign.endTime * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Campaigns */}
        {isContractAvailable && campaigns.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">{t('airdrop.allCampaigns')} ({campaigns.length})</h2>
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">{t('airdrop.tableId')}</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">{t('airdrop.tableDescription')}</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">{t('airdrop.tableStatus')}</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">{t('airdrop.progress')}</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">{t('airdrop.tableClaimed')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {campaigns.map((campaign) => {
                    const isClaimed = hasClaimedCampaign(campaign.id);
                    const status = getStatusLabel(campaign);
                    const progress = Number(campaign.claimedAmount * BigInt(100) / campaign.totalAmount);

                    return (
                      <tr key={campaign.id} className="hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-white">#{campaign.id}</td>
                        <td className="px-4 py-3 text-white">{campaign.description}</td>
                        <td className="px-4 py-3">
                          <span className={status.color}>{status.label}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400">{progress}%</td>
                        <td className="px-4 py-3 text-right">
                          {isClaimed ? (
                            <CheckCircle className="w-5 h-5 text-green-400 inline" />
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Campaigns */}
        {isContractAvailable && !isLoading && campaigns.length === 0 && (
          <div className="card p-8 text-center mb-10">
            <Gift className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">{t('airdrop.noCampaigns')}</p>
            <p className="text-slate-500 text-sm mt-2">{t('airdrop.noCampaignsDesc')}</p>
          </div>
        )}

        {/* Contract Link */}
        {isContractAvailable && contractAddress && (
          <div className="text-center mb-10">
            <a
              href={`https://amoy.polygonscan.com/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-neos-blue transition-colors text-sm"
            >
              {t('airdrop.viewContract')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Task Categories (Off-chain Activities) */}
        <div className="border-t border-slate-800 pt-10">
          <h2 className="text-xl font-bold text-white mb-2">{t('airdrop.earnMore')}</h2>
          <p className="text-slate-400 mb-6">{t('airdrop.earnMoreDesc')}</p>

          <div className="space-y-8">
            {taskCategoryDefs.map((category) => {
              const Icon = category.icon;
              const completedCount = category.tasks.filter(tk => tk.completed).length;

              return (
                <div key={category.id} className="card p-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{t(category.nameKey)}</h3>
                        <p className="text-slate-400 text-sm">
                          {completedCount} / {category.tasks.length} {t('airdrop.completed')}
                        </p>
                      </div>
                    </div>
                    {/* Progress */}
                    <div className="w-32">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${category.bgColor.replace('/20', '')}`}
                          style={{ width: `${(completedCount / category.tasks.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    {category.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          task.completed
                            ? 'bg-green-500/10 border border-green-500/20'
                            : 'bg-slate-800/50 border border-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                          )}
                          <span className={task.completed ? 'text-slate-400 line-through' : 'text-white'}>
                            {t(task.titleKey)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-semibold ${task.completed ? 'text-green-400' : 'text-jeong-orange'}`}>
                            +{task.reward} ALMAN
                          </span>
                          {!task.completed && (
                            <button className="px-4 py-1.5 bg-neos-blue/20 text-neos-blue rounded-lg hover:bg-neos-blue/30 transition-colors text-sm">
                              {t('airdrop.start')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
