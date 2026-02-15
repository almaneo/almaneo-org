import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../providers/language_provider.dart';

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

class _TranslatedMessageState extends ConsumerState<TranslatedMessage> {
  bool _showOriginal = false;

  @override
  Widget build(BuildContext context) {
    final langState = ref.watch(languageProvider);
    final userLang = langState.languageCode;

    final translations = widget.message.extraData['translations'] as Map?;
    final originalLang = widget.message.extraData['original_lang'] as String?;
    final translationStatus = widget.message.extraData['translation_status'] as String?;

    // 번역된 텍스트 가져오기
    final translatedText = translations?[userLang] as String?;
    final hasTranslation = translatedText != null && originalLang != userLang;
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
        alignment: widget.isMyMessage ? Alignment.centerRight : Alignment.centerLeft,
        child: Column(
          crossAxisAlignment:
              widget.isMyMessage ? CrossAxisAlignment.end : CrossAxisAlignment.start,
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
                  bottomRight: widget.isMyMessage ? const Radius.circular(4) : null,
                  bottomLeft: !widget.isMyMessage ? const Radius.circular(4) : null,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    displayText,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                    ),
                  ),
                  // 번역 상태 표시
                  if (translationStatus == 'translating')
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          SizedBox(
                            width: 10,
                            height: 10,
                            child: CircularProgressIndicator(
                              strokeWidth: 1.5,
                              color: Colors.white.withValues(alpha: 0.5),
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Translating...',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.white.withValues(alpha: 0.5),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),

            // 번역 토글 + 원어 배지 + 시간
            Padding(
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
                        color: Colors.white.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        originalLang.toUpperCase(),
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                          color: Colors.white.withValues(alpha: 0.3),
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
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }
}
