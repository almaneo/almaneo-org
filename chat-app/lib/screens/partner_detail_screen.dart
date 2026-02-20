import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/partner_service.dart';

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
        PartnerService.getVouchers(widget.partnerId),
        PartnerService.getPartnerPhotos(widget.partnerId),
      ]);
      if (mounted) {
        setState(() {
          _partner = results[0] as Map<String, dynamic>?;
          _vouchers = results[1] as List<Map<String, dynamic>>;
          _photos = results[2] as List<Map<String, dynamic>>;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _openInMaps() async {
    final lat = _partner?['latitude'];
    final lng = _partner?['longitude'];
    final name = _partner?['business_name'] ?? '';
    if (lat == null || lng == null) return;

    final uri = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng&query_place_id=$name');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
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
                        final uri = Uri.parse(partner['website']);
                        if (await canLaunchUrl(uri)) {
                          await launchUrl(uri, mode: LaunchMode.externalApplication);
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

                  // Photos
                  if (_photos.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    SizedBox(
                      height: 120,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _photos.length,
                        itemBuilder: (context, index) {
                          return Padding(
                            padding: EdgeInsets.only(right: index < _photos.length - 1 ? 8 : 0),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.network(
                                _photos[index]['photo_url'],
                                width: 160,
                                height: 120,
                                fit: BoxFit.cover,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],

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

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: alma.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: alma.borderDefault),
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
              const Spacer(),
              if (validUntil != null)
                Text(
                  '${tr('partners.voucher.validUntil', lang)} ${validUntil.month}/${validUntil.day}',
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
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => _showQrDialog(voucher, lang),
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
              const SizedBox(
                height: 200,
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CircularProgressIndicator(color: AlmaTheme.electricBlue),
                      SizedBox(height: 12),
                      Text('Generating...'),
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
                      '${tr('partners.voucher.qrExpires', widget.lang)} ${_formatTime(_remainingSeconds)}',
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
