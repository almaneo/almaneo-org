'use client';

import { Box } from '@mui/material';
import Image from 'next/image';
import GameIconButton from './GameIconButton';
import { useIsMobile } from '@/hooks/useIsMobile';

interface GameNavBarProps {
  activeTab?: string;
  onUpgradeClick?: () => void;
  onQuestClick?: () => void;
  onAchievementClick?: () => void;
  onLeaderboardClick?: () => void;
  onShopClick?: () => void;
  onImpactClick?: () => void;
  onTokenClick?: () => void;
  questBadge?: number;
  achievementBadge?: number;
}

export default function GameNavBar({
  activeTab,
  onUpgradeClick,
  onQuestClick,
  onAchievementClick,
  onLeaderboardClick,
  onShopClick,
  onImpactClick,
  onTokenClick,
  questBadge,
  achievementBadge,
}: GameNavBarProps) {
  const isMobile = useIsMobile();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        px: isMobile ? 0.5 : 2,
        py: isMobile ? 0.5 : 2,
        pb: isMobile ? 1 : 3,
      }}
    >
      <GameIconButton
        icon={
          <Image
            src="/images/icons/nav-upgrade.png"
            alt="Upgrade"
            width={72}
            height={72}
          />
        }
        label="Upgrade"
        onClick={onUpgradeClick}
        active={activeTab === 'upgrade'}
      />

      <GameIconButton
        icon={
          <Image
            src="/images/icons/nav-quest.png"
            alt="Quest"
            width={72}
            height={72}
          />
        }
        label="Quest"
        onClick={onQuestClick}
        badge={questBadge}
        active={activeTab === 'quest'}
      />

      <GameIconButton
        icon={
          <Image
            src="/images/icons/nav-achievement.png"
            alt="Achievement"
            width={72}
            height={72}
          />
        }
        label="Achievement"
        onClick={onAchievementClick}
        badge={achievementBadge}
        active={activeTab === 'achievement'}
      />

      <GameIconButton
        icon={
          <Image
            src="/images/icons/nav-leaderboard.png"
            alt="Leaderboard"
            width={72}
            height={72}
          />
        }
        label="Ranking"
        onClick={onLeaderboardClick}
        active={activeTab === 'leaderboard'}
      />

      <GameIconButton
        icon={
          <Image
            src="/images/icons/mimig-token.png"
            alt="Token"
            width={72}
            height={72}
          />
        }
        label="Token"
        onClick={onTokenClick}
        active={activeTab === 'token'}
      />

      <GameIconButton
        icon={
          <Image
            src="/images/icons/nav-impact.png"
            alt="Impact"
            width={72}
            height={72}
          />
        }
        label="Impact"
        onClick={onImpactClick}
        active={activeTab === 'impact'}
      />
    </Box>
  );
}
