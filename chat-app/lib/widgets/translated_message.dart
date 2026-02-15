import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../providers/language_provider.dart';
import 'fullscreen_image.dart';

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

    // 첨부파일
    final attachments = widget.message.attachments;
    final hasAttachments = attachments.isNotEmpty;
    final hasText = displayText.isNotEmpty;

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
              constraints: BoxConstraints(
                maxWidth: MediaQuery.of(context).size.width * 0.75,
              ),
              clipBehavior: Clip.antiAlias,
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
                mainAxisSize: MainAxisSize.min,
                children: [
                  // 첨부파일 렌더링 (이미지/비디오/파일)
                  if (hasAttachments)
                    _buildAttachments(attachments),

                  // 텍스트 + 번역 상태
                  if (hasText || isTranslating || isFailed)
                    Padding(
                      padding: EdgeInsets.only(
                        left: 14,
                        right: 14,
                        top: hasAttachments ? 8 : 10,
                        bottom: 10,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (hasText)
                            AnimatedSwitcher(
                              duration: const Duration(milliseconds: 200),
                              child: Text(
                                displayText,
                                key: ValueKey(
                                    '$_showOriginal-${widget.message.id}'),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 15,
                                ),
                              ),
                            ),
                          if (isTranslating)
                            _buildTranslatingIndicator(userLang),
                          if (isFailed && !widget.isMyMessage)
                            _buildFailedIndicator(userLang),
                        ],
                      ),
                    ),

                  // 첨부파일만 있고 텍스트 없는 경우 하단 패딩
                  if (hasAttachments && !hasText && !isTranslating && !isFailed)
                    const SizedBox(height: 4),
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

  /// 첨부파일 렌더링 (이미지, 비디오, 파일 등)
  Widget _buildAttachments(List<Attachment> attachments) {
    final imageAttachments = <Attachment>[];
    final fileAttachments = <Attachment>[];

    for (final a in attachments) {
      if (a.type == 'image' || a.type == 'giphy') {
        imageAttachments.add(a);
      } else {
        fileAttachments.add(a);
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 이미지 그리드
        if (imageAttachments.isNotEmpty)
          _buildImageGrid(imageAttachments),

        // 파일/비디오 목록
        if (fileAttachments.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(left: 10, right: 10, top: 8),
            child: Column(
              children: fileAttachments.map((a) {
                if (a.type == 'video') {
                  return _buildVideoAttachment(a);
                }
                return _buildFileAttachment(a);
              }).toList(),
            ),
          ),
      ],
    );
  }

  /// 이미지 그리드 (1장: 전체, 2장: 2열, 3+: 2열 그리드)
  Widget _buildImageGrid(List<Attachment> images) {
    if (images.length == 1) {
      return _buildSingleImage(images[0]);
    }

    return Padding(
      padding: const EdgeInsets.all(4),
      child: Wrap(
        spacing: 4,
        runSpacing: 4,
        children: images.take(4).toList().asMap().entries.map((entry) {
          final index = entry.key;
          final attachment = entry.value;
          final isLast = index == 3 && images.length > 4;
          return SizedBox(
            width: (MediaQuery.of(context).size.width * 0.75 - 12) / 2,
            height: 120,
            child: Stack(
              fit: StackFit.expand,
              children: [
                _buildImageThumbnail(attachment),
                if (isLast)
                  Container(
                    color: Colors.black54,
                    child: Center(
                      child: Text(
                        '+${images.length - 3}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  /// 단일 이미지 (전체 너비)
  Widget _buildSingleImage(Attachment attachment) {
    final url = attachment.imageUrl ??
        attachment.thumbUrl ??
        attachment.assetUrl ??
        '';
    if (url.isEmpty) return const SizedBox.shrink();

    return GestureDetector(
      onTap: () => _openFullscreenImage(url),
      child: Hero(
        tag: 'img-${widget.message.id}-0',
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 280),
          child: CachedNetworkImage(
            imageUrl: url,
            fit: BoxFit.cover,
            width: double.infinity,
            placeholder: (_, _) => Container(
              height: 180,
              color: Colors.white.withValues(alpha: 0.05),
              child: const Center(
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AlmaTheme.electricBlue,
                ),
              ),
            ),
            errorWidget: (_, _, _) => Container(
              height: 100,
              color: Colors.white.withValues(alpha: 0.05),
              child: const Center(
                child: Icon(Icons.broken_image, color: Colors.white24, size: 32),
              ),
            ),
          ),
        ),
      ),
    );
  }

  /// 이미지 썸네일 (그리드용)
  Widget _buildImageThumbnail(Attachment attachment) {
    final url = attachment.thumbUrl ??
        attachment.imageUrl ??
        attachment.assetUrl ??
        '';
    if (url.isEmpty) return const SizedBox.shrink();

    return GestureDetector(
      onTap: () {
        final fullUrl = attachment.imageUrl ??
            attachment.assetUrl ??
            attachment.thumbUrl ??
            '';
        if (fullUrl.isNotEmpty) _openFullscreenImage(fullUrl);
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: CachedNetworkImage(
          imageUrl: url,
          fit: BoxFit.cover,
          placeholder: (_, _) => Container(
            color: Colors.white.withValues(alpha: 0.05),
            child: const Center(
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AlmaTheme.electricBlue,
              ),
            ),
          ),
          errorWidget: (_, _, _) => Container(
            color: Colors.white.withValues(alpha: 0.05),
            child: const Center(
              child: Icon(Icons.broken_image, color: Colors.white24, size: 24),
            ),
          ),
        ),
      ),
    );
  }

  /// 비디오 첨부파일 (썸네일 + 재생 아이콘)
  Widget _buildVideoAttachment(Attachment attachment) {
    final thumbUrl = attachment.thumbUrl ?? '';

    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Stack(
          alignment: Alignment.center,
          children: [
            if (thumbUrl.isNotEmpty)
              CachedNetworkImage(
                imageUrl: thumbUrl,
                fit: BoxFit.cover,
                width: double.infinity,
                height: 160,
                placeholder: (_, _) => Container(
                  height: 160,
                  color: Colors.white.withValues(alpha: 0.05),
                ),
                errorWidget: (_, _, _) => Container(
                  height: 160,
                  color: Colors.white.withValues(alpha: 0.05),
                ),
              )
            else
              Container(
                height: 120,
                width: double.infinity,
                color: Colors.white.withValues(alpha: 0.05),
              ),
            // 재생 버튼 오버레이
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.black54,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white38, width: 1.5),
              ),
              child: const Icon(
                Icons.play_arrow_rounded,
                color: Colors.white,
                size: 28,
              ),
            ),
            // 파일 크기
            if (attachment.fileSize != null)
              Positioned(
                bottom: 6,
                right: 6,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    _formatFileSize(attachment.fileSize!),
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 11,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  /// 파일 첨부파일 (아이콘 + 파일명 + 크기)
  Widget _buildFileAttachment(Attachment attachment) {
    final fileName = attachment.title ?? 'File';
    final fileSize = attachment.fileSize;
    final ext = fileName.split('.').last.toLowerCase();

    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: _getFileColor(ext).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                _getFileIcon(ext),
                color: _getFileColor(ext),
                size: 20,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    fileName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (fileSize != null)
                    Text(
                      _formatFileSize(fileSize),
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.4),
                        fontSize: 11,
                      ),
                    ),
                ],
              ),
            ),
            Icon(
              Icons.download_rounded,
              color: Colors.white.withValues(alpha: 0.3),
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  void _openFullscreenImage(String url) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => FullscreenImage(
          imageUrl: url,
          heroTag: 'img-${widget.message.id}-0',
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

  /// 하단 메타정보 (토글 + 배지 + 시간 + 읽음 표시)
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

          // 읽음 표시 (내 메시지만)
          if (widget.isMyMessage) ...[
            const SizedBox(width: 4),
            _buildReadReceipt(),
          ],
        ],
      ),
    );
  }

  /// 읽음 표시 아이콘 (✓ 전송됨, ✓✓ 읽음)
  Widget _buildReadReceipt() {
    final isRead = _isMessageReadByOthers();

    if (isRead) {
      // 읽음: 시안 더블체크
      return Icon(
        Icons.done_all,
        size: 14,
        color: AlmaTheme.cyan.withValues(alpha: 0.9),
      );
    }

    // 전송됨: 회색 싱글체크
    return Icon(
      Icons.done,
      size: 14,
      color: Colors.white.withValues(alpha: 0.4),
    );
  }

  /// 다른 사용자가 이 메시지를 읽었는지 확인
  bool _isMessageReadByOthers() {
    try {
      final channel = StreamChannel.of(context).channel;
      final reads = channel.state?.read;
      if (reads == null || reads.isEmpty) return false;

      final myUserId = widget.message.user?.id;
      final messageCreatedAt = widget.message.createdAt;

      for (final read in reads) {
        // 내 읽음 상태는 건너뜀
        if (read.user.id == myUserId) continue;
        // 다른 사용자의 마지막 읽은 시간이 메시지 생성 시간 이후이면 읽음
        if (read.lastRead.isAfter(messageCreatedAt) ||
            read.lastRead.isAtSameMomentAs(messageCreatedAt)) {
          return true;
        }
      }
    } catch (_) {
      // StreamChannel 컨텍스트를 찾지 못한 경우 무시
    }
    return false;
  }

  String _formatTime(DateTime time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  String _formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  IconData _getFileIcon(String ext) {
    switch (ext) {
      case 'pdf':
        return Icons.picture_as_pdf;
      case 'doc':
      case 'docx':
        return Icons.description;
      case 'xls':
      case 'xlsx':
        return Icons.table_chart;
      case 'ppt':
      case 'pptx':
        return Icons.slideshow;
      case 'zip':
      case 'rar':
      case '7z':
        return Icons.folder_zip;
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'ogg':
        return Icons.audiotrack;
      default:
        return Icons.insert_drive_file;
    }
  }

  Color _getFileColor(String ext) {
    switch (ext) {
      case 'pdf':
        return AlmaTheme.error;
      case 'doc':
      case 'docx':
        return AlmaTheme.electricBlue;
      case 'xls':
      case 'xlsx':
        return AlmaTheme.success;
      case 'ppt':
      case 'pptx':
        return AlmaTheme.terracottaOrange;
      case 'zip':
      case 'rar':
      case '7z':
        return AlmaTheme.warning;
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'ogg':
        return AlmaTheme.cyan;
      default:
        return Colors.white54;
    }
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
