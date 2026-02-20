import 'dart:io' as io;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/partner_service.dart';

class PartnerRegisterScreen extends ConsumerStatefulWidget {
  final String? userId;
  final Map<String, dynamic>? existingPartner;
  const PartnerRegisterScreen({super.key, this.userId, this.existingPartner});

  @override
  ConsumerState<PartnerRegisterScreen> createState() => _PartnerRegisterScreenState();
}

class _PartnerRegisterScreenState extends ConsumerState<PartnerRegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _websiteController = TextEditingController();

  int? _selectedCategoryId;
  List<Map<String, dynamic>> _categories = [];
  bool _isLoading = false;
  bool _isSaving = false;

  // Map
  LatLng? _selectedLocation;
  GoogleMapController? _mapController;
  bool _showMap = false;

  // Cover image
  String? _coverImageUrl;
  String? _coverImageLocalPath;
  bool _isUploadingCover = false;

  bool get _isEditMode => widget.existingPartner != null;

  @override
  void initState() {
    super.initState();
    _loadCategories();
    if (_isEditMode) {
      _prefillForm();
    }
  }

  void _prefillForm() {
    final p = widget.existingPartner!;
    _nameController.text = p['business_name'] ?? '';
    _descController.text = p['description'] ?? '';
    _addressController.text = p['address'] ?? '';
    _phoneController.text = p['phone'] ?? '';
    _websiteController.text = p['website'] ?? '';
    _selectedCategoryId = p['category_id'] as int?;
    _coverImageUrl = p['cover_image_url'] as String?;
    final lat = p['latitude'] as double?;
    final lng = p['longitude'] as double?;
    if (lat != null && lng != null) {
      _selectedLocation = LatLng(lat, lng);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _websiteController.dispose();
    _mapController?.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    setState(() => _isLoading = true);
    final cats = await PartnerService.getCategories();
    if (mounted) {
      setState(() {
        _categories = cats;
        _isLoading = false;
      });
    }
  }

  Future<void> _getCurrentLocation() async {
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }
      if (permission == LocationPermission.deniedForever) return;

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
      final latLng = LatLng(position.latitude, position.longitude);
      setState(() => _selectedLocation = latLng);
      _mapController?.animateCamera(CameraUpdate.newLatLngZoom(latLng, 16));
    } catch (e) {
      debugPrint('[PartnerRegister] Location error: $e');
    }
  }

  Future<void> _pickCoverImage() async {
    final alma = context.alma;
    final lang = _lang;

    showModalBottomSheet(
      context: context,
      backgroundColor: alma.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: alma.textTertiary,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: Container(
                width: 40, height: 40,
                decoration: BoxDecoration(
                  color: AlmaTheme.electricBlue.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.photo_library_outlined, color: AlmaTheme.electricBlue),
              ),
              title: Text(tr('partners.register.fromGallery', lang), style: TextStyle(color: alma.textPrimary)),
              onTap: () {
                Navigator.pop(ctx);
                _selectCoverImage(ImageSource.gallery);
              },
            ),
            ListTile(
              leading: Container(
                width: 40, height: 40,
                decoration: BoxDecoration(
                  color: AlmaTheme.cyan.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.camera_alt_outlined, color: AlmaTheme.cyan),
              ),
              title: Text(tr('partners.register.fromCamera', lang), style: TextStyle(color: alma.textPrimary)),
              onTap: () {
                Navigator.pop(ctx);
                _selectCoverImage(ImageSource.camera);
              },
            ),
            if (_coverImageUrl != null || _coverImageLocalPath != null)
              ListTile(
                leading: Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    color: AlmaTheme.error.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.delete_outline, color: AlmaTheme.error),
                ),
                title: Text(tr('partners.register.removePhoto', lang), style: const TextStyle(color: AlmaTheme.error)),
                onTap: () {
                  Navigator.pop(ctx);
                  setState(() {
                    _coverImageUrl = null;
                    _coverImageLocalPath = null;
                  });
                },
              ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Future<void> _selectCoverImage(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source,
        maxWidth: 1200,
        maxHeight: 800,
        imageQuality: 85,
      );
      if (picked == null) return;

      setState(() {
        _coverImageLocalPath = picked.path;
      });
    } catch (e) {
      debugPrint('[PartnerRegister] Image pick error: $e');
    }
  }

  Future<String?> _uploadCoverIfNeeded(String partnerId) async {
    if (_coverImageLocalPath == null) return _coverImageUrl;

    setState(() => _isUploadingCover = true);
    final url = await PartnerService.uploadCoverImage(
      partnerId: partnerId,
      filePath: _coverImageLocalPath!,
    );
    if (mounted) setState(() => _isUploadingCover = false);
    return url;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategoryId == null) {
      _showSnackBar(tr('partners.register.selectCategory', _lang), isError: true);
      return;
    }

    setState(() => _isSaving = true);

    if (_isEditMode) {
      // Update existing partner
      final partnerId = widget.existingPartner!['id'] as String;

      // Upload cover image first if local path set
      String? coverUrl = _coverImageUrl;
      if (_coverImageLocalPath != null) {
        coverUrl = await _uploadCoverIfNeeded(partnerId);
      }

      final result = await PartnerService.updatePartner(
        partnerId: partnerId,
        businessName: _nameController.text.trim(),
        categoryId: _selectedCategoryId!,
        description: _descController.text.trim().isNotEmpty ? _descController.text.trim() : null,
        address: _addressController.text.trim().isNotEmpty ? _addressController.text.trim() : null,
        latitude: _selectedLocation?.latitude,
        longitude: _selectedLocation?.longitude,
        phone: _phoneController.text.trim().isNotEmpty ? _phoneController.text.trim() : null,
        website: _websiteController.text.trim().isNotEmpty ? _websiteController.text.trim() : null,
        coverImageUrl: coverUrl,
      );

      if (mounted) {
        setState(() => _isSaving = false);
        if (result != null) {
          _showSnackBar(tr('partners.register.updateSuccess', _lang));
          Navigator.pop(context, true);
        } else {
          _showSnackBar(tr('partners.register.updateFailed', _lang), isError: true);
        }
      }
    } else {
      // Create new partner
      final result = await PartnerService.createPartner(
        businessName: _nameController.text.trim(),
        categoryId: _selectedCategoryId!,
        ownerUserId: widget.userId,
        description: _descController.text.trim().isNotEmpty ? _descController.text.trim() : null,
        address: _addressController.text.trim().isNotEmpty ? _addressController.text.trim() : null,
        latitude: _selectedLocation?.latitude,
        longitude: _selectedLocation?.longitude,
        phone: _phoneController.text.trim().isNotEmpty ? _phoneController.text.trim() : null,
        website: _websiteController.text.trim().isNotEmpty ? _websiteController.text.trim() : null,
      );

      if (mounted && result != null) {
        // Upload cover image if selected
        if (_coverImageLocalPath != null) {
          await _uploadCoverIfNeeded(result['id'] as String);
        }
        if (mounted) {
          setState(() => _isSaving = false);
          _showSnackBar(tr('partners.register.success', _lang));
          Navigator.pop(context, true);
        }
      } else if (mounted) {
        setState(() => _isSaving = false);
        _showSnackBar(tr('partners.register.failed', _lang), isError: true);
      }
    }
  }

  Future<void> _confirmDeactivate() async {
    final lang = _lang;
    final alma = context.alma;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: alma.cardBg,
        title: Text(tr('partners.register.deactivate', lang), style: TextStyle(color: alma.textPrimary)),
        content: Text(tr('partners.register.deactivateConfirm', lang), style: TextStyle(color: alma.textSecondary)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text(tr('common.cancel', lang), style: TextStyle(color: alma.textSecondary)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text(tr('partners.register.deactivate', lang), style: const TextStyle(color: AlmaTheme.error)),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    setState(() => _isSaving = true);
    final success = await PartnerService.deactivatePartner(widget.existingPartner!['id']);
    if (mounted) {
      setState(() => _isSaving = false);
      if (success) {
        _showSnackBar(tr('partners.register.deactivateSuccess', lang));
        Navigator.pop(context, true);
      } else {
        _showSnackBar(tr('partners.register.deactivateFailed', lang), isError: true);
      }
    }
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AlmaTheme.error : AlmaTheme.success,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  String get _lang => ref.read(languageProvider).languageCode;

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;
    final alma = context.alma;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _isEditMode
              ? tr('partners.register.editTitle', lang)
              : tr('partners.register.title', lang),
          style: TextStyle(fontWeight: FontWeight.w600, color: alma.textPrimary),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AlmaTheme.electricBlue))
          : Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Business Name
                  _buildLabel(tr('partners.register.businessName', lang), alma, required: true),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _nameController,
                    style: TextStyle(color: alma.textPrimary),
                    decoration: _inputDecoration(
                      tr('partners.register.businessNameHint', lang), alma,
                    ),
                    validator: (v) => (v == null || v.trim().isEmpty)
                        ? tr('partners.register.required', lang)
                        : null,
                  ),

                  const SizedBox(height: 20),

                  // Cover Image
                  _buildLabel(tr('partners.register.coverImage', lang), alma),
                  const SizedBox(height: 6),
                  _buildCoverImageSection(lang, alma),

                  const SizedBox(height: 20),

                  // Category
                  _buildLabel(tr('partners.register.category', lang), alma, required: true),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _categories.map((cat) {
                      final isSelected = _selectedCategoryId == cat['id'];
                      return ChoiceChip(
                        selected: isSelected,
                        label: Text(
                          tr('partners.categories.${cat['name']}', lang),
                          style: TextStyle(
                            color: isSelected ? Colors.white : alma.textSecondary,
                            fontSize: 13,
                          ),
                        ),
                        backgroundColor: alma.chipBg,
                        selectedColor: AlmaTheme.electricBlue,
                        checkmarkColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(
                            color: isSelected ? AlmaTheme.electricBlue : alma.borderDefault,
                          ),
                        ),
                        onSelected: (_) {
                          setState(() => _selectedCategoryId = isSelected ? null : cat['id'] as int);
                        },
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 20),

                  // Description
                  _buildLabel(tr('partners.register.description', lang), alma),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _descController,
                    style: TextStyle(color: alma.textPrimary),
                    maxLines: 3,
                    decoration: _inputDecoration(
                      tr('partners.register.descriptionHint', lang), alma,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Address
                  _buildLabel(tr('partners.register.address', lang), alma),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _addressController,
                    style: TextStyle(color: alma.textPrimary),
                    decoration: _inputDecoration(
                      tr('partners.register.addressHint', lang), alma,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Location on Map
                  _buildLabel(tr('partners.register.location', lang), alma),
                  const SizedBox(height: 6),
                  _buildLocationSection(lang, alma),

                  const SizedBox(height: 20),

                  // Phone
                  _buildLabel(tr('partners.register.phone', lang), alma),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _phoneController,
                    style: TextStyle(color: alma.textPrimary),
                    keyboardType: TextInputType.phone,
                    decoration: _inputDecoration(
                      tr('partners.register.phoneHint', lang), alma,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Website
                  _buildLabel(tr('partners.register.website', lang), alma),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _websiteController,
                    style: TextStyle(color: alma.textPrimary),
                    keyboardType: TextInputType.url,
                    decoration: _inputDecoration(
                      tr('partners.register.websiteHint', lang), alma,
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Submit Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _isSaving ? null : _submit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AlmaTheme.electricBlue,
                        foregroundColor: Colors.white,
                        disabledBackgroundColor: AlmaTheme.electricBlue.withValues(alpha: 0.5),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isSaving
                          ? const SizedBox(
                              width: 24, height: 24,
                              child: CircularProgressIndicator(
                                color: Colors.white, strokeWidth: 2,
                              ),
                            )
                          : Text(
                              _isEditMode
                                  ? tr('partners.register.save', lang)
                                  : tr('partners.register.submit', lang),
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                            ),
                    ),
                  ),

                  // Deactivate button (edit mode only)
                  if (_isEditMode) ...[
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: OutlinedButton(
                        onPressed: _isSaving ? null : _confirmDeactivate,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AlmaTheme.error,
                          side: const BorderSide(color: AlmaTheme.error),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: Text(
                          tr('partners.register.deactivate', lang),
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                  ],

                  const SizedBox(height: 40),
                ],
              ),
            ),
    );
  }

  Widget _buildCoverImageSection(String lang, AlmaColors alma) {
    final hasLocalImage = _coverImageLocalPath != null;
    final hasRemoteImage = _coverImageUrl != null;

    return GestureDetector(
      onTap: _pickCoverImage,
      child: Container(
        height: 160,
        decoration: BoxDecoration(
          color: alma.chipBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: alma.borderDefault),
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (hasLocalImage)
              Image.file(
                io.File(_coverImageLocalPath!),
                fit: BoxFit.cover,
              )
            else if (hasRemoteImage)
              Image.network(
                _coverImageUrl!,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => _buildCoverPlaceholder(lang, alma),
              )
            else
              _buildCoverPlaceholder(lang, alma),

            // Overlay with edit icon
            Positioned(
              right: 8,
              bottom: 8,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.6),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.camera_alt, color: Colors.white, size: 20),
              ),
            ),

            // Uploading overlay
            if (_isUploadingCover)
              Container(
                color: Colors.black.withValues(alpha: 0.5),
                child: const Center(
                  child: CircularProgressIndicator(color: Colors.white),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildCoverPlaceholder(String lang, AlmaColors alma) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.add_photo_alternate_outlined, size: 40, color: alma.textTertiary),
        const SizedBox(height: 8),
        Text(
          tr('partners.register.selectPhoto', lang),
          style: TextStyle(color: alma.textTertiary, fontSize: 13),
        ),
      ],
    );
  }

  Widget _buildLabel(String text, AlmaColors alma, {bool required = false}) {
    return Row(
      children: [
        Text(
          text,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: alma.textPrimary,
          ),
        ),
        if (required)
          const Text(' *', style: TextStyle(color: AlmaTheme.error, fontSize: 14)),
      ],
    );
  }

  InputDecoration _inputDecoration(String hint, AlmaColors alma) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: alma.textTertiary),
      filled: true,
      fillColor: alma.inputBg,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: alma.borderDefault),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: alma.borderDefault),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AlmaTheme.electricBlue, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AlmaTheme.error),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    );
  }

  Widget _buildLocationSection(String lang, AlmaColors alma) {
    return Column(
      children: [
        // Location info or "Pick on map" button
        if (_selectedLocation != null)
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: alma.cardBg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: alma.borderDefault),
            ),
            child: Row(
              children: [
                const Icon(Icons.location_on, color: AlmaTheme.electricBlue, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '${_selectedLocation!.latitude.toStringAsFixed(5)}, ${_selectedLocation!.longitude.toStringAsFixed(5)}',
                    style: TextStyle(color: alma.textSecondary, fontSize: 13),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.clear, size: 18, color: alma.textTertiary),
                  onPressed: () => setState(() {
                    _selectedLocation = null;
                    _showMap = false;
                  }),
                ),
              ],
            ),
          ),

        const SizedBox(height: 8),

        // Toggle map button
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => setState(() => _showMap = !_showMap),
                icon: Icon(
                  _showMap ? Icons.map : Icons.map_outlined,
                  size: 18,
                ),
                label: Text(tr(
                  _showMap ? 'partners.register.hideMap' : 'partners.register.pickOnMap',
                  lang,
                )),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AlmaTheme.electricBlue,
                  side: const BorderSide(color: AlmaTheme.electricBlue),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                ),
              ),
            ),
            const SizedBox(width: 8),
            OutlinedButton.icon(
              onPressed: _getCurrentLocation,
              icon: const Icon(Icons.my_location, size: 18),
              label: Text(tr('partners.register.useMyLocation', lang)),
              style: OutlinedButton.styleFrom(
                foregroundColor: AlmaTheme.terracottaOrange,
                side: const BorderSide(color: AlmaTheme.terracottaOrange),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                padding: const EdgeInsets.symmetric(vertical: 10),
              ),
            ),
          ],
        ),

        // Map
        if (_showMap) ...[
          const SizedBox(height: 8),
          Container(
            height: 250,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: alma.borderDefault),
            ),
            clipBehavior: Clip.antiAlias,
            child: Stack(
              children: [
                GoogleMap(
                  initialCameraPosition: CameraPosition(
                    target: _selectedLocation ?? const LatLng(10.7769, 106.7009), // HCMC default
                    zoom: 15,
                  ),
                  markers: _selectedLocation != null
                      ? {
                          Marker(
                            markerId: const MarkerId('selected'),
                            position: _selectedLocation!,
                            draggable: true,
                            onDragEnd: (pos) => setState(() => _selectedLocation = pos),
                          ),
                        }
                      : {},
                  onTap: (latLng) => setState(() => _selectedLocation = latLng),
                  onMapCreated: (c) => _mapController = c,
                  myLocationEnabled: true,
                  myLocationButtonEnabled: false,
                  zoomControlsEnabled: false,
                  mapToolbarEnabled: false,
                  style: Theme.of(context).brightness == Brightness.dark
                      ? _darkMapStyle
                      : null,
                ),
                // Hint overlay
                Positioned(
                  bottom: 8,
                  left: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.7),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      tr('partners.register.tapToPlace', lang),
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  static const _darkMapStyle = '''[
    {"elementType": "geometry", "stylers": [{"color": "#1d2c4d"}]},
    {"elementType": "labels.text.fill", "stylers": [{"color": "#8ec3b9"}]},
    {"elementType": "labels.text.stroke", "stylers": [{"color": "#1a3646"}]},
    {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#0e1626"}]},
    {"featureType": "road", "elementType": "geometry", "stylers": [{"color": "#304a7d"}]},
    {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"color": "#255b89"}]}
  ]''';
}
