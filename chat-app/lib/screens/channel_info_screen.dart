import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../widgets/user_profile_sheet.dart';

/// Full-screen channel info: name, description, member list, actions.
class ChannelInfoScreen extends ConsumerWidget {
  final Channel channel;

  const ChannelInfoScreen({super.key, required this.channel});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final alma = context.alma;
    final lang = ref.watch(languageProvider).languageCode;
    final currentUserId = StreamChat.of(context).currentUser?.id;

    final members = channel.state?.members ?? [];
    final memberCount = channel.memberCount ?? members.length;
    final createdAt = channel.createdAt;

    // Detect DM: no custom name + exactly 2 members
    final customName = channel.extraData['name'] as String?;
    final isDM = (customName == null || customName.isEmpty) && memberCount == 2;

    // For DM, show the other user's name; otherwise show channel name
    String channelName;
    String? dmUserImage;
    if (isDM) {
      final otherMember = members.firstWhere(
        (m) => m.userId != currentUserId,
        orElse: () => members.first,
      );
      channelName = otherMember.user?.name ?? otherMember.userId ?? 'Chat';
      dmUserImage = otherMember.user?.image;
    } else {
      channelName = customName ?? channel.id ?? 'Chat';
    }
    final description = channel.extraData['description'] as String? ?? '';

    return Scaffold(
      appBar: AppBar(
        title: Text(tr('channelInfo.title', lang)),
        centerTitle: true,
      ),
      body: ListView(
        children: [
          const SizedBox(height: 20),
          // Channel avatar + name
          Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundColor: isDM
                      ? AlmaTheme.terracottaOrange.withValues(alpha: 0.15)
                      : AlmaTheme.electricBlue.withValues(alpha: 0.15),
                  backgroundImage: (dmUserImage != null && dmUserImage.isNotEmpty)
                      ? NetworkImage(dmUserImage)
                      : null,
                  child: (dmUserImage == null || dmUserImage.isEmpty)
                      ? Text(
                          channelName.isNotEmpty ? channelName[0].toUpperCase() : '#',
                          style: TextStyle(
                            color: isDM ? AlmaTheme.terracottaOrange : AlmaTheme.electricBlue,
                            fontWeight: FontWeight.bold,
                            fontSize: 32,
                          ),
                        )
                      : null,
                ),
                const SizedBox(height: 12),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Text(
                    channelName,
                    style: TextStyle(
                      color: alma.textPrimary,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                if (description.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      description,
                      style: TextStyle(
                        color: alma.textSecondary,
                        fontSize: 14,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
                const SizedBox(height: 8),
                Text(
                  tr('channelInfo.memberCount', lang, args: {'count': memberCount.toString()}),
                  style: TextStyle(
                    color: alma.textTertiary,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Info section
          _SectionCard(
            alma: alma,
            children: [
              if (createdAt != null)
                _InfoRow(
                  icon: Icons.calendar_today,
                  label: tr('channelInfo.created', lang),
                  value: _formatDate(createdAt, lang),
                  alma: alma,
                ),
              // Hide channel ID for DM channels (hash IDs are meaningless to users)
              if (!isDM)
                _InfoRow(
                  icon: Icons.tag,
                  label: tr('channelInfo.channelId', lang),
                  value: channel.id ?? '',
                  alma: alma,
                  onTap: () {
                    if (channel.id != null) {
                      Clipboard.setData(ClipboardData(text: channel.id!));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(tr('channelInfo.idCopied', lang)),
                          behavior: SnackBarBehavior.floating,
                          backgroundColor: AlmaTheme.success.withValues(alpha: 0.9),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    }
                  },
                ),
            ],
          ),
          const SizedBox(height: 12),

          // Members section
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              tr('channelInfo.members', lang),
              style: TextStyle(
                color: alma.textSecondary,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 8),
          _SectionCard(
            alma: alma,
            children: [
              for (final member in members)
                _MemberTile(
                  member: member,
                  isCurrentUser: member.userId == currentUserId,
                  lang: lang,
                  alma: alma,
                  onTap: () {
                    if (member.user != null && member.userId != currentUserId) {
                      UserProfileSheet.show(
                        context,
                        user: member.user!,
                        lang: lang,
                      );
                    }
                  },
                ),
            ],
          ),
          const SizedBox(height: 12),

          // Actions section
          _SectionCard(
            alma: alma,
            children: [
              _ActionTile(
                icon: Icons.notifications_off_outlined,
                iconColor: AlmaTheme.warning,
                label: channel.isMuted
                    ? tr('channelInfo.unmute', lang)
                    : tr('channelInfo.mute', lang),
                alma: alma,
                onTap: () => _toggleMute(context, lang),
              ),
              Divider(height: 1, color: alma.divider),
              _ActionTile(
                icon: Icons.exit_to_app,
                iconColor: AlmaTheme.error,
                label: tr('channelInfo.leave', lang),
                alma: alma,
                isDestructive: true,
                onTap: () => _leaveChannel(context, lang),
              ),
            ],
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Future<void> _toggleMute(BuildContext context, String lang) async {
    try {
      if (channel.isMuted) {
        await channel.unmute();
      } else {
        await channel.mute();
      }
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              channel.isMuted
                  ? tr('channelInfo.muted', lang)
                  : tr('channelInfo.unmuted', lang),
            ),
            behavior: SnackBarBehavior.floating,
            backgroundColor: AlmaTheme.success.withValues(alpha: 0.9),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            duration: const Duration(seconds: 2),
          ),
        );
        // Trigger rebuild in parent
        (context as Element).markNeedsBuild();
      }
    } catch (_) {
      if (context.mounted) {
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

  Future<void> _leaveChannel(BuildContext context, String lang) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        final alma = ctx.alma;
        return AlertDialog(
          backgroundColor: alma.cardBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text(
            tr('channelInfo.leaveConfirmTitle', lang),
            style: TextStyle(color: alma.textPrimary, fontWeight: FontWeight.bold),
          ),
          content: Text(
            tr('channelInfo.leaveConfirmDesc', lang),
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
              child: Text(tr('channelInfo.leave', lang)),
            ),
          ],
        );
      },
    );

    if (confirmed != true || !context.mounted) return;

    try {
      final currentUserId = StreamChat.of(context).currentUser?.id;
      if (currentUserId != null) {
        await channel.removeMembers([currentUserId]);
      }
      if (context.mounted) {
        // Pop both info screen and chat screen
        Navigator.of(context).popUntil((route) => route.isFirst);
      }
    } catch (_) {
      if (context.mounted) {
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

  String _formatDate(DateTime date, String lang) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }
}

/// Rounded card container for info sections
class _SectionCard extends StatelessWidget {
  final AlmaColors alma;
  final List<Widget> children;

  const _SectionCard({required this.alma, required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: alma.cardBg,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: children,
      ),
    );
  }
}

/// Row showing icon + label + value
class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final AlmaColors alma;
  final VoidCallback? onTap;

  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.alma,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            Icon(icon, size: 18, color: alma.textTertiary),
            const SizedBox(width: 10),
            Text(
              label,
              style: TextStyle(color: alma.textSecondary, fontSize: 14),
            ),
            const Spacer(),
            Flexible(
              child: Text(
                value,
                style: TextStyle(
                  color: alma.textPrimary,
                  fontSize: 14,
                  fontFamily: 'monospace',
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (onTap != null) ...[
              const SizedBox(width: 6),
              Icon(Icons.copy, size: 14, color: alma.textTertiary),
            ],
          ],
        ),
      ),
    );
  }
}

/// A member tile in the member list
class _MemberTile extends StatelessWidget {
  final Member member;
  final bool isCurrentUser;
  final String lang;
  final AlmaColors alma;
  final VoidCallback? onTap;

  const _MemberTile({
    required this.member,
    required this.isCurrentUser,
    required this.lang,
    required this.alma,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final user = member.user;
    final name = user?.name ?? member.userId ?? '';
    final imageUrl = user?.image;
    final isOnline = user?.online ?? false;
    final role = member.channelRole;

    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        child: Row(
          children: [
            // Avatar
            Stack(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: AlmaTheme.terracottaOrange.withValues(alpha: 0.15),
                  backgroundImage: (imageUrl != null && imageUrl.isNotEmpty)
                      ? NetworkImage(imageUrl)
                      : null,
                  child: (imageUrl == null || imageUrl.isEmpty)
                      ? Text(
                          name.isNotEmpty ? name[0].toUpperCase() : '?',
                          style: const TextStyle(
                            color: AlmaTheme.terracottaOrange,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        )
                      : null,
                ),
                if (isOnline)
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        color: AlmaTheme.success,
                        shape: BoxShape.circle,
                        border: Border.all(color: alma.cardBg, width: 1.5),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 10),
            // Name
            Expanded(
              child: Row(
                children: [
                  Flexible(
                    child: Text(
                      name,
                      style: TextStyle(
                        color: alma.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (isCurrentUser) ...[
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: AlmaTheme.electricBlue.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        tr('channelInfo.you', lang),
                        style: const TextStyle(
                          color: AlmaTheme.electricBlue,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            // Role badge
            if (role == 'owner' || role == 'admin')
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AlmaTheme.sandGold.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  role == 'owner'
                      ? tr('channelInfo.owner', lang)
                      : tr('channelInfo.admin', lang),
                  style: const TextStyle(
                    color: AlmaTheme.sandGold,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Action tile (mute, leave)
class _ActionTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final AlmaColors alma;
  final bool isDestructive;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.alma,
    this.isDestructive = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            Icon(icon, size: 20, color: iconColor),
            const SizedBox(width: 10),
            Text(
              label,
              style: TextStyle(
                color: isDestructive ? AlmaTheme.error : alma.textPrimary,
                fontSize: 15,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
