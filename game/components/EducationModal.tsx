/**
 * Education Modal Component
 * 
 * Displays educational content when user reaches specific levels
 * Shows information about AWD, magnetic filters, and carbon credits
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { EducationContent } from '@/lib/educationContent';

// ============================================================================
// Types
// ============================================================================

interface EducationModalProps {
  open: boolean;
  onClose: () => void;
  content: EducationContent | null;
}

// ============================================================================
// Component
// ============================================================================

export default function EducationModal({
  open,
  onClose,
  content
}: EducationModalProps) {
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  if (!content) return null;

  // Category color mapping
  const getCategoryColor = (category: EducationContent['category']) => {
    switch (category) {
      case 'core':
        return '#0052FF';
      case 'ai':
        return '#FF6B00';
      case 'impact':
        return '#4CAF50';
      default:
        return '#0052FF';
    }
  };

  const categoryColor = getCategoryColor(content.category);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `2px solid ${categoryColor}`,
          borderRadius: 4,
          boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 20px ${categoryColor}33`,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}66 100%)`,
          color: 'white',
          py: isLandscape ? 1.5 : 2,
          px: isLandscape ? 2 : 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant={isLandscape ? 'h6' : 'h5'} component="span" sx={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}>
            🛰️
          </Typography>
          <Typography
            variant={isLandscape ? 'h6' : 'h5'}
            component="span"
            sx={{
              fontWeight: 900,
              letterSpacing: -0.5,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            MISSION INTEL: PHASE {content.level}
          </Typography>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: isLandscape ? 2 : 3, bgcolor: 'transparent' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <Typography
            variant={isLandscape ? 'h5' : 'h4'}
            gutterBottom
            sx={{
              color: 'white',
              fontWeight: 900,
              mb: isLandscape ? 1.5 : 2,
              letterSpacing: -1,
              textShadow: '0 0 20px rgba(255,255,255,0.3)'
            }}
          >
            {content.title}
          </Typography>

          {/* Image */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              maxHeight: isLandscape ? 150 : 'none',
              mb: isLandscape ? 1.5 : 3,
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'rgba(255,255,255,0.02)',
              border: `1px solid ${categoryColor}33`,
              boxShadow: `inset 0 0 20px ${categoryColor}22`
            }}
          >
            <Image
              src={content.image}
              alt={content.title}
              fill
              style={{ objectFit: 'contain', padding: '20px' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </Box>

          {/* Description */}
          <Typography
            variant={isLandscape ? 'body2' : 'body1'}
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: isLandscape ? 1.6 : 1.8,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 300,
            }}
          >
            {content.description}
          </Typography>

          {/* Category Badge */}
          <Box
            sx={{
              mt: isLandscape ? 1.5 : 3,
              display: 'inline-block',
              px: 2,
              py: 0.5,
              bgcolor: `${categoryColor}22`,
              border: `1px solid ${categoryColor}44`,
              borderRadius: 1
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: categoryColor,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              SOURCE: {content.category} DATASET
            </Typography>
          </Box>
        </motion.div>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: isLandscape ? 2 : 3, pt: 0, bgcolor: 'transparent' }}>
        <Button
          onClick={onClose}
          variant="contained"
          size={isLandscape ? 'medium' : 'large'}
          sx={{
            bgcolor: categoryColor,
            color: 'white',
            fontWeight: 900,
            letterSpacing: 1,
            '&:hover': {
              bgcolor: categoryColor,
              filter: 'brightness(1.2)',
              transform: 'translateY(-2px)'
            },
            px: isLandscape ? 3 : 4,
            py: isLandscape ? 1 : 1.5,
            transition: 'all 0.2s',
            boxShadow: `0 4px 14px 0 ${categoryColor}66`
          }}
        >
          CONFIRM INTEL
        </Button>
      </DialogActions>
    </Dialog>
  );
}
