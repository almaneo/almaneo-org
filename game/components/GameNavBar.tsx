'use client';

import { Box, Typography, Badge } from '@mui/material';

interface NavTab {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

interface GameNavBarProps {
  activeTab?: string;
  onHomeClick?: () => void;
  onTravelClick?: () => void;
  onQuestClick?: () => void;
  onUpgradeClick?: () => void;
  onMoreClick?: () => void;
  questBadge?: number;
}

export default function GameNavBar({
  activeTab,
  onHomeClick,
  onTravelClick,
  onQuestClick,
  onUpgradeClick,
  onMoreClick,
  questBadge,
}: GameNavBarProps) {
  const tabs: NavTab[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'travel', label: 'Travel', icon: '🌍' },
    { id: 'quest', label: 'Quest', icon: '📋', badge: questBadge },
    { id: 'upgrade', label: 'Upgrade', icon: '⬆️' },
    { id: 'more', label: 'More', icon: '☰' },
  ];

  const handlers: Record<string, (() => void) | undefined> = {
    home: onHomeClick,
    travel: onTravelClick,
    quest: onQuestClick,
    upgrade: onUpgradeClick,
    more: onMoreClick,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        px: 0.5,
        py: 0.5,
        pb: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(to top, rgba(10,15,26,0.95), rgba(10,15,26,0.8))',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Box
            key={tab.id}
            onClick={handlers[tab.id]}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.2,
              cursor: 'pointer',
              userSelect: 'none',
              flex: 1,
              py: 0.5,
              borderRadius: 1,
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              bgcolor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              '&:active': {
                transform: 'scale(0.92)',
              },
            }}
          >
            <Badge
              badgeContent={tab.badge}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: 10,
                  fontWeight: 'bold',
                  minWidth: 18,
                  height: 18,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 22,
                  lineHeight: 1,
                  filter: isActive
                    ? 'drop-shadow(0 0 6px rgba(255,215,0,0.6))'
                    : 'none',
                }}
              >
                {tab.icon}
              </Typography>
            </Badge>
            <Typography
              sx={{
                color: isActive ? '#FFD700' : 'rgba(255,255,255,0.5)',
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                fontFamily: "'Exo 2', sans-serif",
                letterSpacing: 0.3,
                lineHeight: 1,
              }}
            >
              {tab.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
