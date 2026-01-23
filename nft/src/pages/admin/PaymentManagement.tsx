import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Switch,
} from '@mui/material';
import {
  Add,
  Refresh,
  Delete,
} from '@mui/icons-material';
import { useContracts } from '../../hooks/useContracts';
import { useWeb3 } from '../../contexts/Web3Context';
import { ZeroAddress } from 'ethers';
import { getTxOptions } from '../../utils/gas';

interface PaymentToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  isActive: boolean;
  isNative: boolean;
  totalVolume: bigint;
}

interface FeeConfig {
  buyerFee: number;
  sellerFee: number;
  treasury: string;
}

const PaymentManagement: React.FC = () => {
  const contracts = useContracts();
  const { address } = useWeb3();

  const [tokens, setTokens] = useState<PaymentToken[]>([]);
  const [feeConfig, setFeeConfig] = useState<FeeConfig>({ buyerFee: 0, sellerFee: 0, treasury: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [newTokenSymbol, setNewTokenSymbol] = useState('');
  const [newTokenDecimals, setNewTokenDecimals] = useState('18');

  // Fee update state
  const [feeDialogOpen, setFeeDialogOpen] = useState(false);
  const [newBuyerFee, setNewBuyerFee] = useState('');
  const [newSellerFee, setNewSellerFee] = useState('');

  const fetchPaymentTokens = async () => {
    if (!contracts) return;

    setLoading(true);
    try {
      // Fetch fee configuration using getFeeConfig()
      const feeConfigData = await contracts.paymentManager.getFeeConfig();

      setFeeConfig({
        buyerFee: Number(feeConfigData.buyerFeeBps),
        sellerFee: Number(feeConfigData.sellerFeeBps),
        treasury: feeConfigData.treasury,
      });

      // Fetch all payment tokens using getAllPaymentTokens()
      const allTokens = await contracts.paymentManager.getAllPaymentTokens();
      const tokenList: PaymentToken[] = [];

      for (const tokenData of allTokens) {
        const isNative = tokenData.tokenAddress === ZeroAddress;

        tokenList.push({
          address: tokenData.tokenAddress,
          symbol: tokenData.symbol,
          name: tokenData.symbol, // ABI doesn't have name, use symbol
          decimals: Number(tokenData.decimals),
          isActive: tokenData.active,
          isNative,
          totalVolume: tokenData.totalVolume,
        });
      }

      setTokens(tokenList);
      setError(null);
    } catch (err) {
      console.error('Error fetching payment tokens:', err);
      setError('Failed to fetch payment tokens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentTokens();
  }, [contracts]);

  const handleAddToken = async () => {
    if (!contracts || !address) {
      setError('Wallet not connected');
      return;
    }

    if (!newTokenAddress) {
      setError('Token address is required');
      return;
    }

    if (!newTokenSymbol) {
      setError('Token symbol is required');
      return;
    }

    const decimals = parseInt(newTokenDecimals, 10);
    if (isNaN(decimals) || decimals < 0 || decimals > 18) {
      setError('Invalid decimals (0-18)');
      return;
    }

    setDialogLoading(true);
    setError(null);

    try {
      // addPaymentToken(tokenAddress, symbol, decimals)
      const tx = await contracts.paymentManager.addPaymentToken(
        newTokenAddress,
        newTokenSymbol,
        decimals,
        getTxOptions('admin')
      );
      await tx.wait();

      setSuccess(`Token ${newTokenSymbol} added successfully!`);
      setDialogOpen(false);
      setNewTokenAddress('');
      setNewTokenSymbol('');
      setNewTokenDecimals('18');
      fetchPaymentTokens();
    } catch (err: any) {
      console.error('Add token error:', err);
      setError(err.reason || err.message || 'Failed to add token');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleRemoveToken = async (tokenAddress: string) => {
    if (!contracts) return;

    try {
      const tx = await contracts.paymentManager.removePaymentToken(tokenAddress, getTxOptions('admin'));
      await tx.wait();
      setSuccess('Token removed!');
      fetchPaymentTokens();
    } catch (err: any) {
      setError(err.reason || err.message || 'Failed to remove token');
    }
  };

  const handleToggleToken = async (tokenAddress: string, isActive: boolean) => {
    if (!contracts) return;

    try {
      // setPaymentTokenActive(tokenAddress, active)
      const tx = await contracts.paymentManager.setPaymentTokenActive(
        tokenAddress,
        !isActive,
        getTxOptions('admin')
      );
      await tx.wait();
      setSuccess(`Token ${isActive ? 'deactivated' : 'activated'}!`);
      fetchPaymentTokens();
    } catch (err: any) {
      setError(err.reason || err.message || 'Failed to toggle token');
    }
  };

  const handleUpdateFees = async () => {
    if (!contracts) return;

    setDialogLoading(true);
    setError(null);

    try {
      const buyerFeeBps = Math.floor(parseFloat(newBuyerFee) * 100);
      const sellerFeeBps = Math.floor(parseFloat(newSellerFee) * 100);

      // setFeeConfig(buyerFeeBps, sellerFeeBps, treasury)
      const tx = await contracts.paymentManager.setFeeConfig(
        buyerFeeBps,
        sellerFeeBps,
        feeConfig.treasury, // keep existing treasury
        getTxOptions('admin')
      );
      await tx.wait();

      setSuccess('Fees updated successfully!');
      setFeeDialogOpen(false);
      fetchPaymentTokens();
    } catch (err: any) {
      console.error('Update fees error:', err);
      setError(err.reason || err.message || 'Failed to update fees');
    } finally {
      setDialogLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Payment Tokens
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchPaymentTokens} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Add Token
          </Button>
        </Box>
      </Box>

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

      {/* Fee Configuration */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Fee Configuration
          </Typography>
          <Button
            size="small"
            onClick={() => {
              setNewBuyerFee(String(feeConfig.buyerFee / 100));
              setNewSellerFee(String(feeConfig.sellerFee / 100));
              setFeeDialogOpen(true);
            }}
          >
            Edit Fees
          </Button>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'action.hover' }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              {feeConfig.buyerFee / 100}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Buyer Fee
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'action.hover' }}>
            <Typography variant="h4" fontWeight={700} color="secondary">
              {feeConfig.sellerFee / 100}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seller Fee
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'action.hover' }}>
            <Typography variant="h4" fontWeight={700}>
              {(feeConfig.buyerFee + feeConfig.sellerFee) / 100}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Platform Fee
            </Typography>
          </Paper>
        </Box>
      </Paper>

      {/* Token List */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : tokens.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No payment tokens configured.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Decimals</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.address}>
                    <TableCell>
                      <Typography fontWeight={600}>{token.symbol}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {token.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {token.isNative ? 'Native Token' : token.address}
                      </Typography>
                    </TableCell>
                    <TableCell>{token.decimals}</TableCell>
                    <TableCell>
                      <Chip
                        label={token.isNative ? 'Native' : 'ERC-20'}
                        size="small"
                        color={token.isNative ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={token.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={token.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Switch
                          checked={token.isActive}
                          onChange={() => handleToggleToken(token.address, token.isActive)}
                          size="small"
                        />
                        {!token.isNative && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveToken(token.address)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add Token Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !dialogLoading && setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Payment Token</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Token Contract Address"
              value={newTokenAddress}
              onChange={(e) => setNewTokenAddress(e.target.value)}
              placeholder="0x..."
              helperText="Enter the ERC-20 token contract address"
            />
            <TextField
              fullWidth
              label="Token Symbol"
              value={newTokenSymbol}
              onChange={(e) => setNewTokenSymbol(e.target.value.toUpperCase())}
              placeholder="e.g., USDT, USDC, MIMIG"
              helperText="Token symbol (e.g., USDT)"
            />
            <TextField
              fullWidth
              label="Decimals"
              type="number"
              value={newTokenDecimals}
              onChange={(e) => setNewTokenDecimals(e.target.value)}
              slotProps={{ htmlInput: { min: 0, max: 18 } }}
              helperText="Token decimals (usually 18 for standard tokens, 6 for USDT/USDC)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddToken}
            disabled={dialogLoading || !newTokenAddress || !newTokenSymbol}
          >
            {dialogLoading ? <CircularProgress size={20} /> : 'Add Token'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fee Update Dialog */}
      <Dialog
        open={feeDialogOpen}
        onClose={() => !dialogLoading && setFeeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Platform Fees</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Buyer Fee"
              type="number"
              value={newBuyerFee}
              onChange={(e) => setNewBuyerFee(e.target.value)}
              slotProps={{
                input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
                htmlInput: { min: 0, max: 5, step: 0.1 },
              }}
              helperText="Max 5%"
            />
            <TextField
              fullWidth
              label="Seller Fee"
              type="number"
              value={newSellerFee}
              onChange={(e) => setNewSellerFee(e.target.value)}
              slotProps={{
                input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
                htmlInput: { min: 0, max: 5, step: 0.1 },
              }}
              helperText="Max 5%"
            />
            <Alert severity="info">
              Total fee: {(parseFloat(newBuyerFee || '0') + parseFloat(newSellerFee || '0')).toFixed(1)}%
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeeDialogOpen(false)} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateFees}
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={20} /> : 'Update Fees'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentManagement;
