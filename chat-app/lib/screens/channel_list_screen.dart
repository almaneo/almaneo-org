import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/env.dart';
import '../config/theme.dart';
import '../providers/language_provider.dart';
import 'chat_screen.dart';
import 'settings_screen.dart';

class ChannelListScreen extends ConsumerWidget {
  const ChannelListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = StreamChat.of(context).currentUser;
    final langState = ref.watch(languageProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'AlmaChat',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(width: 8),
            // 연결 상태 인디케이터
            _ConnectionDot(),
          ],
        ),
        actions: [
          // 언어 설정 버튼 (현재 언어 표시)
          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SettingsScreen()),
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              margin: const EdgeInsets.only(right: 4),
              decoration: BoxDecoration(
                color: AlmaTheme.slateGray,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.translate, size: 16, color: Colors.white70),
                  const SizedBox(width: 4),
                  Text(
                    langState.language.flag,
                    style: const TextStyle(fontSize: 16),
                  ),
                ],
              ),
            ),
          ),
          // 사용자 아바타
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: CircleAvatar(
              radius: 16,
              backgroundColor: AlmaTheme.terracottaOrange,
              child: Text(
                (user?.name ?? '?')[0].toUpperCase(),
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ],
      ),
      body: StreamChannelListView(
        controller: StreamChannelListController(
          client: StreamChat.of(context).client,
          filter: Filter.in_('members', [user?.id ?? '']),
          channelStateSort: const [SortOption.desc('last_message_at')],
          limit: 20,
        ),
        itemBuilder: (context, channels, index, defaultWidget) {
          return defaultWidget;
        },
        onChannelTap: (channel) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => StreamChannel(
                channel: channel,
                child: const ChatScreen(),
              ),
            ),
          );
        },
        emptyBuilder: (context) => _buildEmptyState(context),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _createGlobalChannel(context),
        child: const Icon(Icons.add_comment_outlined),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.forum_outlined,
            size: 64,
            color: Colors.white.withValues(alpha: 0.2),
          ),
          const SizedBox(height: 16),
          Text(
            'No conversations yet',
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.5),
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Join the global channel to start chatting!',
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.3),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => _createGlobalChannel(context),
            icon: const Icon(Icons.public, size: 18),
            label: const Text('Join Global Chat'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AlmaTheme.electricBlue,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _createGlobalChannel(BuildContext context) async {
    final client = StreamChat.of(context).client;
    final user = StreamChat.of(context).currentUser;

    if (user == null) return;

    // 로딩 다이얼로그 표시
    if (context.mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => const Center(
          child: CircularProgressIndicator(color: AlmaTheme.electricBlue),
        ),
      );
    }

    try {
      // 1. 서버 사이드에서 채널에 유저 추가
      final response = await http.post(
        Uri.parse('${Env.chatApiUrl}/api/join-channel'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': user.id,
          'channelId': 'alma-global',
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Server error: ${response.statusCode}');
      }

      // 2. 클라이언트에서 채널 watch
      final channel = client.channel('messaging', id: 'alma-global');
      await channel.watch();

      if (context.mounted) {
        // 로딩 다이얼로그 닫기
        Navigator.pop(context);
        // 채팅 화면으로 이동
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => StreamChannel(
              channel: channel,
              child: const ChatScreen(),
            ),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        // 로딩 다이얼로그 닫기
        Navigator.pop(context);
        // 에러 스낵바
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Failed to join channel. Please check your connection.',
                    style: const TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
            behavior: SnackBarBehavior.floating,
            backgroundColor: AlmaTheme.error,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            action: SnackBarAction(
              label: 'Retry',
              textColor: Colors.white,
              onPressed: () => _createGlobalChannel(context),
            ),
          ),
        );
      }
    }
  }
}

/// 연결 상태 점 인디케이터
class _ConnectionDot extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final client = StreamChat.of(context).client;

    return StreamBuilder<ConnectionStatus>(
      stream: client.wsConnectionStatusStream,
      initialData: client.wsConnectionStatus,
      builder: (context, snapshot) {
        final status = snapshot.data ?? ConnectionStatus.disconnected;
        final Color color;
        final String tooltip;

        switch (status) {
          case ConnectionStatus.connected:
            color = AlmaTheme.success;
            tooltip = 'Connected';
          case ConnectionStatus.connecting:
            color = AlmaTheme.warning;
            tooltip = 'Connecting...';
          case ConnectionStatus.disconnected:
            color = AlmaTheme.error;
            tooltip = 'Disconnected';
        }

        return Tooltip(
          message: tooltip,
          child: Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: color,
              boxShadow: [
                BoxShadow(
                  color: color.withValues(alpha: 0.4),
                  blurRadius: 4,
                  spreadRadius: 1,
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
