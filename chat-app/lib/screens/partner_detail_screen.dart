import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/partner_service.dart';
import 'partner_register_screen.dart';
import 'voucher_create_screen.dart';

class PartnerDetailScreen extends ConsumerStatefulWidget {
  final String partnerId;
  final String? userId;

  const PartnerDetailScreen({super.key, required this.partnerId, this.userId});

  @override
  ConsumerState<PartnerDetailScreen> createState() => _PartnerDetailScreenState();
}

class _PartnerDetailScreenState extends ConsumerState<PartnerDetailScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _partner;
  List<Map<String, dynamic>> _vouchers = [];
  List<Map<String, dynamic>> _photos = [];

  bool get _isOwner =>
      widget.userId != null &&
      _partner != null &&
      widget.userId == _partner!['owner_user_id'];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final results = await Future.wait([
        PartnerService.getPartnerById(widget.partnerId),
        _isOwner
            ? PartnerService.getOwnerVouchers(widget.partnerId)
            : PartnerService.getVouchers(widget.partnerId),
        PartnerService.getPartnerPhotos(widget.partnerId),
      ]);
      if (mounted) {
        setState(() {
          _partner = results[0] as Map<String, dynamic>?;
          _vouchers = results[1] as List<Map<String, dynamic>>;
          _photos = results[2] as List<Map<String, dynamic>>;
          _isLoading = false;
        });
        // Reload vouchers with correct owner context after partner loaded
        if (_partner != null) {
          _reloadVouchers();
        }
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _reloadVouchers() async {
    final vouchers = _isOwner
        ? await PartnerService.getOwnerVouchers(widget.partnerId)
        : await PartnerService.getVouchers(widget.partnerId);
    if (mounted) setState(() => _vouchers = vouchers);
  }

  Future<void> _openInMaps() async {
    final lat = _partner?['latitude'];
    final lng = _partner?['longitude'];
    if (lat == null || lng == null) return;

    final uri = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    try {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (e) {
      debugPrint('[PartnerDetail] openInMaps error: $e');
    }
  }

  void _showQrDialog(Map<String, dynamic> voucher, String lang) {
    if (widget.userId == null) return;
    final userId = widget.userId!;

    showDialog(
      context: context,
      builder: (ctx) => _QrCodeDialog(
        voucher: voucher,
        partnerId: widget.partnerId,
        userId: userId,
        lang: lang,
      ),
    );
  }

  void _navigateToEdit() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PartnerRegisterScreen(
          userId: widget.userId,
          existingPartner: _partner,
        ),
      ),
    ).then((result) {
      if (result == true) _loadData();
    });
  }

  void _navigateToCreateVoucher() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => VoucherCreateScreen(partnerId: widget.partnerId),
      ),
    ).then((result) {
      if (result == true) _reloadVouchers();
    });
  }

  void _navigateToEditVoucher(Map<String, dynamic> voucher) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => VoucherCreateScreen(
          partnerId: widget.partnerId,
          existingVoucher: voucher,
        ),
      ),
    ).then((result) {
      if (result == true) _reloadVouchers();
    });
  }

  Future<void> _addPhoto() async {
    final lang = ref.read(languageProvider).languageCode;
    final alma = context.alma;

    final source = await showModalBottomSheet<ImageSource>(
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
              onTap: () => Navigator.pop(ctx, ImageSource.gallery),
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
              onTap: () => Navigator.pop(ctx, ImageSource.camera),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );

    if (source == null) return;

    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source,
        maxWidth: 1200,
        maxHeight: 900,
        imageQuality: 85,
      );
      if (picked == null || !mounted) return;

      _showSnackBar(tr('partners.detail.photoUploading', lang));

      final result = await PartnerService.addPartnerPhoto(
        partnerId: widget.partnerId,
        filePath: picked.path,
        uploadedBy: widget.userId,
      );

      if (mounted) {
        if (result != null) {
          _showSnackBar(tr('partners.detail.photoUploaded', lang));
          _loadData();
        } else {
          _showSnackBar(tr('partners.detail.photoUploadFailed', lang), isError: true);
        }
      }
    } catch (e) {
      debugPrint('[PartnerDetail] addPhoto error: $e');
    }
  }

  Future<void> _deletePhoto(String photoId) async {
    final lang = ref.read(languageProvider).languageCode;
    final alma = context.alma;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: alma.cardBg,
        title: Text(tr('partners.detail.deletePhoto', lang), style: TextStyle(color: alma.textPrimary)),
        content: Text(tr('partners.detail.deletePhotoConfirm', lang), style: TextStyle(color: alma.textSecondary)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text(tr('common.cancel', lang), style: TextStyle(color: alma.textSecondary)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text(tr('partners.detail.deleteConfirmBtn', lang), style: const TextStyle(color: AlmaTheme.error)),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    final success = await PartnerService.deletePartnerPhoto(photoId);
    if (mounted) {
      if (success) {
        _loadData();
      } else {
        _showSnackBar(tr('partners.detail.photoDeleteFailed', lang), isError: true);
      }
    }
  }

  Future<void> _toggleVoucherActive(Map<String, dynamic> voucher) async {
    final isActive = voucher['is_active'] as bool? ?? true;
    final success = isActive
        ? await PartnerService.deactivateVoucher(voucher['id'])
        : await PartnerService.updateVoucher(voucherId: voucher['id'], isActive: true);
    if (mounted && success) {
      _reloadVouchers();
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

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;
    final alma = context.alma;

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: CircularProgressIndicator(color: AlmaTheme.electricBlue)),
      );
    }

    if (_partner == null) {
      return Scaffold(
        appBar: AppBar(),
        body: Center(
          child: Text(tr('partners.noResults', lang),
              style: TextStyle(color: alma.textSecondary)),
        ),
      );
    }

    final partner = _partner!;
    final categoryData = partner['partner_categories'] as Map<String, dynamic>?;
    final categoryName = categoryData?['name'] as String? ?? 'other';

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Cover image
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: partner['cover_image_url'] != null
                  ? Image.network(
                      partner['cover_image_url'],
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: alma.surfaceVariant,
                        child: Icon(Icons.storefront, size: 64, color: alma.textTertiary),
                      ),
                    )
                  : Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            AlmaTheme.electricBlue.withValues(alpha: 0.3),
                            AlmaTheme.terracottaOrange.withValues(alpha: 0.3),
                          ],
                        ),
                      ),
                      child: Icon(Icons.storefront, size: 64, color: alma.textTertiary),
                    ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Business name + category
                  Row(
                    children: [
                      if (partner['logo_url'] != null) ...[
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: alma.borderDefault),
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(partner['logo_url'], fit: BoxFit.cover),
                          ),
                        ),
                        const SizedBox(width: 12),
                      ],
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              partner['business_name'] ?? '',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: alma.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                              decoration: BoxDecoration(
                                color: AlmaTheme.electricBlue.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                tr('partners.categories.$categoryName', lang),
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AlmaTheme.electricBlue,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  // Owner action bar
                  if (_isOwner) ...[
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: _navigateToEdit,
                            icon: const Icon(Icons.edit, size: 18),
                            label: Text(tr('partners.detail.edit', lang)),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AlmaTheme.electricBlue,
                              side: const BorderSide(color: AlmaTheme.electricBlue),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: _navigateToCreateVoucher,
                            icon: const Icon(Icons.local_offer, size: 18),
                            label: Text(tr('partners.detail.addVoucher', lang)),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AlmaTheme.terracottaOrange,
                              side: const BorderSide(color: AlmaTheme.terracottaOrange),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],

                  const SizedBox(height: 20),

                  // Address
                  if (partner['address'] != null) ...[
                    _infoRow(
                      Icons.location_on_outlined,
                      partner['address'],
                      alma,
                      trailing: TextButton(
                        onPressed: _openInMaps,
                        child: Text(
                          tr('partners.detail.openInMaps', lang),
                          style: const TextStyle(
                            fontSize: 13,
                            color: AlmaTheme.electricBlue,
                          ),
                        ),
                      ),
                    ),
                  ],

                  // Phone
                  if (partner['phone'] != null)
                    _infoRow(Icons.phone_outlined, partner['phone'], alma),

                  // Website
                  if (partner['website'] != null)
                    GestureDetector(
                      onTap: () async {
                        try {
                          var url = partner['website'] as String;
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            url = 'https://$url';
                          }
                          final uri = Uri.parse(url);
                          if (await canLaunchUrl(uri)) {
                            await launchUrl(uri, mode: LaunchMode.externalApplication);
                          }
                        } catch (e) {
                          debugPrint('[PartnerDetail] website launch error: $e');
                        }
                      },
                      child: _infoRow(
                        Icons.language,
                        partner['website'],
                        alma,
                        textColor: AlmaTheme.electricBlue,
                      ),
                    ),

                  // Description
                  if (partner['description'] != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      tr('partners.detail.description', lang),
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: alma.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      partner['description'],
                      style: TextStyle(
                        fontSize: 14,
                        color: alma.textSecondary,
                        height: 1.5,
                      ),
                    ),
                  ],

                  // Photos section
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Text(
                        tr('partners.detail.photos', lang),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: alma.textPrimary,
                        ),
                      ),
                      const Spacer(),
                      // Add photo button (all users)
                      TextButton.icon(
                        onPressed: _addPhoto,
                        icon: const Icon(Icons.add_a_photo, size: 16),
                        label: Text(tr('partners.detail.addPhoto', lang)),
                        style: TextButton.styleFrom(
                          foregroundColor: AlmaTheme.electricBlue,
                          textStyle: const TextStyle(fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  if (_photos.isEmpty)
                    Container(
                      height: 100,
                      decoration: BoxDecoration(
                        color: alma.chipBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: alma.borderDefault),
                      ),
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.photo_library_outlined, size: 32, color: alma.textTertiary),
                            const SizedBox(height: 4),
                            Text(
                              tr('partners.detail.noPhotos', lang),
                              style: TextStyle(color: alma.textTertiary, fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    SizedBox(
                      height: 120,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _photos.length,
                        itemBuilder: (context, index) {
                          final photo = _photos[index];
                          return Padding(
                            padding: EdgeInsets.only(right: index < _photos.length - 1 ? 8 : 0),
                            child: Stack(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Image.network(
                                    photo['photo_url'],
                                    width: 160,
                                    height: 120,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                // Delete button for owner
                                if (_isOwner)
                                  Positioned(
                                    top: 4,
                                    right: 4,
                                    child: GestureDetector(
                                      onTap: () => _deletePhoto(photo['id']),
                                      child: Container(
                                        padding: const EdgeInsets.all(4),
                                        decoration: BoxDecoration(
                                          color: Colors.black.withValues(alpha: 0.6),
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(Icons.close, color: Colors.white, size: 16),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),

                  // Vouchers
                  const SizedBox(height: 24),
                  Text(
                    tr('partners.detail.vouchers', lang),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: alma.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 12),

                  if (_vouchers.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: alma.cardBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: alma.borderDefault),
                      ),
                      child: Center(
                        child: Text(
                          tr('partners.detail.noVouchers', lang),
                          style: TextStyle(color: alma.textTertiary),
                        ),
                      ),
                    )
                  else
                    ..._vouchers.map((v) => _voucherCard(v, lang)),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoRow(IconData icon, String text, AlmaColors alma, {
    Color? textColor,
    Widget? trailing,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, size: 20, color: alma.textTertiary),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 14,
                color: textColor ?? alma.textSecondary,
              ),
            ),
          ),
          if (trailing != null) trailing,
        ],
      ),
    );
  }

  Widget _voucherCard(Map<String, dynamic> voucher, String lang) {
    final alma = context.alma;
    final discountType = voucher['discount_type'] as String? ?? 'percentage';
    final discountValue = voucher['discount_value'];
    final validUntil = voucher['valid_until'] != null
        ? DateTime.tryParse(voucher['valid_until'])
        : null;
    final isActive = voucher['is_active'] as bool? ?? true;
    final currentRedemptions = voucher['current_redemptions'] as int? ?? 0;
    final maxRedemptions = voucher['max_redemptions'] as int?;

    String discountLabel;
    switch (discountType) {
      case 'percentage':
        discountLabel = '${discountValue?.toInt() ?? 0}% OFF';
      case 'fixed':
        discountLabel = '\$${discountValue ?? 0} OFF';
      case 'free_item':
        discountLabel = tr('partners.voucher.freeItem', lang);
      default:
        discountLabel = 'Discount';
    }

    return Opacity(
      opacity: isActive ? 1.0 : 0.5,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: alma.cardBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isActive ? alma.borderDefault : alma.divider),
          boxShadow: alma.cardShadow,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Discount badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AlmaTheme.terracottaOrange.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    discountLabel,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: AlmaTheme.terracottaOrange,
                    ),
                  ),
                ),
                if (!isActive) ...[
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: alma.chipBg,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      tr('partners.detail.inactive', lang),
                      style: TextStyle(fontSize: 11, color: alma.textTertiary),
                    ),
                  ),
                ],
                const Spacer(),
                if (validUntil != null)
                  Text(
                    tr('partners.voucher.validUntil', lang, args: {
                      'date': '${validUntil.month}/${validUntil.day}',
                    }),
                    style: TextStyle(fontSize: 12, color: alma.textTertiary),
                  ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              voucher['title'] ?? '',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: alma.textPrimary,
              ),
            ),
            if (voucher['description'] != null) ...[
              const SizedBox(height: 4),
              Text(
                voucher['description'],
                style: TextStyle(fontSize: 13, color: alma.textSecondary),
              ),
            ],
            if (voucher['terms'] != null) ...[
              const SizedBox(height: 8),
              Text(
                '${tr('partners.voucher.terms', lang)}: ${voucher['terms']}',
                style: TextStyle(fontSize: 12, color: alma.textTertiary, fontStyle: FontStyle.italic),
              ),
            ],

            // Owner: redemption stats + controls
            if (_isOwner) ...[
              const SizedBox(height: 10),
              Row(
                children: [
                  Icon(Icons.confirmation_number_outlined, size: 14, color: alma.textTertiary),
                  const SizedBox(width: 4),
                  Text(
                    maxRedemptions != null
                        ? '$currentRedemptions / $maxRedemptions ${tr('partners.voucher.redeemed', lang)}'
                        : '$currentRedemptions ${tr('partners.voucher.redeemed', lang)}',
                    style: TextStyle(fontSize: 12, color: alma.textTertiary),
                  ),
                  const Spacer(),
                  // Edit button
                  IconButton(
                    icon: Icon(Icons.edit_outlined, size: 18, color: alma.textSecondary),
                    onPressed: () => _navigateToEditVoucher(voucher),
                    constraints: const BoxConstraints(),
                    padding: const EdgeInsets.all(6),
                  ),
                  const SizedBox(width: 4),
                  // Toggle active
                  IconButton(
                    icon: Icon(
                      isActive ? Icons.toggle_on : Icons.toggle_off,
                      size: 28,
                      color: isActive ? AlmaTheme.success : alma.textTertiary,
                    ),
                    onPressed: () => _toggleVoucherActive(voucher),
                    constraints: const BoxConstraints(),
                    padding: const EdgeInsets.all(4),
                  ),
                ],
              ),
            ] else ...[
              // Regular user: Use Voucher button
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isActive ? () => _showQrDialog(voucher, lang) : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AlmaTheme.electricBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: Text(tr('partners.detail.useVoucher', lang)),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ── QR Code Dialog ──

class _QrCodeDialog extends StatefulWidget {
  final Map<String, dynamic> voucher;
  final String partnerId;
  final String userId;
  final String lang;

  const _QrCodeDialog({
    required this.voucher,
    required this.partnerId,
    required this.userId,
    required this.lang,
  });

  @override
  State<_QrCodeDialog> createState() => _QrCodeDialogState();
}

class _QrCodeDialogState extends State<_QrCodeDialog> {
  bool _isGenerating = true;
  String? _qrCode;
  DateTime? _expiresAt;
  Timer? _countdownTimer;
  int _remainingSeconds = 300; // 5 minutes

  @override
  void initState() {
    super.initState();
    _generateQr();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }

  Future<void> _generateQr() async {
    final result = await PartnerService.generateQrCode(
      voucherId: widget.voucher['id'],
      userId: widget.userId,
      partnerId: widget.partnerId,
    );

    if (result != null && mounted) {
      setState(() {
        _qrCode = result['qr_code'] as String?;
        _expiresAt = DateTime.tryParse(result['qr_expires_at'] ?? '');
        _isGenerating = false;
      });
      _startCountdown();
    } else if (mounted) {
      setState(() => _isGenerating = false);
    }
  }

  void _startCountdown() {
    if (_expiresAt == null) return;
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      final remaining = _expiresAt!.difference(DateTime.now()).inSeconds;
      if (remaining <= 0) {
        _countdownTimer?.cancel();
        if (mounted) setState(() => _remainingSeconds = 0);
      } else {
        if (mounted) setState(() => _remainingSeconds = remaining);
      }
    });
  }

  String _formatTime(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    final isExpired = _remainingSeconds <= 0 && !_isGenerating;

    return Dialog(
      backgroundColor: alma.cardBg,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              tr('partners.voucher.qrTitle', widget.lang),
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: alma.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              widget.voucher['title'] ?? '',
              style: TextStyle(fontSize: 14, color: alma.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),

            if (_isGenerating)
              SizedBox(
                height: 200,
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const CircularProgressIndicator(color: AlmaTheme.electricBlue),
                      const SizedBox(height: 12),
                      Text(tr('partners.voucher.qrGenerating', widget.lang)),
                    ],
                  ),
                ),
              )
            else if (_qrCode == null)
              SizedBox(
                height: 200,
                child: Center(
                  child: Text(
                    tr('partners.voucher.qrGenerating', widget.lang),
                    style: TextStyle(color: alma.textSecondary),
                  ),
                ),
              )
            else ...[
              // QR Code
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: QrImageView(
                  data: _qrCode!,
                  version: QrVersions.auto,
                  size: 180,
                  backgroundColor: Colors.white,
                  eyeStyle: const QrEyeStyle(
                    eyeShape: QrEyeShape.square,
                    color: Color(0xFF0A0F1A),
                  ),
                  dataModuleStyle: const QrDataModuleStyle(
                    dataModuleShape: QrDataModuleShape.square,
                    color: Color(0xFF0A0F1A),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Code text
              Text(
                _qrCode!,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: alma.textPrimary,
                  letterSpacing: 4,
                  fontFamily: 'monospace',
                ),
              ),
              const SizedBox(height: 12),

              // Countdown
              if (isExpired)
                Text(
                  tr('partners.voucher.qrExpired', widget.lang),
                  style: const TextStyle(
                    fontSize: 14,
                    color: AlmaTheme.error,
                    fontWeight: FontWeight.w600,
                  ),
                )
              else
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.timer, size: 16, color: alma.textTertiary),
                    const SizedBox(width: 4),
                    Text(
                      tr('partners.voucher.qrExpires', widget.lang, args: {
                        'time': _formatTime(_remainingSeconds),
                      }),
                      style: TextStyle(
                        fontSize: 14,
                        color: _remainingSeconds < 60
                            ? AlmaTheme.error
                            : alma.textSecondary,
                      ),
                    ),
                  ],
                ),
            ],

            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text(
                  tr('common.close', widget.lang),
                  style: TextStyle(color: alma.textSecondary),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
