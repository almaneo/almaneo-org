'use client';

import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useGameStore } from '@/hooks/useGameStore';
import { useWeb3Auth } from '@/contexts/Web3AuthProvider';
import { AUTO_SAVE_INTERVAL } from '@/lib/constants';
import { Howl } from 'howler';
import GameLayout from '@/components/GameLayout';
import GameHUD from '@/components/GameHUD';
import GameNavBar from '@/components/GameNavBar';
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
import RotateDevicePrompt from '@/components/RotateDevicePrompt';
import StoryIntro from '@/components/StoryIntro';
import StartScreen from '@/components/StartScreen';
import EducationModal from '@/components/EducationModal';
import FullscreenButton from '@/components/FullscreenButton';
import ImpactDashboard from '@/components/ImpactDashboard';
import LoadingScreen from '@/components/LoadingScreen';
import LoginScreen from '@/components/LoginScreen';
import TokenClaimModal from '@/components/TokenClaimModal';
import Image from 'next/image';
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

  // DEV: Test buttons visibility
  const [showDevTools, setShowDevTools] = useState(false);

  const openModal = (modal: string) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  // Load game on mount or wallet connection
  useEffect(() => {
    // Web3Auth 로딩 중이면 대기
    if (web3Loading) return;

    // 지갑 연결된 경우만: 지갑 주소로 로드
    if (isConnected && address) {
      console.log('🔗 Loading game with wallet address:', address);
      loadGame(address);
    }
    // 지갑 미연결: 로그인 필요 (게임 로드 안 함)
    else {
      console.log('❌ Wallet not connected - login required');
    }
  }, [isConnected, address, web3Loading, loadGame]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveGame();
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [saveGame]);

  // Check quest reset every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkQuestReset();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [checkQuestReset]);

  // Level up detection
  useEffect(() => {
    if (level > prevLevel && prevLevel > 0) {
      // Level up detected!
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
      // 첫 방문: StartScreen 표시
      setShowStartScreen(true);
    } else if (!storyViewed) {
      // 게임 시작했지만 스토리 안 봄: 스토리 표시
      const timer = setTimeout(() => {
        setShowStory(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [web3Loading, isLoading]);

  // Level up events: Education and Milestones
  useEffect(() => {
    if (level > prevLevel && prevLevel > 0) {
      // Check for education content
      const education = getEducationByLevel(level);
      if (education) {
        setEducationContent(education);
        setShowEducation(true);
      }

      // Check for story milestone
      const milestone = getStoryMilestone(level);
      if (milestone) {
        setMilestoneSnackbar({
          open: true,
          message: `${milestone.emoji} ${milestone.title}: ${milestone.message}`
        });
      }
    }
  }, [level, prevLevel]);

  // Watch for newly completed achievements
  useEffect(() => {
    const completedAchievements = achievements.filter(a => a.completed);

    // Check if there's a newly completed achievement (completed in last 2 seconds)
    const newlyCompleted = completedAchievements.find(a => {
      if (!a.completedAt) return false;
      const completedTime = new Date(a.completedAt).getTime();
      const now = Date.now();
      return now - completedTime < 2000; // Within 2 seconds
    });

    if (newlyCompleted && !notificationAchievement) {
      setNotificationAchievement(newlyCompleted);
    }
  }, [achievements, notificationAchievement]);

  // Kindness Act 핸들러
  const handleKindnessAct = () => {
    if (energy >= 1) {
      addPoints(upgrades.tapPower);
      consumeEnergy(1);
      updateQuestProgress('tap');
      updateAchievementStats('tap');
    }
  };

  // StartScreen 시작 핸들러
  const handleStartGame = () => {
    // 배경음악 시작 (사용자 제스처!)
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Howl({
        src: ['/sounds/story-bgm.mp3'],
        loop: true,
        volume: 0.3,
        html5: true,
      });
    }
    console.log('🎵 Starting background music from page.tsx');
    bgMusicRef.current.play();

    localStorage.setItem('gameStarted', 'true');
    setShowStartScreen(false);
    setShowStory(true);
  };

  // StoryIntro 종료 핸들러
  const handleStoryClose = () => {
    // 배경음악 정지
    if (bgMusicRef.current) {
      console.log('🔇 Stopping background music');
      bgMusicRef.current.stop();
      bgMusicRef.current.unload();
      bgMusicRef.current = null;
    }
    setShowStory(false);
  };

  // 에너지가 1 이상인지 체크
  const canAct = energy >= 1;

  if (isLoading || web3Loading) {
    return <LoadingScreen message="Loading Kindness Hub..." />;
  }

  // 🔒 로그인 필수 체크
  if (!isConnected || !address) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <>
      {/* 모바일 세로 모드 회전 요청 */}
      <RotateDevicePrompt />

      <GameLayout
        logo={
          <Box
            sx={{
              height: { xs: 100, sm: 120 },
              position: 'relative',
              filter: 'drop-shadow(0 4px 8px rgba(255,215,0,0.6))',
            }}
          >
            <Image
              src="/images/almaneo-logo.png"
              alt="ALMANEO KINDNESS GAME"
              height={120}
              width={400}
              style={{
                height: '100%',
                width: 'auto',
                objectFit: 'contain',
              }}
              priority
            />
          </Box>
        }
        hud={
          <GameHUD
            points={points}
            energy={energy}
            maxEnergy={maxEnergy}
            level={level}
            onProfileClick={() => openModal('profile')}
            onSettingsClick={() => openModal('settings')}
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
            activeTab={activeModal || undefined}
            onUpgradeClick={() => openModal('upgrade')}
            onQuestClick={() => openModal('quest')}
            onAchievementClick={() => openModal('achievement')}
            onLeaderboardClick={() => openModal('leaderboard')}
            onShopClick={() => openModal('shop')}
            onImpactClick={() => openModal('impact')}
            onTokenClick={() => openModal('token')}
          />
        }
        modals={
          <>
            {/* Upgrade Modal */}
            <GameModal
              open={activeModal === 'upgrade'}
              onClose={closeModal}
              title="Upgrade"
              icon={
                <Image
                  src="/images/icons/nav-upgrade.png"
                  alt="Upgrade"
                  width={32}
                  height={32}
                />
              }
            >
              <UpgradePanel />
            </GameModal>

            {/* Quest Modal */}
            <GameModal
              open={activeModal === 'quest'}
              onClose={closeModal}
              title="Quest"
              icon={
                <Image
                  src="/images/icons/nav-quest.png"
                  alt="Quest"
                  width={32}
                  height={32}
                />
              }
            >
              <QuestPanel />
            </GameModal>

            {/* Achievement Modal */}
            <GameModal
              open={activeModal === 'achievement'}
              onClose={closeModal}
              title="Achievement"
              icon={
                <Image
                  src="/images/icons/nav-achievement.png"
                  alt="Achievement"
                  width={32}
                  height={32}
                />
              }
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
              title="Ranking"
              icon={
                <Image
                  src="/images/icons/nav-leaderboard.png"
                  alt="Leaderboard"
                  width={32}
                  height={32}
                />
              }
            >
              <LeaderboardPanel />
            </GameModal>

            {/* Shop Modal (placeholder) */}
            <GameModal
              open={activeModal === 'shop'}
              onClose={closeModal}
              title="Shop"
              icon={
                <Image
                  src="/images/icons/nav-shop.png"
                  alt="Shop"
                  width={32}
                  height={32}
                />
              }
              maxWidth={500}
            >
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#FFD700' }}>
                  Coming Soon...
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Shop feature coming soon!
                </Typography>
              </Box>
            </GameModal>

            {/* Profile Modal (placeholder) */}
            <GameModal
              open={activeModal === 'profile'}
              onClose={closeModal}
              title="Profile"
              icon={
                <Image
                  src="/images/icons/profile-user.png"
                  alt="Profile"
                  width={32}
                  height={32}
                />
              }
              maxWidth={400}
            >
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#FFD700' }}>
                  Coming Soon...
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Profile feature coming soon!
                </Typography>
              </Box>
            </GameModal>

            {/* Settings Modal (placeholder) */}
            <GameModal
              open={activeModal === 'settings'}
              onClose={closeModal}
              title="Settings"
              icon={
                <Image
                  src="/images/icons/settings-gear.png"
                  alt="Settings"
                  width={32}
                  height={32}
                />
              }
              maxWidth={400}
            >
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#FFD700' }}>
                  Coming Soon...
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Settings feature coming soon!
                </Typography>
              </Box>
            </GameModal>

            {/* Environmental Impact Modal */}
            <GameModal
              open={activeModal === 'impact'}
              onClose={closeModal}
              title="Environmental Impact"
              icon={
                <Typography variant="h5" component="span">
                  🌍
                </Typography>
              }
              maxWidth={600}
            >
              <ImpactDashboard />
            </GameModal>

            {/* Token Claim Modal */}
            <TokenClaimModal
              open={activeModal === 'token'}
              onClose={closeModal}
            />
          </>
        }
      />

      {/* Save Indicator */}
      <SaveIndicator />

      {/* Fullscreen Button (Mobile Only) */}
      <FullscreenButton />

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
            '& .MuiAlert-message': {
              whiteSpace: 'pre-line'
            }
          }}
        >
          {milestoneSnackbar.message}
        </Alert>
      </Snackbar>

      {/* DEV TOOLS - 테스트용 (배포 시 제거) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* DEV 버튼 (우측 하단) */}
          <Box
            onClick={() => setShowDevTools(!showDevTools)}
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: '#FF5722',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 9998,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: '#F4511E'
              }
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
              🛠️
            </Typography>
          </Box>

          {/* DEV 패널 */}
          {showDevTools && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 100,
                right: 20,
                bgcolor: 'rgba(0,0,0,0.9)',
                borderRadius: 2,
                p: 2,
                minWidth: 250,
                zIndex: 9998,
                border: '2px solid #FF5722',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
            >
              <Typography sx={{ color: '#FF5722', fontWeight: 'bold', mb: 2 }}>
                🛠️ DEV TOOLS
              </Typography>

              {/* 현재 상태 */}
              <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                <Typography sx={{ color: 'white', fontSize: 12 }}>
                  Level: {level}
                </Typography>
                <Typography sx={{ color: 'white', fontSize: 12 }}>
                  Points: {points.toLocaleString()}
                </Typography>
                <Typography sx={{ color: 'white', fontSize: 12 }}>
                  Total: {useGameStore.getState().totalPoints.toLocaleString()}
                </Typography>
              </Box>

              {/* 테스트 버튼들 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  onClick={() => {
                    addPoints(1000);
                    checkLevelUp();
                  }}
                  sx={{
                    bgcolor: '#4CAF50',
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 12,
                    '&:hover': { bgcolor: '#45a049' }
                  }}
                >
                  +1,000 포인트
                </Box>

                <Box
                  onClick={() => {
                    addPoints(5000);
                    checkLevelUp();
                  }}
                  sx={{
                    bgcolor: '#2196F3',
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 12,
                    '&:hover': { bgcolor: '#1976D2' }
                  }}
                >
                  +5,000 포인트
                </Box>

                <Box
                  onClick={() => {
                    addPoints(20000);
                    checkLevelUp();
                  }}
                  sx={{
                    bgcolor: '#FF9800',
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 12,
                    '&:hover': { bgcolor: '#F57C00' }
                  }}
                >
                  +20,000 포인트
                </Box>

                <Box
                  onClick={() => {
                    setShowLevelUp(true);
                  }}
                  sx={{
                    bgcolor: '#9C27B0',
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 12,
                    '&:hover': { bgcolor: '#7B1FA2' }
                  }}
                >
                  레벨업 효과 보기
                </Box>

                {/* 교육 모달 테스트 */}
                <Box sx={{ mt: 1, mb: 0.5 }}>
                  <Typography sx={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                    교육 모달 테스트:
                  </Typography>
                </Box>

                <Box
                  onClick={() => {
                    const education = getEducationByLevel(10);
                    if (education) {
                      setEducationContent(education);
                      setShowEducation(true);
                    }
                  }}
                  sx={{
                    bgcolor: '#4CAF50',
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 12,
                    '&:hover': { bgcolor: '#45a049' }
                  }}
                >
                  🌾 AWD 교육 (Lv.10)
                </Box>

                <Box
                  onClick={() => {
                    const education = getEducationByLevel(25);
                    if (education) {
                      setEducationContent(education);
                      setShowEducation(true);
                    }
                  }}
                  sx={{
                    bgcolor: '#2196F3',
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 12,
                    '&:hover': { bgcolor: '#1976D2' }
                  }}
                >
                  🧲 필터 교육 (Lv.25)
                </Box>

                <Box
                  onClick={() => {
                    const education = getEducationByLevel(50);
                    if (education) {
                      setEducationContent(education);
                      setShowEducation(true);
                    }
                  }}
                  sx={{
                    bgcolor: '#8BC34A',
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 12,
                    '&:hover': { bgcolor: '#7CB342' }
                  }}
                >
                  💰 탄소 크레딧 (Lv.50)
                </Box>

                {/* 스토리 테스트 */}
                <Box sx={{ mt: 1, mb: 0.5 }}>
                  <Typography sx={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                    스토리 테스트:
                  </Typography>
                </Box>

                <Box
                  onClick={() => {
                    localStorage.removeItem('storyViewed');
                    setShowStory(true);
                  }}
                  sx={{
                    bgcolor: '#FF5722',
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 12,
                    '&:hover': { bgcolor: '#E64A19' }
                  }}
                >
                  📖 오프닝 스토리 보기
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
}
