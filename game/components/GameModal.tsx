'use client';

import React, { ReactNode } from 'react';
import { Box, Modal, IconButton, Typography, Fade, Backdrop, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

interface GameModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  maxWidth?: number;
}

export default function GameModal({
  open,
  onClose,
  title,
  icon,
  children,
  maxWidth = 600,
}: GameModalProps) {
  const theme = useTheme();
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={open} timeout={500}>
        <Box
          sx={{
            position: 'relative',
            width: { xs: '95%', sm: '90%' },
            maxWidth: maxWidth,
            maxHeight: isLandscape ? '95vh' : { xs: '90vh', sm: '85vh' },
            background: 'rgba(20, 15, 10, 0.95)',
            border: '2px solid #FFD700',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,215,0,0.2)',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: isLandscape ? 1 : { xs: 2, sm: 2.5 },
              borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
              background: 'linear-gradient(180deg, rgba(255,215,0,0.1) 0%, transparent 100%)',
            }}
          >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isLandscape ? 1 : 1.5 }}>
            {icon && (
              <Box sx={{ fontSize: isLandscape ? 20 : 28, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                {icon}
              </Box>
            )}
            <Typography
              variant={isLandscape ? 'h6' : 'h5'}
              sx={{
                color: '#FFD700',
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,215,0,0.3)',
                letterSpacing: 1,
              }}
            >
              {title}
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            size={isLandscape ? 'small' : 'medium'}
            sx={{
              color: '#FFD700',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                transform: 'rotate(90deg)',
                color: '#FFF',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CloseIcon fontSize={isLandscape ? 'small' : 'medium'} />
          </IconButton>
        </Box>
        </motion.div>

        {/* 내용 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{ flex: 1, overflow: 'auto' }}
        >
          <Box
          sx={{
            p: isLandscape ? 1.5 : { xs: 2, sm: 3 },
            color: '#FFF',
            '&::-webkit-scrollbar': {
              width: isLandscape ? 4 : 8,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,215,0,0.3)',
              borderRadius: 4,
              '&:hover': {
                background: 'rgba(255,215,0,0.5)',
              },
            },
          }}
        >
          {children}
        </Box>
        </motion.div>
      </Box>
      </Fade>
    </Modal>
  );
}
