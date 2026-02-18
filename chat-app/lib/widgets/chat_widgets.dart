import 'package:flutter/material.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';

/// Connection status banner (shows when offline/reconnecting)
class ConnectionBanner extends StatelessWidget {
  final String lang;

  const ConnectionBanner({super.key, required this.lang});

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

/// Typing indicator with animated dots
class TypingIndicator extends StatelessWidget {
  final String lang;

  const TypingIndicator({super.key, required this.lang});

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
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
              const TypingDots(),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  text,
                  style: TextStyle(
                    fontSize: 12,
                    color: alma.textSecondary,
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

/// Animated typing dots
class TypingDots extends StatefulWidget {
  const TypingDots({super.key});

  @override
  State<TypingDots> createState() => _TypingDotsState();
}

class _TypingDotsState extends State<TypingDots>
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

/// Member count badge for channel header
class MemberCountBadge extends StatelessWidget {
  final Channel channel;

  const MemberCountBadge({super.key, required this.channel});

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    return StreamBuilder<ChannelState>(
      stream: channel.state?.channelStateStream,
      builder: (context, snapshot) {
        final memberCount = channel.state?.members.length ?? 0;
        final watcherCount = channel.state?.watcherCount ?? 0;

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: alma.cardBg,
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
                      : alma.textTertiary,
                ),
              ),
              const SizedBox(width: 4),
              Text(
                '$memberCount',
                style: TextStyle(
                  fontSize: 12,
                  color: alma.textSecondary,
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
