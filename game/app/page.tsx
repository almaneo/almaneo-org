'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useGameStore } from '@/hooks/useGameStore';
import { useWeb3Auth } from '@/contexts/Web3AuthProvider';
import { useTranslation } from 'react-i18next';
import { AUTO_SAVE_INTERVAL } from '@/lib/constants';
import { Howl } from 'howler';
import GameLayout from '@/components/GameLayout';
import GameHUD from '@/components/GameHUD';
import GameNavBar from '@/components/GameNavBar';
import MoreMenu from '@/components/MoreMenu';
import KindnessCanvas from '@/components/KindnessCanvas';
import SaveIndicator from '@/components/SaveIndicator';
import OfflineEarningsModal from '@/components/OfflineEarningsModal';
import UpgradePanel from '@/components/UpgradePanel';
import QuestPanel from '@/components/QuestPanel';
import AchievementPanel from '@/components/AchievementPanel';
import AchievementNotification from '@/components/AchievementNotification';
import LeaderboardPanel from '@/components/LeaderboardPanel';
import GameModal from '@/components/GameModal';
import LevelUpEffect from '@/components/LevelUpEffect';
import StoryIntro from '@/components/StoryIntro';
import StartScreen from '@/components/StartScreen';
import EducationModal from '@/components/EducationModal';
import LoadingScreen from '@/components/LoadingScreen';
import { WorldMap } from '@/components/WorldMap';
import { CountryScreen } from '@/components/CountryScreen';
import { QuestScreen } from '@/components/QuestScreen';
import type { QuestResultData, QuestScreenHandle } from '@/components/QuestScreen';
import { useTravelStore } from '@/hooks/useTravelStore';
import LoginScreen from '@/components/LoginScreen';
import AppealHistory from '@/components/AppealHistory';
import TokenClaimModal from '@/components/TokenClaimModal';
import { Achievement } from '@/lib/achievements';
import { getEducationByLevel, EducationContent } from '@/lib/educationContent';
import { getStoryMilestone } from '@/lib/storyContent';

export default function HomePage() {
  const {
    points,
    energy,
    maxEnergy,
    level,
    upgrades,
    achievements,
    achievementStats,
    addPoints,
    consumeEnergy,
    updateQuestProgress,
    updateAchievementStats,
    checkQuestReset,
    checkLevelUp,
    loadGame,
    saveGame,
    isLoading
  } = useGameStore();

  const { t, i18n } = useTranslation('game');

  // Web3Auth 지갑 연결
  const { address, isConnected, isLoading: web3Loading, login } = useWeb3Auth();

  // Background music ref
  const bgMusicRef = useRef<Howl | null>(null);

  // Achievement notification state
  const [notificationAchievement, setNotificationAchievement] = useState<Achievement | null>(null);

  // Level up effect state
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);

  // Story and Education states
  const [showStartScreen, setShowStartScreen] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [educationContent, setEducationContent] = useState<EducationContent | null>(null);

  // Milestone snackbar state
  const [milestoneSnackbar, setMilestoneSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // More menu state
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Travel system
  const [showTravel, setShowTravel] = useState(false);
  // Quest result overlay (rendered at page level to avoid CSS containment issues)
  const [questResultData, setQuestResultData] = useState<QuestResultData | null>(null);
  const questScreenRef = useRef<QuestScreenHandle>(null);
  const handleQuestResultChange = useCallback((data: QuestResultData | null) => {
    setQuestResultData(data);
  }, []);
  // Appeals
  const [showAppeals, setShowAppeals] = useState(false);
  const travelStore = useTravelStore();

  // Active tab tracking for navbar highlighting
  const activeTab = showTravel
    ? 'travel'
    : activeModal === 'quest'
      ? 'quest'
      : activeModal === 'upgrade'
        ? 'upgrade'
        : showMoreMenu || (activeModal && !['quest', 'upgrade'].includes(activeModal))
          ? 'more'
          : 'home';

  // DEV: Test buttons visibility
  const [showDevTools, setShowDevTools] = useState(false);

  const openModal = (modal: string) => {
    setShowMoreMenu(false);
    setActiveModal(modal);
  };
  const closeModal = () => setActiveModal(null);

  // Load game on mount or wallet connection
  useEffect(() => {
    if (web3Loading) return;
    if (isConnected && address) {
      loadGame(address);
    }
  }, [isConnected, address, web3Loading, loadGame]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveGame();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [saveGame]);

  // Load dynamic content from DB (language-aware)
  // Re-initialize when i18n language changes (e.g., from MoreMenu toggle)
  useEffect(() => {
    const lang = i18n.language?.split('-')[0] || 'en';
    travelStore.initializeContent(lang);
  }, [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check quest reset every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkQuestReset();
    }, 60000);
    return () => clearInterval(interval);
  }, [checkQuestReset]);

  // Level up detection
  useEffect(() => {
    if (level > prevLevel && prevLevel > 0) {
      setShowLevelUp(true);
    }
    setPrevLevel(level);
  }, [level, prevLevel]);

  // Initial story display (only once)
  useEffect(() => {
    if (web3Loading || isLoading) return;
    const gameStarted = localStorage.getItem('gameStarted');
    const storyViewed = localStorage.getItem('storyViewed');

    if (!gameStarted) {
      setShowStartScreen(true);
    } else if (!storyViewed) {
      const timer = setTimeout(() => {
        setShowStory(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [web3Loading, isLoading]);

  // Level up events: Education and Milestones
  useEffect(() => {
    if (level > prevLevel && prevLevel > 0) {
      const education = getEducationByLevel(level);
      if (education) {
        setEducationContent(education);
        setShowEducation(true);
      }
      const milestone = getStoryMilestone(level);
      if (milestone) {
        setMilestoneSnackbar({
          open: true,
          message: `${milestone.emoji} ${t(milestone.titleKey)}: ${t(milestone.messageKey)}`
        });
      }
    }
  }, [level, prevLevel]);

  // Watch for newly completed achievements
  useEffect(() => {
    const completedAchievements = achievements.filter(a => a.completed);
    const newlyCompleted = completedAchievements.find(a => {
      if (!a.completedAt) return false;
      const completedTime = new Date(a.completedAt).getTime();
      return Date.now() - completedTime < 2000;
    });
    if (newlyCompleted && !notificationAchievement) {
      setNotificationAchievement(newlyCompleted);
    }
  }, [achievements, notificationAchievement]);

  // Kindness Act handler
  const handleKindnessAct = () => {
    if (energy >= 1) {
      addPoints(upgrades.tapPower);
      consumeEnergy(1);
      updateQuestProgress('tap');
      updateAchievementStats('tap');
    }
  };

  // StartScreen handler
  const handleStartGame = () => {
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Howl({
        src: ['/sounds/story-bgm.mp3'],
        loop: true,
        volume: 0.3,
        html5: true,
      });
    }
    bgMusicRef.current.play();
    localStorage.setItem('gameStarted', 'true');
    setShowStartScreen(false);
    setShowStory(true);
  };

  // StoryIntro close handler
  const handleStoryClose = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.stop();
      bgMusicRef.current.unload();
      bgMusicRef.current = null;
    }
    setShowStory(false);
  };

  // Nav handlers
  const handleHomeClick = () => {
    closeModal();
    setShowTravel(false);
    setShowMoreMenu(false);
  };

  const handleTravelClick = () => {
    closeModal();
    setShowMoreMenu(false);
    setShowTravel(true);
    travelStore.initialize();
  };

  const handleQuestClick = () => {
    setShowTravel(false);
    setShowMoreMenu(false);
    openModal('quest');
  };

  const handleUpgradeClick = () => {
    setShowTravel(false);
    setShowMoreMenu(false);
    openModal('upgrade');
  };

  const handleMoreClick = () => {
    setShowTravel(false);
    closeModal();
    setShowMoreMenu(true);
  };

  const canAct = energy >= 1;

  if (isLoading || web3Loading) {
    return <LoadingScreen message={t('loading.kindnessHub')} />;
  }

  if (!isConnected || !address) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <>
      <GameLayout
        hud={
          <GameHUD
            points={points}
            energy={energy}
            maxEnergy={maxEnergy}
            level={level}
          />
        }
        canvas={
          <KindnessCanvas
            onHarvest={handleKindnessAct}
            canHarvest={canAct}
            tapPower={upgrades.tapPower}
          />
        }
        navbar={
          <GameNavBar
            activeTab={activeTab}
            onHomeClick={handleHomeClick}
            onTravelClick={handleTravelClick}
            onQuestClick={handleQuestClick}
            onUpgradeClick={handleUpgradeClick}
            onMoreClick={handleMoreClick}
            questBadge={useGameStore.getState().dailyQuests.filter(q => q.current >= q.target && !q.completed).length || undefined}
          />
        }
        modals={
          <>
            {/* Upgrade Modal */}
            <GameModal
              open={activeModal === 'upgrade'}
              onClose={closeModal}
              title={t('modals.upgrade')}
              icon={<Typography sx={{ fontSize: 24 }}>⬆️</Typography>}
            >
              <UpgradePanel />
            </GameModal>

            {/* Quest Modal */}
            <GameModal
              open={activeModal === 'quest'}
              onClose={closeModal}
              title={t('modals.quest')}
              icon={<Typography sx={{ fontSize: 24 }}>📋</Typography>}
            >
              <QuestPanel />
            </GameModal>

            {/* Achievement Modal */}
            <GameModal
              open={activeModal === 'achievement'}
              onClose={closeModal}
              title={t('modals.achievement')}
              icon={<Typography sx={{ fontSize: 24 }}>🏆</Typography>}
            >
              <AchievementPanel
                achievements={achievements}
                stats={{
                  totalTaps: achievementStats.totalTaps,
                  totalPoints: achievementStats.totalPoints,
                  tapPowerLevel: upgrades.tapPower,
                  energyCapacityLevel: upgrades.energyCapacity,
                  autoFarmLevel: upgrades.autoFarm,
                  energyRegenLevel: upgrades.energyRegen,
                  level,
                  totalQuests: achievementStats.totalQuests,
                  playTime: achievementStats.playTime,
                  loginStreak: achievementStats.loginStreak,
                }}
              />
            </GameModal>

            {/* Leaderboard Modal */}
            <GameModal
              open={activeModal === 'leaderboard'}
              onClose={closeModal}
              title={t('modals.ranking')}
              icon={<Typography sx={{ fontSize: 24 }}>📊</Typography>}
            >
              <LeaderboardPanel />
            </GameModal>

            {/* Profile Modal (placeholder) */}
            <GameModal
              open={activeModal === 'profile'}
              onClose={closeModal}
              title={t('modals.profile')}
              icon={<Typography sx={{ fontSize: 24 }}>👤</Typography>}
              maxWidth={400}
            >
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#FFD700' }}>
                  {t('modals.comingSoon')}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('modals.profileComingSoon')}
                </Typography>
              </Box>
            </GameModal>

            {/* Settings Modal (placeholder) */}
            <GameModal
              open={activeModal === 'settings'}
              onClose={closeModal}
              title={t('modals.settings')}
              icon={<Typography sx={{ fontSize: 24 }}>⚙️</Typography>}
              maxWidth={400}
            >
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#FFD700' }}>
                  {t('modals.comingSoon')}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('modals.settingsComingSoon')}
                </Typography>
              </Box>
            </GameModal>

            {/* Token Claim Modal */}
            <TokenClaimModal
              open={activeModal === 'token'}
              onClose={closeModal}
            />
          </>
        }
      />

      {/* More Menu (Bottom Sheet) */}
      <MoreMenu
        open={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        onAchievementClick={() => openModal('achievement')}
        onLeaderboardClick={() => openModal('leaderboard')}
        onTokenClick={() => openModal('token')}
        onProfileClick={() => openModal('profile')}
        onSettingsClick={() => openModal('settings')}
        onStoryClick={() => {
          localStorage.removeItem('storyViewed');
          setShowStory(true);
        }}
        onAppealsClick={() => setShowAppeals(true)}
      />

      {/* World Travel Overlay */}
      {showTravel && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1200,
            background: '#0A0F1A',
          }}
        >
          {travelStore.currentView === 'world_map' && (
            <WorldMap onClose={() => setShowTravel(false)} />
          )}
          {travelStore.currentView === 'country' && (
            <CountryScreen onBack={() => travelStore.openWorldMap()} />
          )}
          {travelStore.currentView === 'quest' && (
            <QuestScreen
              ref={questScreenRef}
              onBack={() => travelStore.goBack()}
              onResultChange={handleQuestResultChange}
            />
          )}

          {/* Quest Result Popup - absolute inside the fixed travel overlay to avoid viewport/body CSS issues */}
          {questResultData && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(4px)',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
              }}
            >
              <Box sx={{ maxWidth: 320, width: '90%' }}>
                {/* Result Card */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: questResultData.correct
                      ? 'rgba(10,20,15,0.98)'
                      : 'rgba(20,10,10,0.98)',
                    border: questResultData.correct
                      ? '1px solid rgba(74,222,128,0.3)'
                      : '1px solid rgba(248,113,113,0.3)',
                    textAlign: 'center',
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: 28, mb: 1 }}>{questResultData.emoji}</Typography>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: questResultData.correct ? '#4ade80' : '#f87171',
                      mb: 1,
                    }}
                  >
                    {questResultData.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.5,
                    }}
                  >
                    {questResultData.explanation}
                  </Typography>

                  {/* Answer text (for history lesson) */}
                  {questResultData.answerText && (
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.7)',
                        mt: 1,
                        mb: 1.5,
                      }}
                    >
                      {questResultData.answerText}
                    </Typography>
                  )}

                  {/* Fun Fact (for history lesson) */}
                  {questResultData.funFact && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        background: 'rgba(255,215,0,0.06)',
                        border: '1px solid rgba(255,215,0,0.15)',
                        textAlign: 'left',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: '#FFD700',
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        💡 {questResultData.funFact.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.7)',
                          lineHeight: 1.5,
                        }}
                      >
                        {questResultData.funFact.text}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Continue Button */}
                <Box
                  onClick={() => questScreenRef.current?.handleResultContinue()}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#FFD700',
                    color: '#0A0F1A',
                    fontWeight: 700,
                    fontSize: 14,
                    '&:active': { opacity: 0.9 },
                  }}
                >
                  {t('travel.continue')}
                </Box>
              </Box>
            </div>
          )}
        </Box>
      )}

      {/* Appeals History Overlay */}
      {showAppeals && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1200,
            background: '#0A0F1A',
          }}
        >
          <AppealHistory onClose={() => setShowAppeals(false)} />
        </Box>
      )}

      {/* Save Indicator */}
      <SaveIndicator />

      {/* Offline Earnings Modal */}
      <OfflineEarningsModal />

      {/* Start Screen */}
      <StartScreen
        open={showStartScreen}
        onStart={handleStartGame}
      />

      {/* Story Introduction */}
      <StoryIntro
        open={showStory}
        onClose={handleStoryClose}
      />

      {/* Education Modal */}
      <EducationModal
        open={showEducation}
        onClose={() => setShowEducation(false)}
        content={educationContent}
      />

      {/* Achievement Notification */}
      <AchievementNotification
        achievement={notificationAchievement}
        onClose={() => setNotificationAchievement(null)}
      />

      {/* Level Up Effect */}
      <LevelUpEffect
        show={showLevelUp}
        level={level}
        onClose={() => setShowLevelUp(false)}
      />

      {/* Milestone Snackbar */}
      <Snackbar
        open={milestoneSnackbar.open}
        autoHideDuration={5000}
        onClose={() => setMilestoneSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setMilestoneSnackbar({ open: false, message: '' })}
          severity="success"
          sx={{
            width: '100%',
            fontSize: '1rem',
            '& .MuiAlert-message': { whiteSpace: 'pre-line' }
          }}
        >
          {milestoneSnackbar.message}
        </Alert>
      </Snackbar>

      {/* DEV TOOLS */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <Box
            onClick={() => setShowDevTools(!showDevTools)}
            sx={{
              position: 'fixed', bottom: 80, right: 16,
              width: 44, height: 44, borderRadius: '50%',
              bgcolor: '#FF5722', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 9998,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Typography sx={{ fontSize: 16 }}>🛠️</Typography>
          </Box>
          {showDevTools && (
            <Box
              sx={{
                position: 'fixed', bottom: 130, right: 16,
                bgcolor: 'rgba(0,0,0,0.92)', borderRadius: 2,
                p: 1.5, minWidth: 200, zIndex: 9998,
                border: '2px solid #FF5722',
              }}
            >
              <Typography sx={{ color: '#FF5722', fontWeight: 'bold', mb: 1, fontSize: 12 }}>
                🛠️ DEV
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {[1000, 5000, 20000].map((pts) => (
                  <Box
                    key={pts}
                    onClick={() => { addPoints(pts); checkLevelUp(); }}
                    sx={{
                      bgcolor: '#4CAF50', color: 'white', p: 0.5,
                      borderRadius: 1, cursor: 'pointer', textAlign: 'center', fontSize: 11,
                    }}
                  >
                    +{(pts/1000)}K pts
                  </Box>
                ))}
                <Box
                  onClick={() => { localStorage.removeItem('storyViewed'); setShowStory(true); }}
                  sx={{
                    bgcolor: '#FF5722', color: 'white', p: 0.5,
                    borderRadius: 1, cursor: 'pointer', textAlign: 'center', fontSize: 11,
                  }}
                >
                  📖 Story
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
}
