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
      case 'farming':
        return '#4CAF50';
      case 'technology':
        return '#2196F3';
      case 'environment':
        return '#8BC34A';
      default:
        return '#4CAF50';
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
          background: 'rgba(20, 15, 10, 0.95)',
          border: '2px solid #FFD700',
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,215,0,0.2)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle 
        sx={{ 
          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}CC 100%)`,
          color: 'white',
          py: isLandscape ? 1 : 2,
          px: isLandscape ? 2 : 3,
          borderBottom: '1px solid rgba(255, 215, 0, 0.3)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant={isLandscape ? 'h6' : 'h5'} component="span">
            🌱
          </Typography>
          <Typography 
            variant={isLandscape ? 'h6' : 'h5'}
            component="span"
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Level {content.level} Achievement!
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
              color: '#FFD700',
              fontWeight: 'bold',
              mb: isLandscape ? 1.5 : 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            {content.title}
          </Typography>
          
          {/* Image */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3 / 2', // 600x400 비율
              maxHeight: isLandscape ? 150 : 'none',
              mb: isLandscape ? 1.5 : 3,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,215,0,0.2)'
            }}
          >
            <Image
              src={content.image}
              alt={content.title}
              fill
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                // Fallback if image not found
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
              color: 'rgba(255,255,255,0.9)'
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
              bgcolor: 'rgba(255,215,0,0.15)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: 1
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#FFD700',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {content.category}
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
            bgcolor: '#FFD700',
            color: '#000',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#FFC700',
              transform: 'scale(1.05)'
            },
            px: isLandscape ? 3 : 4,
            py: isLandscape ? 1 : 1.5,
            transition: 'all 0.2s'
          }}
        >
          Got it! 🎓
        </Button>
      </DialogActions>
    </Dialog>
  );
}
