import 'package:shared_preferences/shared_preferences.dart';

/// 로컬 세션 데이터
class SessionData {
  final String userId;
  final String userName;
  final String? profileImage;
  final bool isWeb3AuthUser;
  final String languageCode;

  const SessionData({
    required this.userId,
    required this.userName,
    this.profileImage,
    required this.isWeb3AuthUser,
    required this.languageCode,
  });

  bool get isGuest => userId.startsWith('guest_');
}

/// SharedPreferences 기반 세션 영속화 서비스
///
/// 앱을 닫아도 로그인 상태가 유지되도록 세션 정보를 로컬에 저장합니다.
/// - 게스트: userId(guest_xxxxx)를 보존하여 채팅 기록 유지
/// - 소셜: Web3Auth 세션과 별개로 로컬 백업 (SDK 세션 만료 시 복원)
class SessionStorage {
  static const _keyUserId = 'session_user_id';
  static const _keyUserName = 'session_user_name';
  static const _keyProfileImage = 'session_profile_image';
  static const _keyIsWeb3Auth = 'session_is_web3auth';
  static const _keyLanguageCode = 'session_language_code';

  /// 세션 저장
  static Future<void> save(SessionData data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyUserId, data.userId);
    await prefs.setString(_keyUserName, data.userName);
    if (data.profileImage != null) {
      await prefs.setString(_keyProfileImage, data.profileImage!);
    } else {
      await prefs.remove(_keyProfileImage);
    }
    await prefs.setBool(_keyIsWeb3Auth, data.isWeb3AuthUser);
    await prefs.setString(_keyLanguageCode, data.languageCode);
  }

  /// 저장된 세션 로드 (없으면 null)
  static Future<SessionData?> load() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString(_keyUserId);
    if (userId == null || userId.isEmpty) return null;

    return SessionData(
      userId: userId,
      userName: prefs.getString(_keyUserName) ?? 'User',
      profileImage: prefs.getString(_keyProfileImage),
      isWeb3AuthUser: prefs.getBool(_keyIsWeb3Auth) ?? false,
      languageCode: prefs.getString(_keyLanguageCode) ?? 'en',
    );
  }

  /// 세션 삭제 (로그아웃 시)
  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyUserId);
    await prefs.remove(_keyUserName);
    await prefs.remove(_keyProfileImage);
    await prefs.remove(_keyIsWeb3Auth);
    await prefs.remove(_keyLanguageCode);
  }

  /// 세션 존재 여부
  static Future<bool> hasSession() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString(_keyUserId);
    return userId != null && userId.isNotEmpty;
  }
}
