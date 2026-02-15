import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../providers/language_provider.dart';

/// 번역 로딩 텍스트 (언어별)
const _translatingText = <String, String>{
  'ko': '번역 중...',
  'en': 'Translating...',
  'zh': '翻译中...',
  'ja': '翻訳中...',
  'es': 'Traduciendo...',
  'fr': 'Traduction...',
  'ar': 'جارٍ الترجمة...',
  'pt': 'Traduzindo...',
  'id': 'Menerjemahkan...',
  'ms': 'Menterjemah...',
  'th': 'กำลังแปล...',
  'vi': 'Đang dịch...',
  'km': 'កំពុងបកប្រែ...',
  'sw': 'Inatafsiri...',
  'hi': 'अनुवाद हो रहा है...',
  'bn': 'অনুবাদ হচ্ছে...',
  'de': 'Übersetzen...',
  'it': 'Traduzione...',
  'ru': 'Перевод...',
  'tr': 'Çevriliyor...',
};

const _failedText = <String, String>{
  'ko': '번역 실패',
  'en': 'Translation failed',
  'zh': '翻译失败',
  'ja': '翻訳失敗',
  'es': 'Traducción fallida',
  'fr': 'Échec de la traduction',
  'ar': 'فشل الترجمة',
  'pt': 'Falha na tradução',
  'id': 'Terjemahan gagal',
  'ms': 'Terjemahan gagal',
  'th': 'แปลไม่สำเร็จ',
  'vi': 'Dịch thất bại',
  'km': 'បកប្រែមិនបាន',
  'sw': 'Tafsiri imeshindwa',
  'hi': 'अनुवाद विफल',
  'bn': 'অনুবাদ ব্যর্থ',
  'de': 'Übersetzung fehlgeschlagen',
  'it': 'Traduzione fallita',
  'ru': 'Ошибка перевода',
  'tr': 'Çeviri başarısız',
};

/// 번역된 메시지를 표시하는 위젯
/// Stream Chat 메시지의 extraData에서 번역 정보를 읽어 표시
class TranslatedMessage extends ConsumerStatefulWidget {
  final Message message;
  final bool isMyMessage;

  const TranslatedMessage({
    super.key,
    required this.message,
    required this.isMyMessage,
  });

  @override
  ConsumerState<TranslatedMessage> createState() => _TranslatedMessageState();
}

class _TranslatedMessageState extends ConsumerState<TranslatedMessage>
    with SingleTickerProviderStateMixin {
  bool _showOriginal = false;

  @override
  Widget build(BuildContext context) {
    final langState = ref.watch(languageProvider);
    final userLang = langState.languageCode;

    final translations = widget.message.extraData['translations'] as Map?;
    final originalLang = widget.message.extraData['original_lang'] as String?;
    final translationStatus =
        widget.message.extraData['translation_status'] as String?;

    // 번역된 텍스트 가져오기
    final translatedText = translations?[userLang] as String?;
    final hasTranslation = translatedText != null && originalLang != userLang;
    final isFailed = translationStatus == 'failed';
    final isTranslating = translationStatus == 'translating';

    final displayText = (_showOriginal || !hasTranslation)
        ? widget.message.text ?? ''
        : translatedText;

    // 발신자 이름
    final senderName = widget.message.user?.name ?? '';

    return Padding(
      padding: EdgeInsets.only(
        left: widget.isMyMessage ? 48 : 8,
        right: widget.isMyMessage ? 8 : 48,
        top: 2,
        bottom: 2,
      ),
      child: Align(
        alignment:
            widget.isMyMessage ? Alignment.centerRight : Alignment.centerLeft,
        child: Column(
          crossAxisAlignment: widget.isMyMessage
              ? CrossAxisAlignment.end
              : CrossAxisAlignment.start,
          children: [
            // 발신자 이름 (상대방 메시지만)
            if (!widget.isMyMessage && senderName.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(left: 4, bottom: 2),
                child: Text(
                  senderName,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: AlmaTheme.terracottaOrange.withValues(alpha: 0.8),
                  ),
                ),
              ),

            // 메시지 버블
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: widget.isMyMessage
                    ? AlmaTheme.electricBlue
                    : AlmaTheme.slateGray,
                borderRadius: BorderRadius.circular(16).copyWith(
                  bottomRight:
                      widget.isMyMessage ? const Radius.circular(4) : null,
                  bottomLeft:
                      !widget.isMyMessage ? const Radius.circular(4) : null,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 메시지 텍스트 (부드러운 전환)
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 200),
                    child: Text(
                      displayText,
                      key: ValueKey('$_showOriginal-${widget.message.id}'),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                      ),
                    ),
                  ),

                  // 번역 상태 표시
                  if (isTranslating) _buildTranslatingIndicator(userLang),
                  if (isFailed && !widget.isMyMessage)
                    _buildFailedIndicator(userLang),
                ],
              ),
            ),

            // 번역 토글 + 원어 배지 + 시간
            _buildFooter(
              hasTranslation: hasTranslation,
              originalLang: originalLang,
              userLang: userLang,
              isTranslating: isTranslating,
              isFailed: isFailed,
            ),
          ],
        ),
      ),
    );
  }

  /// 번역 중 인디케이터 (다국어 + 펄스 애니메이션)
  Widget _buildTranslatingIndicator(String userLang) {
    final text = _translatingText[userLang] ?? _translatingText['en']!;
    return Padding(
      padding: const EdgeInsets.only(top: 6),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _PulsingDots(),
          const SizedBox(width: 6),
          Text(
            text,
            style: TextStyle(
              fontSize: 11,
              color: Colors.white.withValues(alpha: 0.5),
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  /// 번역 실패 인디케이터
  Widget _buildFailedIndicator(String userLang) {
    final text = _failedText[userLang] ?? _failedText['en']!;
    return Padding(
      padding: const EdgeInsets.only(top: 6),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.error_outline,
            size: 13,
            color: AlmaTheme.error.withValues(alpha: 0.7),
          ),
          const SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              fontSize: 11,
              color: AlmaTheme.error.withValues(alpha: 0.7),
            ),
          ),
        ],
      ),
    );
  }

  /// 하단 메타정보 (토글 + 배지 + 시간)
  Widget _buildFooter({
    required bool hasTranslation,
    required String? originalLang,
    required String userLang,
    required bool isTranslating,
    required bool isFailed,
  }) {
    return Padding(
      padding: const EdgeInsets.only(top: 2, left: 4, right: 4),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // 번역 토글 버튼
          if (hasTranslation)
            GestureDetector(
              onTap: () => setState(() => _showOriginal = !_showOriginal),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: _showOriginal
                      ? AlmaTheme.terracottaOrange.withValues(alpha: 0.15)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.translate,
                      size: 12,
                      color: _showOriginal
                          ? AlmaTheme.terracottaOrange
                          : Colors.white.withValues(alpha: 0.3),
                    ),
                    const SizedBox(width: 2),
                    Text(
                      _showOriginal
                          ? originalLang?.toUpperCase() ?? ''
                          : 'Original',
                      style: TextStyle(
                        fontSize: 11,
                        color: _showOriginal
                            ? AlmaTheme.terracottaOrange
                            : Colors.white.withValues(alpha: 0.3),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          if (hasTranslation) const SizedBox(width: 6),

          // 원어 배지
          if (originalLang != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
              decoration: BoxDecoration(
                color: isFailed
                    ? AlmaTheme.error.withValues(alpha: 0.1)
                    : isTranslating
                        ? AlmaTheme.warning.withValues(alpha: 0.1)
                        : Colors.white.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                originalLang.toUpperCase(),
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                  color: isFailed
                      ? AlmaTheme.error.withValues(alpha: 0.5)
                      : isTranslating
                          ? AlmaTheme.warning.withValues(alpha: 0.5)
                          : Colors.white.withValues(alpha: 0.3),
                ),
              ),
            ),
          if (originalLang != null) const SizedBox(width: 6),

          // 시간 표시
          Text(
            _formatTime(widget.message.createdAt),
            style: TextStyle(
              fontSize: 11,
              color: Colors.white.withValues(alpha: 0.3),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }
}

/// 펄스 점 3개 애니메이션 (번역 로딩용)
class _PulsingDots extends StatefulWidget {
  @override
  State<_PulsingDots> createState() => _PulsingDotsState();
}

class _PulsingDotsState extends State<_PulsingDots>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (_, _) {
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(3, (i) {
            final delay = i * 0.2;
            final t = (_controller.value - delay).clamp(0.0, 1.0);
            final opacity = (t < 0.5 ? t * 2 : 2 - t * 2).clamp(0.3, 1.0);
            return Container(
              width: 4,
              height: 4,
              margin: const EdgeInsets.symmetric(horizontal: 1),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: opacity),
              ),
            );
          }),
        );
      },
    );
  }
}
