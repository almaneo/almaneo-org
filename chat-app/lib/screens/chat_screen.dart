import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:share_plus/share_plus.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/env.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/notification_service.dart';
import '../widgets/translated_message.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final cid = StreamChannel.of(context).channel.cid;
    NotificationService.instance.setActiveChannel(cid);
  }

  @override
  void dispose() {
    NotificationService.instance.setActiveChannel(null);
    super.dispose();
  }

  Future<void> _shareInviteLink(Channel channel, String channelName, String lang) async {
    final channelId = channel.id;
    final user = StreamChat.of(context).currentUser;
    if (channelId == null || user == null) return;

    // Show loading
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => Center(
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AlmaTheme.slateGray,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(
                width: 24, height: 24,
                child: CircularProgressIndicator(strokeWidth: 2, color: AlmaTheme.electricBlue),
              ),
              const SizedBox(height: 12),
              Text(
                tr('invite.creating', lang),
                style: const TextStyle(color: Colors.white, fontSize: 14, decoration: TextDecoration.none),
              ),
            ],
          ),
        ),
      ),
    );

    try {
      final response = await http.post(
        Uri.parse('${Env.chatApiUrl}/api/create-invite'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': user.id,
          'channelId': channelId,
          'channelType': channel.type,
        }),
      );

      if (!mounted) return;
      Navigator.pop(context); // dismiss loading

      if (response.statusCode != 200) {
        throw Exception('Server error: ${response.statusCode}');
      }

      final data = jsonDecode(response.body) as Map<String, dynamic>;
      final inviteCode = data['code'] as String;
      final inviteUrl = data['inviteUrl'] as String;

      final shareText = tr('invite.message', lang, args: {
        'name': channelName,
        'link': inviteUrl,
      });

      if (!mounted) return;
      _showInviteBottomSheet(inviteCode, inviteUrl, shareText, lang);
    } catch (e) {
      if (mounted) {
        Navigator.pop(context); // dismiss loading
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(tr('invite.createFailed', lang)),
            backgroundColor: AlmaTheme.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        );
      }
    }
  }

  void _showInviteBottomSheet(String code, String inviteUrl, String shareText, String lang) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AlmaTheme.slateGray,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Text(
                tr('invite.title', lang),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              // Invite code display (large, prominent)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
                decoration: BoxDecoration(
                  color: AlmaTheme.deepNavy,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: AlmaTheme.electricBlue.withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  children: [
                    Text(
                      tr('invite.codeLabel', lang),
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.5),
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      code,
                      style: const TextStyle(
                        color: AlmaTheme.electricBlue,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'monospace',
                        letterSpacing: 6,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      inviteUrl,
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.35),
                        fontSize: 11,
                        fontFamily: 'monospace',
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Copy button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: inviteUrl));
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(tr('invite.copied', lang)),
                        behavior: SnackBarBehavior.floating,
                        backgroundColor: AlmaTheme.success.withValues(alpha: 0.9),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  icon: const Icon(Icons.copy, size: 18),
                  label: Text(tr('invite.copyLink', lang)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              // Share button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    SharePlus.instance.share(ShareParams(text: shareText));
                  },
                  icon: const Icon(Icons.share, size: 18),
                  label: Text(tr('invite.share', lang)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AlmaTheme.electricBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final channel = StreamChannel.of(context).channel;
    final channelName = channel.extraData['name'] as String? ?? 'Chat';
    final langState = ref.watch(languageProvider);
    final lang = langState.languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              channelName,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
            ),
            Text(
              tr('chat.translatingTo', lang, args: {
                'lang': langState.language.nativeName,
                'flag': langState.language.flag,
              }),
              style: TextStyle(
                fontSize: 11,
                color: AlmaTheme.terracottaOrange.withValues(alpha: 0.8),
                fontWeight: FontWeight.w400,
              ),
            ),
          ],
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
        actions: [
          // Share invite link
          IconButton(
            icon: const Icon(Icons.share_outlined, size: 20),
            onPressed: () => _shareInviteLink(channel, channelName, lang),
            tooltip: tr('invite.share', lang),
          ),
          _MemberCountBadge(channel: channel),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          _ConnectionBanner(lang: lang),
          Expanded(
            child: StreamMessageListView(
              messageBuilder: (context, details, messages, defaultWidget) {
                return TranslatedMessage(
                  message: details.message,
                  isMyMessage: details.isMyMessage,
                );
              },
            ),
          ),
          _TypingIndicator(lang: lang),
          const StreamMessageInput(),
        ],
      ),
    );
  }
}

/// 연결 상태 배너 (오프라인/재연결 중 표시)
class _ConnectionBanner extends StatelessWidget {
  final String lang;

  const _ConnectionBanner({required this.lang});

  @override
  Widget build(BuildContext context) {
    final client = StreamChat.of(context).client;

    return StreamBuilder<ConnectionStatus>(
      stream: client.wsConnectionStatusStream,
      initialData: client.wsConnectionStatus,
      builder: (context, snapshot) {
        final status = snapshot.data ?? ConnectionStatus.disconnected;

        if (status == ConnectionStatus.connected) {
          return const SizedBox.shrink();
        }

        final isConnecting = status == ConnectionStatus.connecting;
        final color = isConnecting ? AlmaTheme.warning : AlmaTheme.error;
        final text = isConnecting
            ? tr('chat.reconnecting', lang)
            : tr('chat.noConnection', lang);

        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 4),
          color: color.withValues(alpha: 0.15),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (isConnecting)
                SizedBox(
                  width: 12,
                  height: 12,
                  child: CircularProgressIndicator(
                    strokeWidth: 1.5,
                    color: color,
                  ),
                )
              else
                Icon(Icons.wifi_off, size: 14, color: color),
              const SizedBox(width: 6),
              Text(
                text,
                style: TextStyle(
                  fontSize: 12,
                  color: color,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

/// 타이핑 인디케이터
class _TypingIndicator extends StatelessWidget {
  final String lang;

  const _TypingIndicator({required this.lang});

  @override
  Widget build(BuildContext context) {
    final channel = StreamChannel.of(context).channel;
    final currentUser = StreamChat.of(context).currentUser;

    return StreamBuilder<List<User>>(
      stream: channel.state?.typingEventsStream.map(
        (events) => events.entries
            .where((e) => e.key.id != currentUser?.id)
            .map((e) => e.key)
            .toList(),
      ),
      initialData: const [],
      builder: (context, snapshot) {
        final typingUsers = snapshot.data ?? [];

        if (typingUsers.isEmpty) {
          return const SizedBox.shrink();
        }

        final names = typingUsers.map((u) => u.name).join(', ');
        final text = typingUsers.length == 1
            ? tr('chat.isTyping', lang, args: {'name': names})
            : tr('chat.areTyping', lang, args: {'names': names});

        return AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          alignment: Alignment.centerLeft,
          child: Row(
            children: [
              _TypingDots(),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  text,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withValues(alpha: 0.4),
                    fontStyle: FontStyle.italic,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

/// 타이핑 점 애니메이션
class _TypingDots extends StatefulWidget {
  @override
  State<_TypingDots> createState() => _TypingDotsState();
}

class _TypingDotsState extends State<_TypingDots>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
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
            final delay = i * 0.25;
            final t = ((_controller.value - delay) % 1.0).clamp(0.0, 1.0);
            final scale = t < 0.5 ? 1.0 + t * 0.6 : 1.0 + (1.0 - t) * 0.6;
            return Transform.scale(
              scale: scale,
              child: Container(
                width: 5,
                height: 5,
                margin: const EdgeInsets.symmetric(horizontal: 1),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AlmaTheme.terracottaOrange.withValues(alpha: 0.5),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}

/// 멤버 수 배지
class _MemberCountBadge extends StatelessWidget {
  final Channel channel;

  const _MemberCountBadge({required this.channel});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<ChannelState>(
      stream: channel.state?.channelStateStream,
      builder: (context, snapshot) {
        final memberCount = channel.state?.members.length ?? 0;
        final watcherCount = channel.state?.watcherCount ?? 0;

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: AlmaTheme.slateGray,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: watcherCount > 0
                      ? AlmaTheme.success
                      : Colors.white.withValues(alpha: 0.3),
                ),
              ),
              const SizedBox(width: 4),
              Text(
                '$memberCount',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.white.withValues(alpha: 0.6),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
