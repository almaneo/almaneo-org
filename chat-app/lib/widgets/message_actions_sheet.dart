import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import 'reaction_picker.dart';

/// Bottom sheet with message actions (copy, reply, delete) and reaction picker.
class MessageActionsSheet extends StatelessWidget {
  final Message message;
  final bool isMyMessage;
  final Channel channel;
  final String lang;
  final VoidCallback? onReply;

  const MessageActionsSheet({
    super.key,
    required this.message,
    required this.isMyMessage,
    required this.channel,
    required this.lang,
    this.onReply,
  });

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Drag handle
            Container(
              width: 36,
              height: 4,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: alma.textTertiary,
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // Reaction picker row
            ReactionPicker(
              onReactionSelected: (type) =>
                  _toggleReaction(context, type),
            ),
            const SizedBox(height: 16),

            // Divider
            Divider(height: 1, color: alma.divider),
            const SizedBox(height: 4),

            // Copy text
            if (message.text != null && message.text!.isNotEmpty)
              _ActionTile(
                icon: Icons.copy_rounded,
                label: tr('message.copy', lang),
                color: alma.textPrimary,
                onTap: () {
                  Clipboard.setData(ClipboardData(text: message.text!));
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(tr('message.copied', lang)),
                      behavior: SnackBarBehavior.floating,
                      backgroundColor:
                          AlmaTheme.success.withValues(alpha: 0.9),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8)),
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
              ),

            // Reply
            if (onReply != null)
              _ActionTile(
                icon: Icons.reply_rounded,
                label: tr('message.reply', lang),
                color: alma.textPrimary,
                onTap: () {
                  Navigator.pop(context);
                  onReply!();
                },
              ),

            // Delete (own messages only)
            if (isMyMessage)
              _ActionTile(
                icon: Icons.delete_outline_rounded,
                label: tr('message.delete', lang),
                color: AlmaTheme.error,
                onTap: () => _confirmDelete(context),
              ),
          ],
        ),
      ),
    );
  }

  void _toggleReaction(BuildContext context, String type) {
    // Capture userId BEFORE popping (context becomes invalid after pop)
    final currentUserId = StreamChat.of(context).currentUser?.id;
    Navigator.pop(context);
    if (currentUserId == null) return;

    // Check if user already reacted with this type
    final existing = message.latestReactions?.firstWhere(
      (r) => r.userId == currentUserId && r.type == type,
      orElse: () => Reaction(type: '', messageId: ''),
    );

    if (existing != null && existing.type == type) {
      channel.deleteReaction(message, existing);
    } else {
      channel.sendReaction(message, type, enforceUnique: true);
    }
  }

  void _confirmDelete(BuildContext context) {
    final alma = context.alma;
    Navigator.pop(context); // close actions sheet first
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: alma.cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        title: Text(
          tr('message.deleteConfirm', lang),
          style: TextStyle(color: alma.textPrimary, fontSize: 17),
        ),
        content: Text(
          tr('message.deleteConfirmDesc', lang),
          style: TextStyle(color: alma.textSecondary, fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(
              tr('common.cancel', lang),
              style: TextStyle(color: alma.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              channel.deleteMessage(message);
            },
            child: Text(
              tr('message.delete', lang),
              style: const TextStyle(color: AlmaTheme.error),
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: color, size: 22),
      title: Text(
        label,
        style: TextStyle(color: color, fontSize: 15),
      ),
      onTap: onTap,
      dense: true,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    );
  }
}
