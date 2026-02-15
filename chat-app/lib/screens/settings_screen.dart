import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';

/// 언어 설정 화면
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final langState = ref.watch(languageProvider);
    final lang = langState.languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          tr('settings.title', lang),
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 현재 설정 카드
          _CurrentLanguageCard(langState: langState, lang: lang),
          const SizedBox(height: 20),

          // 자동 감지 옵션
          _AutoDetectTile(langState: langState, lang: lang, ref: ref),
          const SizedBox(height: 12),

          // 구분선 + 라벨
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Text(
              tr('settings.chooseLanguage', lang),
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.5),
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const SizedBox(height: 8),

          // 언어 목록
          ...supportedLanguages.map((l) => _LanguageTile(
                language: l,
                isSelected: !langState.isAutoDetect && langState.languageCode == l.code,
                onTap: () => _selectLanguage(context, ref, l.code, lang),
              )),
        ],
      ),
    );
  }

  void _selectLanguage(BuildContext context, WidgetRef ref, String code, String currentLang) {
    final notifier = ref.read(languageProvider.notifier);
    notifier.setLanguage(code);

    // Stream Chat 사용자 언어 업데이트
    final user = StreamChat.of(context).currentUser;
    if (user != null) {
      notifier.updateStreamUserLanguage(user.id);
    }

    final nativeName = supportedLanguages.firstWhere((l) => l.code == code).nativeName;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(tr('settings.langChanged', code, args: {'lang': nativeName})),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }
}

/// 현재 언어 표시 카드
class _CurrentLanguageCard extends StatelessWidget {
  final LanguageState langState;
  final String lang;

  const _CurrentLanguageCard({required this.langState, required this.lang});

  @override
  Widget build(BuildContext context) {
    final language = langState.language;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AlmaTheme.electricBlue, Color(0xFF0040CC)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Text(language.flag, style: const TextStyle(fontSize: 40)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  language.nativeName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  langState.isAutoDetect
                      ? tr('settings.autoDetected', lang, args: {'lang': language.name})
                      : language.name,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.7),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          if (langState.isAutoDetect)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                tr('settings.auto', lang),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// 자동 감지 토글
class _AutoDetectTile extends StatelessWidget {
  final LanguageState langState;
  final String lang;
  final WidgetRef ref;

  const _AutoDetectTile({required this.langState, required this.lang, required this.ref});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: langState.isAutoDetect
            ? AlmaTheme.terracottaOrange.withValues(alpha: 0.15)
            : AlmaTheme.slateGray,
        borderRadius: BorderRadius.circular(12),
        border: langState.isAutoDetect
            ? Border.all(color: AlmaTheme.terracottaOrange.withValues(alpha: 0.4))
            : null,
      ),
      child: ListTile(
        leading: Icon(
          Icons.auto_awesome,
          color: langState.isAutoDetect
              ? AlmaTheme.terracottaOrange
              : Colors.white38,
        ),
        title: Text(
          tr('settings.autoDetect', lang),
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500),
        ),
        subtitle: Text(
          tr('settings.autoDetectDesc', lang),
          style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 12),
        ),
        trailing: langState.isAutoDetect
            ? const Icon(Icons.check_circle, color: AlmaTheme.terracottaOrange)
            : null,
        onTap: () {
          ref.read(languageProvider.notifier).setAutoDetect();

          final user = StreamChat.of(context).currentUser;
          if (user != null) {
            ref.read(languageProvider.notifier).updateStreamUserLanguage(user.id);
          }
        },
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}

/// 개별 언어 선택 타일
class _LanguageTile extends StatelessWidget {
  final SupportedLanguage language;
  final bool isSelected;
  final VoidCallback onTap;

  const _LanguageTile({
    required this.language,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        color: isSelected
            ? AlmaTheme.electricBlue.withValues(alpha: 0.15)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        border: isSelected
            ? Border.all(color: AlmaTheme.electricBlue.withValues(alpha: 0.4))
            : null,
      ),
      child: ListTile(
        leading: Text(language.flag, style: const TextStyle(fontSize: 24)),
        title: Text(
          language.nativeName,
          style: TextStyle(
            color: Colors.white,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        subtitle: Text(
          language.name,
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.4),
            fontSize: 12,
          ),
        ),
        trailing: isSelected
            ? const Icon(Icons.check_circle, color: AlmaTheme.electricBlue)
            : null,
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
