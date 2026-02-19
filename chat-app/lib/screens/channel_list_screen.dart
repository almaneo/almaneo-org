import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/env.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/auth_service.dart';
import '../widgets/alma_logo.dart';
import '../widgets/channel_actions_sheet.dart';
import 'browse_channels_screen.dart';
import 'chat_screen.dart';
import 'create_channel_screen.dart';
import 'find_friends_screen.dart';
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
  String _filter = 'all'; // 'all', 'dm', 'group'
  Set<String> _pinnedChannelIds = {};
  StreamChannelListController? _channelListController;

  static const _pinnedKey = 'pinned_channel_ids';

  @override
  void initState() {
    super.initState();
    _loadPinnedChannels();
  }

  Future<void> _loadPinnedChannels() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_pinnedKey) ?? [];
    if (mounted) {
      setState(() => _pinnedChannelIds = list.toSet());
    }
  }

  Future<void> _savePinnedChannels() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_pinnedKey, _pinnedChannelIds.toList());
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    _debounce?.cancel();
    _channelListController?.dispose();
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
    channel.markRead();
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

  void _showChannelActions(Channel channel, String lang) {
    final cid = channel.cid;
    if (cid == null) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: context.alma.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) => ChannelActionsSheet(
        channel: channel,
        lang: lang,
        isPinned: _pinnedChannelIds.contains(cid),
        onPin: () => _togglePin(channel, lang),
        onMute: () => _toggleMute(channel, lang),
        onLeave: () => _leaveChannel(channel, lang),
      ),
    );
  }

  void _togglePin(Channel channel, String lang) {
    final cid = channel.cid;
    if (cid == null) return;

    setState(() {
      if (_pinnedChannelIds.contains(cid)) {
        _pinnedChannelIds.remove(cid);
      } else {
        _pinnedChannelIds.add(cid);
      }
    });
    _savePinnedChannels();

    final isPinned = _pinnedChannelIds.contains(cid);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          isPinned
              ? tr('channelActions.pinned', lang)
              : tr('channelActions.unpinned', lang),
        ),
        behavior: SnackBarBehavior.floating,
        backgroundColor: AlmaTheme.success.withValues(alpha: 0.9),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> _toggleMute(Channel channel, String lang) async {
    try {
      if (channel.isMuted) {
        await channel.unmute();
      } else {
        await channel.mute();
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              channel.isMuted
                  ? tr('channelActions.muted', lang)
                  : tr('channelActions.unmuted', lang),
            ),
            behavior: SnackBarBehavior.floating,
            backgroundColor: AlmaTheme.success.withValues(alpha: 0.9),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            duration: const Duration(seconds: 2),
          ),
        );
        setState(() {}); // refresh UI
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(tr('channelInfo.actionFailed', lang)),
            backgroundColor: AlmaTheme.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        );
      }
    }
  }

  Future<void> _leaveChannel(Channel channel, String lang) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        final alma = ctx.alma;
        return AlertDialog(
          backgroundColor: alma.cardBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text(
            tr('channelActions.leaveConfirmTitle', lang),
            style: TextStyle(color: alma.textPrimary, fontWeight: FontWeight.bold),
          ),
          content: Text(
            tr('channelActions.leaveConfirmDesc', lang),
            style: TextStyle(color: alma.textSecondary),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: Text(tr('common.cancel', lang), style: TextStyle(color: alma.textTertiary)),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(ctx, true),
              style: ElevatedButton.styleFrom(
                backgroundColor: AlmaTheme.error,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: Text(tr('channelActions.leave', lang)),
            ),
          ],
        );
      },
    );

    if (confirmed != true || !mounted) return;

    try {
      final currentUserId = StreamChat.of(context).currentUser?.id;
      if (currentUserId != null) {
        await channel.removeMembers([currentUserId]);
      }
      // Remove from pinned if it was pinned
      final cid = channel.cid;
      if (cid != null && _pinnedChannelIds.contains(cid)) {
        setState(() => _pinnedChannelIds.remove(cid));
        _savePinnedChannels();
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(tr('channelInfo.actionFailed', lang)),
            backgroundColor: AlmaTheme.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
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
                      color: alma.cardBg,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.translate, size: 16, color: alma.textSecondary),
                        const SizedBox(width: 4),
                        Text(
                          langState.language.flag,
                          style: const TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
              ],
      ),
      body: _isSearching
          ? _buildSearchBody(lang, user)
          : Column(
              children: [
                // Filter chips
                _FilterChips(
                  selected: _filter,
                  lang: lang,
                  onChanged: (f) => setState(() => _filter = f),
                ),
                Expanded(
                  child: RefreshIndicator(
                    color: AlmaTheme.electricBlue,
                    onRefresh: () async {
                      await _channelListController?.refresh();
                    },
                    child: StreamChannelListView(
                    controller: _channelListController ??= StreamChannelListController(
                      client: StreamChat.of(context).client,
                      filter: Filter.in_('members', [user?.id ?? '']),
                      channelStateSort: const [SortOption.desc('last_message_at')],
                      limit: 20,
                    ),
                    itemBuilder: (context, channels, index, defaultWidget) {
                      // Sort: pinned channels first
                      final sorted = List<Channel>.from(channels);
                      sorted.sort((a, b) {
                        final aPinned = _pinnedChannelIds.contains(a.cid);
                        final bPinned = _pinnedChannelIds.contains(b.cid);
                        if (aPinned && !bPinned) return -1;
                        if (!aPinned && bPinned) return 1;
                        return 0;
                      });
                      final channel = sorted[index];
                      final isDM = _isDMChannel(channel, user);

                      // Apply filter
                      if (_filter == 'dm' && !isDM) {
                        return const SizedBox.shrink();
                      }
                      if (_filter == 'group' && isDM) {
                        return const SizedBox.shrink();
                      }

                      return _ChannelTile(
                        channel: channel,
                        currentUser: user,
                        isDM: isDM,
                        lang: lang,
                        isPinned: _pinnedChannelIds.contains(channel.cid),
                        onTap: () => _navigateToChannel(channel),
                        onLongPress: () => _showChannelActions(channel, lang),
                      );
                    },
                    onChannelTap: _navigateToChannel,
                    emptyBuilder: (context) => _buildEmptyState(context, lang),
                  ),
                  ),
                ),
              ],
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
    final alma = context.alma;

    // Empty query - show hint
    if (_searchController.text.trim().isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search,
              size: 56,
              color: alma.borderDefault,
            ),
            const SizedBox(height: 16),
            Text(
              tr('search.hint', lang),
              style: TextStyle(
                color: alma.textTertiary,
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
                color: alma.textTertiary,
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
              color: alma.borderDefault,
            ),
            const SizedBox(height: 16),
            Text(
              tr('search.noResults', lang),
              style: TextStyle(
                color: alma.textTertiary,
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
    final alma = context.alma;
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
              color: alma.textTertiary,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            tr('channels.joinGlobalHint', lang),
            style: TextStyle(
              color: alma.textTertiary,
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

  void _showJoinByCodeDialog(String lang) {
    final codeController = TextEditingController();
    bool isLoading = false;

    showDialog(
      context: context,
      builder: (ctx) {
        final alma = ctx.alma;
        return StatefulBuilder(
          builder: (ctx, setDialogState) => AlertDialog(
            backgroundColor: alma.cardBg,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: Text(
              tr('invite.joinByCode', lang),
              style: TextStyle(color: alma.textPrimary, fontWeight: FontWeight.bold),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  tr('invite.joinByCodeDesc', lang),
                  style: TextStyle(color: alma.textTertiary, fontSize: 14),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: codeController,
                  textCapitalization: TextCapitalization.characters,
                  maxLength: 6,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: alma.textPrimary,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'monospace',
                    letterSpacing: 6,
                  ),
                  cursorColor: AlmaTheme.electricBlue,
                  decoration: InputDecoration(
                    hintText: 'ABC123',
                    hintStyle: TextStyle(
                      color: alma.borderDefault,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'monospace',
                      letterSpacing: 6,
                    ),
                    counterText: '',
                    filled: true,
                    fillColor: alma.inputBg,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: AlmaTheme.electricBlue.withValues(alpha: 0.3)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: AlmaTheme.electricBlue.withValues(alpha: 0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AlmaTheme.electricBlue),
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
                  ),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'[A-Za-z0-9]')),
                  ],
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: isLoading ? null : () => Navigator.pop(ctx),
                child: Text(
                  tr('common.cancel', lang),
                  style: TextStyle(color: alma.textTertiary),
                ),
              ),
              ElevatedButton(
                onPressed: isLoading
                    ? null
                    : () async {
                        final code = codeController.text.trim().toUpperCase();
                        if (code.length < 4) return;

                        final user = StreamChat.of(context).currentUser;
                        final client = StreamChat.of(context).client;
                        if (user == null) return;

                        setDialogState(() => isLoading = true);

                        try {
                          final response = await http.post(
                            Uri.parse('${Env.chatApiUrl}/api/join-invite'),
                            headers: {'Content-Type': 'application/json'},
                            body: jsonEncode({
                              'userId': user.id,
                              'code': code,
                            }),
                          );

                          final data = jsonDecode(response.body) as Map<String, dynamic>;

                          if (response.statusCode != 200) {
                            final errorType = data['error'] as String? ?? '';
                            String errorMsg;
                            if (errorType == 'invalid_code') {
                              errorMsg = tr('invite.invalidCode', lang);
                            } else if (errorType == 'expired_code') {
                              errorMsg = tr('invite.expiredCode', lang);
                            } else {
                              errorMsg = tr('invite.joinFailed', lang);
                            }
                            if (ctx.mounted) {
                              setDialogState(() => isLoading = false);
                              ScaffoldMessenger.of(ctx).showSnackBar(
                                SnackBar(
                                  content: Text(errorMsg),
                                  backgroundColor: AlmaTheme.error,
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                              );
                            }
                            return;
                          }

                          final channelId = data['channelId'] as String;
                          final channelType = data['channelType'] as String? ?? 'messaging';
                          final channel = client.channel(channelType, id: channelId);
                          await channel.watch();

                          if (ctx.mounted) Navigator.pop(ctx);

                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(tr('invite.joinSuccess', lang)),
                                backgroundColor: AlmaTheme.success.withValues(alpha: 0.9),
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                              ),
                            );
                            _navigateToChannel(channel);
                          }
                        } catch (e) {
                          if (ctx.mounted) {
                            setDialogState(() => isLoading = false);
                            ScaffoldMessenger.of(ctx).showSnackBar(
                              SnackBar(
                                content: Text(tr('invite.joinFailed', lang)),
                                backgroundColor: AlmaTheme.error,
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                              ),
                            );
                          }
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AlmaTheme.electricBlue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: isLoading
                    ? const SizedBox(
                        width: 18, height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : Text(tr('invite.join', lang)),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showChannelOptions(BuildContext context, String lang) {
    showModalBottomSheet(
      context: context,
      backgroundColor: context.alma.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) {
        final alma = ctx.alma;
        return SafeArea(
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
                    color: alma.textTertiary,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                _BottomSheetOption(
                  icon: Icons.person_search,
                  iconColor: AlmaTheme.cyan,
                  title: tr('friends.title', lang),
                  subtitle: tr('friends.menuDesc', lang),
                  onTap: () {
                    Navigator.pop(ctx);
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const FindFriendsScreen()),
                    );
                  },
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
                _BottomSheetOption(
                  icon: Icons.vpn_key_outlined,
                  iconColor: AlmaTheme.sandGold,
                  title: tr('invite.joinByCode', lang),
                  subtitle: tr('invite.joinByCodeDesc', lang),
                  onTap: () {
                    Navigator.pop(ctx);
                    _showJoinByCodeDialog(lang);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  bool _isDMChannel(Channel channel, User? currentUser) {
    final memberCount = channel.state?.members.length ?? channel.memberCount ?? 0;
    final hasName = channel.extraData['name'] != null &&
        (channel.extraData['name'] as String).isNotEmpty;
    // DM = exactly 2 members and no explicit channel name
    return memberCount == 2 && !hasName;
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

/// 필터 칩 (전체 | DM | 그룹)
class _FilterChips extends StatelessWidget {
  final String selected;
  final String lang;
  final ValueChanged<String> onChanged;

  const _FilterChips({
    required this.selected,
    required this.lang,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        children: [
          _chip(context, 'all', tr('channels.filterAll', lang)),
          const SizedBox(width: 8),
          _chip(context, 'dm', tr('channels.filterDM', lang)),
          const SizedBox(width: 8),
          _chip(context, 'group', tr('channels.filterGroup', lang)),
        ],
      ),
    );
  }

  Widget _chip(BuildContext context, String value, String label) {
    final alma = context.alma;
    final isSelected = selected == value;
    return GestureDetector(
      onTap: () => onChanged(value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected
              ? AlmaTheme.electricBlue.withValues(alpha: 0.2)
              : alma.chipBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected
                ? AlmaTheme.electricBlue.withValues(alpha: 0.5)
                : Colors.transparent,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected
                ? AlmaTheme.electricBlue
                : alma.textTertiary,
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ),
    );
  }
}

/// 커스텀 채널 리스트 타일 (DM/Group 구분)
class _ChannelTile extends StatelessWidget {
  final Channel channel;
  final User? currentUser;
  final bool isDM;
  final String lang;
  final bool isPinned;
  final VoidCallback onTap;
  final VoidCallback? onLongPress;

  const _ChannelTile({
    required this.channel,
    required this.currentUser,
    required this.isDM,
    required this.lang,
    this.isPinned = false,
    required this.onTap,
    this.onLongPress,
  });

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    final unreadCount = channel.state?.unreadCount ?? 0;
    final lastMessage = channel.state?.lastMessage;
    final lastMessageText = lastMessage?.text ?? '';
    final lastMessageAt = lastMessage?.createdAt ?? channel.createdAt;

    // Determine display name and avatar
    String displayName;
    String? avatarUrl;
    Widget avatarWidget;

    if (isDM) {
      // DM: show the other person
      final otherMember = channel.state?.members
          .where((m) => m.userId != currentUser?.id)
          .firstOrNull;
      final otherUser = otherMember?.user;
      displayName = otherUser?.name ?? otherMember?.userId ?? 'User';
      avatarUrl = otherUser?.image;

      avatarWidget = CircleAvatar(
        radius: 24,
        backgroundColor: AlmaTheme.terracottaOrange.withValues(alpha: 0.15),
        backgroundImage: (avatarUrl != null && avatarUrl.isNotEmpty)
            ? NetworkImage(avatarUrl)
            : null,
        child: (avatarUrl == null || avatarUrl.isEmpty)
            ? Text(
                displayName[0].toUpperCase(),
                style: const TextStyle(
                  color: AlmaTheme.terracottaOrange,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              )
            : null,
      );
    } else {
      // Group channel
      displayName = channel.extraData['name'] as String? ?? channel.id ?? 'Chat';
      avatarWidget = CircleAvatar(
        radius: 24,
        backgroundColor: AlmaTheme.electricBlue.withValues(alpha: 0.15),
        child: Text(
          displayName.isNotEmpty ? displayName[0].toUpperCase() : '#',
          style: const TextStyle(
            color: AlmaTheme.electricBlue,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
      );
    }

    // Last message sender name for groups
    String preview = '';
    if (lastMessage != null) {
      if (lastMessage.attachments.isNotEmpty && lastMessageText.isEmpty) {
        preview = '📷 ${tr('chat.photo', lang)}';
      } else if (!isDM && lastMessage.user != null) {
        final senderName = lastMessage.user!.name.split(' ').first;
        preview = '$senderName: $lastMessageText';
      } else {
        preview = lastMessageText;
      }
    }

    final isMuted = channel.isMuted;

    return InkWell(
      onTap: onTap,
      onLongPress: onLongPress,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          children: [
            // Avatar with online indicator for DM
            Stack(
              children: [
                avatarWidget,
                if (isDM)
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: _OnlineIndicator(channel: channel, currentUserId: currentUser?.id),
                  ),
              ],
            ),
            const SizedBox(width: 12),
            // Name + Last message
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      if (!isDM)
                        Padding(
                          padding: const EdgeInsets.only(right: 4),
                          child: Icon(
                            Icons.group,
                            size: 14,
                            color: alma.textTertiary,
                          ),
                        ),
                      Expanded(
                        child: Text(
                          displayName,
                          style: TextStyle(
                            color: alma.textPrimary,
                            fontWeight: unreadCount > 0 ? FontWeight.w600 : FontWeight.w500,
                            fontSize: 15,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (isMuted)
                        Padding(
                          padding: const EdgeInsets.only(right: 4),
                          child: Icon(
                            Icons.notifications_off,
                            size: 14,
                            color: alma.textTertiary,
                          ),
                        ),
                      if (isPinned)
                        Padding(
                          padding: const EdgeInsets.only(right: 4),
                          child: Icon(
                            Icons.push_pin,
                            size: 14,
                            color: AlmaTheme.sandGold.withValues(alpha: 0.7),
                          ),
                        ),
                      if (lastMessageAt != null)
                        Text(
                          _formatTime(lastMessageAt),
                          style: TextStyle(
                            color: unreadCount > 0
                                ? AlmaTheme.electricBlue
                                : alma.textTertiary,
                            fontSize: 11,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          preview.isNotEmpty ? preview : tr('channels.noMessages', lang),
                          style: TextStyle(
                            color: unreadCount > 0
                                ? alma.textSecondary
                                : alma.textTertiary,
                            fontSize: 13,
                            fontWeight: unreadCount > 0 ? FontWeight.w500 : FontWeight.w400,
                          ),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                        ),
                      ),
                      if (unreadCount > 0)
                        Container(
                          margin: const EdgeInsets.only(left: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: AlmaTheme.electricBlue,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            unreadCount > 99 ? '99+' : '$unreadCount',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final diff = now.difference(dateTime);

    if (diff.inDays == 0) {
      // Today: show time
      final hour = dateTime.hour.toString().padLeft(2, '0');
      final min = dateTime.minute.toString().padLeft(2, '0');
      return '$hour:$min';
    } else if (diff.inDays == 1) {
      return tr('channels.yesterday', lang);
    } else if (diff.inDays < 7) {
      final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return weekdays[dateTime.weekday - 1];
    } else {
      return '${dateTime.month}/${dateTime.day}';
    }
  }
}

/// DM 상대방 온라인 인디케이터
class _OnlineIndicator extends StatelessWidget {
  final Channel channel;
  final String? currentUserId;

  const _OnlineIndicator({required this.channel, required this.currentUserId});

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    final otherMember = channel.state?.members
        .where((m) => m.userId != currentUserId)
        .firstOrNull;
    final isOnline = otherMember?.user?.online ?? false;

    if (!isOnline) return const SizedBox.shrink();

    return Container(
      width: 12,
      height: 12,
      decoration: BoxDecoration(
        color: AlmaTheme.success,
        shape: BoxShape.circle,
        border: Border.all(color: alma.scaffold, width: 2),
      ),
    );
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
    final alma = context.alma;
    return TextField(
      controller: controller,
      focusNode: focusNode,
      onChanged: onChanged,
      style: TextStyle(color: alma.textPrimary, fontSize: 16),
      cursorColor: AlmaTheme.electricBlue,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(
          color: alma.textTertiary,
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
    final alma = context.alma;
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
        style: TextStyle(
          color: alma.textPrimary,
          fontWeight: FontWeight.w500,
          fontSize: 15,
        ),
      ),
      subtitle: Text(
        description.isNotEmpty
            ? description
            : tr('browse.members', lang, args: {'count': memberCount.toString()}),
        style: TextStyle(
          color: alma.textTertiary,
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
    final alma = context.alma;
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
        style: TextStyle(
          color: alma.textPrimary,
          fontWeight: FontWeight.w500,
          fontSize: 15,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          color: alma.textTertiary,
          fontSize: 13,
        ),
      ),
      trailing: Icon(
        Icons.chevron_right,
        color: alma.textTertiary,
      ),
      onTap: onTap,
    );
  }
}
