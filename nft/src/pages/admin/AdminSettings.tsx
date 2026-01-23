import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Save,
  ContentCopy,
} from '@mui/icons-material';
import { useContracts } from '../../hooks/useContracts';
import { useWeb3 } from '../../contexts/Web3Context';
import { CONTRACTS } from '../../contracts/addresses';
import { getTxOptions } from '../../utils/gas';

const AdminSettings: React.FC = () => {
  const contracts = useContracts();
  const { address } = useWeb3();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [treasuryAddress, setTreasuryAddress] = useState('');
  const [newTreasury, setNewTreasury] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      if (!contracts) return;

      try {
        const treasury = await contracts.paymentManager.treasury();
        setTreasuryAddress(treasury);
        setNewTreasury(treasury);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, [contracts]);

  const handleUpdateTreasury = async () => {
    if (!contracts || !newTreasury) return;

    setLoading(true);
    setError(null);

    try {
      const tx = await contracts.paymentManager.setTreasury(newTreasury, getTxOptions('admin'));
      await tx.wait();
      setTreasuryAddress(newTreasury);
      setSuccess('Treasury address updated!');
    } catch (err: any) {
      setError(err.reason || err.message || 'Failed to update treasury');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Treasury Settings */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Treasury Settings
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Platform fees will be sent to this address
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Treasury Address"
            value={newTreasury}
            onChange={(e) => setNewTreasury(e.target.value)}
            placeholder="0x..."
          />
          <Button
            variant="contained"
            onClick={handleUpdateTreasury}
            disabled={loading || newTreasury === treasuryAddress}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          >
            Update
          </Button>
        </Box>

        {treasuryAddress && treasuryAddress !== newTreasury && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Current: {treasuryAddress}
          </Typography>
        )}
      </Paper>

      {/* Contract Addresses */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Contract Addresses (Amoy Testnet)
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(CONTRACTS).map(([name, addr]) => (
            <Box
              key={name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography fontWeight={600}>{name}</Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                >
                  {addr}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={() => copyToClipboard(addr)}
                >
                  Copy
                </Button>
                <Button
                  size="small"
                  href={`https://amoy.polygonscan.com/address/${addr}`}
                  target="_blank"
                >
                  View
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Admin Info */}
      <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Admin Information
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Connected Wallet
            </Typography>
            <Typography sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {address || 'Not connected'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Network
            </Typography>
            <Typography>Polygon Amoy Testnet (80002)</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary">
          Admin capabilities:
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
          <li>Mint NFTs (ERC-721 & ERC-1155)</li>
          <li>Create and verify collections</li>
          <li>Manage payment tokens</li>
          <li>Update platform fees</li>
          <li>Cancel any listing</li>
          <li>Update treasury address</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
