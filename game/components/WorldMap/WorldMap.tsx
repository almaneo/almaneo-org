'use client';

import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublicIcon from '@mui/icons-material/Public';
import { REGIONS } from '@/lib/worldTravel/regions';
import { ALL_COUNTRIES } from '@/lib/worldTravel/countries';
import { useTravelStore } from '@/hooks/useTravelStore';
import { getNextRegionToUnlock } from '@/lib/worldTravel/progression';
import { contentService } from '@/lib/contentService';
import type { StarRating } from '@/lib/worldTravel/types';
import RegionCard from './RegionCard';
import { useTranslation } from 'react-i18next';

interface WorldMapProps {
  onClose: () => void;
}

export default function WorldMap({ onClose }: WorldMapProps) {
  const { t } = useTranslation('game');
  const {
    regionProgress,
    countryProgress,
    totalStars,
    totalQuestsCompleted,
    countriesVisited,
    perfectCountries,
    startingRegion,
    selectCountry,
  } = useTravelStore();

  const nextUnlock = getNextRegionToUnlock(totalStars, startingRegion);

  // Use DB-loaded content when available, static fallback otherwise
  const activeCountries = contentService.isLoaded() ? contentService.getCountries() : ALL_COUNTRIES;
  const activeRegions = contentService.isLoaded() ? contentService.getRegions() : REGIONS;

  // Build country stars map
  const countryStars: Record<string, StarRating> = {};
  const visitedCountries = new Set<string>();
  for (const [cid, cp] of Object.entries(countryProgress)) {
    countryStars[cid] = cp.stars as StarRating;
    if (cp.firstVisitedAt) visitedCountries.add(cid);
  }

  // Sort regions: starting region first, then by unlock requirement
  const sortedRegions = [...activeRegions].sort((a, b) => {
    if (a.id === startingRegion) return -1;
    if (b.id === startingRegion) return 1;
    return a.unlockRequirement - b.unlockRequirement;
  });

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0A0F1A 0%, #111827 100%)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.3)',
          flexShrink: 0,
        }}
      >
        <Box
          onClick={onClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { color: '#fff' },
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{t('travel.back')}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PublicIcon sx={{ color: '#FFD700', fontSize: 20 }} />
          <Typography
            sx={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: '#fff',
            }}
          >
            {t('travel.title')}
          </Typography>
        </Box>

        <Chip
          label={`${totalStars} ★`}
          size="small"
          sx={{
            bgcolor: 'rgba(255,215,0,0.15)',
            color: '#FFD700',
            fontWeight: 700,
            fontSize: 13,
            border: '1px solid rgba(255,215,0,0.3)',
          }}
        />
      </Box>

      {/* Stats Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          px: 2,
          py: 1,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.15)',
          flexShrink: 0,
        }}
      >
        <StatItem label={t('travel.countries')} value={countriesVisited} />
        <StatItem label={t('travel.quests')} value={totalQuestsCompleted} />
        <StatItem label={t('travel.perfect')} value={perfectCountries} icon="⭐" />
      </Box>

      {/* Next Unlock Hint */}
      {nextUnlock && (
        <Box
          sx={{
            mx: 2,
            mt: 1.5,
            px: 2,
            py: 1,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${nextUnlock.region.color}15, transparent)`,
            border: `1px solid ${nextUnlock.region.color}22`,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'center',
            }}
          >
            {nextUnlock.region.emoji}{' '}
            {t('travel.nextUnlock', { region: nextUnlock.region.name, stars: nextUnlock.starsNeeded })}
          </Typography>
        </Box>
      )}

      {/* Region List */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 2,
          py: 1.5,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 4,
          },
        }}
      >
        {sortedRegions.map((region, index) => {
          const regionCountries = activeCountries.filter(c =>
            region.countries.includes(c.id)
          );
          const rp = regionProgress[region.id] || {
            regionId: region.id,
            unlocked: false,
            totalStars: 0,
          };

          return (
            <RegionCard
              key={region.id}
              region={region}
              countries={regionCountries}
              progress={rp}
              countryStars={countryStars}
              visitedCountries={visitedCountries}
              onCountrySelect={selectCountry}
              index={index}
            />
          );
        })}
      </Box>
    </Box>
  );
}

function StatItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: string;
}) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
          color: '#fff',
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        {icon && `${icon} `}
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
