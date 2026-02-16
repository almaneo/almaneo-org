import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/env.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/auth_service.dart';
import '../widgets/alma_logo.dart';
import 'browse_channels_screen.dart';
import 'chat_screen.dart';
import 'create_channel_screen.dart';
import 'profile_screen.dart';
import 'settings_screen.dart';

class ChannelListScreen extends ConsumerStatefulWidget {
  final VoidCallback onLogout;
  final AuthService authService;

  const ChannelListScreen({
    super.key,
    required this.onLogout,
    required this.authService,
  });

  @override
  ConsumerState<ChannelListScreen> createState() => _ChannelListScreenState();
}

class _ChannelListScreenState extends ConsumerState<ChannelListScreen> {
  bool _isSearching = false;
  final _searchController = TextEditingController();
  final _searchFocusNode = FocusNode();
  Timer? _debounce;
  List<Channel>? _searchResults;
  bool _isLoadingSearch = false;

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  void _startSearch() {
    setState(() {
      _isSearching = true;
      _searchResults = null;
    });
    // Focus the search field after the frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _searchFocusNode.requestFocus();
    });
  }

  void _stopSearch() {
    setState(() {
      _isSearching = false;
      _searchController.clear();
      _searchResults = null;
      _isLoadingSearch = false;
    });
    _debounce?.cancel();
  }

  void _onSearchChanged(String query) {
    _debounce?.cancel();
    if (query.trim().isEmpty) {
      setState(() {
        _searchResults = null;
        _isLoadingSearch = false;
      });
      return;
    }
    setState(() => _isLoadingSearch = true);
    _debounce = Timer(const Duration(milliseconds: 400), () {
      _performSearch(query.trim());
    });
  }

  Future<void> _performSearch(String query) async {
    final client = StreamChat.of(context).client;

    try {
      final channelStream = client.queryChannels(
        filter: Filter.and([
          Filter.equal('type', 'messaging'),
          Filter.autoComplete('name', query),
        ]),
        channelStateSort: [SortOption.desc('member_count')],
        paginationParams: const PaginationParams(limit: 20),
      );

      final channels = await channelStream.first;

      if (mounted && _isSearching) {
        setState(() {
          _searchResults = channels;
          _isLoadingSearch = false;
        });
      }
    } catch (_) {
      if (mounted && _isSearching) {
        setState(() {
          _searchResults = [];
          _isLoadingSearch = false;
        });
      }
    }
  }

  void _navigateToChannel(Channel channel) {
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

  @override
  Widget build(BuildContext context) {
    final user = StreamChat.of(context).currentUser;
    final langState = ref.watch(languageProvider);
    final lang = langState.languageCode;

    return Scaffold(
      appBar: AppBar(
        leading: _isSearching
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: _stopSearch,
              )
            : null,
        title: _isSearching
            ? _SearchField(
                controller: _searchController,
                focusNode: _searchFocusNode,
                hint: tr('search.hint', lang),
                onChanged: _onSearchChanged,
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    tr('app.name', lang),
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(width: 8),
                  _ConnectionDot(lang: lang),
                ],
              ),
        actions: _isSearching
            ? [
                if (_searchController.text.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () {
                      _searchController.clear();
                      _onSearchChanged('');
                    },
                  ),
              ]
            : [
                // 검색 버튼
                IconButton(
                  icon: const Icon(Icons.search, size: 22),
                  onPressed: _startSearch,
                  tooltip: tr('search.hint', lang),
                ),
                // 언어 설정 버튼
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
                // 사용자 아바타 → 프로필 화면
                Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ProfileScreen(onLogout: widget.onLogout, authService: widget.authService),
                        ),
                      );
                    },
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
                ),
              ],
      ),
      body: _isSearching
          ? _buildSearchBody(lang, user)
          : StreamChannelListView(
              controller: StreamChannelListController(
                client: StreamChat.of(context).client,
                filter: Filter.in_('members', [user?.id ?? '']),
                channelStateSort: const [SortOption.desc('last_message_at')],
                limit: 20,
              ),
              itemBuilder: (context, channels, index, defaultWidget) {
                return defaultWidget;
              },
              onChannelTap: _navigateToChannel,
              emptyBuilder: (context) => _buildEmptyState(context, lang),
            ),
      floatingActionButton: _isSearching
          ? null
          : FloatingActionButton(
              onPressed: () => _showChannelOptions(context, lang),
              child: const Icon(Icons.add_comment_outlined),
            ),
    );
  }

  Widget _buildSearchBody(String lang, User? user) {
    // Empty query - show hint
    if (_searchController.text.trim().isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search,
              size: 56,
              color: Colors.white.withValues(alpha: 0.15),
            ),
            const SizedBox(height: 16),
            Text(
              tr('search.hint', lang),
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.4),
                fontSize: 15,
              ),
            ),
          ],
        ),
      );
    }

    // Loading
    if (_isLoadingSearch) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(
              width: 28,
              height: 28,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AlmaTheme.electricBlue,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              tr('search.searching', lang),
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.4),
                fontSize: 14,
              ),
            ),
          ],
        ),
      );
    }

    // No results
    if (_searchResults != null && _searchResults!.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off,
              size: 56,
              color: Colors.white.withValues(alpha: 0.15),
            ),
            const SizedBox(height: 16),
            Text(
              tr('search.noResults', lang),
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.4),
                fontSize: 15,
              ),
            ),
          ],
        ),
      );
    }

    // Results list
    if (_searchResults != null) {
      return ListView.builder(
        itemCount: _searchResults!.length,
        itemBuilder: (context, index) {
          final channel = _searchResults![index];
          final name = channel.extraData['name'] as String? ?? channel.id ?? '';
          final desc = channel.extraData['description'] as String? ?? '';
          final memberCount = channel.memberCount ?? 0;
          final isMember = user != null &&
              channel.state?.members.any((m) => m.userId == user.id) == true;

          return _SearchResultTile(
            name: name,
            description: desc,
            memberCount: memberCount,
            isMember: isMember,
            lang: lang,
            onTap: () async {
              // If already a member, just navigate
              if (isMember) {
                _navigateToChannel(channel);
                return;
              }
              // Otherwise, join via server API then navigate
              if (user == null) return;
              try {
                final response = await http.post(
                  Uri.parse('${Env.chatApiUrl}/api/join-channel'),
                  headers: {'Content-Type': 'application/json'},
                  body: jsonEncode({
                    'userId': user.id,
                    'channelId': channel.id,
                  }),
                );
                if (response.statusCode != 200) {
                  throw Exception('Server error');
                }
                await channel.watch();
                if (mounted) {
                  _navigateToChannel(channel);
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(tr('channels.joinFailed', lang)),
                      backgroundColor: AlmaTheme.error,
                    ),
                  );
                }
              }
            },
          );
        },
      );
    }

    return const SizedBox.shrink();
  }

  Widget _buildEmptyState(BuildContext context, String lang) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/images/Small_Heart.webp',
            width: 80,
            height: 80,
            fit: BoxFit.contain,
            errorBuilder: (_, __, ___) => const AlmaLogo(size: 56, showShadow: false),
          ),
          const SizedBox(height: 16),
          Text(
            tr('channels.noConversations', lang),
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.5),
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            tr('channels.joinGlobalHint', lang),
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.3),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => _createGlobalChannel(context, lang),
            icon: const Icon(Icons.public, size: 18),
            label: Text(tr('channels.joinGlobal', lang)),
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

  void _showChannelOptions(BuildContext context, String lang) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AlmaTheme.slateGray,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              _BottomSheetOption(
                icon: Icons.public,
                iconColor: AlmaTheme.success,
                title: tr('channels.joinGlobal', lang),
                subtitle: tr('channels.globalDesc', lang),
                onTap: () {
                  Navigator.pop(ctx);
                  _createGlobalChannel(context, lang);
                },
              ),
              _BottomSheetOption(
                icon: Icons.add_circle_outline,
                iconColor: AlmaTheme.electricBlue,
                title: tr('channels.createChannel', lang),
                subtitle: tr('channels.createDesc', lang),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CreateChannelScreen()),
                  );
                },
              ),
              _BottomSheetOption(
                icon: Icons.explore_outlined,
                iconColor: AlmaTheme.terracottaOrange,
                title: tr('channels.browseChannels', lang),
                subtitle: tr('channels.browseDesc', lang),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const BrowseChannelsScreen()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _createGlobalChannel(BuildContext context, String lang) async {
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
        Navigator.pop(context);
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
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    tr('channels.joinFailed', lang),
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
              label: tr('common.retry', lang),
              textColor: Colors.white,
              onPressed: () => _createGlobalChannel(context, lang),
            ),
          ),
        );
      }
    }
  }
}

/// AppBar 내 검색 입력 필드
class _SearchField extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final String hint;
  final ValueChanged<String> onChanged;

  const _SearchField({
    required this.controller,
    required this.focusNode,
    required this.hint,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      focusNode: focusNode,
      onChanged: onChanged,
      style: const TextStyle(color: Colors.white, fontSize: 16),
      cursorColor: AlmaTheme.electricBlue,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(
          color: Colors.white.withValues(alpha: 0.4),
          fontSize: 16,
        ),
        border: InputBorder.none,
        contentPadding: EdgeInsets.zero,
      ),
    );
  }
}

/// 검색 결과 타일
class _SearchResultTile extends StatelessWidget {
  final String name;
  final String description;
  final int memberCount;
  final bool isMember;
  final String lang;
  final VoidCallback onTap;

  const _SearchResultTile({
    required this.name,
    required this.description,
    required this.memberCount,
    required this.isMember,
    required this.lang,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: AlmaTheme.electricBlue.withValues(alpha: 0.15),
        child: Text(
          name.isNotEmpty ? name[0].toUpperCase() : '#',
          style: const TextStyle(
            color: AlmaTheme.electricBlue,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
      ),
      title: Text(
        name,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w500,
          fontSize: 15,
        ),
      ),
      subtitle: Text(
        description.isNotEmpty
            ? description
            : tr('browse.members', lang, args: {'count': memberCount.toString()}),
        style: TextStyle(
          color: Colors.white.withValues(alpha: 0.4),
          fontSize: 13,
        ),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: isMember
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AlmaTheme.success.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                tr('browse.joined', lang),
                style: const TextStyle(
                  color: AlmaTheme.success,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            )
          : Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AlmaTheme.electricBlue.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                tr('browse.join', lang),
                style: const TextStyle(
                  color: AlmaTheme.electricBlue,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
      onTap: onTap,
    );
  }
}

/// 연결 상태 점 인디케이터
class _ConnectionDot extends StatelessWidget {
  final String lang;

  const _ConnectionDot({required this.lang});

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
            tooltip = tr('status.connected', lang);
          case ConnectionStatus.connecting:
            color = AlmaTheme.warning;
            tooltip = tr('status.connecting', lang);
          case ConnectionStatus.disconnected:
            color = AlmaTheme.error;
            tooltip = tr('status.disconnected', lang);
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

/// 바텀시트 옵션 타일
class _BottomSheetOption extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _BottomSheetOption({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: iconColor.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: iconColor, size: 22),
      ),
      title: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w500,
          fontSize: 15,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          color: Colors.white.withValues(alpha: 0.4),
          fontSize: 13,
        ),
      ),
      trailing: Icon(
        Icons.chevron_right,
        color: Colors.white.withValues(alpha: 0.3),
      ),
      onTap: onTap,
    );
  }
}
