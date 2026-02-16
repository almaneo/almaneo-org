import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';

/// AlmaNEO "Cold Code, Warm Soul" 테마
class AlmaTheme {
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

  /// Glass card decoration (frosted glass effect)
  static BoxDecoration glassCard({double opacity = 0.08, double radius = 16}) {
    return BoxDecoration(
      color: Colors.white.withValues(alpha: opacity),
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: deepNavy,
      primaryColor: electricBlue,
      colorScheme: const ColorScheme.dark(
        primary: electricBlue,
        secondary: terracottaOrange,
        surface: slateGray,
        error: error,
      ),
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: deepNavy,
        elevation: 0,
        centerTitle: true,
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: electricBlue,
        foregroundColor: Colors.white,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: slateGray,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        hintStyle: const TextStyle(color: Colors.white38),
      ),
    );
  }

  /// Stream Chat 테마 (AlmaNEO 스타일)
  static StreamChatThemeData streamTheme(BuildContext context) {
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
}
