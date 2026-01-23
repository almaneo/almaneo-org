import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Chip,
  IconButton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CloudUpload,
  Token,
  CheckCircle,
  Delete,
  AddPhotoAlternate,
  DragIndicator,
  Collections,
  LocalGasStation,
  LocalGasStationOutlined,
} from '@mui/icons-material';
import { useContracts } from '../../hooks/useContracts';
import { useWeb3 } from '../../contexts/Web3Context';
import { useBiconomy } from '../../contexts/BiconomyContext';
import { useGaslessTransaction } from '../../hooks/useGaslessTransaction';
import { ipfsService } from '../../services/ipfs';
import { getTxOptions } from '../../utils/gas';

interface CollectionInfo {
  id: number;
  name: string;
  symbol: string;
  nftType: number; // 0=ERC721, 1=ERC1155
}

type NFTType = 'ERC721' | 'ERC1155';

interface ImageFile {
  file: File;
  preview: string;
  ipfsUri?: string;
  uploading?: boolean;
  uploaded?: boolean;
}

interface MintForm {
  name: string;
  description: string;
  images: ImageFile[];
  externalUrl: string;
  attributes: { trait_type: string; value: string }[];
  // ERC1155 specific
  amount: string;
  maxSupply: string;
  // Royalty
  royaltyPercent: string;
}

const MintNFT: React.FC = () => {
  const contracts = useContracts();
  const { address } = useWeb3();
  const { isInitialized: isGaslessAvailable, smartAccountAddress } = useBiconomy();
  const { executeGasless, isLoading: isGaslessLoading } = useGaslessTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nftType, setNftType] = useState<NFTType>('ERC721');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [useGasless, setUseGasless] = useState(true); // 가스리스 옵션

  // Collection selection state
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number>(0); // 0 = No Collection
  const [loadingCollections, setLoadingCollections] = useState(false);

  const [form, setForm] = useState<MintForm>({
    name: '',
    description: '',
    images: [],
    externalUrl: '',
    attributes: [{ trait_type: '', value: '' }],
    amount: '1',
    maxSupply: '100',
    royaltyPercent: '5',
  });

  // Fetch collections for dropdown
  const fetchCollections = useCallback(async () => {
    if (!contracts) return;

    setLoadingCollections(true);
    try {
      const totalCollections = await contracts.collectionManager.collectionCount();
      const collectionList: CollectionInfo[] = [];

      for (let i = 1; i <= Number(totalCollections); i++) {
        try {
          const collection = await contracts.collectionManager.getCollection(i);
          // Only show active collections
          if (collection.active) {
            collectionList.push({
              id: Number(collection.id),
              name: collection.name,
              symbol: collection.symbol,
              nftType: Number(collection.nftType),
            });
          }
        } catch (err) {
          console.error(`Error fetching collection ${i}:`, err);
        }
      }

      setCollections(collectionList);
    } catch (err) {
      console.error('Error fetching collections:', err);
    } finally {
      setLoadingCollections(false);
    }
  }, [contracts]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Filter collections by NFT type
  const filteredCollections = collections.filter(
    (c) => c.nftType === (nftType === 'ERC721' ? 0 : 1)
  );

  // Reset collection selection when NFT type changes
  useEffect(() => {
    setSelectedCollectionId(0);
  }, [nftType]);

  // Get selected collection info
  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);

  const steps = ['NFT Details', 'Media & Metadata', 'Review & Mint'];

  const handleFormChange = (field: keyof MintForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAttributeChange = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...form.attributes];
    newAttributes[index][field] = value;
    setForm((prev) => ({ ...prev, attributes: newAttributes }));
  };

  const addAttribute = () => {
    setForm((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }],
    }));
  };

  const removeAttribute = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  // Image handling functions
  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length === 0) {
      setError('Please select valid image or video files');
      return;
    }

    const newImages: ImageFile[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    setError(null);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const removeImage = (index: number) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      // Revoke the preview URL to free memory
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= form.images.length) return;

    setForm((prev) => {
      const newImages = [...prev.images];
      const [movedItem] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedItem);
      return { ...prev, images: newImages };
    });
  };

  const uploadImagesToIPFS = async (): Promise<string> => {
    if (form.images.length === 0) {
      throw new Error('No images selected');
    }

    if (!ipfsService.isConfigured()) {
      throw new Error('IPFS (Pinata) not configured. Please set API keys in .env');
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload the first image as the main NFT image
      const mainImage = form.images[0];
      const totalFiles = form.images.length;
      let completedFiles = 0;

      // Upload main image
      const mainImageUri = await ipfsService.uploadFile(mainImage.file);
      completedFiles++;
      setUploadProgress((completedFiles / totalFiles) * 100);

      // Update form with uploaded URI
      setForm((prev) => {
        const newImages = [...prev.images];
        newImages[0] = { ...newImages[0], ipfsUri: mainImageUri, uploaded: true };
        return { ...prev, images: newImages };
      });

      // Upload additional images if any
      const additionalImageUris: string[] = [];
      for (let i = 1; i < form.images.length; i++) {
        const imageUri = await ipfsService.uploadFile(form.images[i].file);
        additionalImageUris.push(imageUri);
        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 100);

        // Update form with uploaded URI
        setForm((prev) => {
          const newImages = [...prev.images];
          newImages[i] = { ...newImages[i], ipfsUri: imageUri, uploaded: true };
          return { ...prev, images: newImages };
        });
      }

      // Create and upload metadata
      const metadata: Record<string, unknown> = {
        name: form.name,
        description: form.description,
        image: mainImageUri,
        external_url: form.externalUrl || undefined,
        attributes: form.attributes.filter((a) => a.trait_type && a.value),
      };

      // Add additional images to metadata if any
      if (additionalImageUris.length > 0) {
        metadata.additional_images = additionalImageUris;
      }

      const metadataUri = await ipfsService.uploadJSON(metadata, `${form.name}-metadata.json`);

      return metadataUri;
    } finally {
      setUploading(false);
    }
  };

  const handleMint = async () => {
    if (!contracts || !address) {
      setError('Wallet not connected');
      return;
    }

    if (!form.name || !form.description) {
      setError('Please fill in all required fields');
      return;
    }

    if (form.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Upload images and metadata to IPFS
      const tokenUri = await uploadImagesToIPFS();
      const royaltyBps = Math.floor(parseFloat(form.royaltyPercent) * 100);

      // 가스리스 민팅 (Biconomy Smart Account 사용)
      if (useGasless && isGaslessAvailable) {
        console.log('[Mint] Gasless 민팅 시작...');

        let resultTxHash: string | null = null;

        if (nftType === 'ERC721') {
          resultTxHash = await executeGasless(
            contracts.nft721,
            'mint',
            [address, tokenUri, selectedCollectionId, address, royaltyBps],
            { fallbackToRegular: true }
          );
        } else {
          const amount = parseInt(form.amount) || 1;
          const maxSupply = parseInt(form.maxSupply) || 100;

          resultTxHash = await executeGasless(
            contracts.nft1155,
            'mint',
            [address, amount, tokenUri, selectedCollectionId, maxSupply, address, royaltyBps],
            { fallbackToRegular: true }
          );
        }

        if (resultTxHash) {
          setTxHash(resultTxHash);
          setSuccess('NFT minted successfully! (Gasless)');
        } else {
          throw new Error('Gasless 민팅 실패');
        }
      } else {
        // 일반 민팅 (가스비 직접 지불)
        let tx;

        if (nftType === 'ERC721') {
          tx = await contracts.nft721.mint(
            address,
            tokenUri,
            selectedCollectionId,
            address,
            royaltyBps,
            getTxOptions('mint')
          );
        } else {
          const amount = parseInt(form.amount) || 1;
          const maxSupply = parseInt(form.maxSupply) || 100;

          tx = await contracts.nft1155.mint(
            address,
            amount,
            tokenUri,
            selectedCollectionId,
            maxSupply,
            address,
            royaltyBps,
            getTxOptions('mint')
          );
        }

        setTxHash(tx.hash);
        await tx.wait();
        setSuccess('NFT minted successfully!');
      }

      // Clean up previews
      form.images.forEach((img) => URL.revokeObjectURL(img.preview));

      // Reset form
      setActiveStep(0);
      setSelectedCollectionId(0);
      setForm({
        name: '',
        description: '',
        images: [],
        externalUrl: '',
        attributes: [{ trait_type: '', value: '' }],
        amount: '1',
        maxSupply: '100',
        royaltyPercent: '5',
      });
    } catch (err: unknown) {
      console.error('Mint error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint NFT';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return form.name && form.description;
      case 1:
        return form.images.length > 0;
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Mint NFT
      </Typography>

      {/* NFT Type Toggle */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Select NFT Type
        </Typography>
        <ToggleButtonGroup
          value={nftType}
          exclusive
          onChange={(_, value) => value && setNftType(value)}
          fullWidth
        >
          <ToggleButton value="ERC721" sx={{ py: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Token sx={{ fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600}>ERC-721</Typography>
              <Typography variant="caption" color="text.secondary">
                Unique 1/1 NFT
              </Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="ERC1155" sx={{ py: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Token sx={{ fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600}>ERC-1155</Typography>
              <Typography variant="caption" color="text.secondary">
                Multiple editions
              </Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          action={
            txHash && (
              <Button
                size="small"
                href={`https://amoy.polygonscan.com/tx/${txHash}`}
                target="_blank"
              >
                View TX
              </Button>
            )
          }
        >
          {success}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              NFT Details
            </Typography>

            {/* Collection Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Collection (Optional)</InputLabel>
              <Select
                value={selectedCollectionId}
                label="Collection (Optional)"
                onChange={(e) => setSelectedCollectionId(Number(e.target.value))}
                disabled={loadingCollections}
                startAdornment={
                  selectedCollectionId > 0 ? (
                    <Collections sx={{ ml: 1, mr: 0.5, color: 'primary.main' }} fontSize="small" />
                  ) : undefined
                }
              >
                <MenuItem value={0}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>No Collection</Typography>
                    <Chip label="Default" size="small" variant="outlined" />
                  </Box>
                </MenuItem>
                {filteredCollections.length === 0 && (
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      No {nftType} collections available
                    </Typography>
                  </MenuItem>
                )}
                {filteredCollections.map((collection) => (
                  <MenuItem key={collection.id} value={collection.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{collection.name}</Typography>
                      <Chip label={collection.symbol} size="small" variant="outlined" />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {selectedCollection && (
                <Typography variant="caption" color="primary" sx={{ mt: 0.5 }}>
                  Selected: {selectedCollection.name} ({selectedCollection.symbol})
                </Typography>
              )}
              {filteredCollections.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  Create a {nftType} collection first in Collections management to add NFTs to it
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Name *"
              value={form.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              sx={{ mb: 3 }}
              placeholder="My Awesome NFT"
            />

            <TextField
              fullWidth
              label="Description *"
              value={form.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 3 }}
              placeholder="Describe your NFT..."
            />

            {nftType === 'ERC1155' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="Amount to Mint"
                  type="number"
                  value={form.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  inputProps={{ min: 1 }}
                />
                <TextField
                  fullWidth
                  label="Max Supply"
                  type="number"
                  value={form.maxSupply}
                  onChange={(e) => handleFormChange('maxSupply', e.target.value)}
                  inputProps={{ min: 1 }}
                />
              </Box>
            )}

            <TextField
              fullWidth
              label="Royalty Percentage"
              type="number"
              value={form.royaltyPercent}
              onChange={(e) => handleFormChange('royaltyPercent', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ min: 0, max: 10, step: 0.5 }}
              helperText="Royalty you receive on secondary sales (max 10%)"
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Media & Metadata
            </Typography>

            {/* Image Upload Area */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Images * (First image will be the main NFT image)
              </Typography>

              {/* Drag and Drop Zone */}
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragging ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: isDragging ? 'action.hover' : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Drag & Drop Images Here
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  or click to browse files
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports: JPG, PNG, GIF, WEBP, MP4, WEBM (Max 50MB each)
                </Typography>
              </Box>
            </Box>

            {/* Image Previews */}
            {form.images.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Uploaded Images ({form.images.length})
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: 2,
                  }}
                >
                  {form.images.map((img, index) => (
                    <Paper
                      key={index}
                      sx={{
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: index === 0 ? '2px solid' : '1px solid',
                        borderColor: index === 0 ? 'primary.main' : 'divider',
                      }}
                    >
                      {/* Image Preview */}
                      <Box
                        sx={{
                          aspectRatio: '1',
                          position: 'relative',
                        }}
                      >
                        {img.file.type.startsWith('video/') ? (
                          <video
                            src={img.preview}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <img
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        )}

                        {/* Main badge */}
                        {index === 0 && (
                          <Chip
                            label="Main"
                            size="small"
                            color="primary"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                            }}
                          />
                        )}

                        {/* Uploaded badge */}
                        {img.uploaded && (
                          <CheckCircle
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              color: 'success.main',
                              bgcolor: 'white',
                              borderRadius: '50%',
                            }}
                          />
                        )}
                      </Box>

                      {/* Controls */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          bgcolor: 'background.default',
                        }}
                      >
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => moveImage(index, index - 1)}
                            disabled={index === 0}
                          >
                            <DragIndicator fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ flex: 1, textAlign: 'center' }}>
                          {(img.file.size / 1024 / 1024).toFixed(1)} MB
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}

                  {/* Add More Button */}
                  <Paper
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <AddPhotoAlternate sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Add More
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}

            <TextField
              fullWidth
              label="External URL"
              value={form.externalUrl}
              onChange={(e) => handleFormChange('externalUrl', e.target.value)}
              sx={{ mb: 3 }}
              placeholder="https://your-website.com/nft/123"
              helperText="Link to your website or project"
            />

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Attributes
            </Typography>

            {form.attributes.map((attr, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Trait Type"
                  value={attr.trait_type}
                  onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                  placeholder="e.g., Color"
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Value"
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  placeholder="e.g., Blue"
                  sx={{ flex: 1 }}
                />
                <Button
                  color="error"
                  onClick={() => removeAttribute(index)}
                  disabled={form.attributes.length === 1}
                >
                  Remove
                </Button>
              </Box>
            ))}

            <Button onClick={addAttribute} variant="outlined" size="small">
              Add Attribute
            </Button>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Review & Mint
            </Typography>

            <Paper sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '200px 1fr' }, gap: 3 }}>
                {/* Preview Image */}
                <Box
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {form.images.length > 0 ? (
                    form.images[0].file.type.startsWith('video/') ? (
                      <video
                        src={form.images[0].preview}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <img
                        src={form.images[0].preview}
                        alt="NFT Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )
                  ) : (
                    <CloudUpload sx={{ fontSize: 48, color: 'text.secondary' }} />
                  )}
                </Box>

                {/* Details */}
                <Box>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    {form.name || 'Untitled'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={nftType} size="small" color="primary" />
                    <Chip label={`${form.images.length} image(s)`} size="small" variant="outlined" />
                    {selectedCollection ? (
                      <Chip
                        icon={<Collections fontSize="small" />}
                        label={`${selectedCollection.name} (${selectedCollection.symbol})`}
                        size="small"
                        color="secondary"
                      />
                    ) : (
                      <Chip label="No Collection" size="small" variant="outlined" />
                    )}
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {form.description || 'No description'}
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Royalty
                      </Typography>
                      <Typography fontWeight={600}>{form.royaltyPercent}%</Typography>
                    </Box>
                    {nftType === 'ERC1155' && (
                      <>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Amount
                          </Typography>
                          <Typography fontWeight={600}>{form.amount}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Max Supply
                          </Typography>
                          <Typography fontWeight={600}>{form.maxSupply}</Typography>
                        </Box>
                      </>
                    )}
                  </Box>

                  {form.attributes.filter((a) => a.trait_type && a.value).length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Attributes
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {form.attributes
                          .filter((a) => a.trait_type && a.value)
                          .map((attr, i) => (
                            <Chip
                              key={i}
                              label={`${attr.trait_type}: ${attr.value}`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Additional Images Preview */}
              {form.images.length > 1 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Additional Images
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {form.images.slice(1).map((img, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <img
                          src={img.preview}
                          alt={`Additional ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>

            {uploading && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Uploading to IPFS... {Math.round(uploadProgress)}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            {/* Gasless Option */}
            <Paper
              sx={{
                p: 2,
                mb: 3,
                border: '1px solid',
                borderColor: useGasless && isGaslessAvailable ? 'success.main' : 'divider',
                borderRadius: 2,
                bgcolor: useGasless && isGaslessAvailable ? 'success.main' : 'transparent',
                opacity: useGasless && isGaslessAvailable ? 0.1 : 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {useGasless && isGaslessAvailable ? (
                    <LocalGasStation sx={{ color: 'success.main', fontSize: 32 }} />
                  ) : (
                    <LocalGasStationOutlined sx={{ color: 'text.secondary', fontSize: 32 }} />
                  )}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Gasless Transaction
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isGaslessAvailable
                        ? 'Mint without paying gas fees (powered by Biconomy)'
                        : 'Connect wallet to enable gasless minting'}
                    </Typography>
                    {smartAccountAddress && (
                      <Typography variant="caption" color="text.secondary">
                        Smart Account: {smartAccountAddress.slice(0, 6)}...{smartAccountAddress.slice(-4)}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <ToggleButtonGroup
                  value={useGasless ? 'gasless' : 'regular'}
                  exclusive
                  onChange={(_, value) => value && setUseGasless(value === 'gasless')}
                  size="small"
                  disabled={!isGaslessAvailable}
                >
                  <ToggleButton value="gasless" color="success">
                    <LocalGasStation sx={{ mr: 0.5 }} fontSize="small" />
                    Gasless
                  </ToggleButton>
                  <ToggleButton value="regular">
                    Regular
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>

            <Alert severity="info" sx={{ mb: 3 }}>
              {useGasless && isGaslessAvailable
                ? 'Images will be uploaded to IPFS via Pinata. No gas fees required for minting!'
                : 'Images will be uploaded to IPFS via Pinata. You will need to confirm the transaction in your wallet.'}
            </Alert>
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={() => setActiveStep((prev) => prev - 1)}
            disabled={activeStep === 0 || loading || uploading}
          >
            Back
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setActiveStep((prev) => prev + 1)}
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleMint}
              disabled={loading || uploading || isGaslessLoading}
              startIcon={(loading || uploading || isGaslessLoading) ? <CircularProgress size={20} /> : (useGasless && isGaslessAvailable ? <LocalGasStation /> : <CheckCircle />)}
              color={useGasless && isGaslessAvailable ? 'success' : 'primary'}
            >
              {uploading ? 'Uploading to IPFS...' : (loading || isGaslessLoading) ? 'Minting...' : (useGasless && isGaslessAvailable ? 'Mint NFT (Gasless)' : 'Mint NFT')}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default MintNFT;
