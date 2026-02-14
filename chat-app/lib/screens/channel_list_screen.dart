import 'package:flutter/material.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import 'chat_screen.dart';

class ChannelListScreen extends StatelessWidget {
  const ChannelListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = StreamChat.of(context).currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'AlmaChat',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          // 언어 설정 버튼 (향후 구현)
          IconButton(
            icon: const Icon(Icons.translate, size: 22),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Language settings coming soon'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
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

    try {
      // AlmaChat 글로벌 채널 참가
      final channel = client.channel(
        'messaging',
        id: 'alma-global',
        extraData: const {
          'name': 'AlmaChat Global',
          'description': 'Chat with kindness, across languages',
        },
      );

      await channel.watch();

      if (context.mounted) {
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
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to join: $e'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }
}
