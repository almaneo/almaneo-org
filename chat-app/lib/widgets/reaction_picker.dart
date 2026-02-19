import 'package:flutter/material.dart';
import '../config/theme.dart';

/// Reaction type IDs used by Stream Chat (simple string identifiers)
const reactionTypes = ['like', 'love', 'haha', 'wow', 'sad', 'pray'];

/// Map from reaction type ID to display emoji
const reactionEmojis = <String, String>{
  'like': '👍',
  'love': '❤️',
  'haha': '😂',
  'wow': '😮',
  'sad': '😢',
  'pray': '🙏',
};

/// Get emoji for a reaction type (fallback to type itself if unknown)
String reactionToEmoji(String type) => reactionEmojis[type] ?? type;

/// Horizontal emoji picker row for message reactions
class ReactionPicker extends StatelessWidget {
  final void Function(String reactionType) onReactionSelected;

  const ReactionPicker({super.key, required this.onReactionSelected});

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: alma.cardBg,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: reactionTypes.map((type) {
          return GestureDetector(
            onTap: () => onReactionSelected(type),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 6),
              child: Text(
                reactionToEmoji(type),
                style: const TextStyle(fontSize: 24),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
