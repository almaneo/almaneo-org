/**
 * Environmental Impact Dashboard
 * 
 * Displays real-time environmental impact metrics
 * - CO2 Reduction
 * - Tree Equivalent
 * - Temperature Impact
 */

import { Box, Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useGameStore } from '@/hooks/useGameStore';
import {
  calculateKindnessImpact,
  calculateGAIIImprovement,
  calculateHumansEmpowered,
  calculateReconstructionQuality
} from '@/lib/kindnessImpact';

// ============================================================================
// Component
// ============================================================================

export default function ImpactDashboard() {
  // Landscape 모드 감지
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  const totalPoints = useGameStore((state) => state.totalPoints);

  // Kindness Impact calculations
  const gaiiImprovement = calculateGAIIImprovement(totalPoints);
  const humansHelped = calculateHumansEmpowered(totalPoints);
  const dataQuality = calculateReconstructionQuality(totalPoints);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: isLandscape ? 2 : 3, textAlign: 'center' }}>
        <Typography
          variant={isLandscape ? 'h6' : 'h5'}
          gutterBottom
          sx={{
            color: 'white',
            fontWeight: 900,
            mb: 1,
            fontSize: isLandscape ? 20 : undefined,
          }}
        >
          🌍 Global Impact Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'light' }}>
          Tracking your contribution to AI democratization and equality.
        </Typography>
      </Box>

      {/* GAII Improvement Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            mb: isLandscape ? 1.5 : 2,
            bgcolor: 'rgba(0, 82, 255, 0.05)',
            border: '1px solid rgba(0, 82, 255, 0.2)',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: isLandscape ? 2 : 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="h3"
                sx={{ fontSize: isLandscape ? 32 : 40, mr: 2 }}
              >
                📊
              </Typography>
              <Box>
                <Typography
                  variant={isLandscape ? 'caption' : 'subtitle1'}
                  sx={{
                    color: '#0052FF',
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    mb: 0.5,
                    fontSize: isLandscape ? 10 : 12,
                  }}
                >
                  GAII IMPROVEMENT
                </Typography>
                <Typography
                  variant={isLandscape ? 'h5' : 'h4'}
                  sx={{
                    color: 'white',
                    fontWeight: 900,
                    fontSize: isLandscape ? 24 : undefined,
                  }}
                >
                  +{gaiiImprovement.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
              Global AI Inequality Index reduction through your data contributions.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Humans Helped Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card
          sx={{
            mb: isLandscape ? 1.5 : 2,
            bgcolor: 'rgba(255, 107, 0, 0.05)',
            border: '1px solid rgba(255, 107, 0, 0.2)',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: isLandscape ? 2 : 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="h3"
                sx={{ fontSize: isLandscape ? 32 : 40, mr: 2 }}
              >
                👥
              </Typography>
              <Box>
                <Typography
                  variant={isLandscape ? 'caption' : 'subtitle1'}
                  sx={{
                    color: '#FF6B00',
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    mb: 0.5,
                    fontSize: isLandscape ? 10 : 12,
                  }}
                >
                  HUMANS EMPOWERED
                </Typography>
                <Typography
                  variant={isLandscape ? 'h5' : 'h4'}
                  sx={{
                    color: 'white',
                    fontWeight: 900,
                    fontSize: isLandscape ? 24 : undefined,
                  }}
                >
                  {humansHelped.toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
              Individuals supported with open AI resources worldwide.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Quality Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card
          sx={{
            mb: isLandscape ? 1.5 : 2,
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: isLandscape ? 2 : 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="h3"
                sx={{ fontSize: isLandscape ? 32 : 40, mr: 2 }}
              >
                🧠
              </Typography>
              <Box>
                <Typography
                  variant={isLandscape ? 'caption' : 'subtitle1'}
                  sx={{
                    color: 'rgba(255,255,255,0.3)',
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    mb: 0.5,
                    fontSize: isLandscape ? 10 : 12,
                  }}
                >
                  RECONSTRUCTION QUALITY
                </Typography>
                <Typography
                  variant={isLandscape ? 'h5' : 'h4'}
                  sx={{
                    color: 'white',
                    fontWeight: 900,
                    fontSize: isLandscape ? 24 : undefined,
                  }}
                >
                  {dataQuality.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
              AI model alignment with global human values and kindness.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Message */}
      <Box
        sx={{
          mt: isLandscape ? 2 : 3,
          p: 2,
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', letterSpacing: 1 }}>
          💡 10,000 pts = 1 mission accomplishment = 0.01% GAII global impact
        </Typography>
      </Box>
    </Box>
  );
}
