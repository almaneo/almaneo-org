'use client';

import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import type { Region } from '@/lib/worldTravel/types';
import type { Country, StarRating, RegionProgress } from '@/lib/worldTravel/types';
import CountryNode from './CountryNode';

interface RegionCardProps {
  region: Region;
  countries: Country[];
  progress: RegionProgress;
  countryStars: Record<string, StarRating>;
  visitedCountries: Set<string>;
  onCountrySelect: (countryId: string) => void;
  index: number;
}

export default function RegionCard({
  region,
  countries,
  progress,
  countryStars,
  visitedCountries,
  onCountrySelect,
  index,
}: RegionCardProps) {
  const isLocked = !progress.unlocked;
  const maxStars = countries.length * 3;
  const currentStars = progress.totalStars;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Box
        sx={{
          background: isLocked
            ? 'rgba(30,30,40,0.6)'
            : 'rgba(20,15,10,0.85)',
          border: isLocked
            ? '1px solid rgba(255,255,255,0.06)'
            : `1px solid ${region.color}33`,
          borderRadius: 3,
          overflow: 'hidden',
          mb: 1.5,
        }}
      >
        {/* Region Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            background: isLocked
              ? 'rgba(255,255,255,0.02)'
              : `linear-gradient(135deg, ${region.color}18 0%, transparent 100%)`,
            borderBottom: `1px solid ${isLocked ? 'rgba(255,255,255,0.05)' : region.color + '22'}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 24 }}>
              {isLocked ? '🔒' : region.emoji}
            </Typography>
            <Box>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isLocked ? 'rgba(255,255,255,0.3)' : '#fff',
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: 0.5,
                }}
              >
                {region.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  color: isLocked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                }}
              >
                {isLocked
                  ? `${region.unlockRequirement}★ to unlock`
                  : `${countries.length} countries`}
              </Typography>
            </Box>
          </Box>

          {!isLocked && (
            <Chip
              label={`${currentStars}/${maxStars} ★`}
              size="small"
              sx={{
                bgcolor: currentStars === maxStars
                  ? 'rgba(255,215,0,0.2)'
                  : 'rgba(255,255,255,0.08)',
                color: currentStars === maxStars ? '#FFD700' : 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                fontSize: 12,
                border: currentStars === maxStars
                  ? '1px solid rgba(255,215,0,0.3)'
                  : '1px solid rgba(255,255,255,0.1)',
              }}
            />
          )}
        </Box>

        {/* Countries Grid */}
        {!isLocked && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              p: 1.5,
              justifyContent: 'flex-start',
            }}
          >
            {countries.map(country => (
              <CountryNode
                key={country.id}
                country={country}
                stars={(countryStars[country.id] || 0) as StarRating}
                visited={visitedCountries.has(country.id)}
                locked={false}
                onClick={() => onCountrySelect(country.id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
