import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/partner_service.dart';

class VoucherCreateScreen extends ConsumerStatefulWidget {
  final String partnerId;
  final Map<String, dynamic>? existingVoucher;

  const VoucherCreateScreen({
    super.key,
    required this.partnerId,
    this.existingVoucher,
  });

  @override
  ConsumerState<VoucherCreateScreen> createState() =>
      _VoucherCreateScreenState();
}

class _VoucherCreateScreenState extends ConsumerState<VoucherCreateScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _discountValueController = TextEditingController();
  final _termsController = TextEditingController();
  final _maxRedemptionsController = TextEditingController();

  String _discountType = 'percentage';
  DateTime? _validUntil;
  bool _isSubmitting = false;

  bool get _isEditMode => widget.existingVoucher != null;

  @override
  void initState() {
    super.initState();
    if (_isEditMode) {
      _prefillForm();
    }
  }

  void _prefillForm() {
    final v = widget.existingVoucher!;
    _titleController.text = v['title'] ?? '';
    _descriptionController.text = v['description'] ?? '';
    _discountType = v['discount_type'] ?? 'percentage';
    if (v['discount_value'] != null) {
      _discountValueController.text = v['discount_value'].toString();
    }
    _termsController.text = v['terms'] ?? '';
    if (v['max_redemptions'] != null) {
      _maxRedemptionsController.text = v['max_redemptions'].toString();
    }
    if (v['valid_until'] != null) {
      _validUntil = DateTime.tryParse(v['valid_until']);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _discountValueController.dispose();
    _termsController.dispose();
    _maxRedemptionsController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final title = _titleController.text.trim();
      final description = _descriptionController.text.trim();
      final terms = _termsController.text.trim();
      final discountValue = double.tryParse(_discountValueController.text);
      final maxRedemptions = int.tryParse(_maxRedemptionsController.text);

      if (_isEditMode) {
        final success = await PartnerService.updateVoucher(
          voucherId: widget.existingVoucher!['id'],
          title: title,
          description: description.isNotEmpty ? description : null,
          discountType: _discountType,
          discountValue: discountValue,
          terms: terms.isNotEmpty ? terms : null,
          maxRedemptions: maxRedemptions,
          validUntil: _validUntil,
        );
        if (mounted) {
          if (success) {
            Navigator.pop(context, true);
          } else {
            _showError();
          }
        }
      } else {
        final result = await PartnerService.createVoucher(
          partnerId: widget.partnerId,
          title: title,
          discountType: _discountType,
          discountValue: discountValue,
          description: description.isNotEmpty ? description : null,
          terms: terms.isNotEmpty ? terms : null,
          maxRedemptions: maxRedemptions,
          validUntil: _validUntil,
        );
        if (mounted) {
          if (result != null) {
            Navigator.pop(context, true);
          } else {
            _showError();
          }
        }
      }
    } catch (e) {
      if (mounted) _showError();
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _showError() {
    final lang = ref.read(languageProvider).languageCode;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(tr('voucher.saveFailed', lang)),
        backgroundColor: AlmaTheme.error,
      ),
    );
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _validUntil ?? now.add(const Duration(days: 30)),
      firstDate: now,
      lastDate: now.add(const Duration(days: 365 * 3)),
      builder: (context, child) {
        final alma = context.alma;
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: isDark
                ? ColorScheme.dark(
                    primary: AlmaTheme.electricBlue,
                    surface: alma.cardBg,
                    onSurface: alma.textPrimary,
                  )
                : ColorScheme.light(
                    primary: AlmaTheme.electricBlue,
                    surface: alma.cardBg,
                    onSurface: alma.textPrimary,
                  ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() => _validUntil = picked);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;
    final alma = context.alma;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _isEditMode
              ? tr('voucher.editTitle', lang)
              : tr('voucher.createTitle', lang),
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: alma.textPrimary,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title
              _buildLabel(tr('voucher.title', lang), alma),
              const SizedBox(height: 6),
              TextFormField(
                controller: _titleController,
                style: TextStyle(color: alma.textPrimary),
                decoration: InputDecoration(
                  hintText: tr('voucher.titleHint', lang),
                ),
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? tr('voucher.required', lang) : null,
              ),
              const SizedBox(height: 20),

              // Description
              _buildLabel(tr('voucher.description', lang), alma),
              const SizedBox(height: 6),
              TextFormField(
                controller: _descriptionController,
                style: TextStyle(color: alma.textPrimary),
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: tr('voucher.descriptionHint', lang),
                ),
              ),
              const SizedBox(height: 20),

              // Discount Type
              _buildLabel(tr('voucher.discountType', lang), alma),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: [
                  _discountChip('percentage', tr('voucher.percentage', lang), alma),
                  _discountChip('fixed', tr('voucher.fixed', lang), alma),
                  _discountChip('free_item', tr('voucher.freeItem', lang), alma),
                ],
              ),
              const SizedBox(height: 20),

              // Discount Value (hidden for free_item)
              if (_discountType != 'free_item') ...[
                _buildLabel(
                  _discountType == 'percentage'
                      ? tr('voucher.percentageValue', lang)
                      : tr('voucher.fixedValue', lang),
                  alma,
                ),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _discountValueController,
                  style: TextStyle(color: alma.textPrimary),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'[\d.]')),
                  ],
                  decoration: InputDecoration(
                    hintText: _discountType == 'percentage' ? 'e.g. 10' : 'e.g. 5000',
                    suffixText: _discountType == 'percentage' ? '%' : null,
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Terms
              _buildLabel(tr('voucher.terms', lang), alma),
              const SizedBox(height: 6),
              TextFormField(
                controller: _termsController,
                style: TextStyle(color: alma.textPrimary),
                maxLines: 2,
                decoration: InputDecoration(
                  hintText: tr('voucher.termsHint', lang),
                ),
              ),
              const SizedBox(height: 20),

              // Max Redemptions
              _buildLabel(tr('voucher.maxRedemptions', lang), alma),
              const SizedBox(height: 6),
              TextFormField(
                controller: _maxRedemptionsController,
                style: TextStyle(color: alma.textPrimary),
                keyboardType: TextInputType.number,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                decoration: InputDecoration(
                  hintText: tr('voucher.maxRedemptionsHint', lang),
                ),
              ),
              const SizedBox(height: 20),

              // Valid Until
              _buildLabel(tr('voucher.validUntil', lang), alma),
              const SizedBox(height: 6),
              GestureDetector(
                onTap: _pickDate,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: alma.inputBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: alma.borderDefault),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          _validUntil != null
                              ? '${_validUntil!.year}-${_validUntil!.month.toString().padLeft(2, '0')}-${_validUntil!.day.toString().padLeft(2, '0')}'
                              : tr('voucher.noExpiry', lang),
                          style: TextStyle(
                            color: _validUntil != null
                                ? alma.textPrimary
                                : alma.textTertiary,
                          ),
                        ),
                      ),
                      if (_validUntil != null)
                        GestureDetector(
                          onTap: () => setState(() => _validUntil = null),
                          child: Icon(Icons.clear, size: 18, color: alma.textTertiary),
                        )
                      else
                        Icon(Icons.calendar_today, size: 18, color: alma.textTertiary),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AlmaTheme.terracottaOrange,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isSubmitting
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : Text(
                          _isEditMode
                              ? tr('voucher.save', lang)
                              : tr('voucher.create', lang),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text, AlmaColors alma) {
    return Text(
      text,
      style: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: alma.textSecondary,
      ),
    );
  }

  Widget _discountChip(String type, String label, AlmaColors alma) {
    final isSelected = _discountType == type;
    return ChoiceChip(
      selected: isSelected,
      label: Text(
        label,
        style: TextStyle(
          fontSize: 13,
          color: isSelected ? Colors.white : alma.textSecondary,
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
        setState(() => _discountType = type);
      },
    );
  }
}
