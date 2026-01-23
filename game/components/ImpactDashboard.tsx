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
  calculateEnvironmentalImpact,
  formatCO2,
  formatTrees,
  formatTemperature 
} from '@/lib/environmentalImpact';

// ============================================================================
// Component
// ============================================================================

export default function ImpactDashboard() {
  // Landscape 모드 감지
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  
  const totalPoints = useGameStore((state) => state.totalPoints);
  const impact = calculateEnvironmentalImpact(totalPoints);
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: isLandscape ? 2 : 3, textAlign: 'center' }}>
        <Typography 
          variant={isLandscape ? 'h6' : 'h5'} 
          gutterBottom 
          sx={{ 
            color: '#FFD700',
            fontWeight: 'bold',
            mb: 1,
            fontSize: isLandscape ? 20 : undefined,
          }}
        >
          🌍 Your Environmental Impact
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Track the positive change you're making for our planet
        </Typography>
      </Box>
      
      {/* CO2 Reduction Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          sx={{ 
            mb: isLandscape ? 1.5 : 2, 
            bgcolor: 'rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 2
          }}
        >
          <CardContent sx={{ p: isLandscape ? 2 : 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ fontSize: isLandscape ? 32 : 40, mr: 2 }}
              >
                ☁️
              </Typography>
              <Box>
                <Typography 
                  variant={isLandscape ? 'caption' : 'subtitle1'} 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    mb: 0.5,
                    fontSize: isLandscape ? 12 : undefined,
                  }}
                >
                  CO2 Reduction
                </Typography>
                <Typography 
                  variant={isLandscape ? 'h5' : 'h4'} 
                  sx={{ 
                    color: '#4CAF50',
                    fontWeight: 'bold',
                    fontSize: isLandscape ? 24 : undefined,
                  }}
                >
                  {formatCO2(impact.co2Tons)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Carbon dioxide reduced through sustainable farming practices
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tree Equivalent Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card 
          sx={{ 
            mb: isLandscape ? 1.5 : 2, 
            bgcolor: 'rgba(139, 195, 74, 0.15)',
            border: '1px solid rgba(139, 195, 74, 0.3)',
            borderRadius: 2
          }}
        >
          <CardContent sx={{ p: isLandscape ? 2 : 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ fontSize: isLandscape ? 32 : 40, mr: 2 }}
              >
                🌳
              </Typography>
              <Box>
                <Typography 
                  variant={isLandscape ? 'caption' : 'subtitle1'} 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    mb: 0.5,
                    fontSize: isLandscape ? 12 : undefined,
                  }}
                >
                  Tree Equivalent
                </Typography>
                <Typography 
                  variant={isLandscape ? 'h5' : 'h4'} 
                  sx={{ 
                    color: '#8BC34A',
                    fontWeight: 'bold',
                    fontSize: isLandscape ? 24 : undefined,
                  }}
                >
                  {formatTrees(impact.treeEquivalent)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Equal to planting this many trees for one year
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Global Temperature Impact Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card 
          sx={{ 
            mb: isLandscape ? 1.5 : 2,
            bgcolor: 'rgba(3, 169, 244, 0.15)',
            border: '1px solid rgba(3, 169, 244, 0.3)',
            borderRadius: 2
          }}
        >
          <CardContent sx={{ p: isLandscape ? 2 : 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ fontSize: isLandscape ? 32 : 40, mr: 2 }}
              >
                🌡️
              </Typography>
              <Box>
                <Typography 
                  variant={isLandscape ? 'caption' : 'subtitle1'} 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    mb: 0.5,
                    fontSize: isLandscape ? 12 : undefined,
                  }}
                >
                  Global Temperature
                </Typography>
                <Typography 
                  variant={isLandscape ? 'h5' : 'h4'} 
                  sx={{ 
                    color: '#03A9F4',
                    fontWeight: 'bold',
                    fontSize: isLandscape ? 24 : undefined,
                  }}
                >
                  -{formatTemperature(impact.temperatureImpact)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Your contribution to cooling the planet
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Info Message */}
      <Box 
        sx={{ 
          mt: isLandscape ? 2 : 3, 
          p: isLandscape ? 1.5 : 2, 
          bgcolor: 'rgba(255, 193, 7, 0.15)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" sx={{ color: '#FFD700' }}>
          💡 Every 10,000 points = 1 ton CO2 reduced = 50 trees planted
        </Typography>
      </Box>
    </Box>
  );
}
