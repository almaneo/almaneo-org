'use client';

import { Popover, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface InfoPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function InfoPopover({
  open,
  anchorEl,
  onClose,
  title,
  icon,
  children,
}: InfoPopoverProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            border: '2px solid rgba(255, 215, 0, 0.5)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            minWidth: 200,
            mt: 1,
          },
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* 제목 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5,
            pb: 1,
            borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          {icon && <Box sx={{ fontSize: 20 }}>{icon}</Box>}
          <Typography
            variant="h6"
            sx={{
              color: '#FFD700',
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* 내용 */}
        {children}
      </Box>
    </Popover>
  );
}
