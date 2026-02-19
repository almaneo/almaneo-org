import 'package:flutter/material.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';

/// Bottom sheet shown on long-press of a channel tile.
/// Provides pin, mute, and leave actions.
class ChannelActionsSheet extends StatelessWidget {
  final Channel channel;
  final String lang;
  final bool isPinned;
  final VoidCallback onPin;
  final VoidCallback onMute;
  final VoidCallback onLeave;

  const ChannelActionsSheet({
    super.key,
    required this.channel,
    required this.lang,
    required this.isPinned,
    required this.onPin,
    required this.onMute,
    required this.onLeave,
  });

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    final isMuted = channel.isMuted;
    final channelName =
        channel.extraData['name'] as String? ?? channel.id ?? 'Chat';

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
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: alma.textTertiary,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Channel name
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Text(
                channelName,
                style: TextStyle(
                  color: alma.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(height: 8),
            // Pin/Unpin
            _ActionItem(
              icon: isPinned ? Icons.push_pin : Icons.push_pin_outlined,
              iconColor: AlmaTheme.sandGold,
              label: isPinned
                  ? tr('channelActions.unpin', lang)
                  : tr('channelActions.pin', lang),
              alma: alma,
              onTap: () {
                Navigator.pop(context);
                onPin();
              },
            ),
            // Mute/Unmute
            _ActionItem(
              icon: isMuted
                  ? Icons.notifications_active_outlined
                  : Icons.notifications_off_outlined,
              iconColor: AlmaTheme.warning,
              label: isMuted
                  ? tr('channelActions.unmute', lang)
                  : tr('channelActions.mute', lang),
              alma: alma,
              onTap: () {
                Navigator.pop(context);
                onMute();
              },
            ),
            Divider(
                height: 1, indent: 16, endIndent: 16, color: alma.divider),
            // Leave
            _ActionItem(
              icon: Icons.exit_to_app,
              iconColor: AlmaTheme.error,
              label: tr('channelActions.leave', lang),
              alma: alma,
              isDestructive: true,
              onTap: () {
                Navigator.pop(context);
                onLeave();
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionItem extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final AlmaColors alma;
  final bool isDestructive;
  final VoidCallback onTap;

  const _ActionItem({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.alma,
    this.isDestructive = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: iconColor.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: iconColor, size: 20),
      ),
      title: Text(
        label,
        style: TextStyle(
          color: isDestructive ? AlmaTheme.error : alma.textPrimary,
          fontSize: 15,
          fontWeight: FontWeight.w500,
        ),
      ),
      onTap: onTap,
    );
  }
}
