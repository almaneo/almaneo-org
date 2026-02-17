import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// 프로필 이미지 DB 서비스 — Supabase chat_profiles 테이블 CRUD
///
/// Single Source of Truth: 프로필 이미지 URL은 이 DB에만 저장.
/// Stream Chat User.image는 채널 리스트 표시용으로 별도 동기화.
class ProfileService {
  static SupabaseClient get _db => Supabase.instance.client;

  /// DB에서 프로필 이미지 URL 조회
  static Future<String?> getProfileImage(String userId) async {
    try {
      final response = await _db
          .from('chat_profiles')
          .select('profile_image_url')
          .eq('user_id', userId)
          .maybeSingle();

      return response?['profile_image_url'] as String?;
    } catch (e) {
      debugPrint('[ProfileService] getProfileImage error: $e');
      return null;
    }
  }

  /// DB에 프로필 이미지 URL 저장 (upsert)
  static Future<void> saveProfileImage(String userId, String url) async {
    try {
      await _db.from('chat_profiles').upsert({
        'user_id': userId,
        'profile_image_url': url,
      }, onConflict: 'user_id');
      debugPrint('[ProfileService] Saved profile image for $userId');
    } catch (e) {
      debugPrint('[ProfileService] saveProfileImage error: $e');
    }
  }

  /// DB에서 프로필 이미지 URL 삭제
  static Future<void> removeProfileImage(String userId) async {
    try {
      await _db
          .from('chat_profiles')
          .update({'profile_image_url': null})
          .eq('user_id', userId);
      debugPrint('[ProfileService] Removed profile image for $userId');
    } catch (e) {
      debugPrint('[ProfileService] removeProfileImage error: $e');
    }
  }
}
