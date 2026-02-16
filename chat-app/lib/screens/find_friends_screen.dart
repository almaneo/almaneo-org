import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import 'chat_screen.dart';

class FindFriendsScreen extends ConsumerStatefulWidget {
  const FindFriendsScreen({super.key});

  @override
  ConsumerState<FindFriendsScreen> createState() => _FindFriendsScreenState();
}

class _FindFriendsScreenState extends ConsumerState<FindFriendsScreen> {
  final _searchController = TextEditingController();
  final _focusNode = FocusNode();
  Timer? _debounce;
  List<User>? _results;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _focusNode.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    _debounce?.cancel();
    if (query.trim().isEmpty) {
      setState(() {
        _results = null;
        _isLoading = false;
      });
      return;
    }
    setState(() => _isLoading = true);
    _debounce = Timer(const Duration(milliseconds: 400), () {
      _performSearch(query.trim());
    });
  }

  Future<void> _performSearch(String query) async {
    final client = StreamChat.of(context).client;
    final currentUser = StreamChat.of(context).currentUser;

    try {
      final response = await client.queryUsers(
        filter: Filter.and([
          Filter.autoComplete('name', query),
          if (currentUser != null) Filter.notEqual('id', currentUser.id),
        ]),
        sort: [const SortOption('last_active', direction: SortOption.DESC)],
        pagination: const PaginationParams(limit: 30),
      );

      if (mounted) {
        setState(() {
          _results = response.users;
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('User search failed: $e');
      if (mounted) {
        setState(() {
          _results = [];
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _startDM(User targetUser) async {
    final client = StreamChat.of(context).client;
    final currentUser = StreamChat.of(context).currentUser;
    if (currentUser == null) return;

    // distinct channel: same members → same channel (no duplicates)
    final channel = client.channel(
      'messaging',
      extraData: {
        'members': [currentUser.id, targetUser.id],
      },
    );

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
    final lang = ref.watch(languageProvider).languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text(tr('friends.title', lang)),
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: _searchController,
              focusNode: _focusNode,
              onChanged: _onSearchChanged,
              style: const TextStyle(color: Colors.white, fontSize: 16),
              cursorColor: AlmaTheme.electricBlue,
              decoration: InputDecoration(
                hintText: tr('friends.searchHint', lang),
                hintStyle: TextStyle(
                  color: Colors.white.withValues(alpha: 0.4),
                  fontSize: 15,
                ),
                prefixIcon: Icon(
                  Icons.search,
                  color: Colors.white.withValues(alpha: 0.4),
                  size: 22,
                ),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: Icon(
                          Icons.close,
                          color: Colors.white.withValues(alpha: 0.4),
                          size: 20,
                        ),
                        onPressed: () {
                          _searchController.clear();
                          _onSearchChanged('');
                        },
                      )
                    : null,
                filled: true,
                fillColor: AlmaTheme.slateGray,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),

          // Body
          Expanded(child: _buildBody(lang)),
        ],
      ),
    );
  }

  Widget _buildBody(String lang) {
    // Empty query
    if (_searchController.text.trim().isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person_search,
              size: 56,
              color: Colors.white.withValues(alpha: 0.15),
            ),
            const SizedBox(height: 16),
            Text(
              tr('friends.searchHint', lang),
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.4),
                fontSize: 15,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              tr('friends.searchDesc', lang),
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.25),
                fontSize: 13,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    // Loading
    if (_isLoading) {
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
    if (_results != null && _results!.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person_off_outlined,
              size: 56,
              color: Colors.white.withValues(alpha: 0.15),
            ),
            const SizedBox(height: 16),
            Text(
              tr('friends.noResults', lang),
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.4),
                fontSize: 15,
              ),
            ),
          ],
        ),
      );
    }

    // Results
    if (_results != null) {
      return ListView.builder(
        itemCount: _results!.length,
        itemBuilder: (context, index) {
          final user = _results![index];
          return _UserTile(
            user: user,
            lang: lang,
            onTap: () => _startDM(user),
          );
        },
      );
    }

    return const SizedBox.shrink();
  }
}

class _UserTile extends StatelessWidget {
  final User user;
  final String lang;
  final VoidCallback onTap;

  const _UserTile({
    required this.user,
    required this.lang,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final name = user.name.isNotEmpty ? user.name : user.id;
    final imageUrl = user.image;
    final isOnline = user.online;

    return ListTile(
      leading: Stack(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: AlmaTheme.electricBlue.withValues(alpha: 0.15),
            backgroundImage:
                (imageUrl != null && imageUrl.isNotEmpty) ? NetworkImage(imageUrl) : null,
            child: (imageUrl == null || imageUrl.isEmpty)
                ? Text(
                    name[0].toUpperCase(),
                    style: const TextStyle(
                      color: AlmaTheme.electricBlue,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  )
                : null,
          ),
          if (isOnline)
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  color: AlmaTheme.success,
                  shape: BoxShape.circle,
                  border: Border.all(color: AlmaTheme.deepNavy, width: 2),
                ),
              ),
            ),
        ],
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
        isOnline
            ? tr('friends.online', lang)
            : _formatLastSeen(user.lastActive, lang),
        style: TextStyle(
          color: isOnline
              ? AlmaTheme.success.withValues(alpha: 0.8)
              : Colors.white.withValues(alpha: 0.4),
          fontSize: 13,
        ),
      ),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: AlmaTheme.electricBlue.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          tr('friends.chat', lang),
          style: const TextStyle(
            color: AlmaTheme.electricBlue,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      onTap: onTap,
    );
  }

  String _formatLastSeen(DateTime? lastActive, String lang) {
    if (lastActive == null) return tr('friends.offline', lang);
    final diff = DateTime.now().difference(lastActive);
    if (diff.inMinutes < 5) return tr('friends.justNow', lang);
    if (diff.inHours < 1) {
      return tr('friends.minutesAgo', lang, args: {'count': diff.inMinutes.toString()});
    }
    if (diff.inDays < 1) {
      return tr('friends.hoursAgo', lang, args: {'count': diff.inHours.toString()});
    }
    return tr('friends.daysAgo', lang, args: {'count': diff.inDays.toString()});
  }
}
