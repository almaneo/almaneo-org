import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Verified,
  Refresh,
  CloudUpload,
  Delete,
  Token,
} from '@mui/icons-material';
import { useContracts } from '../../hooks/useContracts';
import { useWeb3 } from '../../contexts/Web3Context';
import { getTxOptions } from '../../utils/gas';
import { ipfsService } from '../../services/ipfs';

// NFT Contract Addresses (from deployed contracts)
const NFT_CONTRACTS = {
  ERC721: '0x39D301b0F445085F2f9620778d4b7df2F2A00dce',
  ERC1155: '0x23A92C867F2AF6f6BB52E0EA196376647eA605A0',
};

// NFT Type enum
type NFTType = 'ERC721' | 'ERC1155';

interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

interface Collection {
  id: number;
  categoryId: number;
  name: string;
  symbol: string;
  description: string;
  imageUri: string;
  bannerUri: string;
  creator: string;
  nftContract: string;
  nftType: number; // 0=ERC721, 1=ERC1155
  royaltyBps: number;
  royaltyRecipient: string;
  active: boolean;
  verified: boolean;
  createdAt: bigint;
  totalItems: number;
  totalVolume: bigint;
}

const CollectionManagement: React.FC = () => {
  const contracts = useContracts();
  const { address } = useWeb3();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    categoryId: 1, // Category IDs start from 1 in the contract
    nftType: 'ERC721' as NFTType,
    royaltyBps: '500', // 5% in basis points
    royaltyRecipient: '', // Will default to current wallet
  });

  // Fetch categories from contract
  const fetchCategories = async () => {
    if (!contracts) return;

    try {
      const allCategories = await contracts.collectionManager.getAllCategories();
      // Category IDs start from 1 in the contract, so use index + 1
      const categoryList: Category[] = allCategories.map((cat: any, index: number) => ({
        id: Number(cat.id) || (index + 1), // Use cat.id if available, otherwise index + 1
        name: cat.name,
        description: cat.description,
        active: cat.active,
      }));
      setCategories(categoryList.filter((c) => c.active));
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to default categories (IDs start from 1)
      setCategories([
        { id: 1, name: 'Game', description: 'Gaming NFTs', active: true },
        { id: 2, name: 'Membership', description: 'Membership NFTs', active: true },
        { id: 3, name: 'RWA', description: 'Real World Assets', active: true },
        { id: 4, name: 'Art', description: 'Art NFTs', active: true },
        { id: 5, name: 'Other', description: 'Other NFTs', active: true },
      ]);
    }
  };

  const fetchCollections = async () => {
    if (!contracts) return;

    setLoading(true);
    try {
      // Use collectionCount() instead of getTotalCollections()
      const totalCollections = await contracts.collectionManager.collectionCount();
      const collectionList: Collection[] = [];

      for (let i = 1; i <= Number(totalCollections); i++) {
        try {
          const collection = await contracts.collectionManager.getCollection(i);
          collectionList.push({
            id: Number(collection.id),
            categoryId: Number(collection.categoryId),
            name: collection.name,
            symbol: collection.symbol,
            description: collection.description,
            imageUri: collection.imageUri,
            bannerUri: collection.bannerUri,
            creator: collection.creator,
            nftContract: collection.nftContract,
            nftType: Number(collection.nftType),
            royaltyBps: Number(collection.royaltyBps),
            royaltyRecipient: collection.royaltyRecipient,
            active: collection.active,
            verified: collection.verified,
            createdAt: collection.createdAt,
            totalItems: Number(collection.totalItems),
            totalVolume: collection.totalVolume,
          });
        } catch (err) {
          console.error(`Error fetching collection ${i}:`, err);
        }
      }

      setCollections(collectionList);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchCategories();
  }, [contracts]);

  // Set default royalty recipient to current wallet
  useEffect(() => {
    if (address && !formData.royaltyRecipient) {
      setFormData((prev) => ({ ...prev, royaltyRecipient: address }));
    }
  }, [address]);

  // Image handling
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const preview = URL.createObjectURL(file);
    if (type === 'image') {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImageFile(file);
      setImagePreview(preview);
    } else {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      setBannerFile(file);
      setBannerPreview(preview);
    }
  }, [imagePreview, bannerPreview]);

  const removeImage = (type: 'image' | 'banner') => {
    if (type === 'image') {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImageFile(null);
      setImagePreview('');
    } else {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      setBannerFile(null);
      setBannerPreview('');
    }
  };

  const uploadImagesToIPFS = async (): Promise<{ imageUri: string; bannerUri: string }> => {
    if (!ipfsService.isConfigured()) {
      throw new Error('IPFS (Pinata) not configured. Please set API keys in .env');
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let imageUri = '';
      let bannerUri = '';

      // Upload image if selected
      if (imageFile) {
        imageUri = await ipfsService.uploadFile(imageFile);
        setUploadProgress(50);
      }

      // Upload banner if selected
      if (bannerFile) {
        bannerUri = await ipfsService.uploadFile(bannerFile);
        setUploadProgress(100);
      } else {
        setUploadProgress(100);
      }

      return { imageUri, bannerUri };
    } finally {
      setUploading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!contracts || !address) {
      setError('Wallet not connected');
      return;
    }

    if (!formData.name || !formData.symbol) {
      setError('Name and symbol are required');
      return;
    }

    setDialogLoading(true);
    setError(null);

    try {
      // Upload images to IPFS if selected
      let imageUri = '';
      let bannerUri = '';

      if (imageFile || bannerFile) {
        const uploaded = await uploadImagesToIPFS();
        imageUri = uploaded.imageUri;
        bannerUri = uploaded.bannerUri;
      }

      // Get NFT contract address and type (1:N mapping now supported)
      const nftContract = NFT_CONTRACTS[formData.nftType];
      const nftTypeValue = formData.nftType === 'ERC721' ? 0 : 1;

      // Use royalty recipient from form or default to current wallet
      const royaltyRecipient = formData.royaltyRecipient || address;

      const royaltyBps = parseInt(formData.royaltyBps);

      console.log('Creating collection with params:', {
        categoryId: formData.categoryId,
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        imageUri,
        bannerUri,
        nftContract,
        nftTypeValue,
        royaltyRecipient,
        royaltyBps,
      });

      // Pre-flight checks
      console.log('Running pre-flight checks...');

      // Check 1: Verify OPERATOR_ROLE
      const OPERATOR_ROLE = await contracts.collectionManager.OPERATOR_ROLE();
      const hasOperatorRole = await contracts.collectionManager.hasRole(OPERATOR_ROLE, address);
      console.log('Has OPERATOR_ROLE:', hasOperatorRole);
      if (!hasOperatorRole) {
        throw new Error('You do not have OPERATOR_ROLE permission');
      }

      // Check 2: Verify contract is not paused
      const isPaused = await contracts.collectionManager.paused();
      console.log('Contract paused:', isPaused);
      if (isPaused) {
        throw new Error('Contract is paused');
      }

      // Check 3: Verify category exists and is active
      try {
        const category = await contracts.collectionManager.getCategory(formData.categoryId);
        console.log('Category:', category);
        if (!category.active) {
          throw new Error('Category is not active');
        }
      } catch (catErr: any) {
        console.error('Category check failed:', catErr);
        throw new Error(`Category ${formData.categoryId} does not exist or is not accessible`);
      }

      console.log('All pre-flight checks passed!');

      // createCollection(categoryId, name, symbol, description, imageUri, bannerUri, nftContract, nftType, royaltyRecipient, royaltyBps)
      const txOptions = getTxOptions('listing');
      console.log('Tx options:', txOptions);

      const args = [
        formData.categoryId,           // categoryId (uint256)
        formData.name,                  // name (string)
        formData.symbol,                // symbol (string)
        formData.description,           // description (string)
        imageUri,                       // imageUri (string)
        bannerUri,                      // bannerUri (string)
        nftContract,                    // nftContract (address)
        nftTypeValue,                   // nftType (uint8)
        royaltyRecipient,               // royaltyRecipient (address)
        royaltyBps,                     // royaltyBps (uint96)
      ];

      console.log('Calling createCollection with args:', args);

      // First, simulate the transaction with staticCall to get better error messages
      try {
        console.log('Running staticCall simulation...');
        const result = await contracts.collectionManager.createCollection.staticCall(...args);
        console.log('staticCall succeeded, would return collectionId:', result.toString());
      } catch (simulateErr: any) {
        console.error('staticCall simulation failed:', simulateErr);
        // Try to decode the error
        if (simulateErr.data) {
          console.error('Error data:', simulateErr.data);
        }
        throw new Error(`Transaction would fail: ${simulateErr.reason || simulateErr.message}`);
      }

      // If simulation succeeds, send the actual transaction
      console.log('Simulation passed, sending actual transaction...');
      const tx = await contracts.collectionManager.createCollection(...args, txOptions);

      await tx.wait();

      setSuccess('Collection created successfully!');
      setDialogOpen(false);
      resetForm();
      fetchCollections();
    } catch (err: any) {
      console.error('Create collection error:', err);
      setError(err.reason || err.message || 'Failed to create collection');
    } finally {
      setDialogLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      symbol: '',
      description: '',
      categoryId: 1, // Category IDs start from 1 in the contract
      nftType: 'ERC721',
      royaltyBps: '500',
      royaltyRecipient: address || '',
    });
    removeImage('image');
    removeImage('banner');
  };

  const handleVerifyCollection = async (collectionId: number) => {
    if (!contracts) return;

    try {
      // Use setCollectionVerified instead of verifyCollection
      const tx = await contracts.collectionManager.setCollectionVerified(collectionId, true, getTxOptions('admin'));
      await tx.wait();
      setSuccess('Collection verified!');
      fetchCollections();
    } catch (err: any) {
      setError(err.reason || err.message || 'Failed to verify collection');
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getNftTypeName = (nftType: number): string => {
    return nftType === 0 ? 'ERC721' : 'ERC1155';
  };

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Collections
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchCollections} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Create Collection
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

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : collections.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No collections found. Create your first collection!
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>NFT Type</TableCell>
                  <TableCell>Royalty</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>{collection.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {collection.imageUri && (
                          <Box
                            component="img"
                            src={collection.imageUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              objectFit: 'cover',
                            }}
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {collection.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatAddress(collection.creator)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{collection.symbol}</TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryName(collection.categoryId)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getNftTypeName(collection.nftType)}
                        size="small"
                        color={collection.nftType === 0 ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{collection.royaltyBps / 100}%</TableCell>
                    <TableCell>{collection.totalItems}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column' }}>
                        {collection.verified ? (
                          <Chip
                            icon={<Verified />}
                            label="Verified"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip label="Unverified" size="small" />
                        )}
                        {!collection.active && (
                          <Chip label="Inactive" color="warning" size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {!collection.verified && (
                        <Button
                          size="small"
                          onClick={() => handleVerifyCollection(collection.id)}
                        >
                          Verify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create Collection Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !dialogLoading && !uploading && setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Collection</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* NFT Type Selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                NFT Contract Type *
              </Typography>
              <ToggleButtonGroup
                value={formData.nftType}
                exclusive
                onChange={(_, value) => value && setFormData({ ...formData, nftType: value })}
                fullWidth
                size="small"
              >
                <ToggleButton value="ERC721" sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Token fontSize="small" />
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" fontWeight={600}>ERC-721</Typography>
                      <Typography variant="caption" color="text.secondary">Unique NFTs</Typography>
                    </Box>
                  </Box>
                </ToggleButton>
                <ToggleButton value="ERC1155" sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Token fontSize="small" />
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" fontWeight={600}>ERC-1155</Typography>
                      <Typography variant="caption" color="text.secondary">Multi-edition</Typography>
                    </Box>
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Contract: {NFT_CONTRACTS[formData.nftType]}
              </Typography>
            </Box>

            {/* Basic Info */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                label="Collection Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My NFT Collection"
              />
              <TextField
                fullWidth
                label="Symbol *"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="MNFT"
                slotProps={{ htmlInput: { maxLength: 10 } }}
              />
            </Box>

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              placeholder="Describe your collection..."
            />

            {/* Category Selection */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                label="Category"
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name} - {cat.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Image Upload Section */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
              {/* Collection Image */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Collection Image
                </Typography>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, 'image')}
                  style={{ display: 'none' }}
                />
                {imagePreview ? (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage('image')}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    onClick={() => imageInputRef.current?.click()}
                    sx={{
                      width: '100%',
                      aspectRatio: '1',
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Upload Image
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Banner Image */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Banner Image
                </Typography>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, 'banner')}
                  style={{ display: 'none' }}
                />
                {bannerPreview ? (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={bannerPreview}
                      sx={{
                        width: '100%',
                        aspectRatio: '3/1',
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage('banner')}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    onClick={() => bannerInputRef.current?.click()}
                    sx={{
                      width: '100%',
                      aspectRatio: '3/1',
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Upload Banner (Recommended: 1200x400)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Royalty Settings */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                label="Royalty Recipient"
                value={formData.royaltyRecipient}
                onChange={(e) => setFormData({ ...formData, royaltyRecipient: e.target.value })}
                placeholder="0x..."
                helperText="Defaults to your wallet"
              />
              <TextField
                fullWidth
                label="Royalty Fee"
                type="number"
                value={formData.royaltyBps ? parseInt(formData.royaltyBps) / 100 : 0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFormData({ ...formData, royaltyBps: String(isNaN(val) ? 0 : val * 100) });
                }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  },
                  htmlInput: { min: 0, max: 10, step: 0.5 },
                }}
                helperText="Max 10%"
              />
            </Box>

            {/* Upload Progress */}
            {uploading && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Uploading to IPFS... {Math.round(uploadProgress)}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              resetForm();
            }}
            disabled={dialogLoading || uploading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCollection}
            disabled={dialogLoading || uploading || !formData.name || !formData.symbol}
          >
            {uploading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : dialogLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              'Create Collection'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollectionManagement;
