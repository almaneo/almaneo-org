import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../config/theme.dart';

/// Kindness Score 원형 게이지 카드
class KindnessScoreCard extends StatelessWidget {
  final int score;
  final String? tier;
  final String label;

  const KindnessScoreCard({
    super.key,
    required this.score,
    this.tier,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    final tierColor = AlmaTheme.tierColors[tier] ?? AlmaTheme.electricBlue;
    // 1000점 만점 기준 비율 (최대 100%)
    final progress = (score / 1000).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AlmaTheme.themedCard(context),
      child: Row(
        children: [
          // 원형 게이지
          SizedBox(
            width: 72,
            height: 72,
            child: CustomPaint(
              painter: _ScoreGaugePainter(
                progress: progress,
                color: tierColor,
                bgColor: alma.divider,
              ),
              child: Center(
                child: Text(
                  '$score',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: tierColor,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          // 라벨 + 설명
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: alma.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$score / 1,000',
                  style: TextStyle(
                    fontSize: 12,
                    color: alma.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ScoreGaugePainter extends CustomPainter {
  final double progress;
  final Color color;
  final Color bgColor;

  _ScoreGaugePainter({required this.progress, required this.color, required this.bgColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 4;

    // 배경 원
    final bgPaint = Paint()
      ..color = bgColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6;
    canvas.drawCircle(center, radius, bgPaint);

    // 진행 원호
    final fgPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2,
      2 * math.pi * progress,
      false,
      fgPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _ScoreGaugePainter old) =>
      old.progress != progress || old.color != color || old.bgColor != bgColor;
}
