'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useWeb3Auth } from '@/contexts/Web3AuthProvider';
import { submitAppeal } from '@/lib/appealService';

interface AppealButtonProps {
  contentType: 'region' | 'country' | 'quest';
  contentId: string;
  language?: string;
  fieldPath: string;
  currentValue?: string;
  /** Compact mode for inline placement (e.g., quest completion screen) */
  compact?: boolean;
}

export default function AppealButton({
  contentType,
  contentId,
  language = 'en',
  fieldPath,
  currentValue,
  compact = false,
}: AppealButtonProps) {
  const { address } = useWeb3Auth();
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [open, setOpen] = useState(false);
  const [suggestedValue, setSuggestedValue] = useState('');
  const [reason, setReason] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async () => {
    if (!address || !suggestedValue.trim() || !reason.trim()) return;

    setSubmitting(true);
    setResult(null);

    try {
      const { success, error } = await submitAppeal({
        user_address: address,
        content_type: contentType,
        content_id: contentId,
        language,
        field_path: fieldPath,
        current_value: currentValue || '',
        suggested_value: suggestedValue.trim(),
        reason: reason.trim(),
        source_url: sourceUrl.trim() || undefined,
      });

      if (success) {
        setResult({ success: true, message: 'Appeal submitted! You will be rewarded if approved.' });
        setSuggestedValue('');
        setReason('');
        setSourceUrl('');
      } else {
        setResult({ success: false, message: error || 'Failed to submit appeal' });
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!address) return null;

  return (
    <>
      {/* Trigger Button */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          px: compact ? 1 : 1.5,
          py: compact ? 0.5 : 0.75,
          borderRadius: 1.5,
          cursor: 'pointer',
          bgcolor: 'rgba(255,152,0,0.1)',
          border: '1px solid rgba(255,152,0,0.2)',
          transition: 'all 0.15s ease',
          '&:hover': {
            bgcolor: 'rgba(255,152,0,0.2)',
            border: '1px solid rgba(255,152,0,0.4)',
          },
        }}
      >
        <ReportProblemOutlinedIcon sx={{ fontSize: compact ? 14 : 16, color: '#FF9800' }} />
        <Typography sx={{ fontSize: compact ? 11 : 12, color: '#FF9800', fontWeight: 600 }}>
          Report Error
        </Typography>
      </Box>

      {/* Appeal Modal */}
      <Dialog
        open={open}
        onClose={() => {
          if (!submitting) {
            setOpen(false);
            setResult(null);
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0A0F1A',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            mx: isMobile ? 1 : 3,
          },
        }}
      >
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ReportProblemOutlinedIcon sx={{ color: '#FF9800', fontSize: 22 }} />
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
              Report Incorrect Information
            </Typography>
          </Box>

          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, mb: 2 }}>
            Help improve our cultural content! If approved, you will earn{' '}
            <b style={{ color: '#FFD700' }}>+30 Kindness Score</b> and{' '}
            <b style={{ color: '#FFD700' }}>+200 Game Points</b>.
          </Typography>

          {/* Current Value */}
          {currentValue && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, mb: 0.5, textTransform: 'uppercase' }}>
                Current Value
              </Typography>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                  {currentValue}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Suggested Correction */}
          <TextField
            fullWidth
            label="Suggested Correction"
            value={suggestedValue}
            onChange={e => setSuggestedValue(e.target.value)}
            multiline
            rows={2}
            disabled={submitting}
            sx={{ mb: 2, ...textFieldSx }}
          />

          {/* Reason */}
          <TextField
            fullWidth
            label="Reason for correction"
            value={reason}
            onChange={e => setReason(e.target.value)}
            multiline
            rows={2}
            disabled={submitting}
            sx={{ mb: 2, ...textFieldSx }}
          />

          {/* Source URL (Optional) */}
          <TextField
            fullWidth
            label="Source URL (optional)"
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            disabled={submitting}
            placeholder="https://..."
            sx={{ mb: 2, ...textFieldSx }}
          />

          {/* Result Message */}
          {result && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                mb: 2,
                bgcolor: result.success ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                border: `1px solid ${result.success ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'}`,
              }}
            >
              <Typography sx={{ color: result.success ? '#4CAF50' : '#f44336', fontSize: 13 }}>
                {result.message}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box
              onClick={() => {
                if (!submitting) {
                  setOpen(false);
                  setResult(null);
                }
              }}
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 1.5,
                textAlign: 'center',
                cursor: submitting ? 'default' : 'pointer',
                bgcolor: 'rgba(255,255,255,0.08)',
                '&:hover': submitting ? {} : { bgcolor: 'rgba(255,255,255,0.12)' },
              }}
            >
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13 }}>
                Cancel
              </Typography>
            </Box>

            <Box
              onClick={handleSubmit}
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 1.5,
                textAlign: 'center',
                cursor: submitting || !suggestedValue.trim() || !reason.trim() ? 'default' : 'pointer',
                background: submitting || !suggestedValue.trim() || !reason.trim()
                  ? 'rgba(255,152,0,0.3)'
                  : '#FF9800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                '&:hover': submitting || !suggestedValue.trim() || !reason.trim()
                  ? {}
                  : { background: '#e68900' },
              }}
            >
              {submitting && <CircularProgress size={16} sx={{ color: '#fff' }} />}
              <Typography
                sx={{
                  color: submitting || !suggestedValue.trim() || !reason.trim()
                    ? 'rgba(255,255,255,0.5)'
                    : '#0A0F1A',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Appeal'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Shared text field dark theme styles
const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    fontSize: 13,
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#FF9800' },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    '&.Mui-focused': { color: '#FF9800' },
  },
};
