'use client';

import { Box, Typography, Drawer, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface MoreMenuItem {
  id: string;
  icon: string;
  labelKey: string;
  sublabelKey?: string;
  comingSoon?: boolean;
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
  onAppealsClick?: () => void;
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
  onAppealsClick,
  achievementBadge,
}: MoreMenuProps) {
  const { t, i18n } = useTranslation('game');

  const currentLang = i18n.language?.startsWith('ko') ? 'ko' : 'en';
  const toggleLanguage = () => {
    const newLang = currentLang === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  const mainItems: MoreMenuItem[] = [
    { id: 'achievement', icon: '🏆', labelKey: 'moreMenu.achievement', onClick: onAchievementClick },
    { id: 'ranking', icon: '📊', labelKey: 'moreMenu.ranking', onClick: onLeaderboardClick },
    { id: 'token', icon: '⛏️', labelKey: 'moreMenu.tokenMining', onClick: onTokenClick },
    { id: 'appeals', icon: '📝', labelKey: 'moreMenu.myAppeals', onClick: onAppealsClick },
  ];

  const secondaryItems: MoreMenuItem[] = [
    { id: 'profile', icon: '👤', labelKey: 'moreMenu.profile', sublabelKey: 'moreMenu.comingSoon', comingSoon: true, onClick: onProfileClick },
    { id: 'settings', icon: '⚙️', labelKey: 'moreMenu.settings', sublabelKey: 'moreMenu.comingSoon', comingSoon: true, onClick: onSettingsClick },
    { id: 'story', icon: '📖', labelKey: 'moreMenu.story', sublabelKey: 'moreMenu.replay', onClick: onStoryClick },
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
          {t('moreMenu.title')}
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
              {t(item.labelKey)}
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

      {/* Language Toggle */}
      <Box sx={{ px: 1.5 }}>
        <Box
          onClick={toggleLanguage}
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
          <Typography sx={{ fontSize: 24, lineHeight: 1 }}>🌐</Typography>
          <Typography
            sx={{
              color: 'white',
              fontSize: 15,
              fontWeight: 500,
              flex: 1,
            }}
          >
            {t('common.language')}
          </Typography>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: 'rgba(0,82,255,0.15)',
              border: '1px solid rgba(0,82,255,0.3)',
            }}
          >
            <Typography sx={{ color: '#60a5fa', fontSize: 12, fontWeight: 600 }}>
              {currentLang === 'ko' ? '한국어' : 'English'}
            </Typography>
          </Box>
        </Box>
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
              {t(item.labelKey)}
            </Typography>
            {item.sublabelKey && (
              <Typography
                sx={{
                  color: item.comingSoon
                    ? 'rgba(255,255,255,0.3)'
                    : '#4CAF50',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {t(item.sublabelKey)}
              </Typography>
            )}
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</Typography>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}
