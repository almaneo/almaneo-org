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
    final tierColor = AlmaTheme.tierColors[tier] ?? AlmaTheme.electricBlue;
    // 1000점 만점 기준 비율 (최대 100%)
    final progress = (score / 1000).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AlmaTheme.glassCard(),
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
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$score / 1,000',
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
}

class _ScoreGaugePainter extends CustomPainter {
  final double progress;
  final Color color;

  _ScoreGaugePainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 4;

    // 배경 원
    final bgPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.1)
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
      old.progress != progress || old.color != color;
}
