'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Chip, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useWeb3Auth } from '@/contexts/Web3AuthProvider';
import { getUserAppeals, type Appeal } from '@/lib/appealService';

interface AppealHistoryProps {
  onClose: () => void;
}

export default function AppealHistory({ onClose }: AppealHistoryProps) {
  const { address } = useWeb3Auth();
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppeals = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);

    try {
      const { appeals: data, error: fetchError } = await getUserAppeals(address);
      if (fetchError) {
        setError(fetchError);
      } else {
        setAppeals(data);
      }
    } catch {
      setError('Failed to load appeals');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchAppeals();
  }, [fetchAppeals]);

  const statusConfig = {
    pending: { label: 'Pending', color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
    approved: { label: 'Approved', color: '#4CAF50', bg: 'rgba(76,175,80,0.12)' },
    rejected: { label: 'Rejected', color: '#f44336', bg: 'rgba(244,67,54,0.12)' },
  };

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
          gap: 1,
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
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { color: '#fff' },
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </Box>
        <Typography
          sx={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            fontSize: isMobile ? 14 : 16,
            color: '#fff',
          }}
        >
          My Appeals
        </Typography>
        <Chip
          label={appeals.length}
          size="small"
          sx={{
            bgcolor: 'rgba(255,152,0,0.15)',
            color: '#FF9800',
            fontWeight: 700,
            fontSize: 12,
            height: 22,
          }}
        />
      </Box>

      {/* Stats Bar */}
      {appeals.length > 0 && (
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
          <StatItem label="Pending" value={appeals.filter(a => a.status === 'pending').length} color="#FF9800" />
          <StatItem label="Approved" value={appeals.filter(a => a.status === 'approved').length} color="#4CAF50" />
          <StatItem label="Rejected" value={appeals.filter(a => a.status === 'rejected').length} color="#f44336" />
          <StatItem
            label="Points Earned"
            value={appeals.reduce((sum, a) => sum + (a.game_points_rewarded || 0), 0)}
            color="#FFD700"
          />
        </Box>
      )}

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 2,
          py: 1.5,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.15)', borderRadius: 4 },
        }}
      >
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <CircularProgress size={28} sx={{ color: '#FF9800' }} />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', pt: 4 }}>
            <Typography sx={{ color: '#f44336', fontSize: 13 }}>{error}</Typography>
            <Box
              onClick={fetchAppeals}
              sx={{
                mt: 1,
                px: 2,
                py: 0.75,
                display: 'inline-block',
                borderRadius: 1,
                cursor: 'pointer',
                bgcolor: 'rgba(255,255,255,0.08)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
              }}
            >
              <Typography sx={{ color: '#fff', fontSize: 12 }}>Retry</Typography>
            </Box>
          </Box>
        )}

        {!loading && !error && appeals.length === 0 && (
          <Box sx={{ textAlign: 'center', pt: 4 }}>
            <Typography sx={{ fontSize: 32, mb: 1 }}>📝</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              No appeals yet
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, mt: 0.5 }}>
              Report incorrect information in quests to earn rewards
            </Typography>
          </Box>
        )}

        {!loading &&
          !error &&
          appeals.map(appeal => {
            const cfg = statusConfig[appeal.status];
            return (
              <Box
                key={appeal.id}
                sx={{
                  mb: 1.5,
                  p: isMobile ? 1.5 : 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Top row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                      {appeal.content_type}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>•</Typography>
                    <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                      {appeal.content_id}
                    </Typography>
                  </Box>
                  <Chip
                    label={cfg.label}
                    size="small"
                    sx={{
                      bgcolor: cfg.bg,
                      color: cfg.color,
                      fontWeight: 600,
                      fontSize: 10,
                      height: 20,
                    }}
                  />
                </Box>

                {/* Field */}
                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', mb: 0.5 }}>
                  Field: {appeal.field_path}
                </Typography>

                {/* Suggested value */}
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'rgba(255,255,255,0.04)',
                    mb: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    {appeal.suggested_value}
                  </Typography>
                </Box>

                {/* Reason */}
                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', mb: 1 }}>
                  Reason: {appeal.reason}
                </Typography>

                {/* Bottom row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                    {new Date(appeal.created_at).toLocaleDateString()}
                  </Typography>

                  {appeal.status === 'approved' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {appeal.kindness_points_rewarded && (
                        <Typography sx={{ fontSize: 11, color: '#4CAF50', fontWeight: 600 }}>
                          +{appeal.kindness_points_rewarded} Kindness
                        </Typography>
                      )}
                      {appeal.game_points_rewarded && (
                        <Typography sx={{ fontSize: 11, color: '#FFD700', fontWeight: 600 }}>
                          +{appeal.game_points_rewarded} Points
                        </Typography>
                      )}
                    </Box>
                  )}

                  {appeal.status === 'rejected' && appeal.reviewer_note && (
                    <Typography sx={{ fontSize: 11, color: 'rgba(244,67,54,0.7)', fontStyle: 'italic' }}>
                      {appeal.reviewer_note}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color, fontFamily: "'Orbitron', sans-serif" }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
}
