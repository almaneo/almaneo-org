import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _prefKey = 'theme_preference';

/// 테마 선호도
enum ThemePreference { system, light, dark }

/// 테마 상태
class ThemeState {
  final ThemePreference preference;
  final bool isDark; // 실제 적용 brightness

  const ThemeState({
    required this.preference,
    required this.isDark,
  });
}

/// 테마 Provider
class ThemeNotifier extends StateNotifier<ThemeState> {
  ThemeNotifier()
      : super(ThemeState(
          preference: ThemePreference.system,
          isDark: _resolveSystemBrightness(),
        )) {
    _init();
  }

  Future<void> _init() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefKey);

    if (saved != null) {
      final pref = ThemePreference.values.firstWhere(
        (e) => e.name == saved,
        orElse: () => ThemePreference.system,
      );
      state = ThemeState(
        preference: pref,
        isDark: _resolveIsDark(pref),
      );
    }
  }

  /// 테마 변경
  Future<void> setTheme(ThemePreference pref) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, pref.name);
    state = ThemeState(
      preference: pref,
      isDark: _resolveIsDark(pref),
    );
  }

  bool _resolveIsDark(ThemePreference pref) {
    switch (pref) {
      case ThemePreference.light:
        return false;
      case ThemePreference.dark:
        return true;
      case ThemePreference.system:
        return _resolveSystemBrightness();
    }
  }

  static bool _resolveSystemBrightness() {
    final brightness =
        SchedulerBinding.instance.platformDispatcher.platformBrightness;
    return brightness == Brightness.dark;
  }
}

final themeProvider =
    StateNotifierProvider<ThemeNotifier, ThemeState>((ref) {
  return ThemeNotifier();
});
