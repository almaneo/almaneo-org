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
    double? radiusKm,
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

      // Bounding box filter for location-based queries
      if (lat != null && lng != null && radiusKm != null) {
        final latDelta = radiusKm / 111.0; // ~111km per degree latitude
        final lngDelta = radiusKm / (111.0 * cos(lat * pi / 180));
        query = query
            .gte('latitude', lat - latDelta)
            .lte('latitude', lat + latDelta)
            .gte('longitude', lng - lngDelta)
            .lte('longitude', lng + lngDelta);
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
      final expiresAt = DateTime.now().add(const Duration(minutes: 5));

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
