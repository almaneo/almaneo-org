import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../screens/chat_screen.dart';

/// Bottom sheet showing a user's profile info.
/// Shown when tapping a user avatar in chat or find friends screen.
class UserProfileSheet extends StatelessWidget {
  final User user;
  final String lang;
  /// If true, the "Send Message" button is hidden (already in DM with this user)
  final bool hideSendMessage;

  const UserProfileSheet({
    super.key,
    required this.user,
    required this.lang,
    this.hideSendMessage = false,
  });

  static void show(BuildContext context, {required User user, required String lang, bool hideSendMessage = false}) {
    showModalBottomSheet(
      context: context,
      backgroundColor: context.alma.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => UserProfileSheet(
        user: user,
        lang: lang,
        hideSendMessage: hideSendMessage,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    final name = user.name.isNotEmpty ? user.name : user.id;
    final imageUrl = user.image;
    final isOnline = user.online;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Container(
              width: 36,
              height: 4,
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: alma.textTertiary,
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // Avatar
            Stack(
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundColor: AlmaTheme.terracottaOrange.withValues(alpha: 0.15),
                  backgroundImage: (imageUrl != null && imageUrl.isNotEmpty)
                      ? NetworkImage(imageUrl)
                      : null,
                  child: (imageUrl == null || imageUrl.isEmpty)
                      ? Text(
                          name[0].toUpperCase(),
                          style: const TextStyle(
                            color: AlmaTheme.terracottaOrange,
                            fontWeight: FontWeight.bold,
                            fontSize: 32,
                          ),
                        )
                      : null,
                ),
                if (isOnline)
                  Positioned(
                    right: 2,
                    bottom: 2,
                    child: Container(
                      width: 16,
                      height: 16,
                      decoration: BoxDecoration(
                        color: AlmaTheme.success,
                        shape: BoxShape.circle,
                        border: Border.all(color: alma.cardBg, width: 2.5),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            // Name
            Text(
              name,
              style: TextStyle(
                color: alma.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),

            // Online status
            Text(
              isOnline
                  ? tr('userProfile.online', lang)
                  : _formatLastSeen(user.lastActive, lang),
              style: TextStyle(
                color: isOnline
                    ? AlmaTheme.success
                    : alma.textTertiary,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 16),

            // User ID
            GestureDetector(
              onTap: () {
                Clipboard.setData(ClipboardData(text: user.id));
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(tr('userProfile.idCopied', lang)),
                    behavior: SnackBarBehavior.floating,
                    backgroundColor: AlmaTheme.success.withValues(alpha: 0.9),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    duration: const Duration(seconds: 2),
                  ),
                );
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: alma.inputBg,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Icon(Icons.person_outline, size: 16, color: alma.textTertiary),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        user.id,
                        style: TextStyle(
                          color: alma.textSecondary,
                          fontSize: 13,
                          fontFamily: 'monospace',
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Icon(Icons.copy, size: 14, color: alma.textTertiary),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Actions
            if (!hideSendMessage)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => _startDM(context),
                  icon: const Icon(Icons.chat_bubble_outline, size: 18),
                  label: Text(tr('userProfile.sendMessage', lang)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AlmaTheme.electricBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Future<void> _startDM(BuildContext context) async {
    final client = StreamChat.of(context).client;
    final currentUser = StreamChat.of(context).currentUser;
    if (currentUser == null) return;

    Navigator.pop(context); // close sheet

    final channel = client.channel(
      'messaging',
      extraData: {
        'members': [currentUser.id, user.id],
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
  }

  String _formatLastSeen(DateTime? lastActive, String lang) {
    if (lastActive == null) return tr('userProfile.offline', lang);
    final diff = DateTime.now().difference(lastActive);
    if (diff.inMinutes < 5) return tr('userProfile.justNow', lang);
    if (diff.inHours < 1) {
      return tr('userProfile.minutesAgo', lang, args: {'count': diff.inMinutes.toString()});
    }
    if (diff.inDays < 1) {
      return tr('userProfile.hoursAgo', lang, args: {'count': diff.inHours.toString()});
    }
    return tr('userProfile.daysAgo', lang, args: {'count': diff.inDays.toString()});
  }
}
