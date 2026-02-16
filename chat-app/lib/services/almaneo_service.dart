import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/env.dart';

/// AlmaNEO 생태계 데이터
class AlmaNeoData {
  final int kindnessScore;
  final String? ambassadorTier; // friend, host, ambassador, guardian, null
  final String? walletAddress;
  final double tokenBalance; // ALMAN
  final int meetupsAttended;
  final int meetupsHosted;
  final int referralCount;

  const AlmaNeoData({
    this.kindnessScore = 0,
    this.ambassadorTier,
    this.walletAddress,
    this.tokenBalance = 0,
    this.meetupsAttended = 0,
    this.meetupsHosted = 0,
    this.referralCount = 0,
  });

  bool get hasTier => ambassadorTier != null;
  bool get hasWallet => walletAddress != null && walletAddress!.isNotEmpty;
}

/// AlmaNEO 생태계 데이터 서비스
///
/// 백엔드 API를 통해 온체인/오프체인 데이터를 통합 조회합니다.
/// - AmbassadorSBT 컨트랙트: 티어, 밋업 통계
/// - ALMANToken 컨트랙트: 잔액
/// - Supabase: Kindness Score
class AlmaNeoService {
  static AlmaNeoData? _cachedData;
  static DateTime? _cacheTime;
  static const _cacheDuration = Duration(minutes: 5);

  /// 사용자의 AlmaNEO 생태계 데이터 조회
  static Future<AlmaNeoData> getUserData(String walletAddress) async {
    // 캐시가 유효하면 캐시 반환
    if (_cachedData != null &&
        _cacheTime != null &&
        DateTime.now().difference(_cacheTime!) < _cacheDuration) {
      return _cachedData!;
    }

    try {
      final url = '${Env.chatApiUrl}/api/user-chain-data?address=$walletAddress';
      final response = await http.get(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final result = AlmaNeoData(
          kindnessScore: (data['kindnessScore'] as num?)?.toInt() ?? 0,
          ambassadorTier: data['ambassadorTier'] as String?,
          walletAddress: walletAddress,
          tokenBalance: (data['tokenBalance'] as num?)?.toDouble() ?? 0,
          meetupsAttended: (data['meetupsAttended'] as num?)?.toInt() ?? 0,
          meetupsHosted: (data['meetupsHosted'] as num?)?.toInt() ?? 0,
          referralCount: (data['referralCount'] as num?)?.toInt() ?? 0,
        );

        _cachedData = result;
        _cacheTime = DateTime.now();
        return result;
      }

      throw Exception('API error: ${response.statusCode}');
    } catch (e) {
      debugPrint('AlmaNeoService error: $e');
      // API 실패 시 지갑 주소만 있는 기본 데이터 반환
      return AlmaNeoData(walletAddress: walletAddress);
    }
  }

  /// 캐시 초기화
  static void clearCache() {
    _cachedData = null;
    _cacheTime = null;
  }
}
