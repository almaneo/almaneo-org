import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../providers/language_provider.dart';
import '../widgets/translated_message.dart';

class ChatScreen extends ConsumerWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final channel = StreamChannel.of(context).channel;
    final channelName = channel.extraData['name'] as String? ?? 'Chat';
    final langState = ref.watch(languageProvider);

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
              'Translating to ${langState.language.nativeName} ${langState.language.flag}',
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
          // 멤버 수 표시
          _MemberCountBadge(channel: channel),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // 연결 상태 배너
          const _ConnectionBanner(),

          // 메시지 리스트
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

          // 타이핑 인디케이터
          const _TypingIndicator(),

          // 메시지 입력
          const StreamMessageInput(),
        ],
      ),
    );
  }
}

/// 연결 상태 배너 (오프라인/재연결 중 표시)
class _ConnectionBanner extends StatelessWidget {
  const _ConnectionBanner();

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
        final text = isConnecting ? 'Reconnecting...' : 'No connection';

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
  const _TypingIndicator();

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
            ? '$names is typing'
            : '$names are typing';

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
