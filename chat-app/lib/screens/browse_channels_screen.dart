import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/env.dart';
import '../config/theme.dart';
import 'chat_screen.dart';

class BrowseChannelsScreen extends StatefulWidget {
  const BrowseChannelsScreen({super.key});

  @override
  State<BrowseChannelsScreen> createState() => _BrowseChannelsScreenState();
}

class _BrowseChannelsScreenState extends State<BrowseChannelsScreen> {
  List<_ChannelInfo> _channels = [];
  bool _isLoading = true;
  String? _error;
  String? _joiningChannelId;

  @override
  void initState() {
    super.initState();
    _loadChannels();
  }

  Future<void> _loadChannels() async {
    final user = StreamChat.of(context).currentUser;
    if (user == null) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await http.get(
        Uri.parse('${Env.chatApiUrl}/api/browse-channels?userId=${user.id}'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to load channels');
      }

      final data = jsonDecode(response.body);
      final list = (data['channels'] as List).map((ch) => _ChannelInfo(
            id: ch['id'] as String,
            name: ch['name'] as String,
            description: ch['description'] as String? ?? '',
            memberCount: ch['memberCount'] as int? ?? 0,
            isMember: ch['isMember'] as bool? ?? false,
          ));

      if (mounted) {
        setState(() {
          _channels = list.toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString().replaceFirst('Exception: ', '');
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _joinChannel(_ChannelInfo info) async {
    final streamChat = StreamChat.of(context);
    final user = streamChat.currentUser;
    if (user == null) return;

    final client = streamChat.client;

    setState(() => _joiningChannelId = info.id);

    try {
      // Server-side join
      final response = await http.post(
        Uri.parse('${Env.chatApiUrl}/api/join-channel'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': user.id,
          'channelId': info.id,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to join channel');
      }

      // Watch the channel
      final channel = client.channel('messaging', id: info.id);
      await channel.watch();

      if (mounted) {
        Navigator.pushReplacement(
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
      if (mounted) {
        setState(() => _joiningChannelId = null);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to join: ${e.toString().replaceFirst("Exception: ", "")}'),
            backgroundColor: AlmaTheme.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        );
      }
    }
  }

  Future<void> _openChannel(_ChannelInfo info) async {
    final client = StreamChat.of(context).client;
    final channel = client.channel('messaging', id: info.id);
    await channel.watch();

    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => StreamChannel(
            channel: channel,
            child: const ChatScreen(),
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Browse Channels',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, size: 22),
            onPressed: _isLoading ? null : _loadChannels,
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: AlmaTheme.electricBlue),
      );
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 48, color: AlmaTheme.error.withValues(alpha: 0.5)),
            const SizedBox(height: 12),
            Text(
              _error!,
              style: TextStyle(color: Colors.white.withValues(alpha: 0.5)),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _loadChannels,
              icon: const Icon(Icons.refresh, size: 18),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AlmaTheme.electricBlue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
          ],
        ),
      );
    }

    if (_channels.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, size: 48, color: Colors.white.withValues(alpha: 0.2)),
            const SizedBox(height: 12),
            Text(
              'No channels found',
              style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 16),
            ),
            const SizedBox(height: 4),
            Text(
              'Be the first to create one!',
              style: TextStyle(color: Colors.white.withValues(alpha: 0.3), fontSize: 13),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadChannels,
      color: AlmaTheme.electricBlue,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: _channels.length,
        separatorBuilder: (_, _) => Divider(
          height: 1,
          color: Colors.white.withValues(alpha: 0.06),
          indent: 68,
        ),
        itemBuilder: (context, index) {
          final ch = _channels[index];
          return _ChannelTile(
            info: ch,
            isJoining: _joiningChannelId == ch.id,
            onJoin: () => _joinChannel(ch),
            onOpen: () => _openChannel(ch),
          );
        },
      ),
    );
  }
}

class _ChannelTile extends StatelessWidget {
  final _ChannelInfo info;
  final bool isJoining;
  final VoidCallback onJoin;
  final VoidCallback onOpen;

  const _ChannelTile({
    required this.info,
    required this.isJoining,
    required this.onJoin,
    required this.onOpen,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: info.isMember
              ? AlmaTheme.success.withValues(alpha: 0.15)
              : AlmaTheme.electricBlue.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(
          info.isMember ? Icons.forum : Icons.tag,
          color: info.isMember ? AlmaTheme.success : AlmaTheme.electricBlue,
          size: 22,
        ),
      ),
      title: Row(
        children: [
          Expanded(
            child: Text(
              info.name,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w500,
                fontSize: 15,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (info.isMember)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: AlmaTheme.success.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Text(
                'Joined',
                style: TextStyle(
                  color: AlmaTheme.success,
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
        ],
      ),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (info.description.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Text(
                info.description,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.4),
                  fontSize: 13,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Row(
              children: [
                Icon(Icons.people_outline, size: 13, color: Colors.white.withValues(alpha: 0.3)),
                const SizedBox(width: 4),
                Text(
                  '${info.memberCount} members',
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.3),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      trailing: info.isMember
          ? Icon(Icons.chevron_right, color: Colors.white.withValues(alpha: 0.3))
          : isJoining
              ? const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AlmaTheme.electricBlue,
                  ),
                )
              : SizedBox(
                  height: 32,
                  child: ElevatedButton(
                    onPressed: onJoin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AlmaTheme.electricBlue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      textStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                    child: const Text('Join'),
                  ),
                ),
      onTap: info.isMember ? onOpen : onJoin,
    );
  }
}

class _ChannelInfo {
  final String id;
  final String name;
  final String description;
  final int memberCount;
  final bool isMember;

  _ChannelInfo({
    required this.id,
    required this.name,
    required this.description,
    required this.memberCount,
    required this.isMember,
  });
}
