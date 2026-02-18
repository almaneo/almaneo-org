import 'package:flutter/material.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';

/// Displays grouped reaction counts below a message bubble.
/// Tap own reaction to remove, tap others' to add same.
class ReactionBar extends StatelessWidget {
  final Message message;
  final String currentUserId;
  final void Function(String reactionType) onReactionTap;

  const ReactionBar({
    super.key,
    required this.message,
    required this.currentUserId,
    required this.onReactionTap,
  });

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    final groups = message.reactionGroups;
    if (groups == null || groups.isEmpty) return const SizedBox.shrink();

    // Build a set of reaction types the current user has sent
    final myReactionTypes = <String>{};
    for (final r in message.latestReactions ?? <Reaction>[]) {
      if (r.userId == currentUserId) {
        myReactionTypes.add(r.type);
      }
    }

    return Padding(
      padding: const EdgeInsets.only(top: 4),
      child: Wrap(
        spacing: 4,
        runSpacing: 4,
        children: groups.entries.map((entry) {
          final type = entry.key;
          final count = entry.value.count;
          final isMine = myReactionTypes.contains(type);

          return GestureDetector(
            onTap: () => onReactionTap(type),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: isMine
                    ? AlmaTheme.electricBlue.withValues(alpha: 0.2)
                    : alma.chipBg,
                borderRadius: BorderRadius.circular(12),
                border: isMine
                    ? Border.all(
                        color: AlmaTheme.electricBlue.withValues(alpha: 0.5),
                        width: 1,
                      )
                    : null,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(type, style: const TextStyle(fontSize: 14)),
                  if (count > 1) ...[
                    const SizedBox(width: 3),
                    Text(
                      '$count',
                      style: TextStyle(
                        fontSize: 11,
                        color: isMine
                            ? AlmaTheme.electricBlue
                            : alma.textSecondary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
