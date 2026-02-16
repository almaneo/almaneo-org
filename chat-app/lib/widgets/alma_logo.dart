import 'package:flutter/material.dart';
import '../config/theme.dart';

/// 재사용 가능한 AlmaChat 로고 위젯
///
/// 이미지 에셋(`assets/icons/icon.webp`)이 있으면 사용하고,
/// 없으면 gradient circle + chat icon 폴백을 표시합니다.
class AlmaLogo extends StatelessWidget {
  final double size;
  final bool showShadow;

  const AlmaLogo({
    super.key,
    this.size = 64,
    this.showShadow = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: AlmaTheme.brandGradient,
        boxShadow: showShadow
            ? AlmaTheme.glowShadow(AlmaTheme.electricBlue)
            : null,
      ),
      child: ClipOval(
        child: Image.asset(
          'assets/icons/icon.webp',
          width: size,
          height: size,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => Icon(
            Icons.chat_bubble_outline_rounded,
            color: Colors.white,
            size: size * 0.45,
          ),
        ),
      ),
    );
  }
}
