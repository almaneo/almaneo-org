import 'dart:convert';
import 'dart:ui' as ui;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import '../config/env.dart';

/// 지원 언어 목록 (백엔드 SUPPORTED_LANGUAGES와 동일)
class SupportedLanguage {
  final String code;
  final String name;
  final String nativeName;
  final String flag;

  const SupportedLanguage({
    required this.code,
    required this.name,
    required this.nativeName,
    required this.flag,
  });
}

const supportedLanguages = [
  SupportedLanguage(code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷'),
  SupportedLanguage(code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸'),
  SupportedLanguage(code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳'),
  SupportedLanguage(code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵'),
  SupportedLanguage(code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸'),
  SupportedLanguage(code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷'),
  SupportedLanguage(code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦'),
  SupportedLanguage(code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷'),
  SupportedLanguage(code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩'),
  SupportedLanguage(code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾'),
  SupportedLanguage(code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭'),
  SupportedLanguage(code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳'),
  SupportedLanguage(code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭'),
  SupportedLanguage(code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪'),
  SupportedLanguage(code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳'),
  SupportedLanguage(code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩'),
  SupportedLanguage(code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪'),
  SupportedLanguage(code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹'),
  SupportedLanguage(code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺'),
  SupportedLanguage(code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷'),
];

const _prefKey = 'preferred_language';
const _autoDetect = 'auto';

/// 언어 상태
class LanguageState {
  final String languageCode;
  final bool isAutoDetect;

  const LanguageState({
    required this.languageCode,
    this.isAutoDetect = false,
  });

  SupportedLanguage get language =>
      supportedLanguages.firstWhere(
        (l) => l.code == languageCode,
        orElse: () => supportedLanguages[1], // English fallback
      );
}

/// 언어 Provider
class LanguageNotifier extends StateNotifier<LanguageState> {
  LanguageNotifier() : super(const LanguageState(languageCode: 'en', isAutoDetect: true)) {
    _init();
  }

  Future<void> _init() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefKey);

    if (saved == null || saved == _autoDetect) {
      // 기기 언어 자동 감지
      final deviceLang = ui.PlatformDispatcher.instance.locale.languageCode;
      final isSupported = supportedLanguages.any((l) => l.code == deviceLang);
      state = LanguageState(
        languageCode: isSupported ? deviceLang : 'en',
        isAutoDetect: true,
      );
    } else {
      state = LanguageState(
        languageCode: saved,
        isAutoDetect: false,
      );
    }
  }

  /// 언어 수동 변경
  Future<void> setLanguage(String code) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, code);
    state = LanguageState(languageCode: code, isAutoDetect: false);
  }

  /// 자동 감지로 복원
  Future<void> setAutoDetect() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, _autoDetect);

    final deviceLang = ui.PlatformDispatcher.instance.locale.languageCode;
    final isSupported = supportedLanguages.any((l) => l.code == deviceLang);
    state = LanguageState(
      languageCode: isSupported ? deviceLang : 'en',
      isAutoDetect: true,
    );
  }

  /// Stream Chat 사용자의 preferred_language 업데이트
  Future<void> updateStreamUserLanguage(String userId) async {
    try {
      await http.post(
        Uri.parse('${Env.chatApiUrl}/api/stream-token'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'preferredLanguage': state.languageCode,
        }),
      );
    } catch (e) {
      // 실패해도 로컬 설정은 유지
    }
  }
}

final languageProvider =
    StateNotifierProvider<LanguageNotifier, LanguageState>((ref) {
  return LanguageNotifier();
});
