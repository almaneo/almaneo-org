import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/env.dart';
import 'session_storage.dart';

/// 인증 서비스 — 게스트 로그인 + Web3Auth 소셜 로그인 지원
///
/// 세션 영속화: 로그인 성공 시 SessionStorage에 세션 정보 저장,
/// 앱 재시작 시 저장된 세션으로 자동 로그인 복원.
class AuthService {
  String? _userId;
  String? _userName;
  String? _profileImage;
  bool _isWeb3AuthUser = false;

  String? get userId => _userId;
  String get userName => _userName ?? 'User';
  String? get profileImage => _profileImage;
  bool get isLoggedIn => _userId != null;
  bool get isWeb3AuthUser => _isWeb3AuthUser;

  /// 게스트 로그인 (닉네임만으로 접속)
  Future<String> loginAsGuest(String name, [String preferredLanguage = 'en']) async {
    final randomSuffix = Random().nextInt(99999).toString().padLeft(5, '0');
    _userId = 'guest_$randomSuffix';
    _userName = name;
    _isWeb3AuthUser = false;

    final token = await _getStreamToken(_userId!, name, preferredLanguage);

    // 세션 저장 (앱 재시작 시 동일 게스트 ID 유지)
    await SessionStorage.save(SessionData(
      userId: _userId!,
      userName: name,
      isWeb3AuthUser: false,
      languageCode: preferredLanguage,
    ));

    return token;
  }

  /// 소셜 로그인 (Web3Auth 인증 후 호출)
  Future<String> loginWithSocial(
    String verifierId,
    String name,
    String? image, [
    String preferredLanguage = 'en',
  ]) async {
    _userId = _sanitizeUserId(verifierId);
    _userName = name;
    _profileImage = image;
    _isWeb3AuthUser = true;

    final token = await _getStreamToken(_userId!, name, preferredLanguage);

    // 세션 저장
    await SessionStorage.save(SessionData(
      userId: _userId!,
      userName: name,
      profileImage: image,
      isWeb3AuthUser: true,
      languageCode: preferredLanguage,
    ));

    return token;
  }

  /// 저장된 세션으로 복원 로그인 (앱 재시작 시)
  ///
  /// SharedPreferences에서 세션 데이터를 로드하고,
  /// 백엔드에서 새 Stream Chat 토큰을 발급받아 반환.
  /// 세션이 없거나 토큰 발급 실패 시 null 반환.
  Future<({String token, SessionData session})?> restoreSession() async {
    try {
      final session = await SessionStorage.load();
      if (session == null) return null;

      _userId = session.userId;
      _userName = session.userName;
      _profileImage = session.profileImage;
      _isWeb3AuthUser = session.isWeb3AuthUser;

      // 백엔드에서 새 Stream Chat 토큰 발급
      final token = await _getStreamToken(
        session.userId,
        session.userName,
        session.languageCode,
      );

      return (token: token, session: session);
    } catch (e) {
      debugPrint('Session restore failed: $e');
      // 세션 복원 실패 시 저장된 데이터 정리
      _userId = null;
      _userName = null;
      _profileImage = null;
      _isWeb3AuthUser = false;
      return null;
    }
  }

  /// 백엔드 API에서 Stream Chat 토큰 발급
  Future<String> _getStreamToken(String userId, [String? name, String? preferredLanguage]) async {
    final url = '${Env.chatApiUrl}/api/stream-token';

    final response = await http.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'userId': userId,
        'name': name,
        'preferredLanguage': preferredLanguage ?? 'en',
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['token'] as String;
    }

    throw Exception('Failed to get Stream token: ${response.statusCode}');
  }

  /// Stream Chat user ID로 사용할 수 있도록 정제
  String _sanitizeUserId(String raw) {
    // @, . 등을 _로 치환 (Stream Chat ID: 알파벳, 숫자, _, - 만 허용)
    final sanitized = raw.replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_');
    if (sanitized.isEmpty || !RegExp(r'^[a-zA-Z]').hasMatch(sanitized)) {
      return 'u_$sanitized';
    }
    // 너무 길면 앞 64자로 제한
    return sanitized.length > 64 ? sanitized.substring(0, 64) : sanitized;
  }

  /// 로그아웃 (로컬 세션도 삭제)
  Future<void> logout() async {
    _userId = null;
    _userName = null;
    _profileImage = null;
    _isWeb3AuthUser = false;
    await SessionStorage.clear();
  }
}
