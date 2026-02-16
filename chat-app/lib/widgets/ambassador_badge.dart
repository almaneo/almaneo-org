import 'package:flutter/material.dart';
import '../config/theme.dart';

/// Ambassador SBT 티어 배지 위젯
class AmbassadorBadge extends StatelessWidget {
  final String tier; // friend, host, ambassador, guardian
  final String tierName;
  final String tierDesc;

  const AmbassadorBadge({
    super.key,
    required this.tier,
    required this.tierName,
    required this.tierDesc,
  });

  @override
  Widget build(BuildContext context) {
    final color = AlmaTheme.tierColors[tier] ?? Colors.white38;
    final icon = _tierIcon(tier);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: AlmaTheme.glassCard(),
      child: Row(
        children: [
          // 티어 아이콘 (원형 배경)
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: color.withValues(alpha: 0.15),
              border: Border.all(color: color.withValues(alpha: 0.4)),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 12),
          // 티어 정보
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      tierName,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: color,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'SBT',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.white70,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  tierDesc,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withValues(alpha: 0.5),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  IconData _tierIcon(String tier) {
    switch (tier) {
      case 'friend':
        return Icons.emoji_people;
      case 'host':
        return Icons.groups;
      case 'ambassador':
        return Icons.star;
      case 'guardian':
        return Icons.shield;
      default:
        return Icons.person;
    }
  }
}
