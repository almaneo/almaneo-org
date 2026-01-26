'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { Country } from '@/lib/worldTravel/types';

interface CultureCardProps {
  country: Country;
}

export default function CultureCard({ country }: CultureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
          p: 2,
          mb: 2,
        }}
      >
        {/* Country Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Typography sx={{ fontSize: 40, lineHeight: 1 }}>{country.flag}</Typography>
          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: '#fff',
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              {country.name}
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {country.localName}
            </Typography>
          </Box>
        </Box>

        {/* Greeting */}
        <Box
          sx={{
            display: 'inline-block',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.2)',
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              color: '#FFD700',
              fontWeight: 600,
              fontStyle: 'italic',
            }}
          >
            &ldquo;{country.greeting}&rdquo;
          </Typography>
        </Box>

        {/* Cultural Value */}
        <Typography
          sx={{
            fontSize: 13,
            color: '#FF6B00',
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          🌟 {country.culturalValue}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.5,
          }}
        >
          {country.description}
        </Typography>
      </Box>
    </motion.div>
  );
}
