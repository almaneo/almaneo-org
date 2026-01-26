'use client';

import { Box, Typography, Drawer, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MoreMenuItem {
  id: string;
  icon: string;
  label: string;
  sublabel?: string;
  onClick?: () => void;
}

interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
  onAchievementClick?: () => void;
  onLeaderboardClick?: () => void;
  onTokenClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onStoryClick?: () => void;
  achievementBadge?: number;
}

export default function MoreMenu({
  open,
  onClose,
  onAchievementClick,
  onLeaderboardClick,
  onTokenClick,
  onProfileClick,
  onSettingsClick,
  onStoryClick,
  achievementBadge,
}: MoreMenuProps) {
  const mainItems: MoreMenuItem[] = [
    { id: 'achievement', icon: '🏆', label: 'Achievement', onClick: onAchievementClick },
    { id: 'ranking', icon: '📊', label: 'Ranking', onClick: onLeaderboardClick },
    { id: 'token', icon: '🪙', label: 'Token Mining', onClick: onTokenClick },
  ];

  const secondaryItems: MoreMenuItem[] = [
    { id: 'profile', icon: '👤', label: 'Profile', sublabel: 'Coming Soon', onClick: onProfileClick },
    { id: 'settings', icon: '⚙️', label: 'Settings', sublabel: 'Coming Soon', onClick: onSettingsClick },
    { id: 'story', icon: '📖', label: 'Story', sublabel: 'Replay', onClick: onStoryClick },
  ];

  const handleItemClick = (item: MoreMenuItem) => {
    if (item.onClick) {
      item.onClick();
      onClose();
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(10,15,26,0.98)',
          backdropFilter: 'blur(20px)',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          maxHeight: '60vh',
          pb: 'env(safe-area-inset-bottom, 0px)',
        },
      }}
    >
      {/* Handle bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          pt: 1.5,
          pb: 1,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.2)',
          }}
        />
      </Box>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          pb: 1.5,
        }}
      >
        <Typography
          sx={{
            color: 'white',
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          More
        </Typography>
        <Box
          onClick={onClose}
          sx={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.08)',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>

      {/* Main Items */}
      <Box sx={{ px: 1.5 }}>
        {mainItems.map((item) => (
          <Box
            key={item.id}
            onClick={() => handleItemClick(item)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.5,
              borderRadius: 1.5,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              '&:active': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'scale(0.98)' },
            }}
          >
            <Typography sx={{ fontSize: 24, lineHeight: 1 }}>{item.icon}</Typography>
            <Typography
              sx={{
                color: 'white',
                fontSize: 15,
                fontWeight: 500,
                flex: 1,
              }}
            >
              {item.label}
            </Typography>
            {item.id === 'achievement' && achievementBadge && achievementBadge > 0 && (
              <Box
                sx={{
                  bgcolor: '#f44336',
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 'bold',
                  minWidth: 20,
                  height: 20,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 0.5,
                }}
              >
                {achievementBadge}
              </Box>
            )}
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 1, mx: 2.5, borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Secondary Items */}
      <Box sx={{ px: 1.5, pb: 2 }}>
        {secondaryItems.map((item) => (
          <Box
            key={item.id}
            onClick={() => handleItemClick(item)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.5,
              borderRadius: 1.5,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              '&:active': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'scale(0.98)' },
            }}
          >
            <Typography sx={{ fontSize: 24, lineHeight: 1 }}>{item.icon}</Typography>
            <Typography
              sx={{
                color: 'white',
                fontSize: 15,
                fontWeight: 500,
                flex: 1,
              }}
            >
              {item.label}
            </Typography>
            {item.sublabel && (
              <Typography
                sx={{
                  color: item.sublabel === 'Coming Soon'
                    ? 'rgba(255,255,255,0.3)'
                    : '#4CAF50',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {item.sublabel}
              </Typography>
            )}
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</Typography>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}
