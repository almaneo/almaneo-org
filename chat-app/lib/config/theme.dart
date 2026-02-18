import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';

// ── AlmaColors ThemeExtension ──
// 시맨틱 색상 토큰: Dark/Light 양쪽 값 정의

class AlmaColors extends ThemeExtension<AlmaColors> {
  // Scaffold & Surface
  final Color scaffold;
  final Color surface;
  final Color surfaceVariant;

  // Text
  final Color textPrimary;
  final Color textSecondary;
  final Color textTertiary;

  // Card & Container
  final Color cardBg;
  final Color cardBorder;

  // Input
  final Color inputBg;
  final Color inputBorder;

  // Divider & Border
  final Color divider;
  final Color borderDefault;

  // Nav
  final Color navBg;
  final Color navBorder;

  // Badge & Chip
  final Color chipBg;
  final Color chipSelectedBg;

  // Shadow (light only)
  final List<BoxShadow> cardShadow;

  const AlmaColors({
    required this.scaffold,
    required this.surface,
    required this.surfaceVariant,
    required this.textPrimary,
    required this.textSecondary,
    required this.textTertiary,
    required this.cardBg,
    required this.cardBorder,
    required this.inputBg,
    required this.inputBorder,
    required this.divider,
    required this.borderDefault,
    required this.navBg,
    required this.navBorder,
    required this.chipBg,
    required this.chipSelectedBg,
    required this.cardShadow,
  });

  @override
  AlmaColors copyWith({
    Color? scaffold,
    Color? surface,
    Color? surfaceVariant,
    Color? textPrimary,
    Color? textSecondary,
    Color? textTertiary,
    Color? cardBg,
    Color? cardBorder,
    Color? inputBg,
    Color? inputBorder,
    Color? divider,
    Color? borderDefault,
    Color? navBg,
    Color? navBorder,
    Color? chipBg,
    Color? chipSelectedBg,
    List<BoxShadow>? cardShadow,
  }) {
    return AlmaColors(
      scaffold: scaffold ?? this.scaffold,
      surface: surface ?? this.surface,
      surfaceVariant: surfaceVariant ?? this.surfaceVariant,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      textTertiary: textTertiary ?? this.textTertiary,
      cardBg: cardBg ?? this.cardBg,
      cardBorder: cardBorder ?? this.cardBorder,
      inputBg: inputBg ?? this.inputBg,
      inputBorder: inputBorder ?? this.inputBorder,
      divider: divider ?? this.divider,
      borderDefault: borderDefault ?? this.borderDefault,
      navBg: navBg ?? this.navBg,
      navBorder: navBorder ?? this.navBorder,
      chipBg: chipBg ?? this.chipBg,
      chipSelectedBg: chipSelectedBg ?? this.chipSelectedBg,
      cardShadow: cardShadow ?? this.cardShadow,
    );
  }

  @override
  AlmaColors lerp(ThemeExtension<AlmaColors>? other, double t) {
    if (other is! AlmaColors) return this;
    return AlmaColors(
      scaffold: Color.lerp(scaffold, other.scaffold, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      surfaceVariant: Color.lerp(surfaceVariant, other.surfaceVariant, t)!,
      textPrimary: Color.lerp(textPrimary, other.textPrimary, t)!,
      textSecondary: Color.lerp(textSecondary, other.textSecondary, t)!,
      textTertiary: Color.lerp(textTertiary, other.textTertiary, t)!,
      cardBg: Color.lerp(cardBg, other.cardBg, t)!,
      cardBorder: Color.lerp(cardBorder, other.cardBorder, t)!,
      inputBg: Color.lerp(inputBg, other.inputBg, t)!,
      inputBorder: Color.lerp(inputBorder, other.inputBorder, t)!,
      divider: Color.lerp(divider, other.divider, t)!,
      borderDefault: Color.lerp(borderDefault, other.borderDefault, t)!,
      navBg: Color.lerp(navBg, other.navBg, t)!,
      navBorder: Color.lerp(navBorder, other.navBorder, t)!,
      chipBg: Color.lerp(chipBg, other.chipBg, t)!,
      chipSelectedBg: Color.lerp(chipSelectedBg, other.chipSelectedBg, t)!,
      cardShadow: t < 0.5 ? cardShadow : other.cardShadow,
    );
  }
}

/// context.alma 확장
extension AlmaColorsX on BuildContext {
  AlmaColors get alma => Theme.of(this).extension<AlmaColors>()!;
}

/// AlmaNEO "Cold Code, Warm Soul" 테마
class AlmaTheme {
  // ── Brand Colors (양쪽 테마 공통) ──

  // Cold (기술/AI)
  static const deepNavy = Color(0xFF0A0F1A);
  static const electricBlue = Color(0xFF0052FF);
  static const cyan = Color(0xFF06B6D4);
  static const slateGray = Color(0xFF1E293B);

  // Warm (인간/정)
  static const terracottaOrange = Color(0xFFFF6B00);
  static const sandGold = Color(0xFFD4A574);
  static const softBeige = Color(0xFFD4C4B0);

  // Semantic
  static const success = Color(0xFF4ADE80);
  static const warning = Color(0xFFFACC15);
  static const error = Color(0xFFF87171);

  // ── Dark Colors ──
  static const darkColors = AlmaColors(
    scaffold: deepNavy,                           // #0A0F1A
    surface: slateGray,                           // #1E293B
    surfaceVariant: Color(0xFF2D3748),
    textPrimary: Colors.white,
    textSecondary: Colors.white70,
    textTertiary: Colors.white38,
    cardBg: slateGray,                            // #1E293B
    cardBorder: Colors.transparent,
    inputBg: Color(0xFF0F1724),
    inputBorder: Colors.white12,
    divider: Colors.white12,
    borderDefault: Colors.white10,
    navBg: deepNavy,
    navBorder: Colors.white10,
    chipBg: Colors.white10,
    chipSelectedBg: Color(0x260052FF),            // electricBlue 15%
    cardShadow: [],
  );

  // ── Light Colors ──
  static const lightColors = AlmaColors(
    scaffold: Color(0xFFF5F0EB),                  // Warm Cream
    surface: Colors.white,
    surfaceVariant: Color(0xFFF0EBE5),            // Light Beige
    textPrimary: Color(0xFF1A1A2E),               // Dark Navy Tone
    textSecondary: Color(0xFF4A4A5A),
    textTertiary: Color(0xFF8A8A9A),
    cardBg: Colors.white,
    cardBorder: Color(0xFFE8E0D8),                // Warm Gray
    inputBg: Color(0xFFF5F0EB),                   // Cream
    inputBorder: Color(0xFFD4C4B0),               // Sand
    divider: Color(0xFFE8E0D8),
    borderDefault: Color(0xFFD4C4B0),
    navBg: Colors.white,
    navBorder: Color(0xFFE8E0D8),
    chipBg: Color(0xFFF0EBE5),
    chipSelectedBg: Color(0x1A0052FF),            // electricBlue 10%
    cardShadow: [
      BoxShadow(
        color: Color(0x0D000000),                 // black 5%
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
  );

  // ── Gradients ──
  static const brandGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [electricBlue, terracottaOrange],
  );

  static const coldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [electricBlue, cyan],
  );

  // ── Glow Shadow ──
  static List<BoxShadow> glowShadow(Color color, {double blur = 24, double spread = 2}) {
    return [
      BoxShadow(
        color: color.withValues(alpha: 0.3),
        blurRadius: blur,
        spreadRadius: spread,
      ),
    ];
  }

  // ── Ambassador Tier Colors ──
  static const tierColors = <String, Color>{
    'friend': success,
    'host': cyan,
    'ambassador': electricBlue,
    'guardian': terracottaOrange,
    'none': Colors.white38,
  };

  /// 테마에 맞는 카드 decoration
  /// Dark: glass effect, Light: white + shadow
  static BoxDecoration themedCard(BuildContext context, {double radius = 16}) {
    final colors = context.alma;
    return BoxDecoration(
      color: colors.cardBg,
      borderRadius: BorderRadius.circular(radius),
      border: colors.cardBorder != Colors.transparent
          ? Border.all(color: colors.cardBorder)
          : Border.all(color: Colors.white.withValues(alpha: 0.1)),
      boxShadow: colors.cardShadow,
    );
  }

  /// Glass card decoration (frosted glass effect) — Dark 전용 레거시 지원
  static BoxDecoration glassCard({double opacity = 0.08, double radius = 16}) {
    return BoxDecoration(
      color: Colors.white.withValues(alpha: opacity),
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
    );
  }

  /// ThemeData 팩토리 — AlmaColors 기반
  static ThemeData theme(AlmaColors colors) {
    final isDark = colors.scaffold == deepNavy;
    final brightness = isDark ? Brightness.dark : Brightness.light;
    final baseTextTheme = isDark
        ? ThemeData.dark().textTheme
        : ThemeData.light().textTheme;

    return ThemeData(
      brightness: brightness,
      scaffoldBackgroundColor: colors.scaffold,
      primaryColor: electricBlue,
      colorScheme: isDark
          ? const ColorScheme.dark(
              primary: electricBlue,
              secondary: terracottaOrange,
              surface: slateGray,
              error: error,
            )
          : ColorScheme.light(
              primary: electricBlue,
              secondary: terracottaOrange,
              surface: colors.surface,
              error: error,
            ),
      textTheme: GoogleFonts.interTextTheme(baseTextTheme),
      appBarTheme: AppBarTheme(
        backgroundColor: colors.scaffold,
        elevation: 0,
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
        centerTitle: true,
        foregroundColor: colors.textPrimary,
        iconTheme: IconThemeData(color: colors.textPrimary),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: electricBlue,
        foregroundColor: Colors.white,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colors.inputBg,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: isDark
              ? BorderSide.none
              : BorderSide(color: colors.inputBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: isDark
              ? BorderSide.none
              : BorderSide(color: colors.inputBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: electricBlue),
        ),
        hintStyle: TextStyle(color: colors.textTertiary),
      ),
      dividerColor: colors.divider,
      extensions: [colors],
    );
  }

  /// 기존 darkTheme getter — 하위 호환
  static ThemeData get darkTheme => theme(darkColors);

  /// Stream Chat 테마 — brightness 분기
  static StreamChatThemeData streamTheme(BuildContext context, {Brightness? brightness}) {
    final isDark = brightness != null
        ? brightness == Brightness.dark
        : Theme.of(context).brightness == Brightness.dark;
    final colors = isDark ? darkColors : lightColors;

    if (isDark) {
      return StreamChatThemeData(
        brightness: Brightness.dark,
        channelListHeaderTheme: StreamChannelListHeaderThemeData(
          color: deepNavy,
          titleStyle: GoogleFonts.inter(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        channelPreviewTheme: StreamChannelPreviewThemeData(
          titleStyle: GoogleFonts.inter(
            color: Colors.white,
            fontSize: 15,
            fontWeight: FontWeight.w500,
          ),
          subtitleStyle: GoogleFonts.inter(
            color: Colors.white54,
            fontSize: 13,
          ),
          lastMessageAtStyle: GoogleFonts.inter(
            color: Colors.white38,
            fontSize: 12,
          ),
          unreadCounterColor: terracottaOrange,
        ),
        colorTheme: StreamColorTheme.dark(
          appBg: deepNavy,
          barsBg: deepNavy,
          inputBg: slateGray,
          accentPrimary: electricBlue,
          accentError: error,
        ),
        ownMessageTheme: StreamMessageThemeData(
          messageBackgroundColor: slateGray,
          messageTextStyle: GoogleFonts.inter(
            color: Colors.white,
            fontSize: 15,
          ),
          createdAtStyle: GoogleFonts.inter(
            color: Colors.white38,
            fontSize: 11,
          ),
        ),
        otherMessageTheme: StreamMessageThemeData(
          messageBackgroundColor: const Color(0xFF2D3748),
          messageTextStyle: GoogleFonts.inter(
            color: Colors.white,
            fontSize: 15,
          ),
          createdAtStyle: GoogleFonts.inter(
            color: Colors.white38,
            fontSize: 11,
          ),
        ),
      );
    }

    // Light theme
    return StreamChatThemeData(
      brightness: Brightness.light,
      messageInputTheme: StreamMessageInputThemeData(
        inputBackgroundColor: colors.surface,
        inputTextStyle: GoogleFonts.inter(
          color: colors.textPrimary,
          fontSize: 15,
        ),
        idleBorderGradient: const LinearGradient(
          colors: [Colors.transparent, Colors.transparent],
        ),
        activeBorderGradient: const LinearGradient(
          colors: [Colors.transparent, Colors.transparent],
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      channelListHeaderTheme: StreamChannelListHeaderThemeData(
        color: colors.navBg,
        titleStyle: GoogleFonts.inter(
          color: colors.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.w600,
        ),
      ),
      channelPreviewTheme: StreamChannelPreviewThemeData(
        titleStyle: GoogleFonts.inter(
          color: colors.textPrimary,
          fontSize: 15,
          fontWeight: FontWeight.w500,
        ),
        subtitleStyle: GoogleFonts.inter(
          color: colors.textSecondary,
          fontSize: 13,
        ),
        lastMessageAtStyle: GoogleFonts.inter(
          color: colors.textTertiary,
          fontSize: 12,
        ),
        unreadCounterColor: terracottaOrange,
      ),
      colorTheme: StreamColorTheme.light(
        appBg: colors.scaffold,
        barsBg: colors.navBg,
        inputBg: colors.inputBg,
        accentPrimary: electricBlue,
        accentError: error,
      ),
      ownMessageTheme: StreamMessageThemeData(
        messageBackgroundColor: electricBlue,
        messageTextStyle: GoogleFonts.inter(
          color: Colors.white,
          fontSize: 15,
        ),
        createdAtStyle: GoogleFonts.inter(
          color: Colors.white70,
          fontSize: 11,
        ),
      ),
      otherMessageTheme: StreamMessageThemeData(
        messageBackgroundColor: colors.surfaceVariant,
        messageTextStyle: GoogleFonts.inter(
          color: colors.textPrimary,
          fontSize: 15,
        ),
        createdAtStyle: GoogleFonts.inter(
          color: colors.textTertiary,
          fontSize: 11,
        ),
      ),
    );
  }
}
