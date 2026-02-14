import 'dart:math';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/env.dart';

/// 임시 인증 서비스 (MVP용 게스트 로그인)
/// 향후 Web3Auth Flutter SDK로 교체 예정
class AuthService {
  String? _userId;
  String? _userName;

  String? get userId => _userId;
  String? get userName => _userName;
  bool get isLoggedIn => _userId != null;

  /// 게스트 로그인 (MVP용)
  /// 간단한 닉네임으로 Stream Chat 토큰 발급
  Future<String> loginAsGuest(String name) async {
    // 고유 사용자 ID 생성
    final randomSuffix = Random().nextInt(99999).toString().padLeft(5, '0');
    _userId = 'guest_$randomSuffix';
    _userName = name;

    // Stream Chat 토큰 발급 요청
    final token = await _getStreamToken(_userId!);
    return token;
  }

  /// 백엔드 API에서 Stream Chat 토큰 발급
  Future<String> _getStreamToken(String userId) async {
    final response = await http.post(
      Uri.parse('${Env.chatApiUrl}/api/stream-token'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'userId': userId}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['token'] as String;
    }

    throw Exception('Failed to get Stream token: ${response.statusCode}');
  }

  void logout() {
    _userId = null;
    _userName = null;
  }
}
