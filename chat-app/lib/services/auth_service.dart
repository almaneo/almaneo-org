import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:pointycastle/export.dart' as pc;
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
  String? _walletAddress;
  String? _serverImage; // Stream 서버에 저장된 기존 프로필 이미지
  bool _isWeb3AuthUser = false;

  String? get userId => _userId;
  String get userName => _userName ?? 'User';
  String? get profileImage => _profileImage;
  /// Stream 서버에 저장된 기존 프로필 이미지 (토큰 발급 시 조회)
  String? get serverImage => _serverImage;

  /// 프로필 이미지 URL 업데이트 (업로드 후 호출)
  void setProfileImage(String? url) {
    _profileImage = url;
  }
  String? get walletAddress => _walletAddress;
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
    String? privateKeyHex,
  ]) async {
    _userId = _sanitizeUserId(verifierId);
    _userName = name;
    _profileImage = image;
    _isWeb3AuthUser = true;

    // 지갑 주소 도출
    if (privateKeyHex != null && privateKeyHex.isNotEmpty) {
      _walletAddress = _deriveWalletAddress(privateKeyHex);
    }

    final token = await _getStreamToken(_userId!, name, preferredLanguage);

    // 세션 저장
    await SessionStorage.save(SessionData(
      userId: _userId!,
      userName: name,
      profileImage: image,
      isWeb3AuthUser: true,
      languageCode: preferredLanguage,
      walletAddress: _walletAddress,
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
      _walletAddress = session.walletAddress;

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
      _walletAddress = null;
      _isWeb3AuthUser = false;
      return null;
    }
  }

  /// 현재 사용자의 Stream Chat 토큰 재발급 (연결 실패 시 재시도용)
  Future<String?> refreshToken() async {
    if (_userId == null) return null;
    try {
      return await _getStreamToken(_userId!, _userName);
    } catch (e) {
      debugPrint('Token refresh failed: $e');
      return null;
    }
  }

  /// 백엔드 API에서 Stream Chat 토큰 발급
  /// 서버는 기존 유저의 프로필 이미지도 함께 반환 → _serverImage에 저장
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
      // 서버가 반환한 기존 프로필 이미지 저장
      _serverImage = data['image'] as String?;
      debugPrint('[AuthService] Token received. serverImage=${_serverImage ?? "null"}');
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
    _walletAddress = null;
    _isWeb3AuthUser = false;
    await SessionStorage.clear();
  }

  /// Web3Auth private key에서 Ethereum 지갑 주소 도출
  ///
  /// secp256k1 공개키 → Keccak-256 해시 → 하위 20바이트 → 0x 접두어
  String? _deriveWalletAddress(String privateKeyHex) {
    try {
      final privKeyBytes = _hexToBytes(privateKeyHex);
      final domainParams = pc.ECDomainParameters('secp256k1');
      final privKeyBigInt = _bytesToBigInt(privKeyBytes);
      final pubPoint = domainParams.G * privKeyBigInt;
      if (pubPoint == null) return null;

      // 비압축 공개키 (접두어 04 제외) → 64바이트
      final xBytes = _bigIntToBytes(pubPoint.x!.toBigInteger()!, 32);
      final yBytes = _bigIntToBytes(pubPoint.y!.toBigInteger()!, 32);
      final pubKeyUncompressed = Uint8List.fromList([...xBytes, ...yBytes]);

      // Keccak-256 해시
      final digest = pc.KeccakDigest(256);
      final hash = Uint8List(32);
      digest.update(pubKeyUncompressed, 0, pubKeyUncompressed.length);
      digest.doFinal(hash, 0);

      // 하위 20바이트 → 주소
      final addressBytes = hash.sublist(12);
      return '0x${_bytesToHex(addressBytes)}';
    } catch (e) {
      debugPrint('Wallet address derivation failed: $e');
      return null;
    }
  }

  static Uint8List _hexToBytes(String hex) {
    final h = hex.startsWith('0x') ? hex.substring(2) : hex;
    final bytes = Uint8List(h.length ~/ 2);
    for (var i = 0; i < bytes.length; i++) {
      bytes[i] = int.parse(h.substring(i * 2, i * 2 + 2), radix: 16);
    }
    return bytes;
  }

  static BigInt _bytesToBigInt(Uint8List bytes) {
    var result = BigInt.zero;
    for (final b in bytes) {
      result = (result << 8) | BigInt.from(b);
    }
    return result;
  }

  static Uint8List _bigIntToBytes(BigInt number, int length) {
    final bytes = Uint8List(length);
    var n = number;
    for (var i = length - 1; i >= 0; i--) {
      bytes[i] = (n & BigInt.from(0xFF)).toInt();
      n = n >> 8;
    }
    return bytes;
  }

  static String _bytesToHex(Uint8List bytes) {
    return bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
  }
}
