'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { Country, StarRating } from '@/lib/worldTravel/types';

interface CountryNodeProps {
  country: Country;
  stars: StarRating;
  visited: boolean;
  locked: boolean;
  onClick: () => void;
}

function StarDisplay({ stars, total = 3 }: { stars: number; total?: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.25 }}>
      {Array.from({ length: total }).map((_, i) => (
        <Typography
          key={i}
          sx={{
            fontSize: 10,
            color: i < stars ? '#FFD700' : 'rgba(255,255,255,0.2)',
          }}
        >
          ★
        </Typography>
      ))}
    </Box>
  );
}

export default function CountryNode({
  country,
  stars,
  visited,
  locked,
  onClick,
}: CountryNodeProps) {
  return (
    <motion.div
      whileHover={locked ? undefined : { scale: 1.05, y: -2 }}
      whileTap={locked ? undefined : { scale: 0.95 }}
    >
      <Box
        onClick={locked ? undefined : onClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          p: 1,
          borderRadius: 2,
          cursor: locked ? 'default' : 'pointer',
          opacity: locked ? 0.4 : 1,
          background: visited
            ? 'rgba(255,215,0,0.08)'
            : 'rgba(255,255,255,0.03)',
          border: visited
            ? '1px solid rgba(255,215,0,0.2)'
            : '1px solid rgba(255,255,255,0.06)',
          transition: 'all 0.2s ease',
          minWidth: 72,
          '&:hover': locked
            ? {}
            : {
                background: 'rgba(255,215,0,0.12)',
                borderColor: 'rgba(255,215,0,0.3)',
              },
        }}
      >
        <Typography sx={{ fontSize: 28, lineHeight: 1 }}>
          {locked ? '🔒' : country.flag}
        </Typography>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: visited ? '#FFD700' : '#fff',
            textAlign: 'center',
            lineHeight: 1.2,
            fontFamily: "'Exo 2', sans-serif",
          }}
        >
          {locked ? '???' : country.name}
        </Typography>
        {!locked && <StarDisplay stars={stars} />}
      </Box>
    </motion.div>
  );
}
