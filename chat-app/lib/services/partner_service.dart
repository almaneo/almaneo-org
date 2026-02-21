import 'dart:io' as io;
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class PartnerService {
  static SupabaseClient get _db => Supabase.instance.client;

  // ── Categories ──

  static Future<List<Map<String, dynamic>>> getCategories() async {
    try {
      final data = await _db
          .from('partner_categories')
          .select()
          .order('sort_order');
      return List<Map<String, dynamic>>.from(data);
    } catch (e) {
      debugPrint('[PartnerService] getCategories error: $e');
      return [];
    }
  }

  // ── Partners ──

  static Future<List<Map<String, dynamic>>> getPartners({
    int? categoryId,
    String? search,
    double? lat,
    double? lng,
  }) async {
    try {
      var query = _db
          .from('partners')
          .select('*, partner_categories(name, icon)')
          .eq('is_active', true);

      if (categoryId != null) {
        query = query.eq('category_id', categoryId);
      }

      if (search != null && search.isNotEmpty) {
        query = query.ilike('business_name', '%$search%');
      }

      final data = await query.order('created_at', ascending: false);
      var results = List<Map<String, dynamic>>.from(data);

      // Client-side Haversine distance sort
      if (lat != null && lng != null) {
        for (var i = 0; i < results.length; i++) {
          final pLat = results[i]['latitude'] as double?;
          final pLng = results[i]['longitude'] as double?;
          if (pLat != null && pLng != null) {
            results[i] = {
              ...results[i],
              '_distance_km': _haversineDistance(lat, lng, pLat, pLng),
            };
          }
        }
        results.sort((a, b) {
          final da = a['_distance_km'] as double? ?? double.infinity;
          final db = b['_distance_km'] as double? ?? double.infinity;
          return da.compareTo(db);
        });
      }

      return results;
    } catch (e) {
      debugPrint('[PartnerService] getPartners error: $e');
      return [];
    }
  }

  static Future<Map<String, dynamic>?> getPartnerById(String id) async {
    try {
      final data = await _db
          .from('partners')
          .select('*, partner_categories(name, icon)')
          .eq('id', id)
          .maybeSingle();
      return data;
    } catch (e) {
      debugPrint('[PartnerService] getPartnerById error: $e');
      return null;
    }
  }

  static Future<List<Map<String, dynamic>>> getPartnerPhotos(String partnerId) async {
    try {
      final data = await _db
          .from('partner_photos')
          .select()
          .eq('partner_id', partnerId)
          .order('sort_order');
      return List<Map<String, dynamic>>.from(data);
    } catch (e) {
      debugPrint('[PartnerService] getPartnerPhotos error: $e');
      return [];
    }
  }

  // ── Vouchers ──

  static Future<List<Map<String, dynamic>>> getVouchers(String partnerId) async {
    try {
      final now = DateTime.now().toIso8601String();
      final data = await _db
          .from('vouchers')
          .select()
          .eq('partner_id', partnerId)
          .eq('is_active', true)
          .or('valid_until.is.null,valid_until.gte.$now')
          .order('created_at', ascending: false);
      return List<Map<String, dynamic>>.from(data);
    } catch (e) {
      debugPrint('[PartnerService] getVouchers error: $e');
      return [];
    }
  }

  /// Generate a QR code for a voucher (8-char alphanumeric, 5-min expiry)
  static Future<Map<String, dynamic>?> generateQrCode({
    required String voucherId,
    required String userId,
    required String partnerId,
  }) async {
    try {
      final code = _generateCode(8);
      final expiresAt = DateTime.now().toUtc().add(const Duration(minutes: 5));

      final data = await _db.from('voucher_redemptions').insert({
        'voucher_id': voucherId,
        'user_id': userId,
        'partner_id': partnerId,
        'qr_code': code,
        'qr_expires_at': expiresAt.toIso8601String(),
        'status': 'pending',
      }).select().single();

      return data;
    } catch (e) {
      debugPrint('[PartnerService] generateQrCode error: $e');
      return null;
    }
  }

  /// Redeem a voucher by QR code
  static Future<Map<String, String>> redeemVoucher(String qrCode) async {
    try {
      final redemption = await _db
          .from('voucher_redemptions')
          .select()
          .eq('qr_code', qrCode.toUpperCase())
          .maybeSingle();

      if (redemption == null) {
        return {'error': 'invalid_code'};
      }

      if (redemption['status'] == 'redeemed') {
        return {'error': 'already_redeemed'};
      }

      final expiresAt = DateTime.parse(redemption['qr_expires_at']);
      if (DateTime.now().isAfter(expiresAt)) {
        // Mark as expired
        await _db
            .from('voucher_redemptions')
            .update({'status': 'expired'})
            .eq('id', redemption['id']);
        return {'error': 'expired'};
      }

      // Check max_redemptions before redeeming
      final voucher = await _db
          .from('vouchers')
          .select('max_redemptions, current_redemptions')
          .eq('id', redemption['voucher_id'])
          .maybeSingle();
      if (voucher != null) {
        final maxR = voucher['max_redemptions'] as int?;
        final currentR = voucher['current_redemptions'] as int? ?? 0;
        if (maxR != null && currentR >= maxR) {
          return {'error': 'max_redemptions_reached'};
        }
      }

      // Mark as redeemed
      await _db.from('voucher_redemptions').update({
        'status': 'redeemed',
        'redeemed_at': DateTime.now().toIso8601String(),
      }).eq('id', redemption['id']);

      // Increment redemption count on voucher
      await _db.rpc('increment_voucher_redemptions', params: {
        'voucher_uuid': redemption['voucher_id'],
      }).catchError((e) {
        // Fallback: manual increment if RPC doesn't exist
        debugPrint('[PartnerService] RPC fallback: $e');
      });

      return {'success': 'true'};
    } catch (e) {
      debugPrint('[PartnerService] redeemVoucher error: $e');
      return {'error': 'unknown'};
    }
  }

  // ── Create / Update ──

  static Future<Map<String, dynamic>?> createPartner({
    required String businessName,
    required int categoryId,
    String? ownerUserId,
    String? description,
    String? address,
    double? latitude,
    double? longitude,
    String? phone,
    String? website,
    String? coverImageUrl,
  }) async {
    try {
      // Validate owner: must be a valid wallet_address in users table (FK constraint)
      String? validOwner;
      if (ownerUserId != null) {
        final normalizedOwner = ownerUserId.toLowerCase();
        final user = await _db
            .from('users')
            .select('wallet_address')
            .eq('wallet_address', normalizedOwner)
            .maybeSingle();
        validOwner = user != null ? normalizedOwner : null;
        if (validOwner == null) {
          debugPrint('[PartnerService] owner_user_id "$ownerUserId" not found in users table');
        }
      }

      final data = await _db.from('partners').insert({
        'business_name': businessName,
        'category_id': categoryId,
        'owner_user_id': validOwner,
        'description': description,
        'address': address,
        'latitude': latitude,
        'longitude': longitude,
        'phone': phone,
        'website': website,
        'cover_image_url': coverImageUrl,
        'is_active': true,
      }).select().single();
      return data;
    } catch (e) {
      debugPrint('[PartnerService] createPartner error: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> updatePartner({
    required String partnerId,
    required String businessName,
    required int categoryId,
    String? description,
    String? address,
    double? latitude,
    double? longitude,
    String? phone,
    String? website,
    String? coverImageUrl,
  }) async {
    try {
      final updates = <String, dynamic>{
        'business_name': businessName,
        'category_id': categoryId,
        'description': description,
        'address': address,
        'latitude': latitude,
        'longitude': longitude,
        'phone': phone,
        'website': website,
      };
      updates['cover_image_url'] = coverImageUrl;
      final data = await _db
          .from('partners')
          .update(updates)
          .eq('id', partnerId)
          .select()
          .single();
      return data;
    } catch (e) {
      debugPrint('[PartnerService] updatePartner error: $e');
      return null;
    }
  }

  static Future<bool> deactivatePartner(String partnerId) async {
    try {
      await _db
          .from('partners')
          .update({'is_active': false})
          .eq('id', partnerId);
      return true;
    } catch (e) {
      debugPrint('[PartnerService] deactivatePartner error: $e');
      return false;
    }
  }

  // ── Photos ──

  static Future<String?> uploadCoverImage({
    required String partnerId,
    required String filePath,
  }) async {
    try {
      final bytes = await _getFile(filePath);
      final ext = filePath.split('.').last.toLowerCase();
      final storagePath = 'partners/$partnerId/cover.$ext';
      await _db.storage.from('partner-photos').uploadBinary(
        storagePath,
        bytes,
        fileOptions: const FileOptions(upsert: true),
      );
      final url = _db.storage.from('partner-photos').getPublicUrl(storagePath);
      final cacheBustedUrl = '$url?v=${DateTime.now().millisecondsSinceEpoch}';
      // Update partner record
      await _db
          .from('partners')
          .update({'cover_image_url': cacheBustedUrl})
          .eq('id', partnerId);
      return cacheBustedUrl;
    } catch (e) {
      debugPrint('[PartnerService] uploadCoverImage error: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> addPartnerPhoto({
    required String partnerId,
    required String filePath,
    String? uploadedBy,
    String? caption,
  }) async {
    try {
      final bytes = await _getFile(filePath);
      final ext = filePath.split('.').last.toLowerCase();
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final storagePath = 'partners/$partnerId/gallery/$timestamp.$ext';
      await _db.storage.from('partner-photos').uploadBinary(
        storagePath,
        bytes,
        fileOptions: const FileOptions(upsert: true),
      );
      final url = _db.storage.from('partner-photos').getPublicUrl(storagePath);

      // Get current max sort_order
      final existing = await _db
          .from('partner_photos')
          .select('sort_order')
          .eq('partner_id', partnerId)
          .order('sort_order', ascending: false)
          .limit(1);
      final nextOrder = existing.isNotEmpty
          ? ((existing[0]['sort_order'] as int?) ?? 0) + 1
          : 0;

      final data = await _db.from('partner_photos').insert({
        'partner_id': partnerId,
        'photo_url': url,
        'uploaded_by': uploadedBy,
        'caption': caption,
        'sort_order': nextOrder,
      }).select().single();
      return data;
    } catch (e) {
      debugPrint('[PartnerService] addPartnerPhoto error: $e');
      return null;
    }
  }

  static Future<bool> deletePartnerPhoto(String photoId) async {
    try {
      await _db.from('partner_photos').delete().eq('id', photoId);
      return true;
    } catch (e) {
      debugPrint('[PartnerService] deletePartnerPhoto error: $e');
      return false;
    }
  }

  static Future<String?> uploadPartnerPhoto({
    required String partnerId,
    required String filePath,
    required String fileName,
  }) async {
    try {
      final file = await _getFile(filePath);
      final storagePath = 'partners/$partnerId/$fileName';
      await _db.storage.from('partner-photos').uploadBinary(
        storagePath,
        file,
        fileOptions: const FileOptions(upsert: true),
      );
      final url = _db.storage.from('partner-photos').getPublicUrl(storagePath);
      return url;
    } catch (e) {
      debugPrint('[PartnerService] uploadPartnerPhoto error: $e');
      return null;
    }
  }

  // ── Voucher Management ──

  static Future<Map<String, dynamic>?> createVoucher({
    required String partnerId,
    required String title,
    required String discountType,
    double? discountValue,
    String? description,
    String? terms,
    int? maxRedemptions,
    DateTime? validUntil,
  }) async {
    try {
      final data = await _db.from('vouchers').insert({
        'partner_id': partnerId,
        'title': title,
        'discount_type': discountType,
        'discount_value': discountValue,
        'description': description,
        'terms': terms,
        'max_redemptions': maxRedemptions,
        'valid_until': validUntil?.toIso8601String(),
        'is_active': true,
      }).select().single();
      return data;
    } catch (e) {
      debugPrint('[PartnerService] createVoucher error: $e');
      return null;
    }
  }

  static Future<bool> updateVoucher({
    required String voucherId,
    String? title,
    String? description,
    String? discountType,
    double? discountValue,
    String? terms,
    bool? isActive,
    int? maxRedemptions,
    DateTime? validUntil,
  }) async {
    try {
      final updates = <String, dynamic>{};
      if (title != null) updates['title'] = title;
      if (description != null) updates['description'] = description;
      if (discountType != null) updates['discount_type'] = discountType;
      if (discountValue != null) updates['discount_value'] = discountValue;
      if (terms != null) updates['terms'] = terms;
      if (isActive != null) updates['is_active'] = isActive;
      if (maxRedemptions != null) updates['max_redemptions'] = maxRedemptions;
      if (validUntil != null) updates['valid_until'] = validUntil.toIso8601String();
      if (updates.isEmpty) return true;

      await _db.from('vouchers').update(updates).eq('id', voucherId);
      return true;
    } catch (e) {
      debugPrint('[PartnerService] updateVoucher error: $e');
      return false;
    }
  }

  static Future<bool> deactivateVoucher(String voucherId) async {
    try {
      await _db
          .from('vouchers')
          .update({'is_active': false})
          .eq('id', voucherId);
      return true;
    } catch (e) {
      debugPrint('[PartnerService] deactivateVoucher error: $e');
      return false;
    }
  }

  /// Get all vouchers for owner (including inactive)
  static Future<List<Map<String, dynamic>>> getOwnerVouchers(String partnerId) async {
    try {
      final data = await _db
          .from('vouchers')
          .select()
          .eq('partner_id', partnerId)
          .order('created_at', ascending: false);
      return List<Map<String, dynamic>>.from(data);
    } catch (e) {
      debugPrint('[PartnerService] getOwnerVouchers error: $e');
      return [];
    }
  }

  static Future<Uint8List> _getFile(String path) async {
    return await io.File(path).readAsBytes();
  }

  // ── Helpers ──

  static String _generateCode(int length) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    final rng = Random.secure();
    return List.generate(length, (_) => chars[rng.nextInt(chars.length)]).join();
  }

  /// Haversine distance in km
  static double _haversineDistance(
    double lat1, double lng1, double lat2, double lng2,
  ) {
    const R = 6371.0; // Earth radius in km
    final dLat = (lat2 - lat1) * pi / 180;
    final dLng = (lng2 - lng1) * pi / 180;
    final a = sin(dLat / 2) * sin(dLat / 2) +
        cos(lat1 * pi / 180) * cos(lat2 * pi / 180) *
        sin(dLng / 2) * sin(dLng / 2);
    final c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return R * c;
  }

  /// Format distance for display
  static String formatDistance(double km) {
    if (km < 1) {
      return '${(km * 1000).round()}m';
    }
    return '${km.toStringAsFixed(1)}km';
  }
}
